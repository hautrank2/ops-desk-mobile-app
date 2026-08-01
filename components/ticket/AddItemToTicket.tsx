import { assetItemApis } from "@/apis/asset-item";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { CheckSquare, Search, Square, X } from "lucide-react-native";
import { ScrollView, TouchableOpacity, View } from "react-native";

export type AddItemToTicketProps = { hiddenItemIds?: string[] };

export const AddItemToTicket = ({
  hiddenItemIds = [],
}: AddItemToTicketProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useQuery({
    queryKey: ["get", "asset-items-all"],
    queryFn: async () => assetItemApis.getList(),
  });

  const filteredData = useMemo(() => {
    return;
  }, [data, searchQuery]);

  return (
    <View>
      {/* Search Input bar */}
      <View className="my-3 flex-row items-center bg-background-50 border border-outline-200 rounded-lg px-3 py-2">
        <Search size={16} className="text-typography-400 mr-2" />
        <Input className="flex-1 border-0 h-8">
          <InputField
            placeholder="Search available assets..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="p-0 text-sm"
          />
        </Input>
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <X size={16} className="text-typography-400" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Available list */}
      <View className="flex-1">
        {hiddenItemIds.length === 0 ? (
          <View className="flex-1 items-center justify-center py-10">
            <Text className="text-typography-400 text-sm">
              No matching assets found
            </Text>
          </View>
        ) : (
          <ScrollView className="flex-1">
            {filteredAvailableItems.map((item) => {
              const assetName =
                typeof item.asset === "object" ? item.asset.name : "Asset";
              const codeLabel = item._id.slice(-6).toUpperCase();
              const isSelected = selectedItemIdsToAdd.includes(item._id);

              return (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => handleToggleSelect(item._id)}
                  className={`flex-row items-center p-3 border-b border-outline-100 ${
                    isSelected ? "bg-primary-50/40" : ""
                  }`}
                >
                  <View className="mr-3">
                    {isSelected ? (
                      <CheckSquare size={20} className="text-primary-600" />
                    ) : (
                      <Square size={20} className="text-typography-400" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-typography-900 text-sm">
                      {assetName}
                    </Text>
                    <Text className="text-xs text-typography-500 mt-0.5">
                      ID: {codeLabel}{" "}
                      {item.serialNumber ? `· SN: ${item.serialNumber}` : ""}
                    </Text>
                  </View>
                  <View className="px-2 py-0.5 rounded bg-success-50 border border-success-100">
                    <Text className="text-[10px] font-bold text-success-700">
                      {item.status}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Footer Actions */}
      <View className="flex-row justify-between items-center pt-4 border-t border-outline-100 mt-2">
        <Text className="text-sm font-semibold text-typography-600">
          Selected: {selectedItemIdsToAdd.length}
        </Text>
        <View className="flex-row gap-3">
          <Button
            size="sm"
            variant="outline"
            onPress={() => setIsAddModalOpen(false)}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            size="sm"
            disabled={
              selectedItemIdsToAdd.length === 0 || addItemsMutation.isPending
            }
            onPress={() => addItemsMutation.mutate(selectedItemIdsToAdd)}
          >
            {addItemsMutation.isPending && <ButtonSpinner className="mr-2" />}
            <ButtonText>Add Selected</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
};
