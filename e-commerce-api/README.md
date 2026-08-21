# E-Commerce API

API RESTful para gestión de productos y usuarios en una tienda de hardware tecnológico. Incluye autenticación JWT, recuperación de contraseña por email, generación de códigos QR con tokens expirables, paginación y CRUD de productos y categorías.

## 📦 Descripción
Esta API está diseñada para ser consumida por una SPA moderna y cumple con los requisitos académicos de seguridad, buenas prácticas y separación de capas. Permite:
- Registro e inicio de sesión de usuarios
- Recuperación de contraseña por email
- CRUD de productos y categorías
- Listado paginado de productos
- Generación y validación de códigos QR con acceso exclusivo

## 🚀 Tecnologías utilizadas
- ASP.NET Core 9
- Entity Framework Core (SQL Server)
- JWT Authentication
- AutoMapper
- QRCoder
- SMTP (Gmail) para envío de emails
- Swagger (documentación y pruebas)

## ⚙️ Requisitos previos
- .NET 9 SDK
- SQL Server (o LocalDB)
- Cuenta de Gmail (para SMTP)

## 🛠️ Instalación y configuración
1. **Clona el repositorio:**
   ```sh
   git clone <url-del-repo>
   cd e-commerce-api
   ```

2. **Configura valores locales sin trackearlos:**
   - No edites `appsettings.json` ni agregues credenciales al repositorio.
   - Configura la cadena de conexión y la clave JWT con .NET User Secrets o variables de entorno. Consulta [SECURITY_SETUP.md](SECURITY_SETUP.md) para las claves y los comandos actuales.

3. **Restaura paquetes y aplica migraciones:**
   ```sh
   dotnet restore
   dotnet ef database update --project e-commerce-api.csproj
   ```

4. **Ejecuta la API:**
   ```sh
   dotnet run --project e-commerce-api.csproj
   ```

5. **Accede a Swagger:**
   - [https://localhost:7000/swagger](https://localhost:7000/swagger)

## 🔑 Endpoints principales
- `POST /api/Auth/register` — Registro de usuario
- `POST /api/Auth/login` — Login y obtención de JWT
- `POST /api/Auth/forgot-password` — Solicitar recuperación de contraseña
- `POST /api/Auth/reset-password` — Restablecer contraseña
- `GET /api/Products` — Listado paginado de productos
- `GET /api/Products/{id}` — Detalle de producto
- `POST /api/Products` — Crear producto (requiere JWT)
- `PUT /api/Products/{id}` — Editar producto (requiere JWT)
- `DELETE /api/Products/{id}` — Eliminar producto (requiere JWT)
- `POST /api/Qr/generate` — Generar código QR (requiere JWT)
- `GET /api/Qr/validate/{token}` — Validar token QR

## 🛡️ Seguridad
- Contraseñas almacenadas con hash y salt
- JWT para autenticación y autorización
- Tokens de recuperación y QR con expiración
- Endpoints protegidos con `[Authorize]`

## 📝 Escenario elegido
**E-commerce de hardware tecnológico**: Gestión de productos, categorías y usuarios, con funcionalidades exclusivas vía QR y seguridad avanzada.

## 👨‍💻 Créditos
- API desarrollada por Acevedo Mario Daniel y Alan Quenardelle (Universidad Tecnologica Nacional UTN)

## 📄 Licencia
Uso académico.
