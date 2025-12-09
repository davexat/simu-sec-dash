import { SecurityStatus, AlertLevel, AgentConnectionStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, XCircle, Wifi, WifiOff, Loader2 } from "lucide-react";

interface StatusBadgeProps {
  status: SecurityStatus | AlertLevel | AgentConnectionStatus;
  type: "security" | "alert" | "connection";
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  if (type === "security") {
    const securityConfig = {
      "Seguro": { variant: "default" as const, className: "bg-success text-success-foreground", icon: Shield },
      "Advertencia": { variant: "default" as const, className: "bg-warning text-warning-foreground", icon: AlertTriangle },
      "Amenaza": { variant: "default" as const, className: "bg-danger text-danger-foreground", icon: XCircle },
      "Desconectado": { variant: "secondary" as const, className: "", icon: WifiOff }
    };

    const config = securityConfig[status as SecurityStatus];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  }

  if (type === "alert") {
    const alertConfig = {
      "Baja": { variant: "default" as const, className: "bg-success text-success-foreground" },
      "Media": { variant: "default" as const, className: "bg-warning text-warning-foreground" },
      "Alta": { variant: "default" as const, className: "bg-danger text-danger-foreground" }
    };

    const config = alertConfig[status as AlertLevel];

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  }

  if (type === "connection") {
    const connectionConfig = {
      "Conectado": {
        variant: "default" as const,
        className: "bg-success text-success-foreground",
        icon: Wifi,
        iconClassName: "",
        displayText: undefined as string | undefined
      },
      "Desconectado": {
        variant: "secondary" as const,
        className: "",
        icon: WifiOff,
        iconClassName: "",
        displayText: undefined as string | undefined
      },
      "En sincronización": {
        variant: "default" as const,
        className: "bg-primary text-primary-foreground",
        icon: Loader2,
        iconClassName: "animate-spin",
        displayText: "Sincronizando" as string | undefined
      }
    };

    const config = connectionConfig[status as AgentConnectionStatus];
    const Icon = config.icon;
    const displayText = config.displayText || status;

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className={`h-3 w-3 mr-1 ${config.iconClassName || ''}`} />
        {displayText}
      </Badge>
    );
  }

  return null;
}
