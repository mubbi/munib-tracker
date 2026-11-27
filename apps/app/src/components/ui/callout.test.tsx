import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { Callout } from "@/components/ui/callout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { usePlatform } from "@/test-support/platform";
import { queryHostsByRole } from "@/test-support/queries";
import { renderHookWithTheme, renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

type Props = Parameters<typeof Callout>[0];

const renderCallout = (props: Partial<Props> = {}) =>
  renderWithTheme(<Callout {...props}>{props.children ?? "Prayer times use your city"}</Callout>);

describe("Callout", () => {
  it("renders a string body, an optional title and no live region for info", async () => {
    await renderCallout({ title: "Heads up" });

    expect(screen.getByText("Heads up")).toBeTruthy();
    expect(screen.getByText("Prayer times use your city")).toBeTruthy();
    expect(queryHostsByRole("alert")).toHaveLength(0);
  });

  it("renders element bodies as given", async () => {
    await renderCallout({ children: <Text testID="custom">Custom</Text> });

    expect(screen.getByTestId("custom")).toBeTruthy();
  });

  it("is an assertive alert for the danger tone", async () => {
    await renderCallout({ tone: "danger", children: "Couldn't delete your account" });

    const alert = screen.getByRole("alert");
    expect(alert.props.accessibilityLiveRegion).toBe("assertive");
  });

  it("is a polite live region for warnings", async () => {
    await renderCallout({ tone: "warning" });

    const region = screen.container.queryAll((n) => n.props.accessibilityLiveRegion === "polite");
    expect(region).toHaveLength(1);
  });

  it("tints the surface with the tone's soft colour", async () => {
    const { tokens } = (await renderHookWithTheme(() => useThemeTokens())).result.current;
    await renderWithTheme(
      <Callout tone="success" testID="callout">
        Saved
      </Callout>,
    );

    expect(flattenStyle(screen.getByTestId("callout").props.style).backgroundColor).toBe(
      tokens.status.success.soft,
    );
  });

  it("keeps its action a separate button", async () => {
    const onPress = jest.fn();
    await renderCallout({ tone: "danger", action: { label: "Try again", onPress } });

    await fireEvent.press(screen.getByRole("button", { name: "Try again" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("can hide the icon", async () => {
    await renderCallout({ icon: null, testID: "c" });

    expect(screen.getByTestId("c").children).toHaveLength(1);
  });
});

describe("Callout on web", () => {
  usePlatform({ OS: "web" });

  it("uses role=alert for danger", async () => {
    await renderCallout({ tone: "danger" });

    expect(screen.container.queryAll((n) => n.props.role === "alert")).toHaveLength(1);
  });
});
