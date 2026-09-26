# Sistema de Simulación de Ciclo de Vida de Solicitudes de Crédito

Sistema completo Full Stack para la gestión del ciclo de vida de solicitudes de crédito, desde la captura inicial hasta el desembolso y generación del plan de pagos.

## 📋 Descripción

Aplicación web que simula el proceso completo de una solicitud de crédito dentro de una entidad bancaria/fintech, implementando:

- Captura de solicitudes de crédito
- Evaluación por comité de riesgo
- Aprobación/Rechazo con transacciones ACID
- Generación automática de créditos y planes de pago
- Desembolso de créditos aprobados
- Consulta de planes de amortización

## 🏗️ Arquitectura

### Backend
- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **ORM**: TypeORM
- **Base de Datos**: SQLite
- **Autenticación**: JWT + Refresh Token
- **Validación**: class-validator, class-transformer

### Frontend
- **Framework**: Angular 17 (Standalone Components)
- **Lenguaje**: TypeScript
- **Formularios**: Reactive Forms
- **HTTP**: HttpClient con Interceptors
- **Routing**: Angular Router con Guards
- **UI**: Bootstrap 5

### Infraestructura
- **Contenedores**: Docker + Docker Compose
- **Proxy**: Nginx (frontend)
- **Persistencia**: Volumen Docker para SQLite

## 📁 Estructura del Proyecto

```
credit-simulator/
├── backend/
│   ├── src/
│   │   ├── auth/              # Autenticación JWT
│   │   ├── users/             # Gestión de usuarios
│   │   ├── applications/      # Solicitudes de crédito
│   │   ├── risk/              # Comité de riesgo
│   │   ├── credits/           # Créditos aprobados
│   │   ├── disbursements/     # Desembolsos
│   │   ├── payments/          # Plan de pagos
│   │   └── common/
│   │       ├── enums/         # Enumeraciones
│   │       ├── guards/        # Guards de autenticación
│   │       ├── decorators/    # Decoradores personalizados
│   │       ├── calculations/  # Cálculos financieros
│   │       └── helpers/       # Utilidades
│   ├── test/                  # Tests E2E
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/    # Auth guard
│   │   │   │   ├── interceptors/  # HTTP interceptor
│   │   │   │   ├── services/  # Servicios centralizados
│   │   │   │   └── models/    # Interfaces y enums
│   │   │   ├── auth/          # Login
│   │   │   ├── dashboard/     # Dashboard
│   │   │   ├── applications/  # Solicitudes
│   │   │   ├── risk/          # Comité de riesgo
│   │   │   ├── disbursements/ # Desembolsos
│   │   │   ├── payments/      # Plan de pagos
│   │   │   └── shared/        # Utilidades compartidas
│   │   └── ...
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── data/                      # Persistencia SQLite
├── docker-compose.yml
└── README.md
```

## 🚀 Instalación

