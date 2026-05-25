from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import QuizResult, Question, User
from schemas import QuizResultResponse, QuizResultCreate

router = APIRouter(prefix="/api", tags=["Quiz"])


@router.post("/quiz/submit", response_model=QuizResultResponse, status_code=status.HTTP_201_CREATED)
async def submit_quiz_answer(
    user_id: int,
    result_data: QuizResultCreate,
    db: Session = Depends(get_db)
):
    """Submit an answer to a quiz question."""
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Verify question exists
    question = db.query(Question).filter(Question.id == result_data.question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found",
        )

    # Check if answer is correct
    is_correct = False
    points_earned = 0.0

    if question.question_type == "multiple_choice":
        # Check if selected answer is correct
        for option in question.options:
            if option.is_correct and str(option.id) == result_data.selected_answer:
                is_correct = True
                points_earned = question.points
                break

    elif question.question_type == "true_false":
        correct_option = next((opt for opt in question.options if opt.is_correct), None)
        if correct_option and str(correct_option.id) == result_data.selected_answer:
            is_correct = True
            points_earned = question.points

    # Save quiz result
    quiz_result = QuizResult(
        user_id=user_id,
        question_id=result_data.question_id,
        selected_answer=result_data.selected_answer,
        is_correct=is_correct,
        points_earned=points_earned,
        time_spent_seconds=result_data.time_spent_seconds,
    )
    db.add(quiz_result)
    db.commit()
    db.refresh(quiz_result)

    return quiz_result


@router.get("/quiz/results/user/{user_id}", response_model=List[QuizResultResponse])
async def get_user_results(
    user_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get all quiz results for a user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    results = (
        db.query(QuizResult)
        .filter(QuizResult.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return results


@router.get("/quiz/results/question/{question_id}")
async def get_question_stats(
    question_id: int,
    db: Session = Depends(get_db)
):
    """Get statistics for a question."""
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found",
        )

    total_attempts = db.query(QuizResult).filter(
        QuizResult.question_id == question_id
    ).count()

    correct_attempts = db.query(QuizResult).filter(
        QuizResult.question_id == question_id,
        QuizResult.is_correct == True
    ).count()

    accuracy = (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0

    return {
        "question_id": question_id,
        "total_attempts": total_attempts,
        "correct_attempts": correct_attempts,
        "accuracy_percentage": round(accuracy, 2),
    }


@router.get("/quiz/results/{result_id}", response_model=QuizResultResponse)
async def get_quiz_result(result_id: int, db: Session = Depends(get_db)):
    """Get a specific quiz result."""
    result = db.query(QuizResult).filter(QuizResult.id == result_id).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz result not found",
        )
    return result
