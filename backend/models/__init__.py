from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base


class UserRole(str, enum.Enum):
    """User roles in the system."""
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"


class User(Base):
    """User model for authentication."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100))
    role = Column(SQLEnum(UserRole), default=UserRole.STUDENT)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    courses = relationship("UserCourse", back_populates="user", cascade="all, delete-orphan")
    quiz_results = relationship("QuizResult", back_populates="user", cascade="all, delete-orphan")
    chat_history = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"


class Course(Base):
    """Course model."""
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text)
    content = Column(Text)
    thumbnail_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan")
    user_courses = relationship("UserCourse", back_populates="course", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Course(id={self.id}, title={self.title})>"


class UserCourse(Base):
    """User-Course association (enrollment)."""
    __tablename__ = "user_courses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    progress = Column(Float, default=0.0)  # 0-100
    enrolled_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="courses")
    course = relationship("Course", back_populates="user_courses")

    def __repr__(self):
        return f"<UserCourse(user_id={self.user_id}, course_id={self.course_id})>"


class Lesson(Base):
    """Lesson model."""
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text)
    content = Column(Text)
    model_3d_url = Column(String(500))  # URL to 3D model file
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    course = relationship("Course", back_populates="lessons")
    questions = relationship("Question", back_populates="lesson", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Lesson(id={self.id}, course_id={self.course_id}, title={self.title})>"


class Question(Base):
    """Question model for quizzes."""
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    text = Column(Text, nullable=False)
    question_type = Column(String(50), default="multiple_choice")  # multiple_choice, true_false, text
    difficulty = Column(String(20), default="medium")  # easy, medium, hard
    points = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    lesson = relationship("Lesson", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan")
    results = relationship("QuizResult", back_populates="question", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Question(id={self.id}, lesson_id={self.lesson_id})>"


class QuestionOption(Base):
    """Options for multiple choice questions."""
    __tablename__ = "question_options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    order = Column(Integer, default=0)

    # Relationships
    question = relationship("Question", back_populates="options")

    def __repr__(self):
        return f"<QuestionOption(id={self.id}, question_id={self.question_id})>"


class QuizResult(Base):
    """User quiz results."""
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    selected_answer = Column(Text)  # For text answers or stored option ID
    is_correct = Column(Boolean, default=False)
    points_earned = Column(Float, default=0.0)
    time_spent_seconds = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="quiz_results")
    question = relationship("Question", back_populates="results")

    def __repr__(self):
        return f"<QuizResult(id={self.id}, user_id={self.user_id}, question_id={self.question_id})>"


class ChatHistory(Base):
    """Chat history with AI chatbot."""
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    user_message = Column(Text, nullable=False)
    ai_response = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="chat_history")

    def __repr__(self):
        return f"<ChatHistory(id={self.id}, user_id={self.user_id})>"
