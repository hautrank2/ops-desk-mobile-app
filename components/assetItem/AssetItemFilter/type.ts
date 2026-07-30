import { AssetItemStatus } from "@/types";

/**
 * State của form filter (dùng chuỗi rỗng cho "tất cả" để hợp với Select/Input).
 * Các field bám theo AssetItemQueryDto bên server:
 * code, serialNumber, status, locationId, assetId.
 */
export type AssetItemFilterValues = {
  code: string;
  serialNumber: string;
  status: AssetItemStatus | "";
  locationId: string;
  assetId: string;
};

/** Kết quả đã chuẩn hoá (bỏ field rỗng) để gắn vào AssetItemQueryModel */
export type AssetItemFilterResult = {
  code?: string;
  serialNumber?: string;
  status?: AssetItemStatus;
  locationId?: string;
  assetId?: string;
};

export const defaultAssetItemFilter: AssetItemFilterValues = {
  code: "",
  serialNumber: "",
  status: "",
  locationId: "",
  assetId: "",
};

export type AssetItemFilterProps = {
  defaultValues?: Partial<AssetItemFilterValues>;
  /** Gọi khi bấm Apply (đã chuẩn hoá, bỏ field rỗng) */
  onApply: (result: AssetItemFilterResult) => void;
  /** Gọi khi bấm Reset */
  onReset?: () => void;
};
