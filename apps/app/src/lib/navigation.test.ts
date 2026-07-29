import type { Href } from "expo-router";

import { goBackOrReplace } from "@/lib/navigation";

describe("goBackOrReplace", () => {
  const fallback = "/settings" as Href;

  it("pops when the router can dismiss", () => {
    const router = {
      back: jest.fn(),
      replace: jest.fn(),
      canDismiss: jest.fn(() => true),
    };

    goBackOrReplace(router, fallback);

    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("replaces when there is nothing to dismiss", () => {
    const router = {
      back: jest.fn(),
      replace: jest.fn(),
      canDismiss: jest.fn(() => false),
    };

    goBackOrReplace(router, fallback);

    expect(router.back).not.toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith(fallback);
  });
});
