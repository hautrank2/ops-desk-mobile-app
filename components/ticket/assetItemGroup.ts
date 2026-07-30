import { AssetItemModel, AssetModel } from "@/types";

export type AssetItemGroup = {
  assetId: string;
  asset?: AssetModel;
  items: AssetItemModel[];
};

/** Populated asset object, or undefined when assetId is still a raw id string. */
export const getAssetOf = (item: AssetItemModel): AssetModel | undefined =>
  typeof item.assetId === "object" ? item.assetId : undefined;

export const getAssetIdOf = (item: AssetItemModel): string =>
  typeof item.assetId === "object" ? item.assetId._id : item.assetId;

/** Group asset items by their parent asset, preserving first-seen order. */
export const groupByAsset = (items: AssetItemModel[]): AssetItemGroup[] => {
  const map = new Map<string, AssetItemGroup>();
  const order: string[] = [];

  for (const item of items) {
    const id = getAssetIdOf(item);
    if (!map.has(id)) {
      map.set(id, { assetId: id, asset: getAssetOf(item), items: [] });
      order.push(id);
    }
    map.get(id)!.items.push(item);
  }

  return order.map((id) => map.get(id)!);
};
