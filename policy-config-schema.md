# Firebase Schema - Policy Configurations

## Estructura Propuesta

```
firebase-root/
├── policies/
│   ├── POL-001/
│   │   └── enabled: boolean (estado global)
│   ├── POL-002/
│   │   └── enabled: boolean
│   └── ...
│
└── policy-configurations/
    ├── EQ-001/  (equipment ID)
    │   ├── POL-001/
    │   │   ├── enabled: boolean
    │   │   ├── reason: string
    │   │   ├── modifiedBy: string
    │   │   └── modifiedAt: timestamp
    │   └── POL-004/
    │       └── ...
    ├── EQ-002/
    │   └── ...
    └── ...
```

## Lógica de Resolución

Para determinar si una política está activa en un equipo específico:

1. **Buscar configuración específica**: `policy-configurations/{equipmentId}/{policyId}`
2. **Si existe** → usar ese valor (es una excepción al comportamiento global)
3. **Si no existe** → usar `policies/{policyId}/enabled` (comportamiento global por defecto)

## Ejemplo de Uso

### Escenario: "Limitar instalaciones" desactivada globalmente, pero activa en servidores críticos

**Estado Global:**
```json
{
  "policies": {
    "POL-004": {
      "enabled": false  // Desactivada para la mayoría de equipos
    }
  }
}
```

**Excepciones:**
```json
{
  "policy-configurations": {
    "EQ-002": {  // SERV-FACT
      "POL-004": {
        "enabled": true,
        "reason": "Servidor de facturación requiere protección adicional",
        "modifiedBy": "admin",
        "modifiedAt": "2025-12-09T00:00:00Z"
      }
    },
    "EQ-008": {  // DB-Clientes
      "POL-004": {
        "enabled": true,
        "reason": "Base de datos crítica no puede tener instalaciones no autorizadas",
        "modifiedBy": "admin",
        "modifiedAt": "2025-12-09T00:00:00Z"
      }
    }
  }
}
```

**Resultado:**
- PC-Ventas-1 (EQ-003): Puede instalar software (usa global: false)
- SERV-FACT (EQ-002): NO puede instalar (excepción: true)
- DB-Clientes (EQ-008): NO puede instalar (excepción: true)
- Resto de equipos: Pueden instalar (usa global: false)

## Beneficios de Seguridad

✅ **No más vulnerabilidades instantáneas**: Cambios se guardan en batch  
✅ **Control granular**: Excepciones por equipo sin afectar la red completa  
✅ **Auditoría**: Registro de quién hizo qué cambio y por qué  
✅ **Flexibilidad**: Políticas estrictas en servidores, relajadas en workstations
