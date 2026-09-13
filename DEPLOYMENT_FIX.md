# CivicConnect deployment fix

## Frontend (Vercel)

Add this Environment Variable in Vercel:

REACT_APP_API_URL=https://YOUR-BACKEND-DOMAIN/api

Use the actual URL of the deployed Spring Boot backend. Then redeploy the frontend.

## Backend

Set these environment variables in the backend hosting service:

SPRING_DATASOURCE_URL=jdbc:mysql://YOUR-MYSQL-HOST:3306/civic_issue_system?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=YOUR_DB_USER
SPRING_DATASOURCE_PASSWORD=YOUR_DB_PASSWORD
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
MAIL_USERNAME=YOUR_EMAIL
MAIL_PASSWORD=YOUR_GMAIL_APP_PASSWORD
FRONTEND_URL=https://YOUR-VERCEL-DOMAIN.vercel.app

The backend now reads FRONTEND_URL for CORS instead of hardcoding localhost.

## Important

Do not commit database passwords or mail passwords to GitHub. If a real password was previously committed, rotate it.
