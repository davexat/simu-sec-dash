# Guía de Configuración de Firebase

Esta guía te ayudará a configurar Firebase para el proyecto **simu-sec-dash**.

## ¿Por qué Firebase?

Firebase Firestore se utiliza en este proyecto para:
- Almacenar el estado de las políticas de seguridad (habilitadas/deshabilitadas)
- Permitir que múltiples usuarios vean el mismo estado de las políticas en tiempo real
- Simular cómo el Desktop Simulator verificaría políticas antes de permitir instalaciones

## Paso 1: Crear un Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "**Agregar proyecto**"
3. Ingresa un nombre para tu proyecto (ej: "secure-pyme-demo")
4. (Opcional) Puedes deshabilitar Google Analytics para este proyecto de demostración
5. Haz clic en "**Crear proyecto**"

## Paso 2: Registrar una Aplicación Web

1. En la página de inicio del proyecto, haz clic en el ícono **</>** (Web)
2. Registra tu aplicación con un apodo (ej: "simu-sec-dash")
3. **No marques** "También configurar Firebase Hosting" a menos que planees desplegarlo ahí
4. Haz clic en "**Registrar app**"
5. **Copia las credenciales** que aparecen (las necesitarás en el siguiente paso)

## Paso 3: Configurar Variables de Entorno

1. Crea un archivo `.env` en la raíz del proyecto (al mismo nivel que `package.json`)
2. Copia el contenido de `.env.example` al nuevo archivo `.env`
3. Reemplaza los valores de ejemplo con tus credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=tu_api_key_real
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

> **⚠️ Importante**: El archivo `.env` ya está en `.gitignore`, nunca lo subas a Git con tus credenciales reales.

## Paso 4: Crear la Base de Datos Firestore

1. En Firebase Console, ve a la sección "**Firestore Database**" en el menú lateral
2. Haz clic en "**Crear base de datos**"
3. Selecciona "**Modo de producción**" (configuraremos las reglas después)
4. Elige una ubicación cercana a tus usuarios (ej: `us-central1` o `southamerica-east1` para América Latina)
5. Haz clic en "**Habilitar**"

## Paso 5: Configurar Reglas de Seguridad

1. En Firestore Database, ve a la pestaña "**Reglas**"
2. Reemplaza las reglas por defecto con las siguientes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura a la colección de políticas
    // En producción, deberías agregar autenticación
    match /policies/{policyId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. Haz clic en "**Publicar**"

> **🔒 Nota de Seguridad**: Estas reglas permiten que cualquiera lea y escriba. Para producción, deberías implementar autenticación Firebase y restringir el acceso solo a usuarios autenticados.

## Paso 6: Crear Datos Iniciales

Para que el Desktop Simulator funcione, necesitas crear documentos en la colección `policies`.

### Opción A: Usando Firebase Console (Manual)

1. En Firestore Database, haz clic en "**Iniciar colección**"
2. ID de la colección: `policies`
3. ID del primer documento: `POL-004`
4. Agrega este campo:
   - **Campo**: `habilitada`
   - **Tipo**: boolean
   - **Valor**: `true` o `false`
5. Haz clic en "**Guardar**"

Repite el proceso para crear más políticas si lo deseas (POL-001, POL-002, POL-003, etc.)

### Opción B: Usando un Script (Recomendado)

Crea un archivo temporal `initFirebase.js` en la raíz del proyecto:

```javascript
// initFirebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  // ... resto de tu configuración
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const policiesToInit = [
  { id: 'POL-001', habilitada: true },
  { id: 'POL-002', habilitada: true },
  { id: 'POL-003', habilitada: false },
  { id: 'POL-004', habilitada: true }, // Esta es la que usa el Desktop Simulator
  { id: 'POL-005', habilitada: true },
  { id: 'POL-006', habilitada: false },
];

async function initPolicies() {
  for (const policy of policiesToInit) {
    await setDoc(doc(db, 'policies', policy.id), {
      habilitada: policy.habilitada
    });
    console.log(`Política ${policy.id} creada`);
  }
  console.log('¡Todas las políticas inicializadas!');
  process.exit(0);
}

initPolicies();
```

Luego ejecuta: `node initFirebase.js` (recuerda borrar este archivo después)

## Paso 7: Probar la Configuración

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Accede a la aplicación en tu navegador
3. Ve a la página de "**Simulación**" (Desktop Simulator)
4. Haz clic en el icono del instalador
5. Si la configuración es correcta:
   - Si `POL-004.habilitada` es `true` → Verás un modal de "Amenaza Detectada"
   - Si `POL-004.habilitada` es `false` → Verás un modal de "Instalación Iniciada"

## Estructura de Datos en Firestore

```
/policies (colección)
  /POL-001 (documento)
    - habilitada: boolean
  /POL-002 (documento)
    - habilitada: boolean
  /POL-004 (documento)  // ← Usado por Desktop Simulator
    - habilitada: boolean
  ...
```

## Cambiar el Estado de una Política

Puedes cambiar el estado de una política de dos formas:

1. **Manualmente en Firebase Console**:
   - Ve a Firestore Database
   - Encuentra el documento (ej: `policies/POL-004`)
   - Edita el campo `habilitada`

2. **Desde la aplicación** (si implementas la funcionalidad):
   - Usa el servicio `updatePolicy` de `src/services/policyService.ts`

## Solución de Problemas

### Error: "Firebase: Error (auth/api-key-not-valid)"
- Verifica que hayas copiado correctamente las credenciales
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo después de crear/editar `.env`

### Warning: "Firebase: Usando credenciales de demostración"
- Esto es normal si no has configurado las variables de entorno
- La aplicación funcionará con datos mock, pero no conectará a Firebase real

### No se actualiza el estado
- Verifica las reglas de seguridad en Firestore
- Revisa la consola del navegador para ver errores
- Asegúrate de que el documento en Firestore tenga el campo `habilitada` (no `enabled`)

## Próximos Pasos

Una vez configurado Firebase:

1. **Integra con Políticas**: Puedes modificar la página de Políticas para que también lea/escriba en Firebase
2. **Agrega Autenticación**: Implementa Firebase Authentication para proteger los datos
3. **Deploy**: Despliega tu aplicación en Firebase Hosting, Vercel o Netlify

---

¿Necesitas ayuda? Revisa la [documentación oficial de Firebase](https://firebase.google.com/docs/firestore)
