import {
  cacheDirectory,
  downloadAsync,
  EncodingType,
  makeDirectoryAsync,
  readAsStringAsync,
} from "expo-file-system/legacy";
import { Platform } from "react-native";

function sanitizeFileName(fileName: string): string {
  const base = fileName.replace(/[/\\?%*:|"<>]/g, "_").trim() || "attachment.pdf";
  return base.slice(0, 120);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function downloadRemoteToCache(
  remoteUri: string,
  fileName: string,
  headers?: Record<string, string>,
): Promise<string> {
  const baseDir = cacheDirectory;
  if (!baseDir) {
    throw new Error("No cache directory available");
  }
  const dir = `${baseDir}user-media-preview/`;
  await makeDirectoryAsync(dir, { intermediates: true });
  const localUri = `${dir}${Date.now()}-${sanitizeFileName(fileName)}`;
  const result = await downloadAsync(remoteUri, localUri, {
    headers: headers ?? {},
  });
  return result.uri;
}

/**
 * Load attachment bytes as base64 for inline PDF preview.
 * Supports remote API URLs (cookies + optional Bearer) and local file URIs.
 */
export async function readAttachmentAsBase64(options: {
  uri: string;
  headers?: Record<string, string>;
  fileName?: string;
}): Promise<string> {
  const { uri, headers, fileName = "attachment.pdf" } = options;

  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    if (Platform.OS === "web") {
      const response = await fetch(uri, {
        headers,
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to load attachment (${response.status})`);
      }
      return arrayBufferToBase64(await response.arrayBuffer());
    }
    const localUri = await downloadRemoteToCache(uri, fileName, headers);
    return readAsStringAsync(localUri, { encoding: EncodingType.Base64 });
  }

  if (Platform.OS === "web") {
    if (uri.startsWith("blob:") || uri.startsWith("data:")) {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to load attachment (${response.status})`);
      }
      return arrayBufferToBase64(await response.arrayBuffer());
    }
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Failed to load attachment (${response.status})`);
    }
    return arrayBufferToBase64(await response.arrayBuffer());
  }

  return readAsStringAsync(uri, { encoding: EncodingType.Base64 });
}

/**
 * Interactive PDF.js viewer: scroll pages, pinch/wheel zoom, and toolbar controls.
 * Used on web (iframe) and native (WebView) so Chrome's broken iframe PDF chrome is avoided.
 */
export function buildPdfJsViewerHtml(base64: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=6, user-scalable=yes" />
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0; padding: 0; height: 100%;
      background: #111; color: #fff;
      font: 13px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
      overscroll-behavior: contain;
    }
    #toolbar {
      position: sticky; top: 0; z-index: 5;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      min-height: 44px; padding: 6px 10px;
      background: rgba(22,22,22,0.96);
      border-bottom: 1px solid rgba(255,255,255,0.12);
      backdrop-filter: blur(8px);
    }
    #toolbar button {
      appearance: none; border: 0; margin: 0;
      width: 36px; height: 36px; border-radius: 10px;
      background: rgba(255,255,255,0.1); color: #fff;
      font-size: 18px; font-weight: 600; line-height: 1;
      cursor: pointer; touch-action: manipulation;
    }
    #toolbar button:active { background: rgba(255,255,255,0.22); }
    #toolbar button:disabled { opacity: 0.35; cursor: default; }
    #zoomLabel {
      min-width: 52px; text-align: center;
      color: rgba(255,255,255,0.85); font-variant-numeric: tabular-nums;
    }
    #pageLabel {
      margin-inline-start: 4px;
      color: rgba(255,255,255,0.55); font-size: 12px;
    }
    #status {
      padding: 24px 16px; text-align: center; color: rgba(255,255,255,0.75);
    }
    #scroller {
      height: calc(100% - 45px); overflow: auto;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      touch-action: pan-x pan-y;
    }
    #pages {
      display: flex; flex-direction: column; align-items: center;
      gap: 14px; padding: 14px 10px 28px;
      transform-origin: top center;
    }
    .page {
      background: #fff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.4);
      max-width: 100%;
    }
    canvas { display: block; width: 100%; height: auto; }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>
  <div id="toolbar" hidden>
    <button type="button" id="zoomOut" aria-label="Zoom out">−</button>
    <span id="zoomLabel">100%</span>
    <button type="button" id="zoomIn" aria-label="Zoom in">+</button>
    <button type="button" id="zoomFit" aria-label="Fit width" title="Fit width">⟷</button>
    <span id="pageLabel"></span>
  </div>
  <div id="status">Loading…</div>
  <div id="scroller" hidden>
    <div id="pages"></div>
  </div>
  <script>
    (function () {
      var MIN_SCALE = 0.5;
      var MAX_SCALE = 4;
      var SCALE_STEP = 0.25;
      var statusEl = document.getElementById("status");
      var toolbarEl = document.getElementById("toolbar");
      var scrollerEl = document.getElementById("scroller");
      var pagesEl = document.getElementById("pages");
      var zoomLabel = document.getElementById("zoomLabel");
      var pageLabel = document.getElementById("pageLabel");
      var zoomInBtn = document.getElementById("zoomIn");
      var zoomOutBtn = document.getElementById("zoomOut");
      var zoomFitBtn = document.getElementById("zoomFit");
      var pdfDoc = null;
      var currentScale = 1;
      var fitScale = 1;
      var renderToken = 0;
      var pinchStartDist = 0;
      var pinchStartScale = 1;
      var livePinchScale = null;

      function setStatus(msg) {
        statusEl.style.display = msg ? "block" : "none";
        statusEl.textContent = msg || "";
      }

      function updateChrome(displayScale) {
        var shown = displayScale != null ? displayScale : currentScale;
        zoomLabel.textContent = Math.round(shown * 100) + "%";
        zoomOutBtn.disabled = currentScale <= MIN_SCALE + 0.001;
        zoomInBtn.disabled = currentScale >= MAX_SCALE - 0.001;
        if (pdfDoc) {
          pageLabel.textContent = pdfDoc.numPages + (pdfDoc.numPages === 1 ? " page" : " pages");
        }
      }

      function fitWidthScale(page) {
        var base = page.getViewport({ scale: 1 });
        var available = Math.max(120, (scrollerEl.clientWidth || window.innerWidth) - 24);
        return Math.max(MIN_SCALE, Math.min(2.5, available / base.width));
      }

      function renderAll() {
        if (!pdfDoc) return Promise.resolve();
        var token = ++renderToken;
        var scrollRatio =
          scrollerEl.scrollHeight > 0
            ? scrollerEl.scrollTop / Math.max(1, scrollerEl.scrollHeight - scrollerEl.clientHeight)
            : 0;
        pagesEl.innerHTML = "";
        updateChrome();

        var chain = Promise.resolve();
        for (var p = 1; p <= pdfDoc.numPages; p++) {
          (function (pageNum) {
            chain = chain.then(function () {
              if (token !== renderToken) return;
              return pdfDoc.getPage(pageNum).then(function (page) {
                if (token !== renderToken) return;
                var viewport = page.getViewport({ scale: currentScale });
                var wrap = document.createElement("div");
                wrap.className = "page";
                wrap.style.width = viewport.width + "px";
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d", { alpha: false });
                var outputScale = Math.min(2, window.devicePixelRatio || 1);
                canvas.width = Math.floor(viewport.width * outputScale);
                canvas.height = Math.floor(viewport.height * outputScale);
                canvas.style.width = viewport.width + "px";
                canvas.style.height = viewport.height + "px";
                wrap.appendChild(canvas);
                pagesEl.appendChild(wrap);
                var transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
                return page.render({
                  canvasContext: ctx,
                  viewport: viewport,
                  transform: transform,
                }).promise;
              });
            });
          })(p);
        }
        return chain.then(function () {
          if (token !== renderToken) return;
          requestAnimationFrame(function () {
            var maxScroll = Math.max(0, scrollerEl.scrollHeight - scrollerEl.clientHeight);
            scrollerEl.scrollTop = scrollRatio * maxScroll;
          });
        });
      }

      function setScale(next) {
        var clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(next / 0.05) * 0.05));
        pagesEl.style.transform = "";
        livePinchScale = null;
        if (Math.abs(clamped - currentScale) < 0.001) {
          updateChrome();
          return;
        }
        currentScale = clamped;
        return renderAll();
      }

      function distance(touches) {
        var a = touches[0];
        var b = touches[1];
        var dx = a.clientX - b.clientX;
        var dy = a.clientY - b.clientY;
        return Math.sqrt(dx * dx + dy * dy);
      }

      zoomInBtn.addEventListener("click", function () {
        setScale(currentScale + SCALE_STEP);
      });
      zoomOutBtn.addEventListener("click", function () {
        setScale(currentScale - SCALE_STEP);
      });
      zoomFitBtn.addEventListener("click", function () {
        setScale(fitScale);
      });

      scrollerEl.addEventListener(
        "wheel",
        function (event) {
          if (!(event.ctrlKey || event.metaKey)) return;
          event.preventDefault();
          var delta = event.deltaY > 0 ? -SCALE_STEP / 2 : SCALE_STEP / 2;
          setScale(currentScale + delta);
        },
        { passive: false },
      );

      scrollerEl.addEventListener(
        "touchstart",
        function (event) {
          if (event.touches.length === 2) {
            pinchStartDist = distance(event.touches);
            pinchStartScale = currentScale;
          }
        },
        { passive: true },
      );
      scrollerEl.addEventListener(
        "touchmove",
        function (event) {
          if (event.touches.length !== 2 || !pinchStartDist) return;
          event.preventDefault();
          var ratio = distance(event.touches) / pinchStartDist;
          livePinchScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchStartScale * ratio));
          // Cheap live preview; crisp re-render happens on touchend.
          pagesEl.style.transform = "scale(" + livePinchScale / currentScale + ")";
          updateChrome(livePinchScale);
        },
        { passive: false },
      );
      scrollerEl.addEventListener(
        "touchend",
        function () {
          if (pinchStartDist && livePinchScale != null) {
            setScale(livePinchScale);
          }
          pinchStartDist = 0;
          livePinchScale = null;
        },
        { passive: true },
      );

      var lastTap = 0;
      scrollerEl.addEventListener("click", function () {
        var now = Date.now();
        if (now - lastTap < 280) {
          setScale(Math.abs(currentScale - fitScale) < 0.05 ? fitScale * 1.75 : fitScale);
        }
        lastTap = now;
      });

      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        var raw = atob(${JSON.stringify(base64)});
        var bytes = new Uint8Array(raw.length);
        for (var i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
        pdfjsLib.getDocument({ data: bytes }).promise.then(function (pdf) {
          pdfDoc = pdf;
          return pdf.getPage(1).then(function (page) {
            fitScale = fitWidthScale(page);
            currentScale = fitScale;
            toolbarEl.hidden = false;
            scrollerEl.hidden = false;
            setStatus("");
            return renderAll();
          });
        }).catch(function (err) {
          setStatus("Could not render PDF");
          console.error(err);
        });
      } catch (err) {
        setStatus("Could not render PDF");
        console.error(err);
      }
    })();
  </script>
</body>
</html>`;
}
