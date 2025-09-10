import React from "react";

type SidebarProps = {
  children: React.ReactNode
};

export default function SideContent({ children }: SidebarProps) {

  return (
    <div className="sticky top-6 flex flex-col max-h-[calc(100vh-48px)]">
      {children}
    </div>
  );
}
