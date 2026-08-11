import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { useAuthCtx } from "@/store/auth";
import React from "react";

const DashboardScreen = () => {
  const { payload } = useAuthCtx();
  const role = payload?.role;
  const username = payload?.username;

  switch (role) {
    case "admin":
      return <AdminDashboard username={username} />;
    case "manager":
      return <ManagerDashboard username={username} />;
    default:
      return <UserDashboard username={username} />;
  }
};

export default DashboardScreen;
