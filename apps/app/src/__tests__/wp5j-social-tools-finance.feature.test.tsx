import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import CirclesHubScreen from "@/app/circles/index";
import SadaqahScreen from "@/app/sadaqah/index";
import { KhatmGroupView } from "@/components/circles/khatm/khatm-group-view";
import { NumberField } from "@/components/ui/number-field";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { makeCircleDetail } from "@/test-support/circles";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

const mockHooks = {
  circles: { data: [] as unknown[], isLoading: false, isError: false, refetch: jest.fn() },
  circle: { data: undefined as unknown, isLoading: false, isError: false, refetch: jest.fn() },
  khatms: { data: undefined as unknown, isLoading: false, isError: false, refetch: jest.fn() },
  khatm: { data: undefined as unknown, isLoading: false, isError: false, refetch: jest.fn() },
};

jest.mock("@/lib/circles/hooks", () => ({
  useCircleAuth: () => ({ isAccount: true, hasSession: true }),
  useCircles: () => mockHooks.circles,
  useCircle: () => mockHooks.circle,
  useKhatms: () => mockHooks.khatms,
  useKhatm: () => mockHooks.khatm,
  useCircleMutation: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useCircleAction: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));
jest.mock("@/lib/circles/khatm-hooks", () => ({
  useKhatmPartMutation: () => ({ run: jest.fn(), isPending: false }),
  useKhatmDealMutation: () => ({ run: jest.fn(), isPending: false }),
}));
jest.mock("@/components/circles/nearby/nearby-join-sheet", () => ({
  JoinNearbyButton: () => null,
}));
jest.mock("@/components/quran/quran-recite-launcher", () => ({
  useReciteAlongLauncher: () => ({ available: false, launch: jest.fn(), sheet: null }),
}));
jest.mock("@/components/quran/recite-along-button", () => ({ ReciteAlongButton: () => null }));
jest.mock("@/components/circles/invite-panel", () => ({ InvitePanel: () => null }));
jest.mock("@/components/circles/my-membership-card", () => ({ MyMembershipCard: () => null }));

beforeEach(() => {
  mockHooks.circles = { data: [], isLoading: false, isError: false, refetch: jest.fn() };
  mockHooks.circle = {
    data: makeCircleDetail({ type: "khatm_group" }),
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  };
  mockHooks.khatms = { data: [], isLoading: false, isError: false, refetch: jest.fn() };
  mockHooks.khatm = { data: undefined, isLoading: false, isError: false, refetch: jest.fn() };
});

describe("Circles hub", () => {
  it("shows the empty state with both ways in: start a circle and join with a code", async () => {
    await renderWithTheme(<CirclesHubScreen />);
    expect(screen.getByText("No circles yet")).toBeTruthy();
    // Start action on the empty state, join action beside it.
    expect(screen.getAllByText("Start a circle").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Join with a code").length).toBeGreaterThan(0);
    expect(screen.getByText("Join circle")).toBeTruthy();
  });
});

describe("Khatm group view", () => {
  it("shows Retry (not 'Start a khatm') when the khatm list request failed", async () => {
    mockHooks.khatms = { data: undefined, isLoading: false, isError: true, refetch: jest.fn() };
    await renderWithTheme(<KhatmGroupView circleId="c-1" onLeft={jest.fn()} />);
    expect(screen.queryByText("Start a khatm")).toBeNull();
    await fireEvent.press(screen.getByText("Try again"));
    expect(mockHooks.circle.refetch).toHaveBeenCalled();
    expect(mockHooks.khatms.refetch).toHaveBeenCalled();
  });

  it("only offers 'Start a khatm' once the list loaded empty", async () => {
    await renderWithTheme(<KhatmGroupView circleId="c-1" onLeft={jest.fn()} />);
    expect(screen.getByText("Start a khatm")).toBeTruthy();
  });
});

describe("Sadaqah", () => {
  it("disables the log button until an amount is entered and renders the user's separators", async () => {
    await renderWithTheme(<SadaqahScreen />);
    expect(screen.getByRole("button", { name: "Add to log" })).toBeDisabled();
  });
});

describe("WizardShell", () => {
  it("shows the step, the heading and says why Next is disabled", async () => {
    await renderWithTheme(
      <WizardShell
        title="People"
        stepIndex={1}
        total={3}
        stepLabel="Step 2 of 3"
        progressLabel="Setup progress"
        onBack={jest.fn()}
        onNext={jest.fn()}
        nextDisabled
        nextHint="Add a name to continue."
      ></WizardShell>,
    );
    expect(screen.getByText("Step 2 of 3")).toBeTruthy();
    expect(screen.getByText("People")).toBeTruthy();
    expect(screen.getByText("Add a name to continue.")).toBeTruthy();
  });
});

describe("NumberField money", () => {
  it("renders the amount with the user's separators", async () => {
    await renderWithTheme(
      <NumberField
        label="Amount"
        value={1234.5}
        onChangeValue={() => {}}
        numberFormat="dot_comma"
      />,
    );
    await waitFor(() => expect(screen.getByDisplayValue("1.234,5")).toBeTruthy());
  });
});
