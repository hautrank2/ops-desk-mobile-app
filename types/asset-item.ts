import { DepartmentModel } from './department';
import { LocationModel } from './location';
import { AssetModel } from './asset';

export enum AssetItemStatus {
  Available = "Available",
  InUse = "InUse",
  UnderMaintenance = "UnderMaintenance",
  Retired = "Retired",
}

export type AssetItemModel = {
  _id: string;
  asset: AssetModel | string;
  serialNumber?: string;
  status: AssetItemStatus;
  location?: LocationModel | null;
  ownerDept?: DepartmentModel | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAssetItemDto = {
  quantity: number;
  locationId?: string;
  ownerDeptId?: string;
};

export type AssetItemStatusModel =
  | "Active"
  | "Faulty"
  | "Maintenance"
  | "Retired";

export type AssetItemQueryModel = {
  page?: number;
  pageSize?: number;
  /** Filter by code (partial match) */
  code?: string;
  /** Filter by serial number (partial match) */
  serialNumber?: string;
  /** Filter by locationId */
  locationId?: string;
  /** Filter by assetId */
  assetId?: string;
  /** Filter by status */
  status?: AssetItemStatusModel;
  /** Populate related fields */
  include?: ("createdBy" | "updatedBy")[];
};

export type UpdateAssetItemModel = {
  status?: AssetItemStatusModel;
  locationId?: string;
  ownerDeptId?: string;
  serialNumber?: string;
  note?: string;
};
