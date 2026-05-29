import {
  canhDieuActivities,
  canhDieuCourses,
  canhDieuLessons,
  canhDieuQuestions,
  chapterAssessments,
} from './canhDieuData'

export { chapterAssessments }

export const engineCycleSteps = [
  {
    name: 'Kì nạp',
    piston: 'Piston đi từ điểm chết trên xuống điểm chết dưới',
    valve: 'Xupap nạp mở, xupap thải đóng',
    result: 'Không khí hoặc hòa khí được nạp vào xi lanh.',
    color: 'bg-sky-100 text-sky-800 border-sky-300',
  },
  {
    name: 'Kì nén',
    piston: 'Piston đi từ điểm chết dưới lên điểm chết trên',
    valve: 'Hai xupap đều đóng',
    result: 'Môi chất trong xi lanh bị nén, áp suất và nhiệt độ tăng.',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    name: 'Kì cháy - giãn nở',
    piston: 'Khí cháy giãn nở đẩy piston đi xuống',
    valve: 'Hai xupap đều đóng',
    result: 'Đây là kì sinh công, lực khí cháy truyền qua thanh truyền làm quay trục khuỷu.',
    color: 'bg-red-100 text-red-800 border-red-300',
  },
  {
    name: 'Kì thải',
    piston: 'Piston đi từ điểm chết dưới lên điểm chết trên',
    valve: 'Xupap thải mở, xupap nạp đóng',
    result: 'Khí thải được đẩy ra khỏi xi lanh để chuẩn bị chu trình mới.',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
]

export const sampleCourses = canhDieuCourses
export const sampleLessons = canhDieuLessons
export const sampleQuestions = canhDieuQuestions

export const getSampleCourse = (courseId) =>
  sampleCourses.find((course) => course.id === Number(courseId))

export const getSampleLessonsByCourse = (courseId) =>
  sampleLessons
    .filter((lesson) => lesson.course_id === Number(courseId))
    .sort((a, b) => a.order - b.order)

export const getSampleLesson = (lessonId) =>
  sampleLessons.find((lesson) => lesson.id === Number(lessonId))

export const getSampleQuestionsByLesson = (lessonId) =>
  sampleQuestions.filter((question) => question.lesson_id === Number(lessonId))

const defaultActivity = {
  flashcards: [
    {
      front: 'Cách học một bài Công nghệ cơ khí hiệu quả?',
      back: 'Xác định khái niệm chính, nhiệm vụ của đối tượng kĩ thuật, cấu tạo hoặc quy trình, sau đó liên hệ với ví dụ thực tế.',
    },
    {
      front: 'Khi gặp một hệ thống cơ khí cần phân tích theo những ý nào?',
      back: 'Nhiệm vụ, cấu tạo chính, nguyên lí làm việc, yêu cầu an toàn và cách bảo dưỡng hoặc sử dụng đúng.',
    },
  ],
  matching: [
    { term: 'Nhiệm vụ', answer: 'Cho biết bộ phận hoặc hệ thống dùng để làm gì' },
    { term: 'Cấu tạo', answer: 'Cho biết gồm những bộ phận chính nào' },
    { term: 'Nguyên lí', answer: 'Cho biết hoạt động theo trình tự nào' },
  ],
  scenario: {
    title: 'Phân tích kiến thức SGK',
    prompt: 'Khi học một nội dung mới trong Công nghệ cơ khí, bước nào nên làm trước?',
    options: [
      {
        text: 'Đọc khái niệm và xác định nhiệm vụ của đối tượng kĩ thuật',
        correct: true,
        feedback: 'Đúng. Nắm nhiệm vụ trước sẽ giúp hiểu cấu tạo và nguyên lí dễ hơn.',
      },
      {
        text: 'Học thuộc từng câu mà không cần hiểu nhiệm vụ',
        correct: false,
        feedback: 'Chưa đúng. Công nghệ cơ khí cần hiểu nhiệm vụ, cấu tạo và nguyên lí.',
      },
    ],
  },
  explainChecklist: [
    'Nêu được khái niệm chính.',
    'Nêu được nhiệm vụ hoặc vai trò.',
    'Giải thích được cấu tạo, quy trình hoặc nguyên lí bằng lời của mình.',
  ],
}

export const getInteractiveActivity = (lessonId) =>
  canhDieuActivities[Number(lessonId)] || defaultActivity

export const getChapterAssessmentsByCourse = (courseId) =>
  chapterAssessments.filter((assessment) => assessment.course_id === Number(courseId))

export const getChapterAssessment = (assessmentId) =>
  chapterAssessments.find((assessment) => assessment.id === assessmentId)
