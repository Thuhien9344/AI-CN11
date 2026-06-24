from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, WebSocket
from sqlalchemy.orm import Session
from typing import List

from auth import can_manage_content, get_authenticated_user
from database import get_db
from models import ChatHistory, LearningEvent, Lesson, LessonProgress, User
from schemas import ChatMessageResponse, ChatMessageCreate

router = APIRouter(prefix="/api", tags=["Chat"])


def ensure_user_scope(target_user_id: int, current_user: User) -> None:
    if current_user.id == target_user_id or can_manage_content(current_user):
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You can only access your own chat data.",
    )


def build_tutor_reply(message: str, lesson: Lesson | None = None) -> str:
    text = (message or "").strip().lower()
    lesson_hint = f" for lesson '{lesson.title}'" if lesson else ""

    if not text:
        return "Please enter a question about the lesson, simulation, quiz, or design process."
    if any(keyword in text for keyword in ["4 stroke", "four stroke", "piston", "crankshaft", "valve", "engine"]):
        return (
            "A four-stroke engine works through intake, compression, power, and exhaust. "
            "Focus on piston direction, valve state, and when useful work is produced. "
            "The power stroke happens after ignition when expanding gas pushes the piston down."
        )
    if any(keyword in text for keyword in ["quiz", "test", "review", "wrong", "score"]):
        return (
            "Review the concept first, then explain why each wrong option fails. "
            "After that, redo the quiz and compare the new score with your best score."
        )
    if any(keyword in text for keyword in ["design", "cad", "drawing", "projection", "system"]):
        return (
            "Use the engineering design loop: define the problem, list constraints, sketch options, "
            "choose a solution, prototype or simulate it, test against criteria, then improve."
        )
    return (
        f"I can help{lesson_hint}. Break the topic into: definition, main parts, operating principle, "
        "real-life example, and one common mistake. Ask about one of those parts for a shorter explanation."
    )


def update_assistant_progress(db: Session, user_id: int, lesson_id: int | None, question: str) -> None:
    event = LearningEvent(
        user_id=user_id,
        lesson_id=lesson_id,
        event_type="assistant_question",
        duration_seconds=45,
        payload={"question": question[:500]},
    )
    db.add(event)

    if lesson_id is None:
        return

    progress = (
        db.query(LessonProgress)
        .filter(LessonProgress.user_id == user_id, LessonProgress.lesson_id == lesson_id)
        .first()
    )
    if not progress:
        progress = LessonProgress(user_id=user_id, lesson_id=lesson_id)
        db.add(progress)
        db.flush()

    progress.assistant_question_count += 1
    progress.time_spent_seconds += 45
    progress.progress_percent = max(progress.progress_percent, 60)
    progress.status = "in_progress" if progress.progress_percent < 100 else "completed"
    progress.last_activity_type = "assistant_question"
    progress.last_accessed_at = datetime.utcnow()


@router.post("/chat/message", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED)
async def create_chat_message(
    user_id: int,
    message_data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):
    """Create a new chat message."""
    ensure_user_scope(user_id, current_user)
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    lesson = None
    if message_data.lesson_id is not None:
        lesson = db.query(Lesson).filter(Lesson.id == message_data.lesson_id).first()
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson not found",
            )

    ai_response = build_tutor_reply(message_data.user_message, lesson)
    chat_message = ChatHistory(
        user_id=user_id,
        lesson_id=message_data.lesson_id,
        session_id=message_data.session_id,
        user_message=message_data.user_message,
        ai_response=ai_response,
    )
    db.add(chat_message)
    update_assistant_progress(db, user_id, message_data.lesson_id, message_data.user_message)
    db.commit()
    db.refresh(chat_message)

    return chat_message


@router.get("/chat/history/{user_id}", response_model=List[ChatMessageResponse])
async def get_chat_history(
    user_id: int,
    lesson_id: int = None,
    session_id: str | None = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):
    """Get chat history for a user."""
    ensure_user_scope(user_id, current_user)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    query = db.query(ChatHistory).filter(ChatHistory.user_id == user_id)

    if lesson_id:
        query = query.filter(ChatHistory.lesson_id == lesson_id)
    if session_id:
        query = query.filter(ChatHistory.session_id == session_id)

    messages = query.order_by(ChatHistory.created_at.desc()).offset(skip).limit(limit).all()
    return messages


@router.get("/chat/message/{message_id}", response_model=ChatMessageResponse)
async def get_chat_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):
    """Get a specific chat message."""
    message = db.query(ChatHistory).filter(ChatHistory.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    ensure_user_scope(message.user_id, current_user)
    return message


@router.put("/chat/message/{message_id}", response_model=ChatMessageResponse)
async def update_chat_message(
    message_id: int,
    message_data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):
    """Update a chat message (e.g., add AI response)."""
    message = db.query(ChatHistory).filter(ChatHistory.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    ensure_user_scope(message.user_id, current_user)

    if hasattr(message_data, "ai_response"):
        message.ai_response = message_data.ai_response

    db.commit()
    db.refresh(message)
    return message


@router.delete("/chat/message/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):
    """Delete a chat message."""
    message = db.query(ChatHistory).filter(ChatHistory.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    ensure_user_scope(message.user_id, current_user)
    db.delete(message)
    db.commit()


# WebSocket endpoint for real-time chat (will be enhanced later)
@router.websocket("/ws/chat/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    """WebSocket endpoint for real-time chat."""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Echo back for now - AI integration will come later
            await websocket.send_text(f"Echo: {data}")
    except Exception as e:
        print(f"WebSocket error: {e}")
