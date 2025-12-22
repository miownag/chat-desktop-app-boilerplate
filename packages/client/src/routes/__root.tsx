import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import AppSidebar from '@/components/app-sidebar';
import HeaderMenu from '@/components/header-menu';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <SidebarProvider>
        <Toaster />
        <AppSidebar />
        <main className="flex-1 flex flex-col h-screen">
          <HeaderMenu />
          <Outlet />
        </main>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
