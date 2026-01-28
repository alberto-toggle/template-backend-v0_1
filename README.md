# Microservice Boilerplate (Node.js + Fastify + TypeScript)

Arquetipo para microservicios con Node.js 20, Fastify, TypeScript, Prisma y SQL Server.

## Requisitos

- Node.js 20.15.1 LTS
- npm 11.5.2
- Docker + Docker Compose (para SQL Server local)

## Variables de entorno

Copia `.env.example` a `.env` y ajusta lo necesario:

```bash
cp .env.example .env
```

Variables principales:

- `SERVICE_NAME`: nombre del servicio
- `PORT`: puerto del servidor
- `LOG_LEVEL`: nivel de log para Pino
- `MSSQL_SA_PASSWORD`: password del usuario `sa` para SQL Server
- `DATABASE_URL`: conexión para Prisma (SQL Server)

## Levantar SQL Server (Docker Compose)

```bash
docker compose up -d db
```

## Instalación

```bash
npm install
```

## Migraciones y seed

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Swagger/OpenAPI: `http://localhost:3000/docs`

## Build y run

```bash
npm run build
npm start
```

## Tests

Los tests de integración usan SQL Server. Asegúrate de tener la DB levantada y `DATABASE_URL` configurada.

```bash
npm test
npm run test:watch
npm run test:coverage
```

## Convención para nuevos módulos

Para crear un nuevo módulo (ej. `orders`), copia la estructura de `users`:

- `src/controllers/orders/` (controller + routes)
- `src/services/orders/`
- `src/dto/orders/`
- `src/schemas/order.schema.ts`

Luego registra las rutas en `src/app.ts` y agrega los esquemas en `src/plugins/validation.plugin.ts`.

## Estructura del proyecto

El layout sigue la especificación del Tech Stack v1.1.0 (New Developments + Project Structure). Las carpetas placeholder incluyen `.gitkeep`.
