# Prompt Maestro Final — Simulación del Ciclo de Vida de una Solicitud de Crédito

Actúa como un Arquitecto de Software Senior y Desarrollador Full Stack experto en NestJS, Angular, TypeScript, TypeORM, SQLite, JWT, Refresh Token y Docker.

Debes construir desde cero una aplicación Full Stack completa, funcional, coherente y lista para presentar como prueba técnica profesional.

**NO quiero un simple scaffold, pseudocódigo ni ejemplos parciales.**

Debes generar todos los archivos necesarios y toda la lógica funcional del sistema.

La aplicación debe cumplir exactamente con la especificación funcional que se presenta a continuación.

---

## 1. OBJETIVO

Construir una aplicación web que simule el ciclo de vida de una solicitud de crédito dentro de una entidad bancaria/fintech.

Flujo:

```text
LOGIN
   ↓
SOLICITUD
   ↓
PENDIENTE
   ↓
COMITÉ DE RIESGO
   ├── APROBADA
   │     ↓
   │   CREAR CRÉDITO
   │     ↓
   │   GENERAR PLAN DE PAGOS
   │     ↓
   │   DESEMBOLSO
   │     ↓
   │   DESEMBOLSADA
   │
   └── RECHAZADA
```

La lógica de negocio crítica debe residir en el backend.

El frontend jamás debe ser la autoridad para permitir cambios de estado.

---

## 2. STACK OBLIGATORIO

### Backend

- NestJS
- TypeScript
- TypeORM
- SQLite
- class-validator
- class-transformer
- JWT
- bcrypt

### Frontend

- Angular
- TypeScript
- Reactive Forms
- HttpClient
- Router
- Guards
- HTTP Interceptor
- Templates externos (NO inline templates)
- Standalone Components

### Base de datos

- SQLite
- Archivo físico
- Persistencia mediante volumen Docker

### Infraestructura

- Docker
- Docker Compose
- Dockerfile para backend
- Dockerfile para frontend
- docker-compose.yml en la raíz

**IMPORTANTE:**

NO utilizar:

- SQL Server
- PostgreSQL
- MySQL
- MongoDB

---

## 3. REQUISITO GENERAL DE ARQUITECTURA

La solución debe ser modular y limpia utilizando **Feature-Based Architecture**.

Backend:

```text
AuthModule
UsersModule
ApplicationsModule
RiskModule
CreditsModule
DisbursementsModule
PaymentsModule
```

**Estructura Feature-Based por Módulo:**

Cada módulo debe organizarse siguiendo este patrón:

```text
module-name/
├── module-name.controller.ts    # API endpoints
├── module-name.service.ts       # Lógica de negocio
├── module-name.module.ts        # Configuración del módulo
├── dto/                         # Data Transfer Objects
├── entities/                    # Entidades de base de datos
└── types/                       # Enums e interfaces específicos del dominio
```

**Ejemplo: UsersModule**
```text
users/
├── users.service.ts
├── users.module.ts
├── entities/
│   └── user.entity.ts
└── types/                       # ✅ Enums específicos del dominio
    ├── user-role.enum.ts
    └── index.ts
```

**Ejemplo: ApplicationsModule**
```text
applications/
├── applications.controller.ts
├── applications.service.ts
├── applications.module.ts
├── dto/
│   └── create-application.dto.ts
├── entities/
│   └── credit-application.entity.ts
└── types/                       # ✅ Enums específicos del dominio
    ├── application-status.enum.ts
    └── employment-type.enum.ts
```

**Código Compartido en /common:**

```text
common/
├── decorators/
│   ├── current-user.decorator.ts
│   └── roles.decorator.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
├── calculations/
│   └── installment.calculator.ts
├── helpers/
│   └── credit-number.generator.ts
└── enums/                       # ✅ Solo enums compartidos entre múltiples módulos
    ├── payment-frequency.enum.ts
    ├── bank.enum.ts
    └── index.ts
```

**Principios Importantes:**

1. **Separación por Dominio**: Cada módulo representa un dominio de negocio específico
2. **Enums Específicos**: Los enums que pertenecen a un dominio deben estar en `module/types/`
3. **Enums Compartidos**: Solo los enums usados por múltiples módulos van en `common/enums/`
4. **Bajo Acoplamiento**: Los módulos son independientes con dependencias explícitas

**CLEAN CODE Y BUENAS PRÁCTICAS:**

**Backend (NestJS):**
- ✅ **Separación de Responsabilidades**: Controllers solo manejan HTTP, Services contienen lógica de negocio
- ✅ **Inyección de Dependencias**: Usar el sistema DI de NestJS correctamente
- ✅ **DTOs para Validación**: Usar class-validator en todos los DTOs
- ✅ **Servicios Reutilizables**: Extraer lógica común a servicios compartidos (calculations, helpers)
- ✅ **Transacciones ACID**: Usar TypeORM transactions para operaciones críticas
- ✅ **Manejo de Errores**: Usar excepciones de NestJS (BadRequestException, NotFoundException, etc.)
- ✅ **Nombres Descriptivos**: Variables, métodos y clases con nombres claros y significativos
- ✅ **Funciones Pequeñas**: Cada función debe hacer una sola cosa bien
- ✅ **Evitar Código Duplicado**: Extraer lógica repetida a funciones/servicios reutilizables

**Frontend (Angular):**
- ✅ **Componentes Smart vs Presentacionales**: Separar lógica de presentación
- ✅ **Servicios para Lógica**: No poner lógica de negocio en componentes
- ✅ **Reactive Forms**: Usar FormBuilder y validadores
- ✅ **RxJS Operators**: Usar switchMap, map, catchError, finalize correctamente
- ✅ **Templates Externos**: NUNCA usar inline templates
- ✅ **Unsubscribe**: Manejar suscripciones correctamente (async pipe o unsubscribe)
- ✅ **Guards y Interceptors**: Centralizar autenticación y autorización
- ✅ **Interfaces y Types**: Tipar todo correctamente, evitar `any`
- ✅ **Evitar Código Duplicado**: Extraer lógica común a servicios o helpers

**Patrones de Diseño Aplicados:**

1. **Repository Pattern**: TypeORM repositories para acceso a datos
2. **Service Layer Pattern**: Servicios para lógica de negocio
3. **DTO Pattern**: Objetos de transferencia de datos con validación
4. **Guard Pattern**: Guards para autenticación y autorización
5. **Interceptor Pattern**: Interceptors para manejo de tokens y errores
6. **Strategy Pattern**: JWT Strategy para autenticación
7. **Module Pattern**: Organización modular por features
8. **Dependency Injection**: Inyección de dependencias en toda la aplicación

**IMPORTANTE:**

NO colocar toda la lógica en AppModule.

NO colocar lógica financiera compleja dentro de Controllers.

NO colocar lógica de negocio crítica dentro de componentes Angular.

