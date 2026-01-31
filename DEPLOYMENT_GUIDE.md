# Job Portal Deployment Guide

This guide explains how to deploy the **Job Portal** (Spring Boot Backend + React Frontend) using **Render**.

## Prerequisites

- [GitHub Account](https://github.com/)
- [Render Account](https://render.com/)
- **PostgreSQL Database**: You will need a PostgreSQL database. You can create one on Render or use an external provider (like Neon, Supabase, etc.).

---

## 1. Push to GitHub

Ensure your project is pushed to a GitHub repository.

```bash
git add .
git commit -m "Prepared for deployment"
git push origin main
```

## 2. Deploy to Render (Blueprint)

This project includes a `render.yaml` Blueprint file which automates the deployment of both Frontend and Backend.

1.  Log in to your [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Blueprint**.
3.  Connect your GitHub repository.
4.  Give the blueprint a name (e.g., `job-portal-production`).
5.  **Environment Variables**: You will likely be prompted to provide environment variables immediately or you can configure them later.

### Critical Environment Variables for Backend

The backend needs to connect to a database. You must provide these variables in the Render Dashboard for the **backend service**:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `DB_URL` | JDBC URL for PostgreSQL | `jdbc:postgresql://hostname:port/dbname` |
| `DB_USERNAME` | Database Username | `renderer` |
| `DB_PASSWORD` | Database Password | `your_secret_password` |
| `JWT_SECRET` | Secret key for JWT | `your_long_secure_secret_key` |

> **Note**: Update your `application.properties` or `application.yml` in the backend code to use these environment variables if they are currently hardcoded, or ensure the defaults work for you.
>
> Example for `application.properties`:
> ```properties
> spring.datasource.url=${DB_URL}
> spring.datasource.username=${DB_USERNAME}
> spring.datasource.password=${DB_PASSWORD}
> ```

---

## 3. Manual Deployment (Alternative)

If you prefer to deploy services manually without the Blueprint:

### Backend (Web Service)
1.  **New +** -> **Web Service**.
2.  Connect Repo.
3.  **Root Directory**: `backend`
4.  **Runtime**: Java
5.  **Build Command**: `mvn clean package -DskipTests`
6.  **Start Command**: `java -jar target/*.jar`
7.  Add Environment Variables as listed above.

### Frontend (Static Site)
1.  **New +** -> **Static Site**.
2.  Connect Repo.
3.  **Root Directory**: `frontend`
4.  **Build Command**: `npm install && npm run build`
5.  **Publish Directory**: `dist`
6.  **Rewrite Rules**:
    - Source: `/*`
    - Destination: `/index.html`
    - Action: `Rewrite`

---

## 4. Frontend-Backend Connection

Once both are deployed:
1.  Get the **Backend URL** (e.g., `https://job-portal-backend.onrender.com`).
2.  You likely need to update your Frontend to point to this URL instead of `localhost`.
    - **Option 1 (Build Time)**: Update `vite.config.js` or your API service file in the frontend to use the production URL.
    - **Option 2 (Environment Variable)**: If your frontend code uses `import.meta.env.VITE_API_URL`, set this variable in the Render Static Site settings.

**Enjoy your deployed Job Portal!**
