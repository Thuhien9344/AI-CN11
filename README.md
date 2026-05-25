# AI Education System

An AI-powered educational platform with interactive 3D simulations, AI chatbot tutoring, gamified learning, and comprehensive analytics.

## 🎯 Features

- **Student Dashboard**: Personalized learning experience
- **AI Chatbot**: Real-time Q&A with AI mentor
- **3D Simulation Engine**: Interactive 3D models for visual learning
- **Quiz & Games**: Gamified learning with scoring system
- **Progress Tracking**: Analytics and learning analytics dashboard
- **Responsive UI**: Works on desktop, tablet, and mobile

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)                   │
│  Dashboard │ Chat │ 3D Sim │ Quiz │ Profile │ Analytics   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/WebSocket
┌────────────────────────┴────────────────────────────────────┐
│              Backend API (FastAPI + Python)                 │
│  Auth │ Lessons │ Questions │ Quiz │ Chat │ Analytics      │
└────────────────┬──────────────┬──────────────┬──────────────┘
                 │              │              │
        ┌────────┴────┐  ┌──────┴──────┐  ┌──────┴────────┐
        │ PostgreSQL  │  │ Redis       │  │ LLM Service  │
        │ (Data)      │  │ (Cache)     │  │ (Mistral/...)│
        └─────────────┘  └─────────────┘  └──────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.11+ (for local development)
- Node.js 18+ (for local development)

### Using Docker Compose (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd AI-CN11

# Start all services
docker-compose up

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Local Development

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database (make sure PostgreSQL is running)
# Update DATABASE_URL in .env if needed

# Run backend
python -m uvicorn main:app --reload
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
AI-CN11/
├── backend/                    # FastAPI backend
│   ├── models/                # Database models
│   ├── schemas/               # Pydantic schemas
│   ├── routes/                # API endpoints
│   ├── services/              # Business logic
│   ├── auth/                  # Authentication
│   ├── main.py                # FastAPI app entry
│   ├── config.py              # Configuration
│   ├── database.py            # Database setup
│   ├── requirements.txt        # Python dependencies
│   └── .env                   # Environment variables
│
├── frontend/                   # React Vite frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API client
│   │   ├── store/             # State management
│   │   ├── hooks/             # Custom hooks
│   │   └── App.jsx            # App component
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Vite config
│
├── docker-compose.yml         # Docker Compose configuration
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Courses & Lessons
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create new course
- `GET /api/courses/{id}/lessons` - Get lessons for course
- `POST /api/lessons` - Create lesson
- `GET /api/lessons/{id}` - Get lesson details

### Questions & Quiz
- `POST /api/questions` - Create question
- `GET /api/lessons/{id}/questions` - Get questions for lesson
- `POST /api/quiz/submit` - Submit quiz answer
- `GET /api/quiz/results/user/{id}` - Get user quiz results

### Chat
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/history/{user_id}` - Get chat history
- `WebSocket /ws/chat/{user_id}` - Real-time chat

## 🔐 Environment Variables

Create `.env` files in `backend/` and `frontend/`:

### Backend `.env`
```
DATABASE_URL=postgresql://ai_user:ai_password@localhost:5432/ai_education
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key
DEBUG=True
AI_MODEL=mistral
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:8000
```

## 📚 Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **Cache**: Redis
- **ORM**: SQLAlchemy
- **Auth**: JWT, bcrypt
- **AI**: OpenAI API / LLaMA / Mistral

### Frontend
- **Framework**: React 18
- **Build**: Vite
- **3D**: Three.js
- **State**: Zustand / Context API
- **HTTP**: Axios
- **UI**: Tailwind CSS

## 🔧 Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Quality

```bash
# Backend linting
cd backend
flake8 .

# Frontend linting
cd frontend
npm run lint
```

## 📊 Database Schema

### Core Tables
- **users**: User accounts and authentication
- **courses**: Educational courses
- **lessons**: Individual lessons within courses
- **questions**: Quiz questions and their options
- **quiz_results**: Student quiz responses and scores
- **chat_history**: AI chatbot interaction logs
- **user_courses**: User enrollment in courses

## 🚀 Deployment

### Docker Production Build

```bash
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

### Environment for Production
- Change `DEBUG=False`
- Set strong `SECRET_KEY`
- Use managed PostgreSQL service
- Set up proper CORS origins
- Enable HTTPS

## 📝 API Documentation

Interactive API documentation available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For support, email support@aieducation.example or create an issue in the repository.

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Three.js Documentation](https://threejs.org/docs/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

---

**Built with ❤️ for educators and learners**
