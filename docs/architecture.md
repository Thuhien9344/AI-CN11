# EngineLab - Tài liệu kiến trúc hệ thống

## 1. Tổng quan hệ thống

EngineLab là nền tảng học tập Công nghệ THPT, tập trung vào cơ khí, động cơ đốt trong và ô tô. Hệ thống hỗ trợ học sinh học theo chương, xem mô phỏng 3D, làm quiz, luyện tập, nộp bài; giáo viên đăng thông báo, giao nhiệm vụ, quản lý bài nộp và theo dõi tiến độ.

## 2. Kiến trúc tổng thể

```mermaid
flowchart LR
  Student[Học sinh] --> FE[React/Vite Frontend]
  Teacher[Giáo viên] --> FE
  FE --> API[FastAPI Backend]
  API --> Auth[Auth Service]
  API --> Course[Course/Lesson Service]
  API --> Quiz[Quiz Service]
  API --> Classroom[Classroom Service]
  API --> Material[Material Service]
  API --> Progress[Progress Service]
  API --> Chat[AI Tutor/Chat Service]
  API --> DB[(SQLite Database)]
  Material --> Files[(uploads/materials)]
  Classroom --> Submissions[(uploads/submissions)]
  FE --> Local[(LocalStorage fallback)]
```

## 3. Backend Architecture

```mermaid
flowchart TB
  subgraph Backend[FastAPI Backend]
    Main[main.py]
    AuthRoutes[routes/auth.py]
    LessonRoutes[routes/lessons.py]
    QuestionRoutes[routes/questions.py]
    QuizRoutes[routes/quiz.py]
    ChatRoutes[routes/chat.py]
    ProgressRoutes[routes/progress.py]
    MaterialRoutes[routes/materials.py]
    ClassroomRoutes[routes/classroom.py]
    Schemas[Pydantic Schemas]
    Models[SQLAlchemy Models]
  end

  Main --> AuthRoutes
  Main --> LessonRoutes
  Main --> QuestionRoutes
  Main --> QuizRoutes
  Main --> ChatRoutes
  Main --> ProgressRoutes
  Main --> MaterialRoutes
  Main --> ClassroomRoutes
  AuthRoutes --> Schemas
  LessonRoutes --> Schemas
  QuizRoutes --> Schemas
  ProgressRoutes --> Schemas
  ClassroomRoutes --> Schemas
  Schemas --> Models
  Models --> DB[(SQLite)]
```

## 4. Use Case

```mermaid
flowchart LR
  Student((Học sinh))
  Teacher((Giáo viên))

  Student --> UC1[Đăng nhập/đăng ký]
  Student --> UC2[Xem lộ trình học]
  Student --> UC3[Đọc bài học]
  Student --> UC4[Xem mô phỏng 3D]
  Student --> UC5[Hỏi AI gia sư]
  Student --> UC6[Làm quiz/kho đề]
  Student --> UC7[Luyện tập/cuộc thi vui]
  Student --> UC8[Nộp bài]
  Student --> UC9[Xem tiến độ cá nhân]

  Teacher --> UC10[Đăng thông báo lớp]
  Teacher --> UC11[Giao nhiệm vụ]
  Teacher --> UC12[Tải tài liệu theo chương]
  Teacher --> UC13[Quản lý bài nộp theo lớp]
  Teacher --> UC14[Xem dashboard giáo viên]
```

## 5. ERD

```mermaid
erDiagram
  USERS ||--o{ USER_COURSES : enrolls
  COURSES ||--o{ USER_COURSES : has
  COURSES ||--o{ LESSONS : contains
  LESSONS ||--o{ QUESTIONS : has
  QUESTIONS ||--o{ QUESTION_OPTIONS : has
  USERS ||--o{ QUIZ_ATTEMPTS : submits
  LESSONS ||--o{ QUIZ_ATTEMPTS : tested_by
  QUIZ_ATTEMPTS ||--o{ QUIZ_RESULTS : contains
  QUESTIONS ||--o{ QUIZ_RESULTS : answered
  USERS ||--o{ QUIZ_RESULTS : creates
  USERS ||--o{ CHAT_HISTORY : asks
  USERS ||--o{ LESSON_PROGRESS : tracks
  LESSONS ||--o{ LESSON_PROGRESS : tracked_by
  USERS ||--o{ LEARNING_EVENTS : generates
  LESSONS ||--o{ LEARNING_EVENTS : records
  USERS ||--o{ REFERENCE_MATERIALS : uploads
  USERS ||--o{ CLASSROOM_POSTS : writes
  ASSIGNMENTS ||--o{ ASSIGNMENT_SUBMISSIONS : receives
  USERS ||--o{ ASSIGNMENT_SUBMISSIONS : submits

  USERS {
    int id PK
    string username
    string email
    string password_hash
    string full_name
    string role
  }

  COURSES {
    int id PK
    string title
    text description
    text content
  }

  LESSONS {
    int id PK
    int course_id FK
    string title
    text content
    int order
  }

  QUESTIONS {
    int id PK
    int lesson_id FK
    text text
    string difficulty
    float points
  }

  QUESTION_OPTIONS {
    int id PK
    int question_id FK
    text text
    bool is_correct
  }

  LESSON_PROGRESS {
    int id PK
    int user_id FK
    int lesson_id FK
    string status
    float progress_percent
    int quiz_attempt_count
    float best_quiz_score
  }

  LEARNING_EVENTS {
    int id PK
    int user_id FK
    int lesson_id FK
    string event_type
    int duration_seconds
    float score
  }

  ASSIGNMENTS {
    int id PK
    string title
    text description
    int course_id
    int lesson_id
    datetime due_at
  }

  ASSIGNMENT_SUBMISSIONS {
    int id PK
    int assignment_id FK
    int student_user_id FK
    string student_name
    text content
    string file_name
    float score
  }
```

