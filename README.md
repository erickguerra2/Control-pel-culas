# 🎬 Nuestras Películas

App web para llevar el control de las películas que ven juntos: las del cine y las de casa.

## Funcionalidades

- Agregar películas con título, lugar (cine o casa), estado, calificación, fecha y notas
- Filtrar por: todas, pendientes, vistas, cine, casa
- Marcar como vista con un clic
- Editar y eliminar películas
- Estadísticas rápidas en la parte superior
- Sincronización en tiempo real entre dispositivos (con Firebase)

## Uso rápido (sin configurar Firebase)

La app funciona sin ninguna configuración — las películas se guardan en el almacenamiento local del navegador. Ideal para probarla.

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Configuración con Firebase (para sincronizar entre los dos)

Para que tanto tú como tu pareja vean la misma lista desde cualquier dispositivo, necesitan Firebase.

### 1. Crear un proyecto Firebase (gratis)

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Clic en **"Crear un proyecto"**
3. Dale un nombre (ej. `nuestras-peliculas`) y sigue los pasos
4. En el menú lateral: **Compilación → Firestore Database**
5. Clic en **"Crear base de datos"**, elige **Modo de prueba** y selecciona la región más cercana

### 2. Obtener la configuración

1. En Firebase Console, ve a **Configuración del proyecto** (ícono ⚙️)
2. En **"Tus apps"**, agrega una app web (clic en `</>`)
3. Registra la app y copia el objeto `firebaseConfig`

### 3. Crear el archivo `.env`

Copia `.env.example` a `.env` y rellena con tus valores:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 4. Reglas de Firestore

En Firebase Console → Firestore → **Reglas**, pega esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

(Para una app personal compartida entre dos personas, esto es suficiente.)

### 5. Ejecutar

```bash
npm install
npm run dev
```

## Deploy en Netlify

1. Sube el repositorio a GitHub
2. En [netlify.com](https://netlify.com), clic en **"Add new site"** → importa desde GitHub
3. Netlify detecta automáticamente la configuración de Vite
4. En **Site settings → Environment variables**, agrega todas las variables `VITE_*`
5. Deploy

Una vez desplegado, ambos pueden acceder desde el celular o computadora con la misma URL.
