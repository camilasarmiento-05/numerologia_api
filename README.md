# API de Numerología

## Fase 1

**Alcance de esta fase:** inicialización del proyecto, configuración de variables de entorno y conexión exitosa a MongoDB Atlas.

### Instalación

```bash
npm install
cp .env.example .env
```

Edita `.env` y agrega tu cadena de conexión de **MongoDB Atlas** en `MONGO_URI`.

### Probar la conexión a MongoDB

```bash
node test-conexion.js
```

Si la configuración es correcta verás:

```text
Conexión exitosa a MongoDB Atlas
Base de datos activa: numerologia_db
```

### Iniciar el servidor

```bash
npm run dev
```

Visita:

```text
http://localhost:4000/
```

La respuesta será:

```json
{
  "success": true,
  "message": "API de Numerología funcionando"
}
```

En la consola también aparecerá:

```text
MongoDB Atlas conectado correctamente
```

## Fase 2

**Alcance de esta fase:** creación de los esquemas de MongoDB (2-a), rutas y controladores CRUD base (2-b), y autenticación con JWT + encriptación de contraseñas con bcrypt (2-c).

### Variables de entorno adicionales

A las de la Fase 1 se suman:

```text
JWT_SECRET=cualquier_texto_largo_y_secreto
GEMINI_API_KEY=se_agrega_en_fase_4
```

### Instalar dependencias nuevas

```bash
npm install bcryptjs jsonwebtoken
```

### Endpoints disponibles

#### Autenticación (`/api/v1/auth`) — públicos

| Método | Endpoint | Body |
|--------|----------|------|
| POST | `/register` | `nombre_completo`, `email`, `password`, `fecha_nacimiento` |
| POST | `/login` | `email`, `password` → devuelve `token` |

#### Numerología (`/api/v1/numerology`) — protegidos con JWT

| Método | Endpoint | Requiere |
|--------|----------|----------|
| POST | `/calculate` | Header `Authorization: Bearer <token>` |
| GET | `/profile` | Header `Authorization: Bearer <token>` |

#### Lecturas (`/api/v1/readings`) — protegidos con JWT

| Método | Endpoint | Requiere |
|--------|----------|----------|
| POST | `/generate` | Header `Authorization: Bearer <token>`, body `tipo_lectura` |
| GET | `/history` | Header `Authorization: Bearer <token>` |

#### Compatibilidad (`/api/v1/compatibility`) — protegidos con JWT

| Método | Endpoint | Requiere |
|--------|----------|----------|
|