NO colocar enums específicos de un dominio en common/ - deben estar en el módulo correspondiente dentro de `/types`.

NO duplicar código - extraer a funciones/servicios reutilizables.

NO usar `any` - tipar correctamente todas las variables y funciones.

NO crear funciones largas - mantener funciones pequeñas y enfocadas.

---

## 4. ESTRUCTURA DEL PROYECTO

Crear:

```text
credit-simulator/
│
├── backend/
│   ├── src/
│   │   ├── auth/                          # Módulo de autenticación
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── refresh-token.dto.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   │
│   │   ├── users/                         # Módulo de usuarios
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── types/                     # ✅ Enums del dominio
│   │   │       ├── user-role.enum.ts
│   │   │       └── index.ts
│   │   │
│   │   ├── applications/                  # Módulo de solicitudes
│   │   │   ├── applications.controller.ts
│   │   │   ├── applications.service.ts
│   │   │   ├── applications.module.ts
│   │   │   ├── dto/
│   │   │   │   └── create-application.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── credit-application.entity.ts
│   │   │   └── types/                     # ✅ Enums del dominio
│   │   │       ├── application-status.enum.ts
│   │   │       └── employment-type.enum.ts
│   │   │
│   │   ├── risk/                          # Módulo de comité de riesgo
│   │   │   ├── risk.controller.ts
│   │   │   ├── risk.service.ts
│   │   │   ├── risk.module.ts
│   │   │   └── dto/
│   │   │       ├── approve-application.dto.ts
│   │   │       └── reject-application.dto.ts
│   │   │
│   │   ├── credits/                       # Módulo de créditos
│   │   │   ├── credits.controller.ts
│   │   │   ├── credits.service.ts
│   │   │   ├── credits.module.ts
│   │   │   └── entities/
│   │   │       └── credit.entity.ts
│   │   │
│   │   ├── disbursements/                 # Módulo de desembolsos
│   │   │   ├── disbursements.controller.ts
│   │   │   ├── disbursements.service.ts
│   │   │   ├── disbursements.module.ts
│   │   │   ├── dto/
│   │   │   │   └── create-disbursement.dto.ts
│   │   │   └── entities/
│   │   │       └── disbursement.entity.ts
│   │   │
│   │   ├── payments/                      # Módulo de planes de pago
│   │   │   ├── payments.module.ts
│   │   │   └── entities/
│   │   │       └── payment-installment.entity.ts
│   │   │
│   │   ├── common/                        # Código compartido
│   │   │   ├── decorators/
│   │   │   │   ├── current-user.decorator.ts
│   │   │   │   └── roles.decorator.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── calculations/
│   │   │   │   └── installment.calculator.ts
│   │   │   ├── helpers/
│   │   │   │   └── credit-number.generator.ts
│   │   │   └── enums/                     # ✅ Solo enums compartidos
│   │   │       ├── payment-frequency.enum.ts
│   │   │       ├── bank.enum.ts
│   │   │       └── index.ts
│   │   │
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/
│   │   │   │   │   ├── auth.guard.ts
│   │   │   │   │   └── role.guard.ts      # ✅ Guard de roles
│   │   │   │   ├── interceptors/
│   │   │   │   │   └── auth.interceptor.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── auth.service.ts
│   │   │   │   └── models/
│   │   │   │       ├── interfaces.ts
│   │   │   │       └── enums.ts
│   │   │   ├── shared/
│   │   │   │   ├── components/
│   │   │   │   └── validators/
│   │   │   ├── auth/
│   │   │   │   └── login/
│   │   │   │       ├── login.component.ts
│   │   │   │       ├── login.component.html  # ✅ Template externo
│   │   │   │       └── login.component.css
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   └── dashboard.component.html  # ✅ Template externo
│   │   │   ├── applications/
│   │   │   │   ├── applications-list/
│   │   │   │   │   ├── applications-list.component.ts
│   │   │   │   │   └── applications-list.component.html
│   │   │   │   └── application-form/
│   │   │   │       ├── application-form.component.ts
│   │   │   │       └── application-form.component.html
│   │   │   ├── risk/
│   │   │   │   ├── risk-list/
│   │   │   │   │   ├── risk-list.component.ts
│   │   │   │   │   └── risk-list.component.html
│   │   │   │   └── risk-detail/
│   │   │   │       ├── risk-detail.component.ts
│   │   │   │       └── risk-detail.component.html
│   │   │   ├── disbursements/
│   │   │   │   ├── disbursements-list/
│   │   │   │   │   ├── disbursements-list.component.ts
│   │   │   │   │   └── disbursements-list.component.html
│   │   │   │   └── disbursement-form/
│   │   │   │       ├── disbursement-form.component.ts
│   │   │   │       └── disbursement-form.component.html
│   │   │   └── payments/
│   │   │       └── payments-search/
│   │   │           ├── payments-search.component.ts
│   │   │           └── payments-search.component.html
│   │   │
│   │   ├── app.component.ts
│   │   ├── app.component.html             # ✅ Template externo
│   │   ├── app.component.css              # ✅ Estilos externos
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   │
│   ├── package.json
│   ├── angular.json
│   ├── tsconfig.json
│   ├── proxy.conf.json
│   └── Dockerfile
│
├── data/
│   └── .gitkeep
│
├── docker-compose.yml
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 4.1 MÓDULOS DEL SISTEMA Y SUS RESPONSABILIDADES

### Backend - Módulos Implementados

**AuthModule**
- **Responsabilidad**: Autenticación y generación de tokens JWT
- **Endpoints**: `/api/auth/login`, `/api/auth/refresh`
- **Dependencias**: UsersModule
- **Archivos clave**: `auth.service.ts`, `jwt.strategy.ts`

**UsersModule**
- **Responsabilidad**: Gestión de usuarios y roles
- **Tipos propios**: `UserRole` enum en `/types`
- **Usado por**: AuthModule, ApplicationsModule
- **Archivos clave**: `users.service.ts`, `user.entity.ts`, `user-role.enum.ts`

**ApplicationsModule**
- **Responsabilidad**: Creación y gestión de solicitudes de crédito
- **Endpoints**: `/api/applications`
- **Tipos propios**: `ApplicationStatus`, `EmploymentType` en `/types`
- **Dependencias**: UsersModule
- **Archivos clave**: `applications.service.ts`, `credit-application.entity.ts`

**RiskModule**
- **Responsabilidad**: Aprobación/rechazo de solicitudes (Comité de Riesgo)
- **Endpoints**: `/api/risk/applications`, `/api/risk/applications/:id/approve`, `/api/risk/applications/:id/reject`
- **Dependencias**: ApplicationsModule, CreditsModule, PaymentsModule
- **Archivos clave**: `risk.service.ts`, `approve-application.dto.ts`

**CreditsModule**
- **Responsabilidad**: Gestión de créditos aprobados
- **Endpoints**: `/api/credits`, `/api/credits/search`
- **Dependencias**: ApplicationsModule
- **Archivos clave**: `credits.service.ts`, `credit.entity.ts`

**DisbursementsModule**
- **Responsabilidad**: Desembolso de créditos aprobados
- **Endpoints**: `/api/credits/:id/disbursement`
- **Dependencias**: CreditsModule
- **Archivos clave**: `disbursements.service.ts`, `disbursement.entity.ts`

**PaymentsModule**
- **Responsabilidad**: Generación y consulta de planes de pago
- **Endpoints**: `/api/credits/:id/payments`
- **Dependencias**: CreditsModule
- **Archivos clave**: `payment-installment.entity.ts`

### Frontend - Módulos Implementados

**AuthModule** (`/auth`)
- Login component con templates externos
- AuthService para gestión de sesión
- AuthGuard para protección de rutas
- RoleGuard para protección por roles

**DashboardModule** (`/dashboard`)
- Vista principal con estadísticas
- Componente con template externo

**ApplicationsModule** (`/applications`)
- Lista de solicitudes
- Formulario de creación
- Todos con templates externos

**RiskModule** (`/risk`)
- Lista de solicitudes pendientes
- Detalle para aprobar/rechazar
- Protegido para rol ANALYST

**DisbursementsModule** (`/disbursements`)
- Lista de créditos aprobados
- Formulario de desembolso
- Protegido para rol OPERATIONS_AGENT

**PaymentsModule** (`/payments`)
- Búsqueda de plan de pagos
- Protegido para rol OPERATIONS_AGENT

---

## 5. AUTENTICACIÓN

Crear:

```text
POST /api/auth/login
POST /api/auth/refresh
```

Login con:

- username
- password

Utilizar bcrypt.

Nunca almacenar contraseñas en texto plano.

Crear JWT Access Token firmado.

Crear Refresh Token firmado.

El login debe devolver:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": 1,
    "username": "analyst",
    "role": "ANALYST"
  }
}
```

