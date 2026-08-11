import { locationApis } from "@/apis/location";
import { EntityListScreen } from "@/components/manage/EntityListScreen";
import { LocationModel } from "@/types";
import { useRouter } from "expo-router";
import React from "react";

const LocationListScreen = () => {
  const router = useRouter();

  return (
    <EntityListScreen<LocationModel>
      queryKey={["manage", "location"]}
      queryFn={async () => (await locationApis.getList()).items}
      deleteFn={(id) => locationApis.remove(id)}
      getId={(l) => l._id}
      getPrimary={(l) => l.code}
      getSecondary={(l) =>
        l.floor != null ? `${l.name} · Floor ${l.floor}` : l.name
      }
      getBadge={(l) =>
        l.isActive
          ? { text: "Active", tone: "bg-success-50" }
          : { text: "Inactive", tone: "bg-secondary-50" }
      }
      onAdd={() => router.push("/private/manage/location/add")}
      onEdit={(id) =>
        router.push({
          pathname: "/private/manage/location/[id]",
          params: { id },
        })
      }
      addLabel="New location"
      emptyLabel="No locations yet"
      entityLabel="location"
    />
  );
};

export default LocationListScreen;
