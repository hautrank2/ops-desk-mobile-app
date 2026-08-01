import { locationApis } from "@/apis/location";
import { LocationModel } from "@/types";
import React from "react";
import { EntitySelect, EntitySelectProps } from "./EntitySelect";
import {
  FetchSelectOne,
  FetchSelectPage,
  SelectOption,
} from "./EntitySelect/type";
import { EntitySelectField, EntitySelectFieldProps } from "./EntitySelectField";

const toOption = (location: LocationModel): SelectOption => ({
  value: location._id,
  name: location.name,
  code: location.code,
  data: location,
});

const fetchPage: FetchSelectPage = async ({ search, pageIndex, pageSize }) => {
  const res = await locationApis.getList({
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
    const location = await locationApis.getById(id);
    return toOption(location);
  } catch {
    return null;
  }
};

export type LocationSelectProps = Omit<
  EntitySelectProps,
  "fetchPage" | "fetchOne" | "queryKey"
>;

export const LocationSelect = (props: LocationSelectProps) => (
  <EntitySelect
    {...props}
    fetchPage={fetchPage}
    fetchOne={fetchOne}
    queryKey={["location"]}
    placeholder={props.placeholder ?? "Select location..."}
  />
);

export type LocationSelectFieldProps = Omit<
  EntitySelectFieldProps,
  "fetchPage" | "fetchOne" | "queryKey"
>;

export const LocationSelectField = (props: LocationSelectFieldProps) => (
  <EntitySelectField
    {...props}
    fetchPage={fetchPage}
    fetchOne={fetchOne}
    queryKey={["location"]}
    placeholder={props.placeholder ?? "Select location..."}
  />
);
