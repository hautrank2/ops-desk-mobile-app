import * as z from "zod";
import {
  TicketType,
  TicketPriority,
  TicketStatus,
  imageAssetSchema,
} from "@/types";

export const ticketTypes = Object.values(TicketType);
export const ticketPriorities = Object.values(TicketPriority);
export const ticketStatuses = Object.values(TicketStatus);

export const ticketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  type: z.enum(Object.values(TicketType) as [string, ...string[]]),
  priority: z.enum(Object.values(TicketPriority) as [string, ...string[]]),
  status: z.enum(Object.values(TicketStatus) as [string, ...string[]]),
  assetItemIds: z.array(z.string()).min(1, "At least 1 asset item must be selected"),
  locationId: z.string().optional(),
  assigneeId: z.string().optional(),
  dueAt: z.string().optional().refine(
    (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
    "Format must be YYYY-MM-DD",
  ),
  cause: z.string().optional(),
  note: z.string().optional(),
  description: z.string().optional(),
  images: z.array(imageAssetSchema).optional(),
});

export type TicketFormValues = z.infer<typeof ticketSchema>;

export type TicketFormProps = {
  ticketId?: string;
};

export const getDefaultValues = (ticketData?: any): TicketFormValues => ({
  title: ticketData?.title ?? "",
  type: ticketData?.type ?? TicketType.Repair,
  priority: ticketData?.priority ?? TicketPriority.Medium,
  status: ticketData?.status ?? TicketStatus.New,
  assetItemIds: ticketData?.assetItemIds ?? [],
  locationId: ticketData?.locationId ?? "",
  assigneeId: ticketData?.assigneeId ?? "",
  dueAt: ticketData?.dueAt ? new Date(ticketData.dueAt).toISOString().split("T")[0] : "",
  cause: ticketData?.cause ?? "",
  note: ticketData?.note ?? "",
  description: ticketData?.description ?? "",
  images: [],
});
