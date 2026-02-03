# Propuesta de Actualizacion de Lineamientos de Stack (Compatibilidad)

## Resumen Ejecutivo
- Fastify 5.6.0 es correcto, pero las versiones actuales sugeridas de Swagger/Swagger-UI no son compatibles y causan el error de `FST_ERR_PLUGIN_VERSION_MISMATCH`.
- Node.js 20.15.1 LTS es razonable, pero exigir npm 11.5.2 es inconsistente: Node 20.15.1 trae npm 10.7.0, lo que dispara `EBADENGINE`.
- Node 20 LTS termina soporte en abril de 2026, conviene planear el salto a Node 22/24 en el roadmap.

## Propuesta de Ajustes (Minimos y Compatibles)

### Runtime
- **Node.js:** mantener `20.15.1` (LTS actual).
- **Nota de roadmap:** planificar migracion a Node 22/24 antes de abril 2026.
Justificacion: Node 20 esta en LTS, pero se acerca el fin de soporte.

### Package Manager
- **npm:** cambiar de `11.5.2` a `10.7.0` (bundled con Node 20.15.1) o rango `10.x`.
Justificacion: evita warnings `EBADENGINE` y alinea tooling con la version de Node.

### Fastify + Swagger
- **Fastify:** mantener `5.6.0`.
- **@fastify/swagger:** actualizar a `>=9.x`.
- **@fastify/swagger-ui:** actualizar a `^5.x`.
Justificacion: estas versiones son las compatibles con Fastify 5; versiones anteriores fallan en runtime.

### Logging
- **Pino:** usar `9.x` (mantener).
Justificacion: alineado con Fastify 5 y el repo actual.

### ORM / Data Access
- **Prisma:** mantener `6.14.0`.
- **Nota:** migrar configuracion de `package.json#prisma` a `prisma.config.*` antes de Prisma 7.
Justificacion: la configuracion en `package.json` esta deprecada (aviso en CLI).

### OpenAPI / Docs
- **OpenAPI:** mantener `3.0.3`.
Justificacion: no hay conflictos actuales y es compatible con el stack.

### SQL Server
- **SQL Server 2022 (16.0):** mantener.
Justificacion: compatible con Prisma y el stack actual.

## Impacto de No Ajustar
- Fastify 5 + Swagger 8 / Swagger-UI 2 => fallo de arranque (`FST_ERR_PLUGIN_VERSION_MISMATCH`).
- Node 20.15.1 + npm 11.5.2 => warnings `EBADENGINE` y tooling inconsistente.

## Recomendacion Final
Aplicar los ajustes anteriores para mantener compatibilidad real con el repo actual, reducir errores en runtime y alinear el stack con versiones soportadas.
