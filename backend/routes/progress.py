from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models import LearningEvent, Lesson, LessonProgress, QuizResult, User
from schemas import (
    LearningDashboardResponse,
    LearningEventCreate,
    LearningEventResponse,
    LearningRecommendation,
    LessonProgressResponse,
    LessonProgressUpdate,
)

router = APIRouter(prefix="/api/learning", tags=["Personalized Learning"])


def get_user_or_404(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


def get_lesson_or_404(db: Session, lesson_id: int) -> Lesson:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found",
        )
    return lesson


def get_or_create_progress(db: Session, user_id: int, lesson_id: int) -> LessonProgress:
    progress = (
        db.query(LessonProgress)
        .filter(
            LessonProgress.user_id == user_id,
            LessonProgress.lesson_id == lesson_id,
        )
        .first()
    )
    if progress:
        return progress

    progress = LessonProgress(
        user_id=user_id,
        lesson_id=lesson_id,
        status="not_started",
        progress_percent=0,
    )
    db.add(progress)
    db.flush()
    return progress


def recompute_status(progress: LessonProgress) -> None:
    if progress.progress_percent >= 100:
        progress.status = "completed"
        progress.completed_at = progress.completed_at or datetime.utcnow()
    elif progress.quiz_attempt_count > 0 and progress.best_quiz_score < 60:
        progress.status = "needs_review"
        progress.completed_at = None
    elif progress.progress_percent > 0:
        progress.status = "in_progress"
        progress.completed_at = None
    else:
        progress.status = "not_started"
        progress.completed_at = None


def apply_activity_to_progress(progress: LessonProgress, event: LearningEventCreate) -> None:
    progress.last_activity_type = event.event_type
    progress.last_accessed_at = datetime.utcnow()
    progress.time_spent_seconds += event.duration_seconds

    if event.event_type == "lesson_viewed":
        progress.view_count += 1
        progress.progress_percent = max(progress.progress_percent, 20)
    elif event.event_type == "simulation_opened":
        progress.simulation_count += 1
        progress.progress_percent = max(progress.progress_percent, 45)
    elif event.event_type == "assistant_question":
        progress.assistant_question_count += 1
        progress.progress_percent = max(progress.progress_percent, 60)
    elif event.event_type == "quiz_submitted":
        progress.quiz_attempt_count += 1
        if event.score is not None:
            progress.best_quiz_score = max(progress.best_quiz_score, event.score)
            previous_total = progress.average_quiz_score * (progress.quiz_attempt_count - 1)
            progress.average_quiz_score = round((previous_total + event.score) / progress.quiz_attempt_count, 2)
            progress.progress_percent = max(progress.progress_percent, 100 if event.score >= 70 else 75)
    elif event.event_type == "lesson_completed":
        progress.progress_percent = 100

    recompute_status(progress)


def build_recommendations(progress_rows: List[LessonProgress]) -> List[LearningRecommendation]:
    recommendations = []

    for progress in progress_rows:
      lesson_title = progress.lesson.title if progress.lesson else f"Bài {progress.lesson_id}"

      if progress.status == "needs_review":
          recommendations.append(
              LearningRecommendation(
                  lesson_id=progress.lesson_id,
                  title=lesson_title,
                  reason="Điểm kiểm tra nhanh còn dưới 60%.",
                  priority="high",
                  suggested_action="Ôn lại phần ghi nhớ, mở mô phỏng và làm lại kiểm tra nhanh.",
              )
          )
      elif progress.progress_percent > 0 and progress.progress_percent < 70:
          recommendations.append(
              LearningRecommendation(
                  lesson_id=progress.lesson_id,
                  title=lesson_title,
                  reason="Bài học đã bắt đầu nhưng chưa hoàn thành đủ hoạt động.",
                  priority="medium",
                  suggested_action="Hoàn thành mô phỏng, hỏi trợ lý học tập và làm kiểm tra nhanh.",
              )
          )

    return recommendations[:5]


@router.post("/users/{user_id}/events", response_model=LearningEventResponse, status_code=status.HTTP_201_CREATED)
async def track_learning_event(
    user_id: int,
    event_data: LearningEventCreate,
    db: Session = Depends(get_db),
):
    """Record one learning activity and update the student's lesson progress."""
    get_user_or_404(db, user_id)

    if event_data.lesson_id is not None:
        get_lesson_or_404(db, event_data.lesson_id)

    event = LearningEvent(
        user_id=user_id,
        lesson_id=event_data.lesson_id,
        event_type=event_data.event_type,
        duration_seconds=event_data.duration_seconds,
        score=event_data.score,
        payload=event_data.payload,
    )
    db.add(event)

    if event_data.lesson_id is not None:
        progress = get_or_create_progress(db, user_id, event_data.lesson_id)
        apply_activity_to_progress(progress, event_data)

    db.commit()
    db.refresh(event)
    return event


