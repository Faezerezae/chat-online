import React from "react";
import UserChat from "./features/chat/UserChat";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="layout">
      <UserChat />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
