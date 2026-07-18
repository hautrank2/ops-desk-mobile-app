import { ImageAssetModel } from "./image";
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
  imageUrls: string[];
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
  description?: string;
  images?: ImageAssetModel[];
};

export type UpdateAssetPayload = Partial<CreateAssetPayload>;

export type AssetQueryModel = {
  page?: number;
  pageSize?: number;
  code?: string;
  name?: string;
  type?: AssetType;
  vendor?: string;
  model?: string;
  active?: boolean;
  createdBy?: string;
  sortBy?: "createdAt" | "updatedAt" | "code" | "name" | "type" | "active";
  order?: "asc" | "desc";
  include?: ("createdBy" | "updatedBy")[];
  itemCount?: boolean;
};

export type CreateAssetModel = {
  code: string;
  name: string;
  type: AssetType;
  vendor?: string;
  model?: string;
  purchaseUrl?: string;
  description?: string;
  images?: ImageAssetModel[];
};

export type UpdateAssetModel = Partial<Omit<CreateAssetModel, "images">>;

export type AddAssetImageModel = {
  id: string;
  images: {
    uri: string;
    fileName?: string | null;
    mimeType?: string | null;
  }[];
};
