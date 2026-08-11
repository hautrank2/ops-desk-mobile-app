import { dashboardApi } from "@/apis/dashboard";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Clock,
  PenLine,
  Ticket as TicketIcon,
  UserCheck,
} from "lucide-react-native";
import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import {
  AlertCard,
  DashboardState,
  RecentTicketsList,
  SectionTitle,
  StatCard,
  TicketPriorityBreakdown,
  TicketStatusBreakdown,
} from "./shared";

type Props = { username?: string };

export const UserDashboard = ({ username }: Props) => {
  const { data, isLoading, isRefetching, refetch, isError } = useQuery({
    queryKey: ["dashboard", "user"],
    queryFn: () => dashboardApi.getUserOverview(),
  });

  const state = DashboardState({ isLoading, isError: isError || !data, refetch });
  if (state) return state;

  const { totals, tickets, recentTickets } = data!;

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
        <Text className="text-typography-500 text-sm mt-0.5">Your tickets at a glance</Text>
      </View>

      {/* My ticket counters */}
      <View className="flex-row flex-wrap gap-3">
        <StatCard
          icon={TicketIcon}
          label="My tickets"
          value={totals.myTickets}
          accent="bg-primary-600"
        />
        <StatCard
          icon={PenLine}
          label="Created by me"
          value={totals.createdByMe}
          accent="bg-info-600"
        />
        <StatCard
          icon={UserCheck}
          label="Assigned to me"
          value={totals.assignedToMe}
          accent="bg-success-600"
          width="w-full"
        />
      </View>

      {/* Attention row */}
      <View className="flex-row gap-3 mt-3">
        <AlertCard
          icon={Clock}
          label="Open"
          value={tickets.open}
          iconWrap="bg-info-50"
          iconColor="text-info-600"
        />
        <AlertCard
          icon={AlertTriangle}
          label="Overdue"
          value={tickets.overdue}
          iconWrap="bg-error-50"
          iconColor="text-error-600"
          highlight={tickets.overdue > 0}
        />
      </View>

      <SectionTitle>My tickets by status</SectionTitle>
      <TicketStatusBreakdown byStatus={tickets.byStatus} />

      <SectionTitle>My tickets by priority</SectionTitle>
      <TicketPriorityBreakdown byPriority={tickets.byPriority} />

      <SectionTitle>My recent tickets</SectionTitle>
      <RecentTicketsList tickets={recentTickets} emptyLabel="You have no tickets yet" />
    </ScrollView>
  );
};
