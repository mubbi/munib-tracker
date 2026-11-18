import { screen } from "@testing-library/react-native";

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
