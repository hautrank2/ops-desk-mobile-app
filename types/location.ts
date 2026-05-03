export enum FloorType {
  B2 = "B2",
  B1 = "B1",
  G = "G",
  L1 = "L1",
  L2 = "L2",
  L3 = "L3",
  L4 = "L4",
  L5 = "L5",
}

export type LocationModel = {
  _id: string;
  code: string;
  name: string;
  floor?: FloorType | null;
  description?: string;
  isActive: boolean;
};
