import { TutorialStep } from '@/contexts/TutorialContext';

export const tutorialSteps: Record<string, TutorialStep[]> = {
    dashboard: [
        {
            target: '[data-tutorial="metrics"]',
            title: 'Métricas Principales',
            description: 'Aquí puedes ver un resumen rápido de equipos seguros, en riesgo, amenazas activas y alertas pendientes.',
            placement: 'bottom',
        },
        {
            target: '[data-tutorial="alerts-chart"]',
            title: 'Estado de Equipos',
            description: 'Esta tabla muestra todos los equipos registrados con su estado de seguridad y conexión del agente.',
            placement: 'top',
        },
        {
            target: '[data-tutorial="recent-activity"]',
            title: 'Alertas Activas',
            description: 'Las amenazas críticas y advertencias se muestran aquí. Haz clic en "Ver detalles" para ir a la página de Alertas.',
            placement: 'top',
        },
    ],

    equipos: [
        {
            target: '[data-tutorial="equipment-list"]',
            title: 'Lista de Equipos',
            description: 'Todos los equipos monitoreados aparecen aquí con su estado de seguridad y conexión.',
            placement: 'right',
        },
        {
            target: '[data-tutorial="equipment-details"]',
            title: 'Detalles del Equipo',
            description: 'Haz clic en un equipo para ver información detallada: sistema operativo, versión del agente, último respaldo, etc.',
            placement: 'left',
        },
        {
            target: '[data-tutorial="equipment-actions"]',
            title: 'Acciones Disponibles',
            description: 'Puedes forzar análisis, sincronizar agentes, descargar respaldos o aislar equipos comprometidos.',
            placement: 'top',
        },
        {
            target: '[data-tutorial="equipment-search"]',
            title: 'Búsqueda y Filtros',
            description: 'Usa la barra de búsqueda para encontrar equipos específicos rápidamente.',
            placement: 'bottom',
        },
    ],

    alertas: [
        {
            target: '[data-tutorial="alerts-list"]',
            title: 'Alertas Activas',
            description: 'Todas las alertas de seguridad activas se muestran aquí ordenadas por prioridad.',
            placement: 'right',
        },
        {
            target: '[data-tutorial="alert-priority"]',
            title: 'Niveles de Prioridad',
            description: 'Las alertas se clasifican en Alta (rojo), Media (amarillo) y Baja (azul) según su severidad.',
            placement: 'left',
        },
        {
            target: '[data-tutorial="alert-details"]',
            title: 'Detalles y Prerequisites',
            description: 'Cada alerta muestra descripción, recomendaciones y acciones requeridas antes de resolverla.',
            placement: 'bottom',
        },
        {
            target: '[data-tutorial="alert-actions"]',
            title: 'Acciones de Alerta',
            description: 'Puedes resolver alertas, solicitar ayuda o marcarlas como falsos positivos.',
            placement: 'top',
        },
        {
            target: '[data-tutorial="resolved-alerts"]',
            title: 'Alertas Resueltas',
            description: 'Las alertas resueltas se archivan aquí para referencia futura.',
            placement: 'top',
        },
    ],

    historial: [
        {
            target: '[data-tutorial="incidents-table"]',
            title: 'Historial de Incidentes',
            description: 'Registro completo de todos los incidentes de seguridad con fecha, tipo y estado.',
            placement: 'bottom',
        },
        {
            target: '[data-tutorial="incident-filters"]',
            title: 'Filtros y Búsqueda',
            description: 'Filtra incidentes por tipo, estado o busca por equipo específico.',
            placement: 'bottom',
        },
        {
            target: '[data-tutorial="incident-details"]',
            title: 'Detalles del Incidente',
            description: 'Haz clic en un incidente para ver descripción completa y acciones tomadas.',
            placement: 'left',
        },
    ],

    respaldos: [
        {
            target: '[data-tutorial="backups-list"]',
            title: 'Lista de Respaldos',
            description: 'Todos los respaldos del sistema con fecha, tamaño y estado de integridad.',
            placement: 'bottom',
        },
        {
            target: '[data-tutorial="backup-status"]',
            title: 'Estado de Integridad',
            description: 'Cada respaldo muestra si fue verificado correctamente o está pendiente de verificación.',
            placement: 'left',
        },
        {
            target: '[data-tutorial="backup-actions"]',
            title: 'Acciones de Respaldo',
            description: 'Puedes descargar, verificar o restaurar respaldos desde aquí.',
            placement: 'top',
        },
    ],

    politicas: [
        {
            target: '[data-tutorial="policies-list"]',
            title: 'Políticas de Seguridad',
            description: 'Gestiona las políticas de seguridad del sistema: firewall, USB, conexiones externas, etc.',
            placement: 'right',
        },
        {
            target: '[data-tutorial="policy-status"]',
            title: 'Estado de Políticas',
            description: 'Cada política puede estar Habilitada (activa) o Deshabilitada (inactiva).',
            placement: 'left',
        },
        {
            target: '[data-tutorial="policy-config"]',
            title: 'Configuración Global vs Específica',
            description: 'Puedes aplicar políticas globalmente o configurar excepciones para equipos específicos.',
            placement: 'bottom',
        },
        {
            target: '[data-tutorial="policy-apply"]',
            title: 'Aplicar Políticas',
            description: 'Los cambios se aplican inmediatamente a los equipos conectados.',
            placement: 'top',
        },
    ],

    analisis: [
        {
            target: '[data-tutorial="connectivity-metrics"]',
            title: 'Métricas de Conectividad',
            description: 'Monitorea conexiones activas, destinos sospechosos e intentos de exfiltración.',
            placement: 'bottom',
        },
        {
            target: '[data-tutorial="suspicious-connections"]',
            title: 'Conexiones Sospechosas',
            description: 'Alertas de conexiones a IPs o dominios potencialmente maliciosos.',
            placement: 'top',
        },
        {
            target: '[data-tutorial="traffic-chart"]',
            title: 'Tráfico por Equipo',
            description: 'Visualiza el volumen de datos transferidos por cada equipo.',
            placement: 'top',
        },
        {
            target: '[data-tutorial="recommendations"]',
            title: 'Recomendaciones Dinámicas',
            description: 'Sugerencias de acciones basadas en el análisis actual del sistema.',
            placement: 'top',
        },
    ],

    reportes: [
        {
            target: '[data-tutorial="monthly-summary"]',
            title: 'Resumen del Mes',
            description: 'Estadísticas mensuales: equipos seguros, en riesgo, amenazas y tasa de resolución.',
            placement: 'bottom',
        },
        {
            target: '[data-tutorial="protection-level"]',
            title: 'Nivel de Protección',
            description: 'Indicador del nivel de protección actual basado en alertas y equipos aislados.',
            placement: 'bottom',
        },
        {
            target: '[data-tutorial="incidents-history"]',
            title: 'Historial de Incidentes',
            description: 'Registro histórico de incidentes con alertas activas que requieren atención.',
            placement: 'top',
        },
        {
            target: '[data-tutorial="backup-success"]',
            title: 'Respaldos Exitosos',
            description: 'Contador de respaldos verificados exitosamente este mes.',
            placement: 'top',
        },
    ],
};
