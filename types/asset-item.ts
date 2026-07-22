import { UserModel } from './user';

export enum AssetItemStatus {
  Active = "Active",
  Faulty = "Faulty",
  Maintenance = "Maintenance",
  Retired = "Retired",
}

export type AssetItemModel = {
  _id: string;
  assetId: string;
  code: string;
  status: AssetItemStatus;
  locationId?: string;
  serialNumber?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: UserModel;
  updatedBy?: UserModel;
};

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
  status?: AssetItemStatus;
  /** Populate related fields */
  include?: ("createdBy" | "updatedBy")[];
};

export type CreateAssetItemModel = {
  quantity: number;
  locationId?: string;
  ownerDeptId?: string;
  serialNumber?: string;
  note?: string;
};

export type UpdateAssetItemModel = {
  status?: AssetItemStatus;
  locationId?: string;
  serialNumber?: string;
  note?: string;
};
