import { fireEvent, screen } from "@testing-library/react-native";
import { type ReactNode, useState } from "react";
import { Text, View } from "react-native";

import { renderWithTheme } from "@/test-support/render";

import { useWizardFooterSlot, WizardShell } from "./wizard-shell";

/** Stands in for `ScreenLayout`: the footer renders outside the scrolling body. */
function FakeScreen({ footer, children }: { footer: ReactNode; children: ReactNode }) {
  return (
    <View>
      <View testID="body">{children}</View>
      <View testID="footer">{footer}</View>
    </View>
  );
}

function SlottedWizard({ onFinish }: { onFinish: (step: number) => void }) {
  const slot = useWizardFooterSlot();
  const [step, setStep] = useState(0);
  return (
    <FakeScreen footer={slot.footer}>
      <slot.Provider>
        <WizardShell
          title={`Step title ${step + 1}`}
          stepIndex={step}
          total={3}
          stepLabel={`Step ${step + 1} of 3`}
          progressLabel="Setup progress"
          onBack={() => setStep(step - 1)}
          onNext={() => (step < 2 ? setStep(step + 1) : onFinish(step))}
          nextLabel={step < 2 ? "Next" : "Finish"}
        >
          <Text>Body {step + 1}</Text>
        </WizardShell>
      </slot.Provider>
    </FakeScreen>
  );
}

describe("WizardShell footer slot", () => {
  it("draws Back / Next in the screen footer, not after the body, and keeps it current", async () => {
    const onFinish = jest.fn();
    await renderWithTheme(<SlottedWizard onFinish={onFinish} />);
    // One Next, rendered in the screen's footer.
    expect(screen.getAllByRole("button", { name: "Next" })).toHaveLength(1);
    expect(screen.getByTestId("footer")).toContainElement(
      screen.getByRole("button", { name: "Next" }),
    );

    await fireEvent.press(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Body 2")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Next" }));
    // The published footer follows the shell's latest props (label + handler).
    await fireEvent.press(screen.getByRole("button", { name: "Finish" }));
    expect(onFinish).toHaveBeenCalledWith(2);
  });

  it("without a slot the footer stays inline", async () => {
    await renderWithTheme(
      <WizardShell
        title="People"
        stepIndex={0}
        total={2}
        stepLabel="Step 1 of 2"
        progressLabel="Setup progress"
        onBack={jest.fn()}
        onNext={jest.fn()}
      >
        <Text>Body</Text>
      </WizardShell>,
    );
    expect(screen.getAllByRole("button", { name: "Next" })).toHaveLength(1);
  });
});
