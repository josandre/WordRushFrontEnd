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
# 📐 Estándares de Desarrollo

## Estrategia de ramas (Git)

**Modelo de ramas:**
- `main` → Solo versiones **estables**.
- `develop` → Rama de integración de **features**.
- `feature/` → Ramas de trabajo creadas desde `develop`.

**Convenciones de nombres:**
- Formato: `feature/<idTarea>`
- Ejemplo: `feature/1234-login-con-jwt`

## Reglas de Merge

- **Hacia develop**:
    - Pull Request (PR) obligatorio.
    - Estrategia: **Squash & Merge**.

- **Hacia main**:
    - Solo permitido desde `develop`.


## Convención de nombres

- **Componentes React / Screens**: `PascalCase` → `LoginScreen`, `UserCard`
- **Hooks personalizados**: `camelCase` con prefijo `use` → `useAuth`, `useUserProfile`
- **Interfaces / Types (TypeScript)**: `PascalCase` → `User`, `TodoItem`, `ApiResponse`
- **Funciones y métodos**: `camelCase` → `fetchData()`, `handleSubmit()`
- **Variables locales / parámetros**: `camelCase` → `userName`, `isLoading`
- **Constantes (globales o config)**: `UPPER_SNAKE_CASE` → `API_BASE_URL`, `MAX_RETRY_COUNT`
- **Archivos**:
    - Componentes → `PascalCase.tsx` → `UserCard.tsx`
    - Hooks / utilidades → `camelCase.ts` → `useAuth.ts`, `formatDate.ts`
    - Estilos → `componentName.styles.ts`
- **Estado global (Zustand/Redux)**: `camelCase` para slices y stores → `authStore`, `useAppStore`
- **Tests**: mismo nombre del archivo + `.test.tsx` o `.spec.ts`

## Reglas de Merge

- **Hacia develop**:
    - Pull Request (PR) obligatorio.
    - Estrategia: **Squash & Merge**.

- **Hacia main**:
    - Solo permitido desde `develop`.

---

## ⚙️ Pipelines CI/CD

- Los **pipelines** se ejecutan automáticamente **cuando se realiza un `push` en cualquier rama**.
- El flujo incluye las siguientes etapas:

1. **Set up job**
2. **Checkout code**
3. **Setup .NET**
4. **Restore dependencies**
5. **Build**
6. **Run tests**
7. **Post Setup .NET**
8. **Post Checkout code**
9. **Complete job**
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