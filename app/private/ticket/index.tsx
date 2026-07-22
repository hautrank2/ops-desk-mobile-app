import { ticketApis } from "@/apis/ticket";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { TicketModel } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  Pencil,
  Plus,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const TicketListingScreen = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["get", "ticket", page, pageSize],
    queryFn: () => ticketApis.getList({ page, pageSize }),
  });

  const tickets: TicketModel[] = useMemo(() => data?.items ?? [], [data]);
  const totalPage = data?.totalPage ?? 1;

  return (
    <View className="flex-1 bg-background-50 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-typography-900">
          Total: {data?.total ?? 0}
        </Text>
        <Button size="sm" onPress={() => router.push("/private/ticket/add")}>
          <ButtonIcon as={Plus} className="mr-2" />
          <ButtonText>Create Ticket</ButtonText>
        </Button>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" className="mt-10" />
      ) : (
        <View className="flex-1">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            className="flex-1 bg-background-0 rounded-lg shadow-sm"
          >
            <View style={{ minWidth: 940 }}>
              <Table className="w-full">
                <TableHeader>
                  <TableRow
                    className="flex-row bg-background-0"
                    style={{ paddingLeft: 180, paddingRight: 150 }}
                  >
                    <TableHead
                      useRNView
                      className="absolute left-0 z-10 w-[180px] bg-background-0 border-r border-outline-100 justify-center"
                    >
                      <Text className="font-bold text-[16px] text-typography-800">
                        Code
                      </Text>
                    </TableHead>
                    <TableHead className="flex-none w-[250px]">Title</TableHead>
                    <TableHead className="flex-none w-[120px]">Type</TableHead>
                    <TableHead className="flex-none w-[120px]">
                      Priority
                    </TableHead>
                    <TableHead className="flex-none w-[120px]">
                      Status
                    </TableHead>
                    <TableHead
                      useRNView
                      className="absolute right-0 z-10 w-[150px] bg-background-0 border-l border-outline-100 justify-center items-center"
                    >
                      <Text className="font-bold text-[16px] text-typography-800">
                        Action
                      </Text>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.length === 0 ? (
                    <TableRow>
                      <TableData
                        useRNView
                        className="p-4 items-center justify-center w-full"
                      >
                        <Text className="text-typography-500">
                          No tickets found.
                        </Text>
                      </TableData>
                    </TableRow>
                  ) : (
                    tickets.map((item) => {
                      return (
                        <TableRow
                          key={item._id}
                          className="border-b border-outline-100 items-center flex-row bg-background-0"
                          style={{ paddingLeft: 180, paddingRight: 150 }}
                        >
                          <TableData
                            useRNView
                            className="absolute left-0 z-10 w-[180px] bg-background-0 flex-row items-center h-full border-r border-outline-100"
                          >
                            <TouchableOpacity
                              onPress={() =>
                                router.push({
                                  pathname: "/private/ticket/[id]",
                                  params: { id: item._id },
                                })
                              }
                            >
                              <Text
                                className="text-primary-600 font-bold underline"
                                numberOfLines={1}
                              >
                                {item.code}
                              </Text>
                            </TouchableOpacity>
                          </TableData>
                          <TableData
                            className="flex-none w-[250px]"
                            numberOfLines={1}
                          >
                            {item.title}
                          </TableData>
                          <TableData
                            className="flex-none w-[120px]"
                            numberOfLines={1}
                          >
                            {item.type}
                          </TableData>
                          <TableData
                            className="flex-none w-[120px]"
                            numberOfLines={1}
                          >
                            {item.priority}
                          </TableData>
                          <TableData
                            className="flex-none w-[120px]"
                            numberOfLines={1}
                          >
                            {item.status}
                          </TableData>
                          <TableData
                            useRNView
                            className="absolute right-0 z-10 w-[150px] bg-background-0 flex-row items-center justify-center gap-2 h-full border-l border-outline-100"
                          >
                            <Button
                              size="xs"
                              variant="outline"
                              onPress={() =>
                                router.push({
                                  pathname: "/private/ticket/[id]",
                                  params: { id: item._id },
                                })
                              }
                              className="px-2"
                            >
                              <ButtonIcon as={Pencil} size="sm" />
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              onPress={() =>
                                router.push({
                                  pathname: "/private/ticket/images",
                                  params: { id: item._id },
                                })
                              }
                              className="px-2"
                            >
                              <ButtonIcon as={Images} size="sm" />
                            </Button>
                          </TableData>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </View>
          </ScrollView>

          {/* Pagination Controls */}
          <View className="flex-row items-center justify-between mt-4">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1 || isFetching}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ButtonIcon as={ChevronLeft} className="mr-1" />
              <ButtonText>Prev</ButtonText>
            </Button>

            <View className="flex-row items-center">
              <Text className="text-sm font-medium text-typography-700">
                Page {page} of {totalPage}
              </Text>
              {isFetching && !isLoading && (
                <ActivityIndicator size="small" className="ml-2" />
              )}
            </View>

            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPage || isFetching}
              onPress={() => setPage((p) => Math.min(totalPage, p + 1))}
            >
              <ButtonText>Next</ButtonText>
              <ButtonIcon as={ChevronRight} className="ml-1" />
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default TicketListingScreen;
