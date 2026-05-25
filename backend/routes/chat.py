from fastapi import APIRouter, Depends, HTTPException, status, WebSocket
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import ChatHistory, User
from schemas import ChatMessageResponse, ChatMessageCreate

router = APIRouter(prefix="/api", tags=["Chat"])


@router.post("/chat/message", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED)
async def create_chat_message(
    user_id: int,
    message_data: ChatMessageCreate,
    db: Session = Depends(get_db)
):
    """Create a new chat message."""
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Create chat message
    chat_message = ChatHistory(
        user_id=user_id,
        lesson_id=message_data.lesson_id,
        user_message=message_data.user_message,
        ai_response="",  # Placeholder - would be filled by AI service
    )
    db.add(chat_message)
    db.commit()
    db.refresh(chat_message)

    return chat_message


@router.get("/chat/history/{user_id}", response_model=List[ChatMessageResponse])
async def get_chat_history(
    user_id: int,
    lesson_id: int = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get chat history for a user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    query = db.query(ChatHistory).filter(ChatHistory.user_id == user_id)

    if lesson_id:
        query = query.filter(ChatHistory.lesson_id == lesson_id)

    messages = query.order_by(ChatHistory.created_at.desc()).offset(skip).limit(limit).all()
    return messages


@router.get("/chat/message/{message_id}", response_model=ChatMessageResponse)
async def get_chat_message(message_id: int, db: Session = Depends(get_db)):
    """Get a specific chat message."""
    message = db.query(ChatHistory).filter(ChatHistory.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    return message


@router.put("/chat/message/{message_id}", response_model=ChatMessageResponse)
async def update_chat_message(
    message_id: int,
    message_data: ChatMessageCreate,
    db: Session = Depends(get_db)
):
    """Update a chat message (e.g., add AI response)."""
    message = db.query(ChatHistory).filter(ChatHistory.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )

    if hasattr(message_data, "ai_response"):
        message.ai_response = message_data.ai_response

    db.commit()
    db.refresh(message)
    return message


@router.delete("/chat/message/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat_message(message_id: int, db: Session = Depends(get_db)):
    """Delete a chat message."""
    message = db.query(ChatHistory).filter(ChatHistory.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
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
