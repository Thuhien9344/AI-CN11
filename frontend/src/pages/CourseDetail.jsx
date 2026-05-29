import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { coursesAPI, lessonsAPI } from '../services/api'
import {
  getChapterAssessmentsByCourse,
  getSampleCourse,
  getSampleLessonsByCourse,
} from '../data/courseCatalog'
import { useAuthStore } from '../store'
import {
  createReferenceMaterial,
  deleteReferenceMaterial,
  downloadReferenceMaterial,
  formatFileSize,
  readReferenceMaterials,
} from '../utils/referenceMaterials'

export default function CourseDetail() {
  const { courseId } = useParams()
  const user = useAuthStore((state) => state.user)
  const isTeacher = user?.role === 'teacher'
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [materials, setMaterials] = useState([])
  const [materialForm, setMaterialForm] = useState({ title: '', description: '', lessonId: '' })
  const [selectedMaterialFile, setSelectedMaterialFile] = useState(null)
  const [isUploadingMaterial, setIsUploadingMaterial] = useState(false)
  const chapterAssessments = getChapterAssessmentsByCourse(courseId)

  useEffect(() => {
    fetchData()
    loadMaterials()
  }, [courseId])

  const fetchData = async () => {
    try {
      const courseRes = await coursesAPI.get(courseId)
      setCourse(courseRes.data)
      const lessonsRes = await lessonsAPI.list(courseId)
      setLessons(lessonsRes.data)
    } catch (error) {
      setCourse(getSampleCourse(courseId))
      setLessons(getSampleLessonsByCourse(courseId))
    } finally {
      setIsLoading(false)
    }
  }

  const loadMaterials = async () => {
    try {
      setMaterials(await readReferenceMaterials())
    } catch {
      toast.error('Không đọc được tài liệu của chương')
    }
  }

  const chapterMaterials = useMemo(
    () => materials.filter((material) => material.course_id === Number(courseId)),
    [materials, courseId],
  )

  const getLessonTitle = (lessonId) =>
    lessons.find((lesson) => lesson.id === Number(lessonId))?.title || 'Tài liệu chung của chương'

  const uploadChapterMaterial = async (event) => {
    event.preventDefault()
    setIsUploadingMaterial(true)

    try {
      await createReferenceMaterial({
        file: selectedMaterialFile,
        title: materialForm.title,
        description: materialForm.description,
        courseId,
        lessonId: materialForm.lessonId,
        uploader: user?.full_name || user?.username || 'Giáo viên',
        uploaderUserId: user?.id,
      })
      setMaterialForm({ title: '', description: '', lessonId: '' })
      setSelectedMaterialFile(null)
      event.target.reset()
      await loadMaterials()
      toast.success('Đã tải tài liệu lên chương')
    } catch (error) {
      toast.error(error.message || 'Không thể tải tài liệu')
    } finally {
      setIsUploadingMaterial(false)
    }
  }

  const removeChapterMaterial = async (materialId) => {
    try {
      await deleteReferenceMaterial(materialId)
      await loadMaterials()
      toast.success('Đã xóa tài liệu')
    } catch (error) {
      toast.error(error.message || 'Không thể xóa tài liệu')
    }
  }

  const downloadChapterMaterial = async (material) => {
    try {
      await downloadReferenceMaterial(material)
    } catch (error) {
      toast.error(error.message || 'Không thể tải tài liệu')
    }
  }

  if (isLoading) {
    return <div className="page-container text-center text-slate-600">Đang tải...</div>
  }

  return (
    <div className="page-container">
      <Link to="/" className="mb-5 inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800">
        ← Quay lại khu học tập
      </Link>

      <section className="panel motion-shimmer mb-8 overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="p-6 sm:p-8">
            <p className="muted-label mb-2">Chủ đề học tập</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              {course?.title}
            </h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">{course?.description}</p>
          </div>
          <div className="border-t border-slate-200 bg-slate-50 p-6 lg:border-l lg:border-t-0">
            <h2 className="font-bold text-slate-950">Mục tiêu học phần</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Nắm được khái niệm, vai trò và yêu cầu kĩ thuật trọng tâm của chương.</li>
              <li>Giải thích được quy trình, cấu tạo hoặc hệ thống bằng lời của mình.</li>
              <li>Vận dụng kiến thức vào tình huống thực tế qua mô phỏng, game và quiz.</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Danh sách bài học</h2>
              <p className="text-sm text-slate-500">Học theo thứ tự để kiến thức liền mạch.</p>
            </div>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                to={`/lessons/${lesson.id}`}
                className="motion-card group flex gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-sm font-bold text-blue-700">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-950 group-hover:text-blue-700">
                    {lesson.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{lesson.description}</p>
                </div>
                <span className="hidden self-center text-blue-700 sm:block">→</span>
              </Link>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="panel p-5">
            <h3 className="font-bold text-slate-950">Thông tin chủ đề</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Số bài học</span>
                <span className="font-semibold text-slate-900">{lessons.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Hoạt động</span>
                <span className="font-semibold text-slate-900">Mô phỏng 3D, AI, Game, Quiz</span>
              </div>
              <div className="flex justify-between">
                <span>Gợi ý thời lượng</span>
                <span className="font-semibold text-slate-900">2 giờ</span>
              </div>
            </div>
          </div>

          <div className="motion-card rounded-lg border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="font-bold text-emerald-950">Tài liệu theo chương</h3>
            <p className="mt-2 text-sm leading-6 text-emerald-900">
              Tài liệu được gắn với chương này, có thể chọn thêm từng bài học cụ thể khi tải lên.
            </p>

            {isTeacher && (
              <form onSubmit={uploadChapterMaterial} className="mt-4 space-y-3 rounded-lg bg-white p-4">
                <input
                  type="text"
                  value={materialForm.title}
                  onChange={(event) => setMaterialForm((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Tên tài liệu"
                  className="w-full rounded-md border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
                <textarea
                  value={materialForm.description}
                  onChange={(event) => setMaterialForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Mô tả ngắn"
                  rows="3"
                  className="w-full rounded-md border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
                <select
                  value={materialForm.lessonId}
                  onChange={(event) => setMaterialForm((prev) => ({ ...prev, lessonId: event.target.value }))}
                  className="w-full rounded-md border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <option value="">Tài liệu chung của chương</option>
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                  ))}
                </select>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  onChange={(event) => setSelectedMaterialFile(event.target.files?.[0] || null)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  required
                />
                {selectedMaterialFile && (
                  <p className="text-xs text-slate-500">
                    Đã chọn: {selectedMaterialFile.name} · {formatFileSize(selectedMaterialFile.size)}
                  </p>
                )}
                <button type="submit" disabled={isUploadingMaterial} className="primary-button w-full">
                  {isUploadingMaterial ? 'Đang tải lên...' : 'Tải tài liệu lên chương'}
                </button>
              </form>
            )}

            <div className="mt-4 space-y-3">
              {chapterMaterials.length === 0 ? (
                <p className="rounded-lg bg-white p-3 text-sm text-slate-600">Chưa có tài liệu cho chương này.</p>
              ) : (
                chapterMaterials.map((material) => (
                  <article key={material.id} className="rounded-lg border border-emerald-100 bg-white p-3">
                    <p className="font-bold text-slate-950">{material.title}</p>
                    <p className="mt-1 text-xs font-semibold text-emerald-700">{getLessonTitle(material.lesson_id)}</p>
                    {material.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-600">{material.description}</p>
                    )}
                    <p className="mt-2 text-xs text-slate-500">
                      {material.file_name} · {formatFileSize(material.file_size)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => downloadChapterMaterial(material)} className="primary-button">
                        Tải xuống
                      </button>
                      {isTeacher && (
                        <button
                          type="button"
                          onClick={() => removeChapterMaterial(material.id)}
                          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700 transition hover:bg-red-100"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {chapterAssessments.length > 0 && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
              <h3 className="font-bold text-blue-950">Kiểm tra theo chương</h3>
              <p className="mt-2 text-sm leading-6 text-blue-900">
                Không gian luyện tập riêng cho từng chương, có chấm điểm và giải thích sau khi nộp bài.
              </p>
              <Link to={`/courses/${courseId}/chapter-tests`} className="primary-button mt-4 w-full justify-center">
              Mở bài kiểm tra chương
              </Link>
            </div>
          )}

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-bold text-amber-950">Cách học hiệu quả</h3>
            <p className="mt-2 text-sm leading-6 text-amber-900">
              Đọc bài trước, mở mô phỏng để quan sát chuyển động, sau đó dùng bài kiểm tra nhanh
              để đánh giá khả năng giải thích bằng lời của mình.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
