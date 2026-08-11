import { userApis } from "@/apis/user";
import { EntityListScreen } from "@/components/manage/EntityListScreen";
import { UserModel } from "@/types";
import { useRouter } from "expo-router";
import React from "react";

const ROLE_TONE: Record<string, string> = {
  admin: "bg-primary-50",
  manager: "bg-info-50",
  user: "bg-secondary-50",
};

const UserListScreen = () => {
  const router = useRouter();

  return (
    <EntityListScreen<UserModel>
      queryKey={["manage", "user"]}
      queryFn={() => userApis.getList()}
      deleteFn={(id) => userApis.remove(id)}
      getId={(u) => u._id}
      getPrimary={(u) => u.name || u.username}
      getSecondary={(u) => `@${u.username} · ${u.email}`}
      getBadge={(u) => ({
        text: u.role,
        tone: ROLE_TONE[u.role] ?? "bg-secondary-50",
      })}
      onAdd={() => router.push("/private/manage/user/add")}
      onEdit={(id) =>
        router.push({ pathname: "/private/manage/user/[id]", params: { id } })
      }
      addLabel="New user"
      emptyLabel="No users yet"
      entityLabel="user"
    />
  );
};

export default UserListScreen;
