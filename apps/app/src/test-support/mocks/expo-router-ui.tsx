/**
 * `expo-router/ui` headless tabs stand-in. `TabTrigger asChild` hands its child
 * `isFocused` (the active tab, see `setMockActiveTab`) and an `onPress` that
 * records the href in `mockTabNavigate`.
 *
 *   jest.mock("expo-router/ui", () => require("@/test-support/mocks/expo-router-ui").expoRouterUiMock);
 *   beforeEach(resetExpoRouterUiMock);
 */
import { Children, cloneElement, type ReactElement, type ReactNode } from "react";
import { View } from "react-native";

let activeTab = "index";

export const mockTabNavigate = jest.fn();

export function setMockActiveTab(name: string): void {
  activeTab = name;
}

export function resetExpoRouterUiMock(): void {
  activeTab = "index";
  mockTabNavigate.mockClear();
}

type SlotProps = { children?: ReactNode; style?: unknown };

function Tabs({ children, style }: SlotProps) {
  return (
    <View testID="tabs" style={style as never}>
      {children}
    </View>
  );
}

function TabList({ asChild, children, style }: SlotProps & { asChild?: boolean }) {
  if (asChild) return <>{children}</>;
  return (
    <View testID="tab-list" style={style as never}>
      {children}
    </View>
  );
}

function TabSlot({ style }: { style?: unknown }) {
  return <View testID="tab-slot" style={style as never} />;
}

function TabTrigger({ name, href, children }: { name: string; href: string; children: ReactNode }) {
  const child = Children.only(children) as ReactElement<Record<string, unknown>>;
  return cloneElement(child, {
    isFocused: name === activeTab,
    onPress: () => mockTabNavigate(href),
  });
}

export const expoRouterUiMock = { __esModule: true, Tabs, TabList, TabSlot, TabTrigger };
