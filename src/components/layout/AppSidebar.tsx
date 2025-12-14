import { Home, Server, AlertTriangle, History, HardDrive, Shield, Activity, FileText, MonitorSmartphone, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home, roles: ["Administrador", "Operativo"] },
  { title: "Equipos", url: "/equipos", icon: Server, roles: ["Administrador", "Operativo"] },
  { title: "Alertas", url: "/alertas", icon: AlertTriangle, roles: ["Administrador", "Operativo"] },
  { title: "Historial", url: "/historial", icon: History, roles: ["Administrador", "Operativo"] },
  { title: "Respaldos", url: "/respaldos", icon: HardDrive, roles: ["Administrador", "Operativo"] },
  { title: "Políticas", url: "/politicas", icon: Shield, roles: ["Administrador"] },
  { title: "Análisis", url: "/analisis", icon: Activity, roles: ["Administrador"] },
  { title: "Reportes", url: "/reportes", icon: FileText, roles: ["Administrador"] },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { user, logout } = useAuth();
  const { alerts } = useData();
  const activeAlertsCount = alerts.filter(a => a.estado === "Activa").length;

  const filteredItems = menuItems.filter(item =>
    user && item.roles.includes(user.rol)
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Shield className="h-6 w-6 text-sidebar-primary shrink-0" />
            <span className="font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">SecurePYME</span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.title === "Alertas" && activeAlertsCount > 0 && (
                        <Badge className="ml-auto bg-destructive text-destructive-foreground">
                          {activeAlertsCount}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <div className="mt-auto p-4 border-t border-sidebar-border group-data-[collapsible=icon]:hidden">
            <div className="mb-3">
              <div className="text-sm text-sidebar-foreground">
                <p className="font-medium">{user.nombre}</p>
                <p className="text-xs text-muted-foreground">{user.rol}</p>
              </div>
            </div>
            {/* Logout button removed */}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
