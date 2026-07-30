import { AssetItemModel } from "@/types";
import * as z from "zod";

// ─── Zod schema ────────────────────────────────────────────────────────────
export const ticketAddAssetItemSchema = z.object({
  assetItemIds: z
    .array(z.string())
    .min(1, "At least 1 asset item must be selected"),
});

export type TicketAddAssetItemValues = z.infer<typeof ticketAddAssetItemSchema>;

// ─── Props ─────────────────────────────────────────────────────────────────
export type TicketAddAssetItemProps = {
  isEdit?: boolean;
  defaultValues?: TicketAddAssetItemValues;
  /**
   * Gọi khi bấm xác nhận (Add Selected).
   * @param ids   Danh sách id đã chọn
   * @param items Danh sách AssetItemModel tương ứng
   * @param indexes Vị trí của item trong danh sách nguồn
   */
  onSubmit: (ids: string[], items: AssetItemModel[], indexes: number[]) => void;
  /** Gọi khi huỷ / đóng dialog */
  onCancel: () => void;
  excludedAssetItemId: string[];
};

export type TicketAddAssetItemDialogProps = TicketAddAssetItemProps & {
  isOpen: boolean;
};
