from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"


# ============= User Schemas =============
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole = UserRole.STUDENT


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

    class Config:
        from_attributes = True


# ============= Course Schemas =============
class CourseBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    content: Optional[str] = None
    thumbnail_url: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseResponse(CourseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============= Lesson Schemas =============
class LessonBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    content: Optional[str] = None
    model_3d_url: Optional[str] = None
    order: int = 0


class LessonCreate(LessonBase):
    course_id: int


class LessonResponse(LessonBase):
    id: int
    course_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============= Question Schemas =============
class QuestionOptionBase(BaseModel):
    text: str
    is_correct: bool = False
    order: int = 0


class QuestionOptionResponse(QuestionOptionBase):
    id: int

    class Config:
        from_attributes = True


class QuestionBase(BaseModel):
    text: str
    question_type: str = "multiple_choice"
    difficulty: str = "medium"
    points: float = 1.0


class QuestionCreate(QuestionBase):
    lesson_id: int
    options: Optional[List[QuestionOptionBase]] = []


class QuestionResponse(QuestionBase):
    id: int
    lesson_id: int
    options: List[QuestionOptionResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


# ============= Quiz Result Schemas =============
class QuizResultBase(BaseModel):
    question_id: int
    selected_answer: Optional[str] = None
    time_spent_seconds: int = 0


class QuizResultCreate(QuizResultBase):
    pass


class QuizResultResponse(QuizResultBase):
    id: int
    user_id: int
    is_correct: bool
    points_earned: float
    created_at: datetime

    class Config:
        from_attributes = True


# ============= Chat History Schemas =============
class ChatMessageBase(BaseModel):
    user_message: str
    lesson_id: Optional[int] = None


class ChatMessageCreate(ChatMessageBase):
    pass


class ChatMessageResponse(ChatMessageBase):
    id: int
    user_id: int
    ai_response: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ============= Auth Schemas =============
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    username: Optional[str] = None