Usuario demo:

```text
username:
analyst

password:
Analyst123!
```

Crear automáticamente el usuario si no existe.

No crear usuarios duplicados en cada arranque.

No retornar `passwordHash`.

---

## 6. TOKENS

Variables:

```text
JWT_SECRET
JWT_REFRESH_SECRET
ACCESS_TOKEN_EXPIRES
REFRESH_TOKEN_EXPIRES
```

Valores iniciales sugeridos:

```text
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
```

El sistema debe soportar Refresh Token.

Al recibir 401 debido a access token expirado:

1. Intentar refresh.
2. Obtener nuevo access token.
3. Reintentar la petición original.
4. Si refresh falla: cerrar sesión.

Evitar ciclos infinitos de refresh.

---

## 7. CONFIGURACIÓN .ENV

Crear:

```text
backend/.env.example
```

Contenido:

```env
PORT=3000
DB_PATH=/app/data/credit.sqlite
JWT_SECRET=change-this-secret
JWT_REFRESH_SECRET=change-this-refresh-secret
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
```

No incluir un `.env` real en Git.

---

## 8. BASE DE DATOS

Usar SQLite.

La base debe ubicarse en:

```text
/app/data/credit.sqlite
```

Docker debe mapear:

```text
./data:/app/data
```

TypeORM:

```text
type: "sqlite"
```

database:

```text
process.env.DB_PATH
```

Usar `autoLoadEntities`.

Para entorno de prueba técnica puede utilizarse `synchronize=true`.

Documentar esta decisión en README.

---

## 9. MODELO DE DATOS

Crear entidades:

- User
- CreditApplication
- Credit
- PaymentInstallment
- Disbursement

Relaciones:

```text
User
1:N
CreditApplication

CreditApplication
1:0..1
Credit

Credit
1:N
PaymentInstallment

Credit
1:0..1
Disbursement
```

---

## 10. USER

Campos:

- id
- username
- passwordHash
- role
- createdAt
- updatedAt

Roles (Implementados):

```text
CREDIT_ADVISOR    # Asesor de Crédito - Gestiona solicitudes
ANALYST           # Analista - Comité de Riesgo
OPERATIONS_AGENT  # Agente de Operaciones - Desembolsos y Pagos
```

**Usuarios por defecto:**

```text
username: asesor
password: Asesor123!
role: CREDIT_ADVISOR

username: analista
password: Analista123!
role: ANALYST

username: agente
password: Agente123!
role: OPERATIONS_AGENT
```

**Permisos por rol:**

- **CREDIT_ADVISOR**: Acceso a `/applications` (crear y ver solicitudes)
- **ANALYST**: Acceso a `/risk` (comité de riesgo, aprobar/rechazar)
- **OPERATIONS_AGENT**: Acceso a `/disbursements` y `/payments` (desembolsos y plan de pagos)
- **Todos**: Acceso a `/dashboard`

---

## 11. CREDIT APPLICATION

Campos:

- id
- fullName
- identification
- email
- phone
- birthDate
- employmentType
- workplace
- employmentYears
- monthlyIncome
- requestedAmount
- installments
- annualInterestRate
- paymentFrequency
- installmentAmount
- status
- observations
- rejectedAt
- createdAt
- updatedAt

**IMPORTANTE:**

Los campos nullable de tipo fecha deben declarar explícitamente el tipo SQLite.

Ejemplo:

```typescript
@Column({
  type: 'datetime',
  nullable: true
})
rejectedAt!: Date | null;
```

No permitir que TypeORM interprete `Date | null` como `Object`.

---

## 12. ESTADOS

Crear enum:

```text
PENDING = "PENDIENTE"
APPROVED = "APROBADA"
REJECTED = "RECHAZADA"
DISBURSED = "DESEMBOLSADA"
```

El estado principal del ciclo de negocio debe estar en:

```text
CreditApplication.status
```

Además, para reflejar literalmente el criterio ACID de la prueba técnica, la entidad `Credit` debe tener también:

```text
status
```

con:

```text
APPROVED
DISBURSED
```

La relación de estados debe ser coherente entre `CreditApplication` y `Credit`.

---

## 13. MATRIZ DE TRANSICIONES

La matriz de estados debe ser:

```text
PENDING -> APPROVED      permitido
PENDING -> REJECTED      permitido
APPROVED -> DISBURSED    permitido
```

Todo otro cambio:

```text
NO PERMITIDO
```

Ejemplos:

```text
APPROVED -> REJECTED       NO
REJECTED -> APPROVED       NO
APPROVED -> APPROVED       NO
PENDING -> DISBURSED       NO
REJECTED -> DISBURSED      NO
DISBURSED -> DISBURSED     NO
```

Los intentos inválidos deben responder HTTP 409.

El backend debe ser la autoridad para estas transiciones.

---

## 14. REGLAS DE NEGOCIO IMPORTANTES

NO inventar reglas de negocio adicionales.

NO agregar:

