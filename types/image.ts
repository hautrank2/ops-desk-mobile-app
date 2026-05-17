import z from "zod";

export type ImageAssetMediaType =
  | "image"
  | "video"
  | "livePhoto"
  | "pairedVideo";

export const imageAssetSchema = z.object({
  assetId: z.string().nullable().optional(),
  base64: z.string().nullable().optional(),
  duration: z.number().nullable().optional(),
  exif: z.record(z.any(), z.any()).nullable().optional(),
  fileName: z.string().nullable().optional(),
  fileSize: z.number().optional(),
  height: z.number(),
  width: z.number(),
  type: z.enum(["image", "video", "livePhoto", "pairedVideo"]).optional(),
  uri: z.string(),
  mimeType: z.string().optional(),
});

export type ImageAssetModel = z.infer<typeof imageAssetSchema>;
