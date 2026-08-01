import { assetApis } from "@/apis/asset";
import { AssetModel } from "@/types";
import React from "react";
import { EntitySelect, EntitySelectProps } from "./EntitySelect";
import {
  FetchSelectOne,
  FetchSelectPage,
  SelectOption,
} from "./EntitySelect/type";
import { EntitySelectField, EntitySelectFieldProps } from "./EntitySelectField";

const toOption = (asset: AssetModel): SelectOption => ({
  value: asset._id,
  name: asset.name,
  code: asset.code,
  data: asset,
});

const fetchPage: FetchSelectPage = async ({ search, pageIndex, pageSize }) => {
  const res = await assetApis.getList({
    name: search || undefined,
    page: pageIndex,
    pageSize,
  });
  return {
    items: res.items.map(toOption),
    hasNext: pageIndex * pageSize < res.total,
    pageIndex,
  };
};

const fetchOne: FetchSelectOne = async (id) => {
  try {
    const asset = await assetApis.getById(id);
    return toOption(asset);
  } catch {
    return null;
  }
};

export type AssetSelectProps = Omit<
  EntitySelectProps,
  "fetchPage" | "fetchOne" | "queryKey"
>;

export const AssetSelect = (props: AssetSelectProps) => (
  <EntitySelect
    {...props}
    fetchPage={fetchPage}
    fetchOne={fetchOne}
    queryKey={["asset"]}
    placeholder={props.placeholder ?? "Select asset..."}
  />
);

export type AssetSelectFieldProps = Omit<
  EntitySelectFieldProps,
  "fetchPage" | "fetchOne" | "queryKey"
>;

export const AssetSelectField = (props: AssetSelectFieldProps) => (
  <EntitySelectField
    {...props}
    fetchPage={fetchPage}
    fetchOne={fetchOne}
    queryKey={["asset"]}
    placeholder={props.placeholder ?? "Select asset..."}
  />
);
