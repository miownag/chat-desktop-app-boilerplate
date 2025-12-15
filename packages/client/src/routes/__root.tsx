import { createRootRoute, Outlet } from "@tanstack/react-router";
import AppSidebar from "@/components/app-sidebar";
import HeaderMenu from "@/components/header-menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

function RootComponent() {
  return (
    <SidebarProvider>
      <Toaster />
      <AppSidebar />
      <main className="flex-1 flex flex-col h-screen">
        <HeaderMenu />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
