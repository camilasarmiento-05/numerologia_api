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
| POST | `/check` | Header `Authorization: Bearer <token>`, body `id_otro_usuario` |

> Los cálculos numerológicos, el texto de las lecturas y el análisis de compatibilidad aún devuelven valores en 0 o mensajes provisionales — la lógica real llega en la Fase 3 (algoritmos) y la Fase 4 (Gemini).

### Cómo probar el flujo completo

1. `POST /api/v1/auth/register` — crea el usuario.
2. `POST /api/v1/auth/login` — devuelve el `token`.
3. Copia el `token` y agrégalo en cualquier ruta protegida como header `Authorization: Bearer <token>`.
4. `POST /api/v1/numerology/calculate` — crea el perfil (sin body, el usuario se toma del token).
5. `GET /api/v1/numerology/profile` — consulta ese perfil.

## Fase 3

**Alcance de esta fase:** algoritmos de numerología pitagórica (suma y reducción numérica) para calcular los tres números centrales del perfil, reemplazando los valores en 0 que se dejaron como placeholder en la Fase 2.

### Archivo nuevo

```text
src/utils/numerologia.js
```

### Funciones

| Función | Qué calcula |
|---------|-------------|
| `reducirNumero(numero)` | Suma los dígitos de un número hasta dejarlo en un solo dígito, respetando los números maestros (11, 22, 33) sin reducirlos más |
| `calcularNumeroVida(fechaNacimiento)` | Camino de Vida: suma todos los dígitos de la fecha de nacimiento (día + mes + año) y reduce |
| `calcularNumeroExpresion(nombreCompleto)` | Expresión: convierte cada letra del nombre completo a un número (tabla pitagórica) y suma todo |
| `calcularNumeroAlma(nombreCompleto)` | Alma: igual que Expresión, pero solo con las vocales del nombre |

### Cambios en `numerology.controller.js`

El endpoint `POST /api/v1/numerology/calculate` ahora busca al usuario autenticado (por `req.user.id`), toma su `nombre_completo` y `fecha_nacimiento`, y calcula los tres números reales en vez de guardar ceros.

### Cómo probar

1. `POST /api/v1/numerology/calculate` — con header `Authorization: Bearer <token>`, body vacío `{}`.
2. `GET /api/v1/numerology/profile` — mismo header, sin body. Debe devolver `numero_vida`, `numero_expresion` y `numero_alma` con valores del 1 al 9 (o 11/22/33 si sale un número maestro).

## Fase 4

**Alcance de esta fase:** integración del SDK de Google Gemini para generar interpretaciones reales en las lecturas y en el análisis de compatibilidad, reemplazando los mensajes provisionales de la Fase 2.

### Variable de entorno necesaria

```text
GEMINI_API_KEY=tu_api_key_real_de_google_ai_studio
```

Se obtiene en [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

### Dependencia nueva

```bash
npm install @google/generative-ai
```

### Archivo nuevo

```text
src/utils/gemini.js
```

Expone `generarTexto(prompt)`, que envía un prompt al modelo `gemini-1.5-flash` y devuelve el texto de la respuesta.

### Cambios en los controladores

- **`readings.controller.js`** — `generate` arma un prompt con los tres números del perfil del usuario y el `tipo_lectura` (`diaria`, `general` o `anual`), lo envía a Gemini, y guarda el `prompt_enviado` junto con la `respuesta_generada` real.
- **`compatibility.controller.js`** — `check` calcula un `puntaje` (0 a 100) comparando la diferencia entre los números de ambos perfiles, arma un prompt con esos números y el puntaje, y guarda la `interpretacion` que devuelve Gemini.

### Cómo probar

```text
POST /api/v1/readings/generate
Header: Authorization: Bearer <token>
Body: { "tipo_lectura": "diaria" }
```

```text
POST /api/v1/compatibility/check
Header: Authorization: Bearer <token>
Body: { "id_otro_usuario": "<id de otro usuario con perfil ya calculado>" }
```

## Estructura del proyecto

```text
numerologia-api/
├── server.js
├── test-conexion.js
├── package.json
├── .env.example
└── src/
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── User.js
    │   ├── NumerologyProfile.js
    │   ├── Reading.js
    │   ├── CompatibilityMatch.js
    │   └── AuditLog.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── numerology.controller.js
    │   ├── readings.controller.js
    │   └── compatibility.controller.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── numerology.routes.js
    │   ├── readings.routes.js
    │   └── compatibility.routes.js
    ├── middlewares/
    │   └── auth.middleware.js
    └── utils/
        ├── numerologia.js
        └── gemini.js
```

## Próximas fases

| Fase | Contenido |
|------|-----------|
| 5 | Colección de auditoría, validación de datos, manejo de errores y pruebas finales |