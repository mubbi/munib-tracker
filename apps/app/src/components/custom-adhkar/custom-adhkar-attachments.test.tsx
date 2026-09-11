import { fireEvent, render, screen } from "@testing-library/react-native";

import { CustomAdhkarAttachments } from "@/components/custom-adhkar/custom-adhkar-attachments";
import { MunibThemeProvider } from "@/providers/theme-provider";

const mockPickAttachmentFromSource = jest.fn(async () => ({ kind: "canceled" as const }));

jest.mock("@/lib/attachments/attachment-file-manager", () => {
  const actual = jest.requireActual(
    "@/lib/attachments/attachment-file-manager",
  ) as typeof import("@/lib/attachments/attachment-file-manager");
  return {
    ...actual,
    pickAttachmentFromSource: (...args: unknown[]) => mockPickAttachmentFromSource(...args),
  };
});

jest.mock("@/lib/platform/is-tv", () => ({
  isTV: () => false,
}));

jest.mock("@/providers/toast-provider", () => ({
  useToast: () => ({
    warning: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  }),
}));

jest.mock("@/components/attachments/attachment-thumb", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    AttachmentThumb: ({ uri, headers }: { uri: string; headers?: Record<string, string> }) =>
      React.createElement(View, {
        testID: `thumb-${uri}`,
        accessibilityLabel: headers?.Authorization ? "remote-thumb" : "local-thumb",
      }),
  };
});

describe("CustomAdhkarAttachments", () => {
  beforeEach(() => {
    mockPickAttachmentFromSource.mockClear();
  });

  it("renders existing remote attachments and opens the inline source list", async () => {
    const onChange = jest.fn();
    render(
      <MunibThemeProvider>
        <CustomAdhkarAttachments
          canUpload
          onChange={onChange}
          attachments={[
            {
              uri: "https://cdn.example/a.jpg",
              mimeType: "image/jpeg",
              filename: "a.jpg",
              mediaId: "media-1",
              headers: { Authorization: "Bearer test" },
            },
          ]}
        />
      </MunibThemeProvider>,
    );

    expect(screen.getByLabelText("remote-thumb")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Add file"));
    expect(screen.getByText("Add attachment")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Take a photo"));
    expect(mockPickAttachmentFromSource).toHaveBeenCalledWith("camera");
    expect(screen.queryByText("Add attachment")).toBeNull();
  });
});
