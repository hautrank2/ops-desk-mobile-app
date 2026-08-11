import { departmentApis } from "@/apis/department";
import { EntityListScreen } from "@/components/manage/EntityListScreen";
import { DepartmentModel } from "@/types";
import { useRouter } from "expo-router";
import React from "react";

const DepartmentListScreen = () => {
  const router = useRouter();

  return (
    <EntityListScreen<DepartmentModel>
      queryKey={["manage", "department"]}
      queryFn={() => departmentApis.getList()}
      deleteFn={(id) => departmentApis.remove(id)}
      getId={(d) => d._id}
      getPrimary={(d) => d.name}
      getSecondary={(d) => d.code}
      getBadge={(d) =>
        d.isActive
          ? { text: "Active", tone: "bg-success-50" }
          : { text: "Inactive", tone: "bg-secondary-50" }
      }
      onAdd={() => router.push("/private/manage/department/add")}
      onEdit={(id) =>
        router.push({
          pathname: "/private/manage/department/[id]",
          params: { id },
        })
      }
      addLabel="New department"
      emptyLabel="No departments yet"
      entityLabel="department"
    />
  );
};

export default DepartmentListScreen;
