import { Link, useLocation, Outlet } from "react-router-dom";
import {
  MessageSquare,
  User,
  Users,
  Building2,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/messages",
  },
  {
    title: "Profile",
    icon: User,
    href: "/profile",
  },
  {
    title: "Employees",
    icon: Users,
    href: "/employees",
  },
];

export function DashboardLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border/50">
            <div className="flex items-center gap-3 px-3 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm group-data-[collapsible=icon]:hidden">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold tracking-tight">Employee Chat</span>
                <span className="text-xs text-muted-foreground/80">Management System</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.href}
                        tooltip={item.title}
                      >
                        <Link to={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border/50">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full" tooltip="John Doe">
                  <Avatar className="h-9 w-9 ring-2 ring-sidebar-border/50">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">John Doe</span>
                    <span className="text-xs text-muted-foreground/80">Admin</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <main className="flex flex-1 flex-col bg-muted/30">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 shadow-sm">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-xl font-semibold tracking-tight">
                {menuItems.find((item) => item.href === location.pathname)?.title || "Dashboard"}
              </h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 rounded-full hover:bg-muted"
                title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              >
                {theme === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

