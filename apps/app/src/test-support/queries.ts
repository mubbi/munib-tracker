import { screen } from "@testing-library/react-native";
import type { TestInstance } from "test-renderer";

/**
 * Host-tree lookups for elements RNTL's accessible queries skip (non-`accessible`
 * Views with a role, native-only hosts like `RCTRefreshControl` / `RNSVGPath`).
 */
export function queryHostsByType(type: string) {
  return screen.container.queryAll((node) => node.type === type);
}

export function queryHostsByRole(role: string) {
  return screen.container.queryAll((node) => node.props.accessibilityRole === role);
}

/**
 * The host `levels` steps above `node` (wrapper Views around a `Text`, a
 * pressable around its label). Throws instead of returning `null`, so a
 * changed tree fails with a clear message.
 */
export function parentOf(node: TestInstance, levels = 1): TestInstance {
  let current = node;
  for (let step = 0; step < levels; step++) {
    const { parent } = current;
    if (!parent) throw new Error(`No host ${levels} level(s) above <${String(node.type)}>`);
    current = parent;
  }
  return current;
}
