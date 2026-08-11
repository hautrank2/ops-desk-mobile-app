import { AssetItemStatus } from "./asset-item";
import { TicketPriority, TicketStatus } from "./ticket";

export type DashboardRecentTicket = {
  _id: string;
  code: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
};

type TicketBreakdowns = {
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
};

// ─── Admin ──────────────────────────────────────────────────────────────────
export type AdminDashboardModel = {
  totals: {
    assets: number;
    items: number;
    tickets: number;
    locations: number;
    users: number;
  };
  tickets: {
    open: number;
    overdue: number;
  } & TicketBreakdowns;
  items: {
    byStatus: Record<AssetItemStatus, number>;
  };
  recentTickets: DashboardRecentTicket[];
};

// ─── Manager ────────────────────────────────────────────────────────────────
export type ManagerDashboardModel = {
  totals: {
    assets: number;
    items: number;
    tickets: number;
    locations: number;
  };
  tickets: {
    open: number;
    overdue: number;
    unassigned: number;
  } & TicketBreakdowns;
  items: {
    byStatus: Record<AssetItemStatus, number>;
  };
  recentTickets: DashboardRecentTicket[];
};

// ─── User ───────────────────────────────────────────────────────────────────
export type UserDashboardModel = {
  totals: {
    myTickets: number;
    createdByMe: number;
    assignedToMe: number;
  };
  tickets: {
    open: number;
    overdue: number;
  } & TicketBreakdowns;
  recentTickets: DashboardRecentTicket[];
};
