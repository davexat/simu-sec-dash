# Guía de Inicialización Manual de Firebase (Estructura Simplificada)

## Nueva Estructura con Subcolecciones

Ahora usamos una estructura más simple y jerárquica:

```
policies/
  POL-001/
    habilitada: true
    equipments/  (subcolección)
      EQ-002/
        enabled: true
```

## Paso 1: Ir a Firebase Console

1. Abre https://console.firebase.google.com/
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **Firestore Database**

## Paso 2: Crear Colección "policies"

1. Haz clic en **"Iniciar colección"**
2. ID de la colección: `policies`
3. Crea 6 documentos:

### Documento 1-6
- **ID**: `POL-001` a `POL-006`
- **Campo**: `habilitada` (boolean) = `true` o `false` según corresponda

| ID | habilitada |
|---|---|
| POL-001 | true |
| POL-002 | true |
| POL-003 | false |
| POL-004 | true |
| POL-005 | true |
| POL-006 | false |

## Paso 3: Crear Subcolecciones para Excepciones

Para cada política que tenga excepciones por equipo:

### POL-004 → Subcolección "equipments"

1. Entra al documento `POL-004`
2. Haz clic en **"Iniciar colección"**
3. ID de la colección: `equipments`
4. Crea 2 documentos:

**Documento 1:**
- **ID**: `EQ-002`
- **Campo**: `enabled` (boolean) = `true`

**Documento 2:**
- **ID**: `EQ-008`
- **Campo**: `enabled` (boolean) = `true`

### POL-003 → Subcolección "equipments"

1. Entra al documento `POL-003`
2. Haz clic en **"Iniciar colección"**
3. ID de la colección: `equipments`
4. Crea 1 documento:

**Documento 1:**
- **ID**: `EQ-008`
- **Campo**: `enabled` (boolean) = `true`

## Paso 4: Actualizar Reglas de Firebase

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso a policies y sus subcolecciones
    match /policies/{policyId} {
      allow read, write: if true;
      
      match /equipments/{equipmentId} {
        allow read, write: if true;
      }
    }
    
    // Denegar todo lo demás
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Resumen Visual

```
Firestore Database
└── policies/
    ├── POL-001 { habilitada: true }
    ├── POL-002 { habilitada: true }
    ├── POL-003 { habilitada: false }
    │   └── equipments/
    │       └── EQ-008 { enabled: true }
    ├── POL-004 { habilitada: true }
    │   └── equipments/
    │       ├── EQ-002 { enabled: true }
    │       └── EQ-008 { enabled: true }
    ├── POL-005 { habilitada: true }
    └── POL-006 { habilitada: false }
```

## Ventajas de esta Estructura

✅ Más intuitiva y jerárquica
✅ Fácil de navegar en Firebase Console
✅ Las excepciones están agrupadas bajo cada política
✅ No necesitas IDs compuestos como `EQ-002_POL-004`
