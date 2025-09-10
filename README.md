# WordRushFrontEnd
# README — Frontend (React Native)

## 📦 Proyecto
Aplicación móvil *React Native* (Cliente) que consume la API del Servidor (.NET).  
Arquitectura *Atomic Design* y tipado reforzado a partir de los modelos del backend.

---

## 🏗️ Arquitectura y Setup Inicial

### Arquitectura general del sistema
*Cliente (React Native) ⇒ Servidor (API .NET) ⇒ Base de Datos (PostgreSQL/Neon)*  
Comunicación segura vía *HTTPS* + *JWT*.

### Arquitectura interna del Frontend (Atomic Design)
- src/ui/atoms/ — componentes básicos (botón, texto, input).
- src/ui/molecules/ — combinaciones simples (input + label, card).
- src/ui/organisms/ — secciones completas (formularios, headers).
- src/ui/pages/ — pantallas/rutas de la app.
- src/services/api/ — cliente HTTP, interceptores, manejo de errores.
- src/models/ — *tipos generados desde el backend* (OpenAPI) + tipos de dominio UI.
- src/state/ — estado global (Zustand/Redux).
- src/hooks/, src/utils/, src/config/.

*Modelos: Investigación → Reforzar tipado*  
Se generan types/DTOs desde Swagger/OpenAPI del backend para asegurar contratos fuertes entre FE y BE.

---

## 🧰 Herramientas
- *Repos*: Dos repos separados (Client y Server).
- *GitHub* con dos ramas principales: develop y master.
- *IDE*: Visual Studio Code (con ESLint/Prettier).
- *Dependencias*: React Native + TypeScript + axios/fetch + react-navigation.
- *Calidad*: ESLint + Prettier + Husky (pre-commit).

---

## ⚙️ Setup local

```bash
# instalar dependencias
npm install
# iOS
npx pod-install ios
npm run ios
# Android
npm run android