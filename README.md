# 🏢 Online Real Estate Management System

A full-stack, enterprise-grade real estate management platform designed for property owners, property managers, tenants, and administrators. Built with a modern **Spring Boot 3 (Java 21)** backend and a responsive **React 18 + Vite + Tailwind CSS** frontend.

---

## 🌟 Key Features

- **Multi-Role Authentication & Authorization**: Dedicated dashboards for `ADMIN`, `PROPERTY_MANAGER`, and `TENANT` secured with JWT (JSON Web Tokens).
- **Property Listings & Management**: Create, edit, browse, filter, search, and approve real estate listings.
- **Rental Application & Lease Pipeline**: Submit rental applications, verify credit details, and draft/manage active lease agreements.
- **Direct In-App Messaging**: Real-time communication channels between tenants and property managers.
- **Activity & System Auditing**: Platform-wide audit logs, configurable commission rates, and notification alerts.
- **Dual Database Profiles**:
  - **`postgres` (Production/Cloud)**: Connects directly to **Supabase PostgreSQL** via Session Pooler or direct connection.
  - **`h2` (Local/Offline)**: Embedded file-based H2 database for zero-config offline development.

---

## 🛠️ Tech Stack

- **Backend**:
  - Java 21 & Spring Boot 3.3.4
  - Spring Security 6 & JJWT (0.12.6)
  - Spring Data JPA & Hibernate
  - PostgreSQL Driver & HikariCP
  - H2 Database (local profile)
  - Apache Maven 3.9+
- **Frontend**:
  - React 18 & Vite
  - Tailwind CSS & PostCSS
  - React Router DOM 6
  - Lucide React Icons & Recharts
  - Axios

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

| Tool | Recommended Version | Check Command |
| :--- | :--- | :--- |
| **Java JDK** | 21+ | `java -version` |
| **Apache Maven** | 3.9+ | `mvn -version` |
| **Node.js** | 18+ / 20+ | `node -v` |
| **npm** | 9+ / 10+ | `npm -v` |
| **Git** | 2.x | `git --version` |

---

## ☁️ Supabase PostgreSQL Setup Guide (Profile: `postgres`)

Follow these steps to connect your backend to a hosted Supabase PostgreSQL database:

