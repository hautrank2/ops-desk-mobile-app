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

export interface TicketModel {
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
  images: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: UserModel;
  updatedBy?: UserModel;
}
