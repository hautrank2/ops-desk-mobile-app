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

  return { control, applyFilter, resetFilter };
};
