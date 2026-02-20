# Dental Clinic - AI-Powered Patient Assistant Dashboard

A full-stack application for managing dental clinic patients with an AI-powered chat assistant.

## 🏗️ Architecture

- **Frontend**: React (Vite) - Patient dashboard and chat UI
- **Backend**: Node.js + Express.js - RESTful API with JWT authentication
- **Database**: PostgreSQL - Patient data and chat history
- **AI Service**: Python (Flask) - AI-powered chat responses

## 🚀 Quick Start

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

# Copy environment files
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials

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
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migrate

# Start server
npm run dev
```

#### 3. AI Service Setup

```bash
cd ai-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start service
python app.py
```

#### 4. Frontend Setup

```bash
cd frontend
npm install

# Create .env file (optional, defaults to localhost:3001)
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Start dev server
npm run dev
```

## 📋 Environment Variables

### Backend (.env)

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

### AI Service (.env)

```env
PORT=5000
```

**Note:** The AI service uses mock responses and does not require any API keys.

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
```

## 🌐 API Endpoints

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

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend directory: `cd frontend`
3. Deploy: `vercel`
4. Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`

### Backend Deployment (Render/Railway/Fly.io)

1. Set up PostgreSQL database (Supabase, Neon, or Render PostgreSQL)
2. Set environment variables in your hosting platform
3. Deploy from GitHub repository
4. Run migrations: `npm run migrate`

### AI Service Deployment

Deploy to any Python hosting service (Render, Railway, Fly.io) or run as a separate service.

### Database Deployment

Use managed PostgreSQL services:
- **Supabase**: https://supabase.com
- **Neon**: https://neon.tech
- **Render PostgreSQL**: https://render.com

## 📝 Live Deployment URLs

**Note**: Update these URLs after deployment

- Frontend: [To be deployed]
- Backend API: [To be deployed]
- AI Service: [To be deployed]
- Database: [To be deployed]

## 🧪 Testing

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

## 📁 Project Structure

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
│   └── package.json
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
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── ai-service/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🤖 AI Usage Disclosure

This project uses AI assistance for code generation and development. The following components were AI-assisted:

- **Initial project structure setup**: Project scaffolding and folder organization
- **Backend API implementation**: Express.js routes, controllers, and models
- **Frontend React components**: Component structure and state management
- **Database schema design**: PostgreSQL table definitions and indexes
- **Docker configuration**: Dockerfile and docker-compose setup
- **Documentation**: README and design document structure

All code has been reviewed, tested, and customized for this specific use case. The AI service uses mock responses with 20 different contextual responses based on user queries.

## 🔒 Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- SQL injection protection via parameterized queries
- CORS enabled for frontend-backend communication
- Input validation using express-validator
- Environment variables for sensitive data

## 📚 Technologies Used

- **Frontend**: React 18, React Router, Axios, Vite
- **Backend**: Node.js, Express.js, PostgreSQL, JWT, bcrypt
- **AI Service**: Python, Flask (Mock Responses)
- **DevOps**: Docker, Docker Compose
- **Database**: PostgreSQL 15

## 📄 License

ISC

## 👤 Author

Senior Full-Stack Engineer Assessment Project