- scoring de crédito
- buró de crédito
- capacidad de endeudamiento
- límite de salario
- límite de monto no especificado
- límite de solicitudes por cédula
- bloqueo por solicitudes anteriores
- validaciones bancarias no indicadas
- edad mínima no indicada

SOLO implementar las reglas de esta especificación.

---

## 15. CAPTURA DE SOLICITUD

Endpoints:

```text
POST /api/applications
GET /api/applications
GET /api/applications/:id
```

Formulario con:

### INFORMACIÓN PERSONAL

- Nombre Completo
- Cédula / Identificación
- Correo Electrónico
- Teléfono
- Fecha de nacimiento

### INFORMACIÓN LABORAL

- Tipo de Empleo
  - ASALARIADO
  - INDEPENDIENTE
- Empresa / Lugar de Trabajo
- Antigüedad Laboral en años
- Ingreso Mensual

### CONDICIONES DEL CRÉDITO

- Monto Solicitado
- Cantidad de cuotas
- Tasa de Interés Anual (%)
- Periodicidad:
  - QUINCENAL
  - MENSUAL
  - ANUAL

Al crear la solicitud:

```text
status = PENDING
```

---

## 16. NO RESTRINGIR CÉDULA DUPLICADA

NO crear una regla que impida registrar otra solicitud pendiente con la misma identificación.

La prueba no exige esa restricción.

No devolver 409 simplemente porque ya exista una solicitud anterior para la misma cédula.

---

## 17. VALIDACIÓN DE EDAD

No permitir solicitudes de clientes mayores de 80 años.

Debe validarse en:

- Angular
- NestJS

El backend es la autoridad definitiva.

Calcular edad teniendo en cuenta:

- día
- mes
- año

Si:

```text
edad > 80
```

responder HTTP 400 con un mensaje claro.

A los 80 años sí debe permitirse la solicitud.

---

## 18. CÁLCULO DE CUOTA

Periodicidad:

```text
ANUAL = 1
MENSUAL = 12
QUINCENAL = 24
```

Tasa periódica:

```text
i = (Tasa Anual / 100) / n
```

Cuota:

```text
Cuota =
Monto *
[
  i * (1 + i)^Cuotas
]
/
[
  (1 + i)^Cuotas - 1
]
```

Caso especial:

Si `Tasa Anual = 0`:

```text
Cuota = Monto / Cuotas
```

Crear función reutilizable:

```text
calculateInstallment()
```

Debe existir tanto en:

- backend
- frontend

El frontend muestra el cálculo en tiempo real.

El backend recalcula el valor antes de persistir.

Nunca confiar exclusivamente en el valor enviado desde Angular.

---

## 19. PLAZO

El formulario NO necesita un campo separado de plazo.

El plazo debe derivarse de:

```text
cantidad de cuotas + periodicidad
```

Ejemplos:

```text
12 cuotas MENSUALES = 12 meses

24 cuotas QUINCENALES = 12 meses

5 cuotas ANUALES = 5 años
```

El sistema debe mostrar un texto de plazo calculado consistentemente.

No inventar un segundo campo de plazo que pueda quedar desincronizado.

---

## 20. FORMULARIO ANGULAR

Usar Reactive Forms.

Validar:

- required
- email
- min
- minLength
- enum
- fecha válida

Calcular edad al cambiar `birthDate`.

Calcular cuota al cambiar:

- requestedAmount
- installments
- annualInterestRate
- paymentFrequency

Mostrar la cuota inmediatamente.

Botón:

```text
Crear solicitud
```

Mientras procesa:

```text
Guardando...
```

Al terminar correctamente:

```text
Crear solicitud
```

Si ocurre error:

```text
Crear solicitud
```

Implementar `finalize()` o equivalente.

Evitar doble submit.

---

## 20.1 TEMPLATES EXTERNOS EN ANGULAR (IMPLEMENTADO)

**IMPORTANTE:** Todos los componentes Angular deben usar templates externos en archivos `.html` separados.

**NO USAR:**
```typescript
@Component({
  selector: 'app-example',
  template: `<div>...</div>`  // ❌ NO usar inline templates
})
```

**USAR:**
```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'  // ✅ Usar templates externos
})
```

**Estructura de archivos:**
```text
component/
├── component.component.ts      # Lógica del componente
├── component.component.html    # Template HTML
└── component.component.css     # Estilos (opcional)
```

**Beneficios:**
- Mejor organización del código
- Facilita el mantenimiento
- Separación de responsabilidades
- Mejor soporte de IDEs y herramientas
- Más fácil de leer y modificar

**Componentes que deben tener templates externos:**
- LoginComponent
- DashboardComponent
- ApplicationsListComponent
- ApplicationFormComponent
- RiskListComponent
- RiskDetailComponent
- DisbursementsListComponent
- DisbursementFormComponent
- PaymentsSearchComponent
- AppComponent

---

## 21. CONFIRMACIÓN DE GUARDADO

Después de guardar una solicitud correctamente:

Mostrar inmediatamente:

```text
Solicitud guardada correctamente.
```

Y:

```text
Solicitud #ID creada correctamente. Estado: PENDIENTE.
```

Luego:

- limpiar formulario
- refrescar lista
- mostrar el nuevo registro

Crear sección:

```text
Solicitudes registradas
```

Mostrar:

- ID
- Identificación
- Nombre
- Monto
- Estado
- Fecha

NO depender solamente del cambio de color del botón para indicar éxito.

La lista debe ser obtenida nuevamente desde backend.

---

## 22. COMITÉ DE RIESGO

Endpoints:

```text
GET /api/risk/applications
POST /api/risk/applications/:id/approve
POST /api/risk/applications/:id/reject
```

La vista inicial muestra solicitudes:

```text
status = PENDING
```

La lista debe cargarse automáticamente al entrar.

Después de aprobar o rechazar:

```text
recargar automáticamente
```

NO colocar un botón genérico "Actualizar" como parte del flujo principal.

---

## 23. INFORMACIÓN DEL COMITÉ

La pantalla de detalle del Comité debe mostrar **ÚNICAMENTE**:

- Cédula / Identificación
- Nombre Completo
- Edad
- Cantidad de cuotas
- Periodicidad de Pago
- Plazo
- Monto solicitado

NO mostrar en el detalle:

- Email
- Teléfono
- Empresa
- Antigüedad laboral
- Ingreso mensual
- Tasa
- IDs técnicos
- Password
- timestamps
- información interna

Todos los datos son readonly.

La pantalla debe permitir únicamente:

- Revisar
- Aprobar
- Rechazar
- Volver

---

## 24. OBSERVACIONES DE APROBACIÓN

Agregar obligatoriamente:

```text
Observaciones
```

Para aprobar:

- obligatorio
- no null
- no vacío
- no aceptar solo espacios

Si no existe:

```text
HTTP 400
```

NO modificar estado.

NO crear crédito.

NO crear cuotas.

---

## 25. APROBAR SOLICITUD

Endpoint:

```text
POST /api/risk/applications/:id/approve
```

Body:

```json
{
  "observations": "Cliente cumple condiciones para aprobación."
}
```

Solo permitir si:

```text
status = PENDING
```

---

## 26. TRANSACCIÓN DE APROBACIÓN — ACID OBLIGATORIO

ESTE ES UNO DE LOS REQUISITOS MÁS IMPORTANTES.

La aprobación debe ejecutarse dentro de UNA ÚNICA TRANSACCIÓN ACID.

Orden:

```text
BEGIN TRANSACTION

1. Buscar solicitud.
2. Verificar existencia.
3. Verificar status = PENDING.
4. Validar observations.
5. Cambiar CreditApplication.status = APPROVED.
6. Guardar observations.
7. Crear Credit con status = APPROVED.
8. Generar creditNumber.
9. Calcular cuota.
10. Crear exactamente N PaymentInstallments.

COMMIT
```

Si falla cualquier operación:

```text
ROLLBACK
```

Nunca dejar:

```text
APPROVED sin Credit

Credit sin cuotas

plan de pagos incompleto
```

El uso de TypeORM debe ser equivalente a:

```typescript
dataSource.transaction(async (manager) => {
  // todas las operaciones con el mismo manager
});
```

No abrir transacciones parciales.

No guardar parte del proceso fuera de la transacción.

---

## 27. REGLA ACID PARA EL ESTADO DEL CRÉDITO

La operación de aprobación debe actualizar dentro de la misma transacción:

```text
CreditApplication.status = APPROVED

Credit.status = APPROVED

PaymentInstallment[]
```

Por tanto:

```text
estado de solicitud
+
estado de crédito
+
creación de cuotas
```

deben ser atómicos.

Si uno falla:

```text
ROLLBACK TODO
```

---

## 28. CRÉDITO

Entidad:

```text
Credit
```

Campos:

- id
- creditNumber
- applicationId
- amount
- annualInterestRate
- installments
- paymentFrequency
- installmentAmount
- status
- createdAt
- updatedAt

Número:

```text
CR-000001
CR-000002
CR-000003
```

o equivalente incremental.

Debe relacionarse con `CreditApplication`.

No crear crédito en solicitudes rechazadas.

No crear crédito en solicitudes pendientes.

No crear dos créditos para una misma aprobación.

---

## 29. RECHAZAR SOLICITUD

Endpoint:

```text
POST /api/risk/applications/:id/reject
```

Solo si:

```text
status = PENDING
```

Cambiar:

```text
PENDING -> REJECTED
```

Registrar `rejectedAt`.

NO crear:

- Credit
- PaymentInstallments
- Disbursement

Las observaciones de rechazo pueden ser opcionales porque el requisito solo obliga observaciones al aprobar.

---

## 30. PLAN DE PAGOS

Al aprobar y crear `Credit`:

crear exactamente:

```text
installments
```

registros `PaymentInstallment`.

Campos:

- id
- creditId
- installmentNumber
- dueDate
- installmentAmount
- interest
- principal
- balance

El plan debe amortizar completamente el crédito.

La última cuota debe dejar:

```text
balance = 0.00
```

Controlar redondeos a 2 decimales.

Ajustar la última cuota si es necesario para eliminar diferencias de redondeo.

---

## 31. FECHAS DEL PLAN

Periodicidad:

```text
QUINCENAL
cada 14 días

MENSUAL
cada 1 mes

ANUAL
cada 1 año
```

La primera cuota debe tener fecha de vencimiento basada en la periodicidad.

---

## 32. DESEMBOLSO

Endpoint:

```text
POST /api/credits/:id/disbursement
```

Solo permitir créditos con:

```text
Credit.status = APPROVED
CreditApplication.status = APPROVED
```

Nunca permitir desembolso:

```text
PENDING
REJECTED
DISBURSED
```

Si no está aprobado:

```text
HTTP 409
```

---

## 33. PANTALLA DE DESEMBOLSO

La pantalla principal debe mostrar únicamente créditos:

```text
APPROVED
```

No mostrar créditos pendientes ni rechazados.

Mostrar:

- Número de crédito
- Cédula
- Nombre
- Monto
- Tasa
- Periodicidad
- Plazo
- Acción

Acción:

```text
Desembolsar
```

NO utilizar un botón genérico "Actualizar" como parte de la operación.

La lista debe cargarse automáticamente al entrar.

Después de desembolsar:

```text
recargar automáticamente
```

El crédito desembolsado debe desaparecer de la lista disponible para desembolso.

---

## 34. DETALLE DE DESEMBOLSO

Mostrar únicamente:

- Cédula
- Nombre Completo
- Monto
- Tasa
- Periodicidad
- Plazo

Luego:

```text
Banco Destino
```

Valores:

- LAFISE
- FICOHSA
- BAC CREDOMATIC
- BANPRO

Y:

```text
Número de Cuenta
```

Botones:

```text
Procesar desembolso
Volver
```

---

## 35. TRANSACCIÓN DE DESEMBOLSO

Ejecutar de forma transaccional:

```text
BEGIN

1. Buscar Credit.
2. Buscar CreditApplication relacionada.
3. Verificar Credit.status = APPROVED.
4. Verificar CreditApplication.status = APPROVED.
5. Verificar que no exista Disbursement.
6. Validar banco.
7. Validar cuenta.
8. Crear Disbursement.
9. Cambiar Credit.status = DISBURSED.
10. Cambiar CreditApplication.status = DISBURSED.

COMMIT
```

Si falla:

```text
ROLLBACK
```

Impedir doble desembolso.

---

## 36. BANCOS

Valores permitidos exactamente:

```text
LAFISE
FICOHSA
BAC CREDOMATIC
BANPRO
```

No permitir otros valores.

---

## 37. BÚSQUEDA DE PLAN DE PAGOS

Crear pantalla:

```text
Plan de pagos
```

Campo:

```text
Cédula / Identificación
```

Botón:

```text
Buscar
```

Endpoint:

```text
GET /api/credits/search?identification=...
```

Después obtener crédito:

```text
GET /api/credits/:id/payments
```

Mostrar:

- Número de crédito
- Cliente
- Monto
- Tasa
- Periodicidad
- Cuotas
- Estado

Tabla:

- #
- Vencimiento
- Cuota
- Interés
- Capital
- Saldo

---

## 38. COMPORTAMIENTO SI NO EXISTE CRÉDITO

Si el usuario busca una identificación cuyo crédito todavía no existe:

Mostrar inmediatamente:

```text
Crédito no encontrado.
```

Y:

```text
La solicitud debe ser aprobada antes de consultar su plan de pagos.
```

No mostrar solamente un error técnico.

El HTTP 404 del backend puede mantenerse porque el recurso no existe.

El frontend debe traducirlo a un mensaje entendible.

---

## 39. PLAN DE PAGOS Y ACTUALIZACIÓN ANGULAR