### 1. Create a Supabase Project
1. Log in to [Supabase](https://supabase.com) and click **"New Project"** (or visit [database.new](https://database.new)).
2. Choose your organization, name your project (e.g., `real-estate-management`), and select your closest AWS region.
3. Set a strong **Database Password** and save it in a secure location.
4. Note your **Project Reference ID** (a 20-character string found in your project URL: `https://supabase.com/dashboard/project/<PROJECT-REF>`).

### 2. Retrieve the JDBC Connection String
In your Supabase Dashboard:
1. Navigate to: **Project Settings** (gear icon) ➔ **Database**.
2. Scroll down to the **Connection string** section.
3. Click the **JDBC** tab.

Supabase provides two connection methods:

#### Option A: Connection Pooler (Session Mode) — **Recommended for IPv4 Networks**
> [!TIP]
> Most residential Internet Service Providers (ISPs), cellular networks, and standard VPNs do not support IPv6 routing. Direct connections to Supabase require IPv6 unless you purchase their IPv4 add-on. **The Supabase Connection Pooler on port 5432 supports IPv4** and is fully compatible with Spring Boot & HikariCP.

- **Host**: `aws-0-[REGION].pooler.supabase.com`
- **Port**: `5432`
- **Database Name**: `postgres`
- **Username**: `postgres.[YOUR-PROJECT-REF]`
- **SSL Mode**: Required (`?sslmode=require`)
- **JDBC URL Format**:
  ```text
  jdbc:postgresql://aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require
  ```
  *(Example for Mumbai `ap-south-1`: `jdbc:postgresql://aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require`)*

#### Option B: Direct Connection (IPv6 Enabled Networks)
- **Host**: `db.[YOUR-PROJECT-REF].supabase.co`
- **Port**: `5432`
- **Database Name**: `postgres`
- **Username**: `postgres`
- **JDBC URL Format**:
  ```text
  jdbc:postgresql://db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require
  ```

### 3. Generate a Secure JWT Secret
Before launching the backend, generate a cryptographically strong 256-bit secret key for HMAC-SHA256 JWT token signing:

```bash
# In PowerShell:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})

# In Linux / macOS / Git Bash:
openssl rand -hex 32
```

---

## ⚙️ Environment Variables Configuration

Copy `.env.example` to `.env` in the root folder or `backend/.env`:

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials:

```dotenv
SPRING_PROFILES_ACTIVE=postgres
DB_URL=jdbc:postgresql://aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require
DB_USERNAME=postgres.[YOUR-PROJECT-REF]
DB_PASSWORD=YOUR_SUPABASE_DATABASE_PASSWORD
JWT_SECRET=your_generated_64_character_hex_or_32_char_secret_here
PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
```

### Environment Variables Reference

| Variable Name | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | Yes | `h2` | Set to `postgres` to connect to Supabase. |
| `DB_URL` | Yes (for postgres) | None | Full JDBC PostgreSQL connection URL with `?sslmode=require`. |
| `DB_USERNAME` | Yes (for postgres) | `postgres` | Database username (`postgres.[REF]` for Pooler, `postgres` for Direct). |
| `DB_PASSWORD` | Yes (for postgres) | None | Database password configured in Supabase. |
| `JWT_SECRET` | Yes | None | 256-bit (minimum 32-character) secret key for token signing. |
| `JWT_EXPIRATION_MS` | No | `86400000` | Token expiration time in milliseconds (24 hours). |
| `PORT` | No | `8080` | Backend HTTP server port. |
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:5173,...` | Comma-separated list of allowed frontend origins. |
| `SEED_ADMIN_PASSWORD` | No | `admin123` (fallback) | Custom initial password for demo administrator account. |
| `SEED_MANAGER_PASSWORD` | No | `manager123` (fallback) | Custom initial password for demo property manager account. |
| `SEED_TENANT_PASSWORD` | No | `tenant123` (fallback) | Custom initial password for demo tenant account. |

---

## 🚀 Running the Application

### 1. Launching the Backend with Supabase (`postgres` Profile)

#### Option A: Using PowerShell (Command Line)
```powershell
# 1. Set environment variables
$env:SPRING_PROFILES_ACTIVE = "postgres"
$env:DB_URL = "jdbc:postgresql://aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require"
$env:DB_USERNAME = "postgres.[YOUR-PROJECT-REF]"
$env:DB_PASSWORD = "YOUR_SUPABASE_DB_PASSWORD"
$env:JWT_SECRET = "your_64_character_hex_or_32_char_secret"

# 2. Start the backend
cd backend
mvn spring-boot:run
```

#### Option B: Using Linux / macOS / Git Bash
```bash
export SPRING_PROFILES_ACTIVE=postgres
export DB_URL="jdbc:postgresql://aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require"
export DB_USERNAME="postgres.[YOUR-PROJECT-REF]"
export DB_PASSWORD="YOUR_SUPABASE_DB_PASSWORD"
export JWT_SECRET="your_64_character_hex_or_32_char_secret"

cd backend
mvn spring-boot:run
```

#### Option C: Fallback Local Mode (Embedded H2)
If you want to run offline without Supabase:
```powershell
cd backend
mvn spring-boot:run
```
*(Uses the default `h2` profile and creates local database files under `backend/data/`, which are ignored by Git).*

### 2. Verifying Successful Supabase Connection
When starting with `SPRING_PROFILES_ACTIVE=postgres`, watch for the following lines in the terminal output:
```text
The following 1 profile is active: "postgres"
HikariPool-1 - Starting...
HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@...
HikariPool-1 - Start completed.
>>> Initializing seed data for Online Real Estate Management System...
Tomcat started on port 8080 (http) with context path '/'
Started RealEstateManagementApplication in X.XXX seconds
```
All database tables (`users`, `properties`, `applications`, `agreements`, `messages`, `settings`, `notifications`, `activity_logs`) will be automatically created in your Supabase PostgreSQL database under the `public` schema.

### 3. Troubleshooting Supabase Connections
- **Connection Timeout / UnknownHostException**:
  - Make sure you are using the **Connection Pooler URL** (`aws-0-[REGION].pooler.supabase.com:5432`), not the direct URL if your network does not route IPv6.
  - Verify your Supabase project status is **Active** (free tier projects pause after 7 days of inactivity; restore them in the Supabase Dashboard).
- **Password Authentication Failed**:
  - Ensure `DB_USERNAME` includes your project reference when using the pooler: `postgres.[YOUR-PROJECT-REF]`.
  - Pass the password via `DB_PASSWORD` rather than embedding it inside `DB_URL` to avoid URL-encoding conflicts with special characters.
- **SSL Connection Error**:
  - Ensure `?sslmode=require` is present at the end of `DB_URL`.


---

### 4. Launching the Frontend

In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend will start at **`http://localhost:5173`**.

---

## 👥 Default Demo Credentials (Initial Seed)

When the backend runs for the first time on an empty database, initial seed data is automatically populated:

| Role | Email | Default Password | Dashboard Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@realestate.com` | `admin123` (or `SEED_ADMIN_PASSWORD`) | Full system management, user management, audit logs, listings approval |
| **Property Manager** | `manager@realestate.com` | `manager123` (or `SEED_MANAGER_PASSWORD`) | Property creation, applications review, lease agreements, tenant chat |
| **Tenant** | `tenant@realestate.com` | `tenant123` (or `SEED_TENANT_PASSWORD`) | Property discovery, application submission, active lease viewing, messaging |

---

## 🔒 Security & Git Push Checklist

To safely push to a public GitHub repository, verify the following:

- [x] **No tracked `.env` files**: `.env`, `.env.*`, and `*.env` are in `.gitignore`.
- [x] **No tracked `node_modules`**: Excluded across the workspace.
- [x] **No compiled binaries or build folders**: `target/`, `dist/`, and `.class` are ignored.
- [x] **No local database files**: `data/`, `backend/data/`, `*.db`, `*.mv.db`, and `*.trace.db` are ignored.
- [x] **No hardcoded secrets**: All database credentials, JWT secrets, and sensitive keys are retrieved through environment variables.
- [x] **Safe `.env.example`**: Only placeholder values exist in tracked configuration templates.

### First Git Push Instructions

```bash
# 1. Initialize git repository (if not already done)
git init

# 2. Stage files (verify that ignored folders are not listed)
git add .
git status

# 3. Create initial commit
git commit -m "feat: complete Online Real Estate Management System ready for production"

# 4. Link your GitHub remote repository and push
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