### Requisitos Previos
- Node.js 18+
- npm 9+
- Docker y Docker Compose (opcional)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd credit-simulator
```

2. **Instalar dependencias**
```bash
npm run install:all
```

3. **Configurar variables de entorno**

Backend (`backend/.env`):
```env
PORT=3000
DB_PATH=./data/credit.sqlite
JWT_SECRET=change-this-secret
JWT_REFRESH_SECRET=change-this-refresh-secret
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
```

4. **Ejecutar en desarrollo**

Terminal 1 - Backend:
```bash
npm run backend
```

Terminal 2 - Frontend:
```bash
npm run frontend
```

### Instalación con Docker

```bash
docker compose up --build
```

Acceder a:
- Frontend: http://localhost:4200
- Backend: http://localhost:3000

## 🔐 Credenciales de Acceso

El sistema cuenta con tres roles de usuario, cada uno con permisos específicos:

### 1. Asesor de Crédito
- **Username**: `asesor`
- **Password**: `Asesor123!`
- **Permisos**: Crear y consultar solicitudes de crédito

### 2. Analista (Comité de Riesgo)
- **Username**: `analista`
- **Password**: `Analista123!`
- **Permisos**: Aprobar o rechazar solicitudes en el comité de riesgo

### 3. Agente de Operaciones
- **Username**: `agente`
- **Password**: `Agente123!`
- **Permisos**: Ejecutar desembolsos y consultar planes de pago

Todos los usuarios se crean automáticamente al iniciar el backend.

## 📡 Endpoints del API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Renovar access token

### Solicitudes
- `POST /api/applications` - Crear solicitud
- `GET /api/applications` - Listar solicitudes
- `GET /api/applications/:id` - Obtener solicitud

### Comité de Riesgo
- `GET /api/risk/applications` - Solicitudes pendientes
- `POST /api/risk/applications/:id/approve` - Aprobar solicitud
- `POST /api/risk/applications/:id/reject` - Rechazar solicitud

### Créditos
- `GET /api/credits/approved` - Créditos aprobados
- `GET /api/credits/search?identification=...` - Buscar por cédula
- `GET /api/credits/:id/payments` - Plan de pagos

### Desembolsos
- `POST /api/credits/:id/disbursement` - Desembolsar crédito

## 🔄 Estados y Transiciones

### Estados de Solicitud
- **PENDIENTE** - Solicitud creada, esperando revisión
- **APROBADA** - Aprobada por comité de riesgo
- **RECHAZADA** - Rechazada por comité de riesgo
- **DESEMBOLSADA** - Crédito desembolsado

### Matriz de Transiciones Permitidas

| Desde | Hacia | Permitido |
|-------|-------|-----------|
| PENDIENTE | APROBADA | ✅ |
| PENDIENTE | RECHAZADA | ✅ |
| APROBADA | DESEMBOLSADA | ✅ |
| APROBADA | RECHAZADA | ❌ |
| RECHAZADA | APROBADA | ❌ |
| DESEMBOLSADA | * | ❌ |

## 💰 Cálculo de Cuota

### Fórmula

Para tasa > 0:
```
Cuota = Monto × [i × (1 + i)^n] / [(1 + i)^n - 1]