@router.put("/users/{user_id}/lessons/{lesson_id}/progress", response_model=LessonProgressResponse)
async def update_lesson_progress(
    user_id: int,
    lesson_id: int,
    progress_data: LessonProgressUpdate,
    db: Session = Depends(get_db),
):
    """Manually update progress for a lesson."""
    get_user_or_404(db, user_id)
    get_lesson_or_404(db, lesson_id)

    progress = get_or_create_progress(db, user_id, lesson_id)
    progress.last_accessed_at = datetime.utcnow()
    progress.time_spent_seconds += progress_data.time_spent_seconds

    if progress_data.status is not None:
        progress.status = progress_data.status
    if progress_data.progress_percent is not None:
        progress.progress_percent = progress_data.progress_percent
    if progress_data.activity_type is not None:
        progress.last_activity_type = progress_data.activity_type
    if progress_data.quiz_score is not None:
        progress.quiz_attempt_count += 1
        progress.best_quiz_score = max(progress.best_quiz_score, progress_data.quiz_score)
        previous_total = progress.average_quiz_score * (progress.quiz_attempt_count - 1)
        progress.average_quiz_score = round((previous_total + progress_data.quiz_score) / progress.quiz_attempt_count, 2)

    recompute_status(progress)
    db.commit()
    db.refresh(progress)
    return progress


@router.get("/users/{user_id}/lessons/{lesson_id}/progress", response_model=LessonProgressResponse)
async def get_lesson_progress(
    user_id: int,
    lesson_id: int,
    db: Session = Depends(get_db),
):
    """Get progress for one student and one lesson."""
    get_user_or_404(db, user_id)
    get_lesson_or_404(db, lesson_id)

    progress = get_or_create_progress(db, user_id, lesson_id)
    db.commit()
    db.refresh(progress)
    return progress


@router.get("/users/{user_id}/dashboard", response_model=LearningDashboardResponse)
async def get_learning_dashboard(
    user_id: int,
    course_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """Return personalized progress, activity and review suggestions for a student."""
    get_user_or_404(db, user_id)

    lesson_query = db.query(Lesson)
    if course_id is not None:
        lesson_query = lesson_query.filter(Lesson.course_id == course_id)
    lessons = lesson_query.order_by(Lesson.course_id, Lesson.order).all()
    lesson_ids = [lesson.id for lesson in lessons]

    progress_rows = []
    for lesson in lessons:
        progress_rows.append(get_or_create_progress(db, user_id, lesson.id))

    db.commit()
    for progress in progress_rows:
        db.refresh(progress)

    completed_lessons = sum(1 for item in progress_rows if item.status == "completed")
    in_progress_lessons = sum(1 for item in progress_rows if item.status in ("in_progress", "needs_review"))
    average_progress = (
        round(sum(item.progress_percent for item in progress_rows) / len(progress_rows), 2)
        if progress_rows
        else 0
    )
    quiz_scores = [item.best_quiz_score for item in progress_rows if item.quiz_attempt_count > 0]
    average_quiz_score = round(sum(quiz_scores) / len(quiz_scores), 2) if quiz_scores else 0
    total_time_spent_seconds = sum(item.time_spent_seconds for item in progress_rows)
    assistant_questions = sum(item.assistant_question_count for item in progress_rows)

    event_query = db.query(LearningEvent).filter(LearningEvent.user_id == user_id)
    if lesson_ids:
        event_query = event_query.filter(LearningEvent.lesson_id.in_(lesson_ids))
    recent_events = event_query.order_by(LearningEvent.created_at.desc()).limit(10).all()

    return LearningDashboardResponse(
        user_id=user_id,
        total_lessons=len(lessons),
        completed_lessons=completed_lessons,
        in_progress_lessons=in_progress_lessons,
        average_progress=average_progress,
        average_quiz_score=average_quiz_score,
        total_time_spent_seconds=total_time_spent_seconds,
        assistant_questions=assistant_questions,
        recent_events=recent_events,
        lesson_progress=progress_rows,
        recommendations=build_recommendations(progress_rows),
    )


@router.get("/users/{user_id}/events", response_model=List[LearningEventResponse])
async def get_learning_events(
    user_id: int,
    lesson_id: Optional[int] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """List recent learning events for a student."""
    get_user_or_404(db, user_id)

    query = db.query(LearningEvent).filter(LearningEvent.user_id == user_id)
    if lesson_id is not None:
        query = query.filter(LearningEvent.lesson_id == lesson_id)

    return query.order_by(LearningEvent.created_at.desc()).limit(limit).all()
