import { Icon as GSIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  AssetItemStatus,
  DashboardRecentTicket,
  TicketPriority,
  TicketStatus,
} from "@/types";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { ClipboardList } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

// ─── Tones ──────────────────────────────────────────────────────────────────

export type Tone = { bg: string; text: string; bar: string };

export const TICKET_STATUS_TONE: Record<TicketStatus, Tone> = {
  [TicketStatus.New]: {
    bg: "bg-info-50",
    text: "text-info-700",
    bar: "bg-info-500",
  },
  [TicketStatus.Assigned]: {
    bg: "bg-primary-50",
    text: "text-primary-700",
    bar: "bg-primary-500",
  },
  [TicketStatus.Doing]: {
    bg: "bg-warning-50",
    text: "text-warning-700",
    bar: "bg-warning-500",
  },
  [TicketStatus.Waiting]: {
    bg: "bg-secondary-50",
    text: "text-secondary-700",
    bar: "bg-secondary-400",
  },
  [TicketStatus.Done]: {
    bg: "bg-success-50",
    text: "text-success-700",
    bar: "bg-success-500",
  },
  [TicketStatus.Cancelled]: {
    bg: "bg-error-50",
    text: "text-error-700",
    bar: "bg-error-500",
  },
};

export const TICKET_PRIORITY_TONE: Record<TicketPriority, Tone> = {
  [TicketPriority.Low]: {
    bg: "bg-secondary-50",
    text: "text-secondary-700",
    bar: "bg-secondary-400",
  },
  [TicketPriority.Medium]: {
    bg: "bg-info-50",
    text: "text-info-700",
    bar: "bg-info-500",
  },
  [TicketPriority.High]: {
    bg: "bg-warning-50",
    text: "text-warning-700",
    bar: "bg-warning-500",
  },
  [TicketPriority.Urgent]: {
    bg: "bg-error-50",
    text: "text-error-700",
    bar: "bg-error-500",
  },
};

export const ITEM_STATUS_TONE: Record<AssetItemStatus, Tone> = {
  [AssetItemStatus.Active]: {
    bg: "bg-success-50",
    text: "text-success-700",
    bar: "bg-success-500",
  },
  [AssetItemStatus.Faulty]: {
    bg: "bg-error-50",
    text: "text-error-700",
    bar: "bg-error-500",
  },
  [AssetItemStatus.Maintenance]: {
    bg: "bg-warning-50",
    text: "text-warning-700",
    bar: "bg-warning-500",
  },
  [AssetItemStatus.Retired]: {
    bg: "bg-secondary-50",
    text: "text-secondary-700",
    bar: "bg-secondary-400",
  },
};

// ─── Small pieces ───────────────────────────────────────────────────────────

type StatCardProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  accent: string;
  width?: string;
};

export const StatCard = ({
  icon: Icon,
  label,
  value,
  accent,
  width = "w-[48%]",
}: StatCardProps) => (
  <View
    className={`${width} bg-background-0 rounded-2xl p-4 border border-outline-100 shadow-sm`}
  >
    <View
      className={`w-9 h-9 rounded-lg justify-center items-center mb-3 ${accent}`}
    >
      <GSIcon as={Icon} size="md" className="text-typography-0" />
    </View>
    <Text className="text-2xl font-bold text-typography-900">{value}</Text>
    <Text className="text-typography-500 text-xs mt-0.5">{label}</Text>
  </View>
);

type AlertCardProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  iconWrap: string;
  iconColor: string;
  highlight?: boolean;
};

export const AlertCard = ({
  icon: Icon,
  label,
  value,
  iconWrap,
  iconColor,
  highlight,
}: AlertCardProps) => (
  <View
    className={`flex-1 rounded-2xl p-4 border shadow-sm flex-row items-center gap-3 ${
      highlight
        ? "bg-error-50 border-error-100"
        : "bg-background-0 border-outline-100"
    }`}
  >
    <View
      className={`w-9 h-9 rounded-lg justify-center items-center ${iconWrap}`}
    >
      <GSIcon as={Icon} size="md" className={iconColor} />
    </View>
    <View className="flex-1">
      <Text className="text-xl font-bold text-typography-900">{value}</Text>
      <Text className="text-typography-500 text-xs">{label}</Text>
    </View>
  </View>
);

export const BreakdownRow = ({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: Tone;
}) => {
  const pct = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0;
  return (
    <View className="gap-1.5">
      <View className="flex-row justify-between items-center">
        <Text className="text-typography-700 text-sm">{label}</Text>
        <Text className="text-typography-900 text-sm font-semibold">
          {value}
        </Text>
      </View>
      <View className="h-2 rounded-full bg-background-100 overflow-hidden">
        <View
          className={`h-full rounded-full ${tone.bar}`}
          style={{ width: `${pct}%` }}
        />
      </View>
    </View>
  );
};

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-typography-500 text-xs font-semibold uppercase mt-6 mb-3 px-1">
    {children}
  </Text>
);