IMPORTANTE:

La interfaz debe actualizarse inmediatamente después de que la API responda.

No depender de:

- click fuera del input
- blur
- teclado
- eventos posteriores
- cambio de foco

Al finalizar HTTP:

```text
result
```

debe aparecer inmediatamente.

Y:

```text
schedule
```

debe aparecer inmediatamente.

Si se usa `ChangeDetectionStrategy.OnPush` o Angular zoneless:

utilizar señales o:

```typescript
ChangeDetectorRef.markForCheck()
```

cuando sea necesario.

Preferir patrones modernos de Angular que garanticen actualización inmediata de UI.

---

## 40. ENTER EN BÚSQUEDA

El campo de búsqueda de plan de pagos debe permitir:

- clic en Buscar
- ENTER

Usar:

```html
<form (ngSubmit)="search()">
```

El botón debe tener:

```html
type="submit"
```

---

## 41. HTTP INTERCEPTOR ANGULAR

Crear HTTP interceptor.

Para llamadas protegidas agregar:

```text
Authorization: Bearer <accessToken>
```

El usuario NO debe copiar manualmente tokens.

El interceptor debe intentar refresh cuando corresponda.

No enviar access token innecesariamente a:

```text
/api/auth/login
/api/auth/refresh
```

---

## 42. AUTH GUARD Y ROLE GUARD

Crear guard de autenticación.

Proteger:

```text
/dashboard
/applications
/applications/new
/risk
/disbursements
/payments
```

Permitir:

```text
/login
```

Después de login navegar a:

```text
/dashboard
```

**IMPORTANTE - ROLE GUARD (Implementado):**

Además del `authGuard`, implementar un `roleGuard` para proteger rutas por rol:

```typescript
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  // Verifica si el usuario tiene uno de los roles permitidos
  // Si no tiene permiso, redirige al dashboard
}
```

**Protección de rutas por rol:**

```typescript
{
  path: 'applications',
  canActivate: [authGuard, roleGuard([UserRole.CREDIT_ADVISOR])]
}
{
  path: 'risk',
  canActivate: [authGuard, roleGuard([UserRole.ANALYST])]
}
{
  path: 'disbursements',
  canActivate: [authGuard, roleGuard([UserRole.OPERATIONS_AGENT])]
}
{
  path: 'payments',
  canActivate: [authGuard, roleGuard([UserRole.OPERATIONS_AGENT])]
}
```

**Comportamiento:**
- Si un usuario intenta acceder a una ruta sin el rol adecuado (incluso por URL directa)
- El `roleGuard` lo redirige automáticamente al `/dashboard`
- Esto previene acceso no autorizado mediante navegación directa por URL

---

## 43. PROXY ANGULAR

Crear:

```text
frontend/proxy.conf.json
```

Contenido:

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

Configurar Angular para utilizarlo.

Los servicios Angular deben llamar:

```text
/api/...
```

NO utilizar:

```text
http://localhost:3000
```

hardcodeado dentro de cada servicio.

---

## 44. API SERVICE ANGULAR

Crear un servicio centralizado:

```text
ApiService
```

Métodos:

- login()
- refresh()
- listApplications()
- getApplication()
- createApplication()
- riskApplications()
- approveApplication()
- rejectApplication()
- approvedCredits()
- searchCredit()
- getPayments()
- disburse()

No duplicar llamadas HttpClient por todos los componentes.

---

## 45. MANEJO DE ERRORES ANGULAR

Crear manejo consistente.

```text
404:
recurso no encontrado

401:
sesión/token

409:
conflicto de reglas de negocio

400:
validación

500:
error inesperado
```

Mostrar mensajes útiles.

---

## 46. UI / UX

La aplicación debe verse profesional y financiera.

Crear navegación.

Mostrar estados con badges.

Mostrar loaders.

Mostrar mensajes de éxito.

Mostrar mensajes de error.

Desactivar botones durante operaciones.

Evitar doble submit.

No utilizar "Actualizar" indiscriminadamente en cada pantalla.

Las listas deben cargarse automáticamente.

Después de una acción exitosa:

```text
actualizar automáticamente
```

---

## 47. DASHBOARD

Crear dashboard sencillo con:

- Total solicitudes
- Pendientes
- Aprobadas
- Rechazadas
- Desembolsadas

Puede utilizar cards.

No es obligatorio para la lógica, pero mejora presentación.

---

## 48. DOCKER BACKEND

Crear Dockerfile.

El backend debe escuchar en:

```text
0.0.0.0:3000
```

SQLite:

```text
/app/data/credit.sqlite
```

---

## 49. DOCKER FRONTEND

Crear Dockerfile multistage:

1. build Angular
2. servir con Nginx

Frontend en:

```text
http://localhost:4200
```

Configurar correctamente el acceso a la API en ambiente Docker.

**IMPORTANTE:**

La solución debe considerar que dentro del contenedor `localhost` no representa al backend.

No hacer que Nginx intente llamar al backend usando localhost del navegador.

Configurar el proxy/reverse proxy de Nginx o una estrategia equivalente correctamente.

---

## 50. DOCKER COMPOSE

Crear en raíz:

```text
docker-compose.yml
```

Debe levantar como mínimo:

- backend
- frontend

SQLite debe persistirse:

```yaml
volumes:
  - ./data:/app/data
```

Comando:

```bash
docker compose up --build
```

Debe levantar la solución completa.

Documentar:

```bash
docker compose down
docker compose up --build
```

---

## 51. ROOT PACKAGE.JSON

Crear `package.json` en raíz con:

- install:all
- backend
- frontend
- build:all

Preferiblemente permitir ejecución individual.

Opcionalmente utilizar `concurrently`.

---

## 52. README

Crear README profesional.

Debe documentar:

- Descripción
- Arquitectura
- Stack
- Estructura
- Instalación
- Node requerido
- Ejecución local
- Ejecución Docker
- Variables de entorno
- Credenciales
- Endpoints
- Estados
- Reglas de transición
- Cálculo de cuota
- Plan de pagos
- Transacciones
- Seguridad
- Refresh Token
- Decisiones de arquitectura
- Pruebas
- Bitácora de IA

---

## 53. BITÁCORA DE IA

El README debe incluir:

Herramientas:

- ChatGPT
- GitHub Copilot
- Claude si se utilizó

Para cada una documentar:

- Objetivo
- Prompt/resumen
- Resultado
- Validación humana
- Correcciones realizadas

No afirmar que la IA validó cosas que no fueron realmente probadas.

---

## 54. TESTS BACKEND

Crear tests unitarios y/o e2e.

Como mínimo:

