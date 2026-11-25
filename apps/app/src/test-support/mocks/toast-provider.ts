/**
 * Shared `@/providers/toast-provider` mock with stable spies:
 *
 *   jest.mock("@/providers/toast-provider", () => require("@/test-support/mocks/toast-provider").toastProviderMock);
 *   import { mockToast } from "@/test-support/mocks/toast-provider";
 *   expect(mockToast.error).toHaveBeenCalledWith("…");
 *
 * Call `jest.clearAllMocks()` (or `resetToastMock()`) in `beforeEach`.
 */
import type { ReactNode } from "react";

export const mockToast = {
  show: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
  dismiss: jest.fn(),
};

export function resetToastMock(): void {
  for (const fn of Object.values(mockToast)) fn.mockClear();
}

export const toastProviderMock = {
  __esModule: true,
  ToastProvider: ({ children }: { children: ReactNode }) => children,
  useToast: () => mockToast,
  /** `Sheet` hosts toasts while open — no outlet under the mock. */
  useToastOutlet: () => null,
  ToastHost: () => null,
};
