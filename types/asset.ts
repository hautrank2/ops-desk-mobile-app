import { UserModel } from "./user";

export enum AssetType {
  Device = "Device",
  Appliance = "Appliance",
  Furniture = "Furniture",
  IT = "IT",
  Facility = "Facility",
}

export type AssetModel = {
  _id: string;
  code: string;
  name: string;
  type: AssetType;
  vendor?: string;
  model?: string;
  purchaseUrl?: string;
  description?: string;
  images: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: UserModel;
  updatedBy?: UserModel;
};

export type CreateAssetPayload = {
  code: string;
  name: string;
  type: AssetType;
  vendor?: string;
  model?: string;
  purchaseUrl?: string;
  imageUrls?: string[];
  active?: boolean;
  description?: string;
};

export type UpdateAssetPayload = Partial<CreateAssetPayload>;
