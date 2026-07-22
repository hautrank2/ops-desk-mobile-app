import { UserModel } from "./user";

export type TicketCommentModel = {
  _id: string;
  ticketId: string;
  content: string;
  imgUrls: string[];
  parentId: string | null;
  rootId: string | null;
  depth: number;
  isDeleted: boolean;
  createdBy: {
    _id: string;
    name: string;
    username: string;
  } | UserModel;
  updatedBy?: {
    _id: string;
    name: string;
    username: string;
  } | UserModel | null;
  createdAt: string;
  updatedAt?: string | null;
  replies?: TicketCommentModel[];
};

export type CreateTicketCommentModel = {
  ticketId: string;
  content: string;
  parentId?: string;
  images?: Array<{ uri: string; fileName?: string | null; mimeType?: string | null }>;
};

export type UpdateTicketCommentModel = {
  content: string;
};

export type UpdateTicketCommentImagesModel = {
  keepUrls?: string[];
  images?: Array<{ uri: string; fileName?: string | null; mimeType?: string | null }>;
};
