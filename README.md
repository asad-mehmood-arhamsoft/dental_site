# Dental Clinic - AI-Powered Patient Assistant Dashboard

A full-stack application for managing dental clinic patients with an AI-powered chat assistant.

## Architecture

- **Frontend**: React (Vite) - Patient dashboard and chat UI
- **Backend**: Node.js + Express.js - RESTful API with JWT authentication
- **Database**: PostgreSQL - Patient data and chat history
- **AI Service**: Python (Flask) - AI-powered chat responses

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 15+ (or use Docker)
- Docker & Docker Compose (optional but recommended)

### Option 1: Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/asad-mehmood-arhamsoft/dental_site.git
cd dental_site

# Create backend/.env file with your database credentials
# See Environment Variables section below for required variables

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend npm run migrate
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- AI Service: http://localhost:5000

### Option 2: Manual Setup

#### 1. Database Setup

```bash
# Create PostgreSQL database
createdb dental_clinic

# Or using psql
psql -U postgres
CREATE DATABASE dental_clinic;
```

#### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file with your database credentials
# See Environment Variables section below for required variables

# Run migrations
npm run migrate

# Start server
npm run dev
```

#### 3. AI Service Setup

```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start service
python3 app.py
```

**Note:** If `python` command is not found, use `python3` instead. You can also install `python-is-python3` package on Linux.

#### 4. Frontend Setup

```bash
cd frontend
npm install

# Create frontend/.env file (optional, defaults to localhost:3001)
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Start dev server
npm run dev
```

## Environment Variables

### Backend (backend/.env)

Create a `.env` file in the `backend/` directory:

**Option 1: Using Connection String (Recommended for Supabase/Cloud Databases)**

```env
PORT=3001
NODE_ENV=production

# Supabase or other cloud database connection string
DATABASE_URL=postgresql://postgres:password@host:5432/database

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

AI_SERVICE_URL=http://localhost:5000
```

**Option 2: Using Individual Variables (For Local Development)**

```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=dental_clinic
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

AI_SERVICE_URL=http://localhost:5000
```

**Note:** The `database.js` file automatically detects and uses `DATABASE_URL` if present, otherwise it falls back to individual variables. For Supabase, use the full connection string format: `postgresql://user:password@host:port/database`

### AI Service (ai-service/.env)

Create a `.env` file in the `ai-service/` directory (optional):

```env
PORT=5000
```

**Note:** The AI service uses mock responses stored in `ai-service/data/mock_responses.py` and does not require any API keys. It provides 20 different general responses and 6 context-specific responses based on message keywords.

### Frontend (frontend/.env)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3001/api
```

**Note:** This file should be located at `frontend/.env`. Vite automatically loads environment variables prefixed with `VITE_` from this file.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Patients
- `GET /api/patients` - Get all patients (with pagination)
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Chat
- `POST /api/chat` - Send message to AI assistant
- `GET /api/chat/:patientId` - Get chat history for patient

All patient and chat endpoints require JWT authentication (Bearer token).

## Deployment

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend directory: `cd frontend`
3. Deploy: `vercel`
4. Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`

### Backend Deployment (Render/Railway/Fly.io)

1. Set up PostgreSQL database (Supabase, Neon, or Render PostgreSQL)
2. Get your database connection string (e.g., from Supabase: `postgresql://user:password@host:port/database`)
3. Set environment variables in your hosting platform:
   - `DATABASE_URL` - Your full database connection string
   - `JWT_SECRET` - A secure random string
   - `AI_SERVICE_URL` - Your AI service URL
   - `NODE_ENV=production`
4. Deploy from GitHub repository
5. Run migrations: `npm run migrate`

### AI Service Deployment

Deploy to any Python hosting service (Render, Railway, Fly.io) or run as a separate service.

### Database Deployment

Use managed PostgreSQL services:
- **Supabase**: https://supabase.com
- **Neon**: https://neon.tech
- **Render PostgreSQL**: https://render.com

## Live Deployment URLs

**Note**: Update these URLs after deployment

- Frontend: [To be deployed]
- Backend API: [To be deployed]
- AI Service: [To be deployed]
- Database: [To be deployed]

## Testing

### Manual Testing

1. Register a new user at `/login`
2. Create a patient from the dashboard
3. Click "Chat" to start a conversation
4. Send messages and verify AI responses

### API Testing

Use tools like Postman or curl:

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get patients (replace TOKEN with JWT from login)
curl -X GET http://localhost:3001/api/patients \
  -H "Authorization: Bearer TOKEN"
```

## Project Structure

```
dental_site/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   └── chatController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Patient.js
│   │   └── Chat.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── patients.js
│   │   └── chat.js
│   ├── scripts/
│   │   └── migrate.js
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PatientList.jsx
│   │   │   ├── PatientForm.jsx
│   │   │   └── PatientChat.jsx
│   │   ├── utils/
│   │   │   ├── auth.js
│   │   │   └── api.js
│   │   ├── validation/
│   │   │   └── schemas/
│   │   │       ├── authSchemas.js
│   │   │       ├── patientSchemas.js
│   │   │       └── index.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── Dockerfile
├── ai-service/
│   ├── data/
│   │   ├── __init__.py
│   │   └── mock_responses.py
│   ├── app.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── venv/ (local development only)
├── docker-compose.yml
└── README.md
```


## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- SQL injection protection via parameterized queries
- CORS enabled for frontend-backend communication
- Input validation using express-validator (backend) and Yup (frontend)
- Validation schemas organized in `frontend/src/validation/schemas/`
- Environment variables for sensitive data

## Technologies Used

- **Frontend**: React 18, React Router, Axios, Vite, Yup (validation)
- **Backend**: Node.js, Express.js, PostgreSQL, JWT, bcrypt, express-validator
- **AI Service**: Python 3.11+, Flask (Mock Responses)
- **DevOps**: Docker, Docker Compose
- **Database**: PostgreSQL 15

## AI Usage Disclosure

I used Cursor AI for debugging issues and faster UI development. All code logic and other decisions belonged to me.

## License

ISC

## Author

Senior Full-Stack Engineer Assessment Project