## 6. Sequence Diagram - học bài và cập nhật tiến độ

```mermaid
sequenceDiagram
  participant S as Học sinh
  participant FE as Frontend
  participant API as Backend API
  participant DB as Database
  participant Local as LocalStorage

  S->>FE: Mở bài học
  FE->>API: GET /api/lessons/{id}
  API->>DB: Query Lesson
  API-->>FE: Lesson data
  FE->>API: POST /api/learning/users/{id}/events lesson_viewed
  API->>DB: Insert LearningEvent + update LessonProgress
  alt Backend lỗi hoặc chưa có dữ liệu
    FE->>Local: Lưu event lesson_viewed
  end
  S->>FE: Bấm Đánh dấu hoàn thành
  FE->>Local: Lưu event lesson_completed
  S->>FE: Mở Theo dõi tiến độ
  FE->>API: GET /api/learning/users/{id}/dashboard
  API-->>FE: Dashboard backend
  FE->>Local: Build dashboard local
  FE-->>S: Hiển thị nguồn có tiến độ cao hơn
```

## 7. Sequence Diagram - giáo viên giao bài và quản lý nộp bài

```mermaid
sequenceDiagram
  participant T as Giáo viên
  participant FE as Frontend
  participant API as Backend API
  participant DB as Database
  participant FS as File Storage
  participant S as Học sinh

  T->>FE: Tạo nhiệm vụ nộp bài
  FE->>API: POST /api/classroom/assignments
  API->>DB: Insert Assignment
  API-->>FE: Assignment created
  S->>FE: Nộp bài + file
  FE->>API: POST /api/classroom/assignments/{id}/submissions
  API->>FS: Save uploaded file
  API->>DB: Insert AssignmentSubmission
  T->>FE: Xem trạng thái lớp
  FE->>API: GET /api/classroom/assignments/{id}/submissions
  API->>DB: Query submissions
  API-->>FE: Danh sách đã nộp
  FE-->>T: Hiển thị đã nộp/chưa nộp theo lớp
```

## 8. AI Flow

```mermaid
flowchart TB
  Input[Học sinh nhập câu hỏi hoặc chọn bài] --> Context[Thu thập ngữ cảnh bài học]
  Context --> Intent[Phân loại ý định: giải thích, ôn tập, sinh câu hỏi, gợi ý lộ trình]
  Intent --> Explain[AI giải thích nội dung cơ khí]
  Intent --> Generate[AI sinh câu hỏi luyện tập]
  Intent --> Recommend[AI gợi ý bài học tiếp theo]
  Progress[LearningEvent + LessonProgress] --> Recommend
  Explain --> Response[Trả lời có ví dụ theo bài]
  Generate --> Response
  Recommend --> Response
  Response --> Log[Lưu ChatHistory/LearningEvent]
```

## 9. Các luồng AI có ích trong dự án

- AI giải thích động cơ: học sinh hỏi về piston, xupap, trục khuỷu, chu trình 4 kì; hệ thống trả lời theo bài học.
- AI sinh câu hỏi: tạo câu hỏi ôn tập từ nội dung bài/chương, có đáp án và giải thích.
- AI gợi ý lộ trình: dựa vào bài chưa học, quiz chưa làm, bài cần ôn.
- AI phân tích tiến độ: dùng LessonProgress, LearningEvent, điểm quiz để chỉ ra bài yếu và hành động tiếp theo.

## 10. Dashboard giáo viên

Dashboard giáo viên cần hiển thị:

- Tổng số học sinh/tài khoản học sinh.
- Số nhiệm vụ đã giao.
- Tổng số bài nộp.
- Tỉ lệ nộp bài theo từng nhiệm vụ/lớp.
- Hoạt động học tập: quiz, mô phỏng, hỏi AI, hoàn thành bài.
- Danh sách học sinh cần nhắc nộp bài hoặc cần hỗ trợ học tập.
