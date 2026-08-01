import { assetItemApis } from "@/apis/asset-item";
import { AssetItemModel, AssetItemStatus } from "@/types";
import React from "react";
import { EntitySelect, EntitySelectProps } from "./EntitySelect";
import {
  FetchSelectOne,
  FetchSelectPage,
  SelectOption,
} from "./EntitySelect/type";
import { EntitySelectField, EntitySelectFieldProps } from "./EntitySelectField";

const toOption = (item: AssetItemModel): SelectOption => ({
  value: item._id,
  name: item.code,
  code: item.serialNumber ?? item.status,
  data: item,
});

/** Dependent filters (assetId/status) are closed over here so the engine stays entity-agnostic. */
const makeAdapters = (assetId?: string, status?: AssetItemStatus) => {
  const fetchPage: FetchSelectPage = async ({
    search,
    pageIndex,
    pageSize,
  }) => {
    const res = await assetItemApis.getList({
      code: search || undefined,
      assetId,
      status,
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
      const item = await assetItemApis.getById(id);
      return toOption(item);
    } catch {
      return null;
    }
  };

  return { fetchPage, fetchOne };
};

export type AssetItemSelectProps = Omit<
  EntitySelectProps,
  "fetchPage" | "fetchOne" | "queryKey"
> & {
  /** Restrict the list to items belonging to this asset. */
  assetId?: string;
  /** Restrict the list to a given status. */
  status?: AssetItemStatus;
};

export const AssetItemSelect = ({
  assetId,
  status,
  ...props
}: AssetItemSelectProps) => {
  const { fetchPage, fetchOne } = makeAdapters(assetId, status);
  return (
    <EntitySelect
      {...props}
      fetchPage={fetchPage}
      fetchOne={fetchOne}
      queryKey={["asset-item", assetId ?? "all", status ?? "all"]}
      placeholder={props.placeholder ?? "Select asset item..."}
    />
  );
};

export type AssetItemSelectFieldProps = Omit<
  EntitySelectFieldProps,
  "fetchPage" | "fetchOne" | "queryKey"
> & {
  assetId?: string;
  status?: AssetItemStatus;
};

export const AssetItemSelectField = ({
  assetId,
  status,
  ...props
}: AssetItemSelectFieldProps) => {
  const { fetchPage, fetchOne } = makeAdapters(assetId, status);
  return (
    <EntitySelectField
      {...props}
      fetchPage={fetchPage}
      fetchOne={fetchOne}
      queryKey={["asset-item", assetId ?? "all", status ?? "all"]}
      placeholder={props.placeholder ?? "Select asset item..."}
    />
  );
};
