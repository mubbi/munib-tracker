import { render, screen } from "@testing-library/react-native";

import { ExternalCommandProcessor } from "@/components/external-command-processor";
import { useExternalCommandProcessor } from "@/hooks/use-external-command-processor";

jest.mock("@/hooks/use-external-command-processor", () => ({
  useExternalCommandProcessor: jest.fn(),
}));

describe("ExternalCommandProcessor", () => {
  it("mounts the command drain loop without rendering UI", async () => {
    await render(<ExternalCommandProcessor />);

    expect(useExternalCommandProcessor).toHaveBeenCalled();
    expect(screen.toJSON()).toBeNull();
  });
});