1. Login válido.
2. Login inválido.
3. Refresh token.
4. Edad > 80.
5. Edad = 80.
6. Cuota con tasa > 0.
7. Cuota con tasa = 0.
8. Crear solicitud.
9. Crear solicitud en PENDING.
10. Aprobar solicitud.
11. Observaciones obligatorias.
12. No aprobar solicitud ya aprobada.
13. Rechazar solicitud.
14. No desembolsar PENDING.
15. No desembolsar REJECTED.
16. Desembolsar APPROVED.
17. No desembolsar dos veces.
18. Crear crédito al aprobar.
19. Crear exactamente N cuotas.
20. Saldo final = 0.
21. Rollback de aprobación si falla generación de cuotas.
22. Credit.status se actualiza correctamente.
23. Rollback si falla alguna operación de desembolso.

---

## 55. REGLAS DE INTEGRIDAD

El backend siempre debe impedir:

```text
PENDING -> DISBURSED

REJECTED -> DISBURSED

APPROVED -> APPROVED

DISBURSED -> DISBURSED
```

No confiar en el frontend para estas reglas.

---

## 56. CASOS NEGATIVOS OBLIGATORIOS

Probar:

```text
Cliente 81 años
→ rechazar

Cliente 80 años
→ permitir

Aprobar sin observaciones
→ rechazar

Desembolsar PENDING
→ rechazar

Desembolsar REJECTED
→ rechazar

Desembolsar APPROVED
→ permitir

Desembolsar dos veces
→ rechazar

Reaprobar
→ rechazar

Rechazar una aprobada
→ rechazar
```

---

## 57. CASO DE USO COMPLETO

El proyecto debe permitir ejecutar este flujo completo:

1. Login.
2. Crear solicitud.
3. Ver cuota calculada.
4. Guardar.
5. Mostrar confirmación.
6. Ver solicitud PENDING.
7. Entrar a Comité.
8. Revisar solicitud.
9. Ver solo datos permitidos.
10. Escribir Observaciones.
11. Aprobar.
12. Crear Credit automáticamente.
13. Generar N cuotas automáticamente.
14. Aparecer en Desembolso.
15. Seleccionar banco.
16. Introducir cuenta.
17. Procesar desembolso.
18. Estado pasa a DESEMBOLSADA.
19. Buscar por identificación.
20. Cargar plan de pagos inmediatamente.

---

## 58. CASO DE USO DE RECHAZO

1. Crear solicitud.
2. Entrar a Comité.
3. Revisar.
4. Rechazar.
5. Estado = RECHAZADA.
6. No crear Credit.
7. No crear cuotas.
8. No aparecer en Desembolso.

---

## 59. COMPORTAMIENTO DE LISTAS

### Comité

Mostrar:

```text
PENDING
```

### Desembolso

Mostrar:

```text
APPROVED
```

### Plan de pagos

Buscar:

```text
Credit existente
```

No usar botones de "Actualizar" como requisito funcional.

Cargar listas automáticamente al abrir cada pantalla.

Después de operaciones:

```text
recargar automáticamente
```

---

## 60. CALIDAD DE CÓDIGO Y CLEAN CODE

**IMPORTANTE:** El código debe seguir principios de Clean Code, usar abstracciones adecuadas, patrones de diseño y modularidad.

### Principios de Clean Code

**Nombres Significativos:**
- Variables, funciones y clases con nombres descriptivos
- Evitar abreviaciones confusas
- Usar nombres que revelen intención

**Funciones:**
- Funciones pequeñas que hacen una sola cosa
- Máximo 20-30 líneas por función
- Parámetros mínimos (idealmente 0-3)
- Sin efectos secundarios ocultos

**Comentarios:**
- El código debe ser autoexplicativo
- Comentarios solo cuando sea absolutamente necesario
- Evitar comentarios obsoletos

**Formato:**
- Indentación consistente
- Espaciado coherente
- Agrupación lógica de código relacionado

### Abstracciones y Modularidad

