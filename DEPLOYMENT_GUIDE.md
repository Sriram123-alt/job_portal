# Job Portal Deployment Guide

This guide explains how to deploy the **Job Portal** (Spring Boot Backend + React Frontend) using **Render**.

## Prerequisites

- [GitHub Account](https://github.com/)
- [Render Account](https://render.com/)
- **PostgreSQL Database**: You will need a PostgreSQL database.

---

## 1. Push to GitHub

Ensure your project is pushed to a GitHub repository.

```bash
git add .
git commit -m "Prepared for deployment"
git push origin main
```

## 2. Deploy to Render (Blueprint)

This project includes a `render.yaml` Blueprint file.

1.  Log in to your [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Blueprint**.
3.  Connect your GitHub repository.
4.  Give the blueprint a name (e.g., `job-portal-production`).
5.  Click **Apply**.

### Critical Environment Variables for Backend

The backend needs to connect to a database. You must provide these variables in the Render Dashboard for the **backend service**:

| Variable | Description |
| :--- | :--- |
| `DB_URL` | `jdbc:postgresql://hostname:port/dbname` |
| `DB_USERNAME` | Database Username |
| `DB_PASSWORD` | Database Password |
| `JWT_SECRET` | Secret key for JWT |

---

## 3. Troubleshooting & "Stuck" Deployments

If your deployment fails with `mvn: command not found` or you don't see the new service:

### Force Blueprint Sync
1. Go to your **Render Dashboard**.
2. Click on the **Blueprints** tab (left sidebar).
3. Click on your Blueprint name (e.g., `job-portal-production`).
4. Click **Manual Sync** or check for a "Sync needed" message.
5. This forces Render to re-read `render.yaml` and create the new `job-portal-backend-docker` service.

### Manual Backend Deployment (Fail-safe)
If the Blueprint refuses to work, deploy the Backend manually:

1.  **New +** -> **Web Service**.
2.  Connect Repo.
3.  **Name**: `manual-job-backend`
4.  **Runtime**: **Docker** (Select "Docker" explicitly).
5.  **Region**: Ohio (or any).
6.  **Branch**: `main`.
7.  **Root Directory**: `backend` (Important!).
8.  **Dockerfile Path**: `Dockerfile` (or `backend/Dockerfile` if root is blank).
9.  Click **Create Web Service**.

---

## 4. Frontend-Backend Connection

Once deployed, update your Frontend to point to the Backend URL.
