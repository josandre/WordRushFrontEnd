# Definition of Done (DoD) — WordRushFrontEnd

Este documento establece los criterios que deben cumplirse para que una tarea/feature se considere completada en el proyecto **WordRushFrontEnd**.

---

## 1. Código y Convenciones

- La rama fue creada desde `develop` siguiendo la convención:
  - `feature/<idTarea>-<slug>` (ejemplo: `feature/1234-login-con-jwt`).
- Se respetaron las **convenciones de nombres**:
  - Componentes y Screens → `PascalCase` (ej. `LoginScreen`, `UserCard`)
  - Hooks personalizados → `camelCase` con prefijo `use` (ej. `useAuth`)
  - Interfaces/Types (TS) → `PascalCase` (ej. `User`, `ApiResponse`)
  - Funciones y métodos → `camelCase` (ej. `fetchData`, `handleSubmit`)
  - Variables locales/parámetros → `camelCase`
  - Constantes → `UPPER_SNAKE_CASE` (ej. `API_BASE_URL`)
  - Archivos:
    - Componentes → `PascalCase.tsx`
    - Hooks/utilidades → `camelCase.ts`
    - Estilos → `componentName.styles.ts`
  - Estado global (Zustand/Redux) → `camelCase` para stores/slices
  - Tests → mismo nombre + `.test.tsx` o `.spec.ts`

---

## 2. Arquitectura y Organización

- Los componentes siguen la arquitectura **Atomic Design**:
  - `atoms`, `molecules`, `organisms`, `pages`.
- Servicios de API y estado global se encuentran en `src/services` y `src/state`.
- Los modelos/DTOs se generan desde **Swagger/OpenAPI** del backend para mantener contratos fuertes entre FE y BE.

---

## 3. Calidad y Estilo

- El código pasó las reglas de **ESLint** y **Prettier**.
- Husky ejecutó hooks (pre-commit) sin errores.
- Se agregaron/actualizaron pruebas unitarias/componentes si aplica.

---

## 4. Integración Continua

- El **pipeline CI/CD** se ejecutó automáticamente al hacer `push` en la rama.
- Todas las etapas completadas con éxito:
  1. Set up job
  2. Checkout code
  3. Setup .NET
  4. Restore dependencies
  5. Build
  6. Run tests
  7. Post Setup .NET
  8. Post Checkout code
  9. Complete job

---

## 5. Revisiones y Pull Requests

- El código pasó revisión por al menos **1 integrante del equipo**.
- El **merge a `develop`** se realizó vía Pull Request con **Squash & Merge**.
- El **merge a `main`** solo se hace desde `develop` después de validar la release.

---
