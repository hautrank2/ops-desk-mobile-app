import { assetApis } from "@/apis/asset";
import { httpClient } from "@/lib/httpClient";
import { AssetModel, LocationModel, TableResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  AssetItemFilterProps,
  AssetItemFilterResult,
  AssetItemFilterValues,
  defaultAssetItemFilter,
} from "./type";

export const useAssetItemFilter = ({
  defaultValues,
  onApply,
  onReset,
}: AssetItemFilterProps) => {
  const { control, handleSubmit, reset } = useForm<AssetItemFilterValues>({
    defaultValues: { ...defaultAssetItemFilter, ...defaultValues },
  });

  // Dữ liệu cho dropdown
  const { data: locations = [] } = useQuery<LocationModel[]>({
    queryKey: ["get", "locations-all"],
    queryFn: async () => {
      const { data } = await httpClient.get<
        LocationModel[] | TableResponse<LocationModel>
      >("/location");
      return Array.isArray(data) ? data : data.items || [];
    },
  });

  const { data: assets = [] } = useQuery<AssetModel[]>({
    queryKey: ["get", "assets-all"],
    queryFn: async () => {
      const res = await assetApis.getList();
      return res.items || [];
    },
  });

  const normalize = (values: AssetItemFilterValues): AssetItemFilterResult => ({
    code: values.code.trim() || undefined,
    serialNumber: values.serialNumber.trim() || undefined,
    status: values.status || undefined,
    locationId: values.locationId || undefined,
    assetId: values.assetId || undefined,
  });

  const applyFilter = handleSubmit((values) => onApply(normalize(values)));

  const resetFilter = () => {
    reset(defaultAssetItemFilter);
    onReset?.();
    onApply({});
  };

  return { control, locations, assets, applyFilter, resetFilter };
};
