import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import i18n from "@/i18n";
import { pickAttachmentFromGallery } from "@/lib/attachments/attachment-file-manager";
import { discardPickedFile } from "@/lib/attachments/discard-picked-file";
import { preparePickedPhoto } from "@/lib/debts/debt-photo";
import { debtsActions } from "@/lib/debts/debts-store";
import { renderWithTheme } from "@/test-support/render";

import { DebtPhotoCard } from "./debt-photo-card";

jest.mock("@/lib/attachments/attachment-file-manager", () => ({
  pickAttachmentFromCamera: jest.fn(),
  pickAttachmentFromGallery: jest.fn(),
}));
jest.mock("@/lib/attachments/discard-picked-file", () => ({ discardPickedFile: jest.fn() }));
jest.mock("@/lib/debts/debt-photo", () => ({
  loadDebtPhoto: jest.fn(async () => null),
  preparePickedPhoto: jest.fn(),
}));
jest.mock("@/lib/debts/debts-store", () => ({
  debtsActions: {
    setDocumentPhoto: jest.fn(async () => undefined),
    removeDocumentPhoto: jest.fn(async () => undefined),
  },
}));

const PICKED = "file:///cache/ImagePicker/receipt.jpg";
const pick = pickAttachmentFromGallery as jest.Mock;
const prepare = preparePickedPhoto as jest.Mock;
const setDocumentPhoto = debtsActions.setDocumentPhoto as jest.Mock;
const discard = discardPickedFile as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  pick.mockResolvedValue({
    kind: "picked",
    attachment: { uri: PICKED, fileName: "receipt.jpg", mimeType: "image/jpeg", sizeBytes: 10 },
  });
});

async function chooseFromGallery() {
  await renderWithTheme(<DebtPhotoCard debtId="d1" documentUri={undefined} />);
  await fireEvent.press(screen.getByText(i18n.t("debts.photo.choose")));
}

describe("DebtPhotoCard — plaintext picker copy", () => {
  it("deletes the picker's cache copy after sealing the photo into the vault", async () => {
    const bytes = new Uint8Array([0xff, 0xd8, 0xff]);
    prepare.mockResolvedValue({ ok: true, bytes, mimeType: "image/jpeg" });

    await chooseFromGallery();

    await waitFor(() => expect(discard).toHaveBeenCalledWith(PICKED));
    expect(setDocumentPhoto).toHaveBeenCalledWith("d1", bytes, "image/jpeg");
    expect(setDocumentPhoto.mock.invocationCallOrder[0]).toBeLessThan(
      discard.mock.invocationCallOrder[0] ?? 0,
    );
  });

  it("still deletes it when the photo is refused or saving fails", async () => {
    prepare.mockResolvedValueOnce({ ok: false, reason: "too-large" });
    await chooseFromGallery();
    await waitFor(() => expect(discard).toHaveBeenCalledWith(PICKED));
    expect(setDocumentPhoto).not.toHaveBeenCalled();

    discard.mockClear();
    prepare.mockResolvedValueOnce({ ok: true, bytes: new Uint8Array([1]), mimeType: "image/png" });
    setDocumentPhoto.mockRejectedValueOnce(new Error("vault locked"));
    await fireEvent.press(screen.getByText(i18n.t("debts.photo.choose")));
    await waitFor(() => expect(discard).toHaveBeenCalledWith(PICKED));
  });

  it("has nothing to delete when the picker was cancelled", async () => {
    pick.mockResolvedValueOnce({ kind: "canceled" });
    await chooseFromGallery();
    await waitFor(() => expect(discard).toHaveBeenCalledWith(null));
    expect(prepare).not.toHaveBeenCalled();
  });
});
