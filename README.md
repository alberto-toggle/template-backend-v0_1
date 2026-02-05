# Microservice Boilerplate (Node.js + Fastify + TypeScript)

Arquetipo para microservicios con Node.js 22, Fastify, TypeScript, Prisma y SQL Server.

## Requisitos

- Node.js 22.22.0 LTS
- npm 10.x (incluido con Node 22.22.0)
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
- `MSSQL_DB_NAME`: nombre de la base de datos
- `DATABASE_URL`: conexión para Prisma (SQL Server, formato `sqlserver://host:port;database=...;user=...;password=...`)
- `JWT_SECRET`: secreto para firmar JWT propios
- `JWT_EXPIRES_IN`: expiración en segundos para JWT propios
- `AUTH_EXTERNAL_MODE`: modo de validación externa (`mock_allow` o `mock_deny`)

## Levantar SQL Server (Docker Compose)

```bash
docker compose up -d sqlserver
```

### Prisma Studio (opcional)

Prisma Studio es una UI para inspeccionar y editar datos.

```bash
docker compose up -d prisma-studio
```

Abre `http://localhost:5555`.

### Persistencia local de datos (opcional)

Este proyecto usa un volumen Docker llamado `sqlserver_data`. El comando de limpieza elimina contenedores y borra el volumen, por lo que se pierden los datos locales. Úsalo solo cuando quieras un entorno limpio desde cero:

```bash
docker compose down -v
```

## Instalación

```bash
npm install
```

## Migraciones y seed

```bash
npm run prisma:generate
npx prisma db push
npm run prisma:seed
```

## Ejecutar en desarrollo

```bash
npm run dev
```

### Usar SQL Server remoto (opcional)

Puedes usar una base de datos remota y omitir el contenedor local.

1) Configura `DATABASE_URL` apuntando al host remoto en tu `.env` o `.env.local`.
2) Asegura credenciales y permisos en el servidor remoto (usuario, password y red/VPN).
3) No levantes el contenedor `sqlserver`.
4) Levanta solo la app:

```bash
npm run dev
```

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

Swagger/OpenAPI: `http://localhost:3000/docs`

## Estándar de respuestas

Todas las respuestas usan un formato único para éxito y error.

Éxito:

```json
{
  "success": true,
  "http_status": 200,
  "message": "opcional",
  "data": {},
  "meta": {},
  "pagination": {}
}
```

Error:

```json
{
  "success": false,
  "http_status": 401,
  "message": "detalle del error",
  "error_code": "INVALID_TOKEN",
  "details": {},
  "meta": {}
}
```
