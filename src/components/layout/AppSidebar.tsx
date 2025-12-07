import { Home, Server, AlertTriangle, History, HardDrive, Shield, Activity, FileText, MonitorSmartphone, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
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

  const filteredItems = menuItems.filter(item =>
    user && item.roles.includes(user.rol)
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-sidebar-primary" />
            <span className="font-bold text-sidebar-foreground">SecurePYME</span>
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
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
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
