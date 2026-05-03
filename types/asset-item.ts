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
