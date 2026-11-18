/**
 * Placeholder component for mocking heavy children: renders its `label` as text
 * so a parent test can assert *whether* the child is shown without its internals.
 *
 *   jest.mock("@/components/continue-card", () => ({
 *     ContinueCard: require("@/test-support/mocks/stub-component").stubComponent("continue-card"),
 *   }));
 */
import { Text } from "react-native";

export function stubComponent(label: string) {
  return () => <Text>{label}</Text>;
}