Donde:
i = Tasa Anual / 100 / Períodos por Año
n = Número de cuotas
```

Para tasa = 0:
```
Cuota = Monto / Número de cuotas
```

### Períodos por Año
- ANUAL: 1
- MENSUAL: 12
- QUINCENAL: 24

## 📊 Plan de Pagos

El plan de amortización se genera automáticamente al aprobar una solicitud con:
- Número de cuota
- Fecha de vencimiento
- Monto de cuota
- Interés
- Capital
- Saldo

El saldo final siempre es 0.00, con ajuste en la última cuota si es necesario.

## ⚡ Transacciones ACID

### Aprobación de Solicitud

Operación atómica que ejecuta:
1. Verificar estado PENDIENTE
2. Validar observaciones obligatorias
3. Cambiar estado a APROBADA
4. Crear registro Credit con status APPROVED
5. Generar número de crédito (CR-XXXXXX)
6. Calcular cuota
7. Crear N cuotas (PaymentInstallment)

Si cualquier paso falla: **ROLLBACK completo**

### Desembolso de Crédito

Operación atómica que ejecuta:
1. Verificar Credit.status = APPROVED
2. Verificar CreditApplication.status = APPROVED
3. Verificar que no exista desembolso previo
4. Crear registro Disbursement
5. Cambiar Credit.status = DISBURSED
6. Cambiar CreditApplication.status = DISBURSED

Si cualquier paso falla: **ROLLBACK completo**

## 🛡️ Seguridad

### JWT
- **Access Token**: Expira en 15 minutos
- **Refresh Token**: Expira en 7 días
- Tokens firmados con secretos diferentes
- Refresh automático mediante interceptor

### Validaciones
- Edad máxima: 80 años (a los 80 se permite)
- Observaciones obligatorias para aprobar
- Validación de transiciones de estado en backend
- Guards en rutas protegidas

## 🧪 Tests

### Backend

```bash
cd backend
npm run test        # Tests unitarios
npm run test:e2e    # Tests E2E
npm run test:cov    # Cobertura
```

### Tests Implementados
- Login válido/inválido
- Refresh token
- Validación edad > 80 años
- Validación edad = 80 años
- Cálculo cuota con tasa > 0
- Cálculo cuota con tasa = 0
- Creación de solicitud
- Estado inicial PENDIENTE

## 🐳 Docker

### Construcción
```bash
docker compose build
```

### Ejecución
```bash
docker compose up
```

### Detener
```bash
docker compose down
```

### Persistencia
Los datos de SQLite se persisten en `./data/credit.sqlite` mediante volumen Docker.

## 📝 Decisiones de Arquitectura

### Backend
- **Modularidad**: Cada funcionalidad en su propio módulo
- **Separación de responsabilidades**: Controllers, Services, DTOs, Entities
- **Transacciones**: DataSource.transaction() para operaciones ACID
- **Validación**: DTOs con class-validator
- **Seguridad**: Guards de autenticación, bcrypt para passwords

### Frontend
- **Standalone Components**: Angular 17 sin NgModules
- **Reactive Forms**: Validación y cálculos en tiempo real
- **Interceptors**: Manejo automático de tokens y refresh
- **Guards**: Protección de rutas
- **Servicios centralizados**: ApiService para todas las llamadas HTTP

### Base de Datos
- **SQLite**: Simplicidad para prueba técnica
- **synchronize=true**: Solo para desarrollo/demo
- **Fechas nullable**: Tipo explícito 'datetime' para compatibilidad

## 🤖 Bitácora de IA

### Herramientas Utilizadas
- **Windsurf Cascade**: Generación completa del proyecto

### Proceso
1. **Análisis del prompt**: Lectura y comprensión de especificaciones
2. **Planificación**: Estructura modular backend y frontend
3. **Implementación Backend**: 
   - Módulos NestJS con separación clara
   - Entidades TypeORM con relaciones
   - Transacciones ACID para aprobación y desembolso
   - Tests E2E básicos
4. **Implementación Frontend**:
   - Componentes standalone Angular 17
   - Formularios reactivos con validación
   - Interceptor para refresh token automático
   - Cálculo de cuota en tiempo real
5. **Dockerización**: Dockerfiles multistage y docker-compose
6. **Documentación**: README completo

### Validación Humana Requerida
- Instalación de dependencias (`npm install`)
- Ejecución de tests
- Prueba del flujo completo
- Verificación de Docker
- Ajustes de configuración según entorno

### Correcciones Potenciales
- Ajustar secretos JWT para producción
- Configurar CORS según dominio real
- Deshabilitar `synchronize` en producción
- Implementar migraciones TypeORM
- Agregar más tests de cobertura
- Implementar logging estructurado

## 📚 Tecnologías y Patrones

### Patrones Implementados
- **Repository Pattern**: TypeORM repositories
- **DTO Pattern**: Validación y transformación de datos
- **Guard Pattern**: Protección de rutas
- **Interceptor Pattern**: Manejo de tokens HTTP
- **Service Layer**: Lógica de negocio separada
- **Transaction Script**: Operaciones ACID

### Librerías Principales
- **Backend**: NestJS, TypeORM, Passport, JWT, bcrypt, class-validator
- **Frontend**: Angular, RxJS, Bootstrap
- **Testing**: Jest, Supertest
- **DevOps**: Docker, Nginx

## 🎯 Cumplimiento de Requisitos

✅ Stack completo: NestJS + Angular + TypeScript + SQLite  
✅ Autenticación JWT con Refresh Token  
✅ Transacciones ACID en aprobación y desembolso  
✅ Validación edad > 80 años  
✅ Cálculo automático de cuota  
✅ Plan de pagos con amortización completa  
✅ Estados y transiciones validadas en backend  
✅ Dockerización completa  
✅ Tests E2E  
✅ README documentado  
✅ Modularidad y limpieza de código  

## 📄 Licencia

MIT

## 👥 Autor

Proyecto generado con Windsurf Cascade para prueba técnica.
