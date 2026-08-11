import { dashboardApi } from "@/apis/dashboard";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Boxes,
  Clock,
  Inbox,
  MapPin,
  Package,
  Ticket as TicketIcon,
} from "lucide-react-native";
import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import {
  AlertCard,
  DashboardState,
  ItemStatusBreakdown,
  RecentTicketsList,
  SectionTitle,
  StatCard,
  TicketPriorityBreakdown,
  TicketStatusBreakdown,
} from "./shared";

type Props = { username?: string };

export const ManagerDashboard = ({ username }: Props) => {
  const { data, isLoading, isRefetching, refetch, isError } = useQuery({
    queryKey: ["dashboard", "manager"],
    queryFn: () => dashboardApi.getManagerOverview(),
  });

  const state = DashboardState({ isLoading, isError: isError || !data, refetch });
  if (state) return state;

  const { totals, tickets, items, recentTickets } = data!;

  return (
    <ScrollView
      className="flex-1 bg-background-50"
      contentContainerClassName="p-4 pb-8"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
    >
      <View className="mt-1 mb-4">
        <Text className="text-2xl font-bold text-typography-900">
          Hi, {username || "there"} 👋
        </Text>
        <Text className="text-typography-500 text-sm mt-0.5">Operations overview</Text>
      </View>

      {/* Action row — what needs attention first */}
      <View className="flex-row gap-3">
        <AlertCard
          icon={Inbox}
          label="Unassigned"
          value={tickets.unassigned}
          iconWrap="bg-warning-50"
          iconColor="text-warning-600"
          highlight={tickets.unassigned > 0}
        />
        <AlertCard
          icon={AlertTriangle}
          label="Overdue"
          value={tickets.overdue}
          iconWrap="bg-error-50"
          iconColor="text-error-600"
          highlight={tickets.overdue > 0}
        />
        <AlertCard
          icon={Clock}
          label="Open"
          value={tickets.open}
          iconWrap="bg-info-50"
          iconColor="text-info-600"
        />
      </View>

      <View className="flex-row flex-wrap gap-3 mt-3">
        <StatCard icon={TicketIcon} label="Tickets" value={totals.tickets} accent="bg-warning-600" />
        <StatCard icon={Package} label="Asset Items" value={totals.items} accent="bg-info-600" />
        <StatCard icon={Boxes} label="Assets" value={totals.assets} accent="bg-primary-600" />
        <StatCard icon={MapPin} label="Locations" value={totals.locations} accent="bg-success-600" />
      </View>

      <SectionTitle>Tickets by status</SectionTitle>
      <TicketStatusBreakdown byStatus={tickets.byStatus} />

      <SectionTitle>Tickets by priority</SectionTitle>
      <TicketPriorityBreakdown byPriority={tickets.byPriority} />

      <SectionTitle>Asset items by status</SectionTitle>
      <ItemStatusBreakdown byStatus={items.byStatus} />

      <SectionTitle>Recent tickets</SectionTitle>
      <RecentTicketsList tickets={recentTickets} />
    </ScrollView>
  );
};
