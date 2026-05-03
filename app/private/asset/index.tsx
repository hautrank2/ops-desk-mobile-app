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
import { getAssetIcon } from "@/lib/asset-icon-config";
import { httpClient } from "@/lib/httpClient";
import { AssetModel, TableResponse } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const AssetScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["get", "asset", page, pageSize],
    queryFn: async () => {
      const response = await httpClient.get<TableResponse<AssetModel>>(
        "/asset",
        {
          params: { page, pageSize },
        },
      );
      // Handle both paginated TableResponse and flat array response
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/asset/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "asset"] });
    },
    onError: (error) => {
      console.error("Failed to delete asset", error);
      Alert.alert("Error", "Failed to delete asset.");
    },
  });

  const confirmDelete = (id: string, name: string) => {
    Alert.alert("Confirm Delete", `Are you sure you want to delete ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  };

  const assets: AssetModel[] = data?.items || (Array.isArray(data) ? data : []);
  const totalPage = data?.totalPage || 1;

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">Total: {data?.total || 0}</Text>
        <Button size="sm" onPress={() => router.push("/private/asset/add")}>
          <ButtonIcon as={Plus} className="mr-2" />
          <ButtonText>Create Asset</ButtonText>
        </Button>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" className="mt-10" />
      ) : (
        <View className="flex-1">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            className="flex-1 bg-white rounded-lg shadow-sm"
          >
            <View style={{ minWidth: 820 }}>
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="flex-row bg-white" style={{ paddingLeft: 200, paddingRight: 100 }}>
                    <TableHead useRNView className="absolute left-0 z-10 w-[200px] bg-white border-r border-gray-100 justify-center">
                      <Text className="font-bold text-[16px] text-gray-800">Code</Text>
                    </TableHead>
                    <TableHead className="flex-none w-[250px]">Name</TableHead>
                    <TableHead className="flex-none w-[150px]">Type</TableHead>
                    <TableHead className="flex-none w-[120px]">Status</TableHead>
                    <TableHead useRNView className="absolute right-0 z-10 w-[100px] bg-white border-l border-gray-100 justify-center items-center">
                      <Text className="font-bold text-[16px] text-gray-800">Action</Text>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.length === 0 ? (
                    <TableRow>
                      <TableData
                        useRNView
                        className="p-4 items-center justify-center"
                      >
                        <Text className="text-gray-500">No assets found.</Text>
                      </TableData>
                    </TableRow>
                  ) : (
                    assets.map((item) => {
                      const { icon: AssetIcon, color } = getAssetIcon(
                        item.name,
                        item.type,
                      );
                      return (
                        <TableRow
                          key={item._id}
                          className="border-b border-gray-100 items-center flex-row bg-white"
                          style={{ paddingLeft: 200, paddingRight: 100 }}
                        >
                          <TableData useRNView className="absolute left-0 z-10 w-[200px] bg-white flex-row items-center h-full border-r border-gray-100">
                            <View
                              className="w-8 h-8 rounded-full items-center justify-center mr-3"
                              style={{ backgroundColor: `${color}20` }}
                            >
                              <AssetIcon color={color} size={16} />
                            </View>
                            <TouchableOpacity
                              onPress={() =>
                                router.push({
                                  pathname: "/private/asset/[id]",
                                  params: { id: item._id },
                                })
                              }
                            >
                              <Text className="text-blue-600 font-bold underline">
                                {item.code}
                              </Text>
                            </TouchableOpacity>
                          </TableData>
                          <TableData className="flex-none w-[250px]">{item.name}</TableData>
                          <TableData className="flex-none w-[150px]">{item.type}</TableData>
                          <TableData useRNView className="flex-none w-[120px]">
                            <Text
                              style={{
                                color: item.active ? "green" : "red",
                                fontWeight: "500",
                              }}
                            >
                              {item.active ? "Active" : "Inactive"}
                            </Text>
                          </TableData>
                          <TableData useRNView className="absolute right-0 z-10 w-[100px] bg-white items-center justify-center h-full border-l border-gray-100">
                            <Button
                              size="sm"
                              variant="outline"
                              action="negative"
                              onPress={() => confirmDelete(item._id, item.name)}
                              disabled={deleteMutation.isPending}
                              className="px-2"
                            >
                              <ButtonIcon as={Trash2} />
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
              <Text className="text-sm font-medium">
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

export default AssetScreen;
