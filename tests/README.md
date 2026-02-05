# Tests

Estructura de pruebas por tipo:

- `tests/integration/controllers/`: pruebas de endpoints y flujos HTTP.
- `tests/unit/services/`: pruebas unitarias de servicios.
- `tests/unit/middleware/`: pruebas unitarias de middlewares/guards.
- `tests/unit/utils/`: pruebas unitarias de utilidades/helpers.

Las pruebas mínimas actuales son placeholders para mantener la estructura lista
mientras se definen escenarios y coverage.

## Nota sobre ESM en tests

El runtime del servicio es ESM, pero Jest todavía es más estable en CommonJS
cuando se combina con TypeScript. Por eso los tests se compilan con
`tsconfig.jest.json` (CJS) aunque el código de la app sea ESM.
