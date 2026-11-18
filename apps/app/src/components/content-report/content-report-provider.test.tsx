import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { act, fireEvent, screen } from "@testing-library/react-native";

import { ContentReportFooterLink } from "@/components/content-report/content-report-footer-link";
import { ContentReportProvider } from "@/components/content-report/content-report-provider";
import { resetAuthMock, setMockAuth } from "@/test-support/mocks/auth-provider";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { renderWithTheme } from "@/test-support/render";

let mockOnline = true;
const mockSubmit = jest.fn(async (..._a: unknown[]) => undefined);
const mockEnqueue = jest.fn(async (..._a: unknown[]) => undefined);
const mockFlush = jest.fn(async (_t: string) => 0);

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/hooks/use-is-online", () => ({ useIsOnline: () => mockOnline }));
jest.mock("@/lib/content-report-api", () => ({
  submitContentReport: (...args: unknown[]) => mockSubmit(...args),
  isGuestReportError: (e: unknown) => (e as Error)?.message === "guest",
  isOfflineReportError: (e: unknown) => (e as Error)?.message === "offline",
}));
jest.mock("@/lib/content-report-queue", () => ({
  enqueueContentReport: (...args: unknown[]) => mockEnqueue(...args),
  flushContentReportQueue: (token: string) => mockFlush(token),
}));
jest.mock("@/components/content-report/content-report-sheet", () => {
  const { Pressable, Text, View } = require("react-native");
  const values = {
    issueType: "typo",
    description: "Something is off here",
    suggestedCorrection: "",
    userReference: "Book 1",
    attachments: [],
  };
  return {
    ContentReportSheet: (props: {
      visible: boolean;
      contentRef: { contentId: string } | null;
      submitting: boolean;
      onSubmit: (v: unknown) => void;
      onClose: () => void;
    }) =>
      props.visible ? (
        <View>
          <Text>{`sheet:${props.contentRef?.contentId}`}</Text>
          <Pressable accessibilityLabel="mock-submit" onPress={() => props.onSubmit(values)} />
          <Pressable accessibilityLabel="mock-close" onPress={props.onClose} />
        </View>
      ) : null,
  };
});

const ref = { contentType: "dua", contentId: "dua-1" } as unknown as ContentReportReference;
function reportTree() {
  return (
    <ContentReportProvider>
      <ContentReportFooterLink contentRef={ref} />
    </ContentReportProvider>
  );
}

async function settle() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

async function renderProvider() {
  const utils = await renderWithTheme(reportTree());
  await settle();
  return utils;
}

async function submitReport() {
  await renderProvider();
  await fireEvent.press(screen.getByLabelText("Report an issue"));
  await fireEvent.press(screen.getByLabelText("mock-submit"));
  await settle();
}

describe("ContentReportProvider", () => {
  beforeEach(() => {
    mockOnline = true;
    mockSubmit.mockReset();
    mockEnqueue.mockClear();
    mockFlush.mockReset();
    mockFlush.mockResolvedValue(0);
    resetAuthMock();
    setMockAuth({ session: { accessToken: "tok" }, isGuest: false });
    resetToastMock();
    resetExpoRouterMock();
  });

  describe("queue flushing", () => {
    it("flushes on mount and toasts a single sent report", async () => {
      mockFlush.mockResolvedValueOnce(1);
      await renderProvider();
      expect(mockFlush).toHaveBeenCalledWith("tok");
      expect(mockToast.success).toHaveBeenCalledWith("Queued report sent successfully");
    });

    it("flushes again when coming back online", async () => {
      mockOnline = false;
      const utils = await renderProvider();
      mockOnline = true;
      mockFlush.mockResolvedValueOnce(3);
      await utils.rerender(reportTree());
      await settle();
      expect(mockFlush).toHaveBeenCalledTimes(2);
      expect(mockToast.success).toHaveBeenCalledWith("3 queued reports sent successfully");
    });

    it("stays quiet when the flush fails", async () => {
      mockFlush.mockRejectedValueOnce(new Error("down"));
      await renderProvider();
      expect(mockToast.success).not.toHaveBeenCalled();
    });

    it("skips flushing for guests", async () => {
      setMockAuth({ isGuest: true });
      await renderProvider();
      expect(mockFlush).not.toHaveBeenCalled();
    });
  });

  describe("sign-in gate", () => {
    it("routes guests to the profile", async () => {
      setMockAuth({ isGuest: true });
      await renderProvider();
      await fireEvent.press(screen.getByLabelText("Report an issue"));
      expect(screen.getByText("Sign in to report content")).toBeTruthy();
      await fireEvent.press(screen.getByText("Go to account"));
      expect(mockRouter.push).toHaveBeenCalledWith("/profile");
    });

    it("can be cancelled without a session", async () => {
      setMockAuth({ session: null });
      await renderProvider();
      await fireEvent.press(screen.getByLabelText("Report an issue"));
      await fireEvent.press(screen.getByText("Cancel"));
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe("submitting", () => {
    it("sends the report with the content reference", async () => {
      await submitReport();
      expect(mockSubmit).toHaveBeenCalledWith(
        "tok",
        expect.objectContaining({
          issueType: "typo",
          suggestedCorrection: undefined,
          userReference: "Book 1",
          content: ref,
          platform: "ios",
        }),
        [],
      );
    });

    it("toasts success and closes the sheet", async () => {
      await submitReport();
      expect(mockToast.success).toHaveBeenCalledWith("Report submitted — thank you");
      expect(screen.queryByText(/sheet:/)).toBeNull();
    });

    it("queues offline submissions", async () => {
      mockSubmit.mockRejectedValueOnce(new Error("offline"));
      await submitReport();
      expect(mockEnqueue).toHaveBeenCalled();
      expect(mockToast.success).toHaveBeenCalledWith(
        "Report saved — will send when you're back online",
      );
    });

    it("shows the gate when the API rejects a guest session", async () => {
      mockSubmit.mockRejectedValueOnce(new Error("guest"));
      await submitReport();
      expect(screen.getByText("Sign in to report content")).toBeTruthy();
    });

    it("toasts generic failures and keeps the sheet open", async () => {
      mockSubmit.mockRejectedValueOnce(new Error("boom"));
      await submitReport();
      expect(mockToast.error).toHaveBeenCalledWith("Could not submit report. Try again.");
      expect(screen.getByText("sheet:dua-1")).toBeTruthy();
    });
  });

  it("closes the sheet", async () => {
    await renderProvider();
    await fireEvent.press(screen.getByLabelText("Report an issue"));
    await fireEvent.press(screen.getByLabelText("mock-close"));
    expect(screen.queryByText(/sheet:/)).toBeNull();
  });

  it("throws when the report hook is used outside the provider", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(renderWithTheme(<ContentReportFooterLink contentRef={ref} />)).rejects.toThrow(
      "useContentReport must be used within ContentReportProvider",
    );
    spy.mockRestore();
  });
});
