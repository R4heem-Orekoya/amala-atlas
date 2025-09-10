import SideBar from "@/components/custom-ui/SideBar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <SideBar>{children}</SideBar>;
};

export default layout;
