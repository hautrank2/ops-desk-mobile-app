import { UserModel } from './user';

export enum TicketType {
  Repair = "Repair",
  Maintenance = "Maintenance",
  Request = "Request",
  Incident = "Incident",
}

export enum TicketPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Urgent = "Urgent",
}

export enum TicketStatus {
  New = "New",
  Assigned = "Assigned",
  Doing = "Doing",
  Waiting = "Waiting",
  Done = "Done",
  Cancelled = "Cancelled",
}

export type TicketModel = {
  _id: string;
  code: string;
  title: string;
  description?: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  assetItemIds: string[];
  cause?: string;
  note?: string;
  locationId?: string;
  assigneeId?: string;
  teamId?: string;
  dueAt?: string;
  closedAt?: string;
  /** Uploaded ticket image URLs (server field: imageUrls) */
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: UserModel;
  updatedBy?: UserModel;
};

export type TicketQueryModel = {
  page?: number;
  pageSize?: number;
  code?: string;
  title?: string;
  type?: TicketType;
  priority?: TicketPriority;
  status?: TicketStatus;
  /** Filter by asset item ids */
  assetItemIds?: string[];
  locationId?: string;
  assigneeId?: string;
  departmentId?: string;
  /** ISO date string — due date range start */
  startDueAt?: string;
  /** ISO date string — due date range end */
  endDueAt?: string;
  createdBy?: string;
  sortBy?: "createdAt" | "updatedAt" | "dueAt" | "priority" | "status";
  order?: "asc" | "desc";
  populations?: ("createdBy" | "updatedBy" | "assetItemId")[];
};

export type CreateTicketModel = {
  title: string;
  description?: string;
  type: TicketType;
  /** At least 1 asset item id required */
  assetItemIds: string[];
  priority?: TicketPriority;
  status?: TicketStatus;
  cause?: string;
  note?: string;
  locationId?: string;
  assigneeId?: string;
  teamId?: string;
  /** ISO date string */
  dueAt?: string;
  /** ISO date string */
  closedAt?: string;
  images?: Array<{ uri: string; fileName?: string | null; mimeType?: string | null }>;
};

export type UpdateTicketModel = Partial<Omit<CreateTicketModel, "images">>;

export type AddTicketImageModel = {
  id: string;
  images: Array<{ uri: string; fileName?: string | null; mimeType?: string | null }>;
};
