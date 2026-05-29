from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import Base, engine
from migrations import run_startup_migrations
import models  # noqa: F401

# Create tables
Base.metadata.create_all(bind=engine)
run_startup_migrations(engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    description="AI-powered educational platform",
    version=settings.version,
    debug=settings.debug,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============= Health Check =============
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": settings.version}


@app.get("/", tags=["Info"])
async def root():
    """Root endpoint with API info."""
    return {
        "name": settings.app_name,
        "version": settings.version,
        "docs": "/docs",
        "openapi": "/openapi.json",
    }


# ============= Import Routes =============
from routes import auth, lessons, questions, quiz, chat, progress, materials, classroom, nova3d

app.include_router(auth.router)
app.include_router(lessons.router)
app.include_router(questions.router)
app.include_router(quiz.router)
app.include_router(chat.router)
app.include_router(progress.router)
app.include_router(materials.router)
app.include_router(classroom.router)
app.include_router(nova3d.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
    )