export const Card = ({ children }: { children: React.ReactNode }) => (
  <View className="bg-background-0 rounded-2xl p-5 border border-outline-100 shadow-sm gap-3.5">
    {children}
  </View>
);

/**
 * Renders a loading spinner or an error/retry state.
 * Returns `null` when data is ready so the caller can render its own content.
 * No hooks inside — safe to call as a plain function.
 */
export const DashboardState = ({
  isLoading,
  isError,
  refetch,
}: {
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}): React.ReactElement | null => {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-50">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background-50 p-6">
        <Text className="text-typography-500 text-center">
          Could not load dashboard.
        </Text>
        <TouchableOpacity
          onPress={refetch}
          className="mt-4 px-4 py-2 rounded-lg bg-primary-600"
        >
          <Text className="text-typography-0 font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return null;
};

export const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return format(date, "dd MMM");
};

// ─── Reusable breakdown blocks ──────────────────────────────────────────────

export const TicketStatusBreakdown = ({
  byStatus,
}: {
  byStatus: Record<TicketStatus, number>;
}) => {
  const entries = Object.values(TicketStatus).map((s) => ({
    key: s,
    value: byStatus[s] ?? 0,
    tone: TICKET_STATUS_TONE[s],
  }));
  const max = Math.max(1, ...entries.map((e) => e.value));
  return (
    <Card>
      {entries.map((e) => (
        <BreakdownRow
          key={e.key}
          label={e.key}
          value={e.value}
          max={max}
          tone={e.tone}
        />
      ))}
    </Card>
  );
};

export const TicketPriorityBreakdown = ({
  byPriority,
}: {
  byPriority: Record<TicketPriority, number>;
}) => {
  const entries = Object.values(TicketPriority).map((p) => ({
    key: p,
    value: byPriority[p] ?? 0,
    tone: TICKET_PRIORITY_TONE[p],
  }));
  const max = Math.max(1, ...entries.map((e) => e.value));
  return (
    <Card>
      {entries.map((e) => (
        <BreakdownRow
          key={e.key}
          label={e.key}
          value={e.value}
          max={max}
          tone={e.tone}
        />
      ))}
    </Card>
  );
};

export const ItemStatusBreakdown = ({
  byStatus,
}: {
  byStatus: Record<AssetItemStatus, number>;
}) => {
  const entries = Object.values(AssetItemStatus).map((s) => ({
    key: s,
    value: byStatus[s] ?? 0,
    tone: ITEM_STATUS_TONE[s],
  }));
  const max = Math.max(1, ...entries.map((e) => e.value));
  return (
    <Card>
      {entries.map((e) => (
        <BreakdownRow
          key={e.key}
          label={e.key}
          value={e.value}
          max={max}
          tone={e.tone}
        />
      ))}
    </Card>
  );
};

export const RecentTicketsList = ({
  tickets,
  emptyLabel = "No tickets yet",
}: {
  tickets: DashboardRecentTicket[];
  emptyLabel?: string;
}) => {
  const router = useRouter();
  return (
    <View className="bg-background-0 rounded-2xl border border-outline-100 shadow-sm overflow-hidden">
      {tickets.length === 0 ? (
        <View className="items-center py-8 px-4">
          <GSIcon as={ClipboardList} size="xl" className="text-typography-300" />
          <Text className="text-typography-500 text-sm mt-2">{emptyLabel}</Text>
        </View>
      ) : (
        tickets.map((t, idx) => {
          const tone = TICKET_STATUS_TONE[t.status];
          return (
            <TouchableOpacity
              key={t._id}
              onPress={() =>
                router.push({
                  pathname: "/private/ticket/[id]",
                  params: { id: t._id },
                })
              }
              className={`flex-row items-center gap-3 p-4 ${
                idx > 0 ? "border-t border-outline-100" : ""
              }`}
            >
              <View className="flex-1">
                <Text
                  className="text-primary-600 font-bold text-sm"
                  numberOfLines={1}
                >
                  {t.code}
                </Text>
                <Text
                  className="text-typography-700 text-sm mt-0.5"
                  numberOfLines={1}
                >
                  {t.title}
                </Text>
              </View>
              <View className="items-end gap-1">
                <View
                  className={`px-2 py-0.5 rounded-full ${tone?.bg ?? "bg-secondary-50"}`}
                >
                  <Text
                    className={`text-[11px] font-semibold ${tone?.text ?? "text-secondary-700"}`}
                  >
                    {t.status}
                  </Text>
                </View>
                <Text className="text-typography-400 text-[11px]">
                  {formatDate(t.createdAt)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};