**Backend:**
- ✅ **Servicios Reutilizables**: Extraer lógica común (calculations, helpers)
- ✅ **DTOs Validados**: Usar class-validator para validación
- ✅ **Interfaces y Contratos**: Definir contratos claros entre capas
- ✅ **Separación de Capas**: Controller → Service → Repository
- ✅ **DRY (Don't Repeat Yourself)**: Eliminar duplicación de código
- ✅ **Single Responsibility**: Cada clase/función una responsabilidad

**Frontend:**
- ✅ **Servicios Especializados**: Un servicio por dominio
- ✅ **Componentes Reutilizables**: Extraer componentes comunes
- ✅ **Pipes Personalizados**: Para transformaciones comunes
- ✅ **Validators Reutilizables**: Validadores custom compartidos
- ✅ **Interfaces Tipadas**: Tipar todas las estructuras de datos
- ✅ **DRY**: Evitar duplicación en templates y lógica

### Patrones de Diseño Aplicados

1. **Repository Pattern**: Acceso a datos centralizado
2. **Service Layer Pattern**: Lógica de negocio en servicios
3. **DTO Pattern**: Validación y transferencia de datos
4. **Factory Pattern**: Creación de objetos complejos (credit number, etc.)
5. **Strategy Pattern**: JWT Strategy para autenticación
6. **Guard Pattern**: Protección de rutas
7. **Interceptor Pattern**: Manejo de tokens y errores
8. **Observer Pattern**: RxJS Observables en Angular

### Evitar (Anti-Patrones)

**Backend:**
- ❌ `any` excesivo - tipar correctamente
- ❌ Lógica duplicada - extraer a servicios/helpers
- ❌ Hardcode de URLs - usar variables de entorno
- ❌ Hardcode de secretos - usar .env
- ❌ SQL manual innecesario - usar TypeORM
- ❌ Strings de estados dispersos - usar enums
- ❌ Lógica de negocio en Controllers
- ❌ Funciones largas (>50 líneas)
- ❌ Clases God (con muchas responsabilidades)

**Frontend:**
- ❌ Lógica crítica en componentes - mover a servicios
- ❌ Múltiples llamadas HTTP repetidas - cachear
- ❌ Callbacks anidados - usar RxJS operators
- ❌ Inline templates - usar templates externos
- ❌ Magic numbers - usar constantes
- ❌ Componentes gigantes - dividir en componentes más pequeños
- ❌ Suscripciones sin unsubscribe - usar async pipe

### Preferir (Buenas Prácticas)

**General:**
- ✅ Enums para valores constantes
- ✅ Tipos e interfaces para estructuras
- ✅ DTOs para transferencia de datos
- ✅ Services para lógica de negocio
- ✅ Funciones reutilizables y puras
- ✅ Constantes para valores mágicos
- ✅ Manejo centralizado de errores
- ✅ Logging apropiado

**Backend:**
- ✅ Transacciones ACID para operaciones críticas
- ✅ Validación con class-validator
- ✅ Excepciones tipadas de NestJS
- ✅ Inyección de dependencias

**Frontend:**
- ✅ Observables y RxJS operators (`switchMap`, `map`, `catchError`)
- ✅ `finalize` para cleanup
- ✅ Async pipe para suscripciones automáticas
- ✅ Reactive Forms con validadores
- ✅ Guards e Interceptors centralizados

---

## 61. TYPEORM + SQLITE

Para fechas nullable:

```typescript
@Column({
  type: 'datetime',
  nullable: true
})
```

Para:

```text
IS NULL
```

utilizar:

```typescript
IsNull()
```

Ejemplo:

```typescript
where: {
  disbursedAt: IsNull()
}
```

No utilizar directamente:

```typescript
where: {
  disbursedAt: null
}
```

si TypeORM produce incompatibilidad de tipos.

---

## 62. PRESENTACIÓN DE LA INFORMACIÓN

### Comité

SOLO:

- Cédula
- Nombre
- Edad
- Cuotas
- Periodicidad
- Plazo
- Monto

### Desembolso

SOLO:

- Cédula
- Nombre
- Monto
- Tasa
- Periodicidad
- Plazo

### Solicitud

Todos los datos solicitados.

### Plan de pagos

Datos del crédito + tabla de amortización.

---

## 63. CONSIDERACIONES SOBRE EL TOKEN

El usuario nunca debe tener que:

- copiar JWT
- pegar JWT
- escribir Bearer manualmente

Angular debe manejarlo.

El interceptor debe agregar automáticamente:

```text
Authorization: Bearer TOKEN
```

Si expira:

```text
refresh automático
```

---

## 64. VALIDACIÓN FINAL

Antes de considerar terminado el proyecto:

### Backend

```bash
npm install
npm run build
npm run test
```

### Frontend

```bash
npm install
npm run build
```

### Docker

```bash
docker compose build
docker compose up
```

Verificar:

- Login
- Solicitud
- Comité
- Aprobación
- Crédito
- Cuotas
- Desembolso
- Plan de pagos

---

## 65. NO AFIRMAR VALIDACIONES NO REALIZADAS

Si Docker o alguna herramienta no puede ejecutarse en el entorno:

decirlo explícitamente.

NO afirmar:

```text
"Todo fue probado"
```

si no fue realmente ejecutado.

---

## 66. ENTREGA

Entregar:

- proyecto completo
- código completo
- package.json
- Dockerfiles
- docker-compose.yml
- README
- .env.example
- tests
- estructura modular

Si la plataforma permite crear archivos:

crear físicamente el proyecto.

Crear también:

```text
credit-simulator.zip
```

---

## 67. CRITERIO DE TERMINADO

El proyecto solo se considera terminado si:

1. Compila.
2. Backend arranca.
3. Frontend arranca.
4. SQLite funciona.
5. Login funciona.
6. JWT funciona.
7. Refresh Token funciona.
8. Crear solicitud funciona.
9. Validación >80 funciona.
10. Cuota funciona.
11. Comité funciona.
12. Aprobar funciona.
13. Rechazar funciona.
14. Credit se crea automáticamente.
15. Credit.status se crea en APPROVED.
16. Cuotas se crean automáticamente.
17. Transacción de aprobación funciona.
18. Desembolso funciona.
19. Credit.status cambia a DISBURSED.
20. No permite desembolso inválido.
21. Plan de pagos funciona.
22. Búsqueda actualiza la UI inmediatamente.
23. ENTER ejecuta la búsqueda.
24. El botón de guardar no queda bloqueado.
25. La interfaz confirma guardado.
26. Docker levanta frontend + backend + SQLite.
27. README documenta todo.

---

## 68. REGLA FINAL

No simplifiques la lógica.

No elimines requisitos.

No inventes reglas adicionales.

No cambies SQLite.

No cambies NestJS.

No cambies Angular.

No entregues pseudocódigo.

No uses placeholders del tipo:

```text
// implementar aquí
// etc.
...
```

para ocultar código.

Genera una solución coherente, compilable y lista para ejecutar.

Antes de finalizar, realiza una revisión contra toda esta especificación y corrige cualquier inconsistencia.

---

## 69. MATRIZ DE EVALUACIÓN OBLIGATORIA

La solución debe cumplir explícitamente con los cuatro puntos de evaluación de la prueba técnica.

### 69.1 Integridad del negocio y reglas de estado

Debe demostrarse que:

- una solicitud PENDING no puede desembolsarse;
- una solicitud REJECTED no puede desembolsarse;
- solo una solicitud APPROVED puede desembolsarse;
- una solicitud DISBURSED no puede volver a desembolsarse;
- estas reglas son validadas en backend.

### 69.2 Transaccionalidad ACID

Debe demostrarse que:

```text
Aprobación
+
cambio de estado
+
creación de Credit
+
creación de N cuotas
```

son una única operación transaccional.

Si una parte falla:

```text
ROLLBACK
```

Asimismo, el desembolso debe ser transaccional:

```text
crear Disbursement
+
Credit.status = DISBURSED
+
CreditApplication.status = DISBURSED
```

Si una parte falla:

```text
ROLLBACK
```

### 69.3 Calidad y limpieza

Debe demostrarse:

- modularidad;
- separación de responsabilidades;
- servicios;
- DTOs;
- guards;
- interceptors;
- enums;
- funciones reutilizables;
- ausencia de duplicación innecesaria.

Cuando sea apropiado y sin forzar patrones innecesarios, utilizar:

- Service Layer
- Repository Pattern
- DTO Pattern
- Guard Pattern
- Interceptor Pattern

### 69.4 Dockerización

Debe existir:

```text
docker-compose.yml
backend/Dockerfile
frontend/Dockerfile
```

y debe ser posible levantar la solución con:

```bash
docker compose up --build
```

El backend debe utilizar SQLite persistido mediante:

```text
./data:/app/data
```

La solución debe levantar:

```text
frontend
backend
SQLite
```

sin pasos manuales adicionales para crear la base de datos.

---

## 70. REVISIÓN FINAL CONTRA EL ENUNCIADO

Antes de entregar el proyecto, verificar uno por uno:

### Stack

- SQLite
- NestJS
- Angular
- Dockerfile
- docker-compose.yml

### Login

- usuario
- contraseña
- JWT
- Refresh Token

### Solicitud

- datos personales
- datos laborales
- condiciones del crédito
- cuota nivelada en frontend
- validación de edad >80

### Comité

- readonly
- únicamente campos solicitados
- observaciones obligatorias al aprobar
- aprobar
- rechazar
- crear Credit
- número de crédito
- relación solicitud/credit
- generar N cuotas

### Desembolso

- solo APPROVED
- Cédula
- Nombre
- Monto
- Tasa
- Periodicidad
- Plazo
- banco
- cuenta
- DESEMBOLSADA

### Extra

- Refresh Token
- búsqueda por Cédula
- carga de plan de pagos

### Evaluación

- integridad
- estados
- ACID
- modularidad
- no duplicación
- Docker

### Entregables

- README
- GitHub-ready
- resumen de arquitectura
- bitácora de IA

Si algún punto no está implementado, debes corregirlo antes de considerar la solución terminada.
