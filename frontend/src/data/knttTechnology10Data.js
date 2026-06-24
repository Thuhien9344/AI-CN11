import { createKnttLmsData } from './knttLmsFactory'

const courseSpecs = [
  {
    id: 1,
    short_title: 'Chương I. Đại cương về công nghệ',
    title: 'Chương I. Đại cương về công nghệ',
    description:
      'Hình thành nền tảng về bản chất công nghệ, hệ thống kĩ thuật, công nghệ phổ biến, công nghệ mới, đánh giá công nghệ, cách mạng công nghiệp và định hướng nghề nghiệp.',
  },
  {
    id: 2,
    short_title: 'Chương II. Vẽ kĩ thuật',
    title: 'Chương II. Vẽ kĩ thuật',
    description:
      'Rèn năng lực đọc và lập bản vẽ kĩ thuật: tiêu chuẩn trình bày, hình chiếu, hình cắt, mặt cắt, ren, bản vẽ cơ khí, bản vẽ xây dựng và CAD.',
  },
  {
    id: 3,
    short_title: 'Chương III. Thiết kế kĩ thuật',
    title: 'Chương III. Thiết kế kĩ thuật',
    description:
      'Tổ chức tư duy thiết kế: nhận diện vấn đề, xây dựng yêu cầu, đề xuất phương án, lựa chọn, mô hình hóa, thử nghiệm, đánh giá và cải tiến.',
  },
]

const lessonSpecs = [
  {
    id: 101,
    course_id: 1,
    title: 'Bài 1. Công nghệ và đời sống',
    description: 'Nhận biết vai trò của công nghệ trong sản xuất, đời sống và giải quyết nhu cầu con người.',
    key_points: ['Công nghệ là giải pháp, quy trình, tri thức và phương tiện được tạo ra để đáp ứng nhu cầu thực tiễn.', 'Công nghệ tác động tới sản xuất, học tập, giao tiếp, y tế, giao thông và môi trường.', 'Đánh giá công nghệ cần xem xét lợi ích, chi phí, an toàn, đạo đức và tác động xã hội.'],
  },
  {
    id: 102,
    course_id: 1,
    title: 'Bài 2. Hệ thống kĩ thuật',
    description: 'Phân tích hệ thống kĩ thuật theo đầu vào, xử lí, đầu ra và điều khiển.',
    key_points: ['Hệ thống kĩ thuật gồm các phần tử liên kết để thực hiện một chức năng xác định.', 'Có thể đọc hệ thống theo dòng vật chất, năng lượng, thông tin và tín hiệu điều khiển.', 'Phân tích hệ thống giúp vận hành, chẩn đoán lỗi và cải tiến an toàn.'],
  },
  {
    id: 103,
    course_id: 1,
    title: 'Bài 3. Công nghệ phổ biến',
    description: 'Khái quát một số công nghệ nền trong sản xuất và đời sống.',
    key_points: ['Công nghệ cơ khí, điện, điện tử, tự động hóa, vật liệu và xây dựng tạo nền tảng cho nhiều ngành nghề.', 'Mỗi công nghệ có đối tượng, công cụ, quy trình và yêu cầu an toàn riêng.', 'Liên hệ công nghệ với sản phẩm thực tế giúp tránh học rời rạc.'],
  },
  {
    id: 104,
    course_id: 1,
    title: 'Bài 4. Một số công nghệ mới',
    description: 'Tìm hiểu AI, IoT, robot, in 3D, vật liệu mới và năng lượng tái tạo.',
    key_points: ['Công nghệ mới thường tăng mức tự động hóa, kết nối dữ liệu và cá nhân hóa sản phẩm.', 'Robot, IoT, AI và in 3D hỗ trợ tạo mẫu nhanh, giám sát thông minh và tối ưu quy trình.', 'Đổi mới công nghệ cần đi cùng an toàn dữ liệu, bảo vệ môi trường và trách nhiệm xã hội.'],
  },
  {
    id: 105,
    course_id: 1,
    title: 'Bài 5. Đánh giá công nghệ',
    description: 'Biết đánh giá công nghệ theo hiệu quả, kinh tế, an toàn, môi trường và khả năng triển khai.',
    key_points: ['Đánh giá công nghệ giúp chọn giải pháp phù hợp thay vì chỉ chọn phương án hiện đại nhất.', 'Tiêu chí đánh giá gồm hiệu quả kĩ thuật, chi phí, độ tin cậy, an toàn, môi trường và tác động xã hội.', 'Một công nghệ tốt phải phù hợp bối cảnh sử dụng và nguồn lực hiện có.'],
  },
  {
    id: 106,
    course_id: 1,
    title: 'Bài 6. Cách mạng công nghiệp',
    description: 'Nhận biết các giai đoạn cách mạng công nghiệp và tác động của chuyển đổi số.',
    key_points: ['Cách mạng công nghiệp làm thay đổi phương thức sản xuất và cơ cấu nghề nghiệp.', 'Công nghiệp 4.0 gắn với dữ liệu, kết nối, tự động hóa, AI, robot và hệ thống thông minh.', 'Người học cần năng lực số, tư duy hệ thống và khả năng học suốt đời.'],
  },
  {
    id: 107,
    course_id: 1,
    title: 'Bài 7. Ngành nghề kĩ thuật, công nghệ',
    description: 'Định hướng nghề nghiệp trong lĩnh vực kĩ thuật, công nghệ.',
    key_points: ['Nghề kĩ thuật, công nghệ gồm thiết kế, chế tạo, vận hành, bảo trì, kiểm định, dữ liệu và tự động hóa.', 'Năng lực quan trọng gồm đọc tài liệu kĩ thuật, tư duy thiết kế, làm việc nhóm, an toàn và cập nhật công nghệ.', 'Học sinh cần liên hệ sở thích, năng lực cá nhân với nhu cầu xã hội.'],
  },
  {
    id: 201,
    course_id: 2,
    title: 'Bài 8. Bản vẽ kĩ thuật và tiêu chuẩn trình bày',
    description: 'Hiểu vai trò bản vẽ kĩ thuật và các tiêu chuẩn trình bày cơ bản.',
    flow: 'drawing',
    key_points: ['Bản vẽ kĩ thuật là ngôn ngữ chung trong thiết kế, chế tạo, lắp ráp và thi công.', 'Tiêu chuẩn trình bày giúp bản vẽ rõ ràng, thống nhất và tránh hiểu sai.', 'Khi đọc bản vẽ cần chú ý hình biểu diễn, kích thước, kí hiệu và yêu cầu kĩ thuật.'],
  },
  {
    id: 202,
    course_id: 2,
    title: 'Bài 9. Hình chiếu vuông góc',
    description: 'Biểu diễn vật thể bằng hình chiếu đứng, bằng, cạnh và liên hệ giữa các hình chiếu.',
    flow: 'drawing',
    key_points: ['Hình chiếu vuông góc mô tả chính xác hình dạng vật thể trên các mặt phẳng chiếu.', 'Cần chọn hướng chiếu thể hiện được nhiều đặc điểm hình dạng nhất.', 'Đọc hình chiếu là quá trình ghép thông tin từ nhiều hình để tưởng tượng vật thể.'],
  },
  {
    id: 203,
    course_id: 2,
    title: 'Bài 10. Hình cắt và mặt cắt',
    description: 'Dùng hình cắt, mặt cắt để biểu diễn cấu tạo bên trong vật thể.',
    flow: 'drawing',
    key_points: ['Hình cắt thể hiện phần vật thể sau mặt phẳng cắt để thấy cấu tạo bên trong.', 'Mặt cắt chỉ biểu diễn phần giao giữa vật thể và mặt phẳng cắt.', 'Cần dùng đúng kí hiệu đường gạch vật liệu và vị trí mặt phẳng cắt.'],
  },
  {
    id: 204,
    course_id: 2,
    title: 'Bài 11. Hình chiếu trục đo',
    description: 'Biểu diễn vật thể trong không gian bằng hình chiếu trục đo.',
    flow: 'drawing',
    key_points: ['Hình chiếu trục đo giúp người đọc nhìn nhanh dạng 3D của vật thể.', 'Cần chọn hệ trục và hệ số biến dạng phù hợp để biểu diễn cân đối.', 'Hình trục đo hỗ trợ đọc bản vẽ nhưng không thay thế hoàn toàn hình chiếu vuông góc.'],
  },
  {
    id: 205,
    course_id: 2,
    title: 'Bài 12. Hình chiếu phối cảnh',
    description: 'Tìm hiểu biểu diễn không gian gần với thị giác trong kiến trúc và thiết kế sản phẩm.',
    flow: 'drawing',
    key_points: ['Hình chiếu phối cảnh tạo cảm giác xa gần giống quan sát thực tế.', 'Phối cảnh một điểm tụ hoặc hai điểm tụ phù hợp với các tình huống biểu diễn khác nhau.', 'Phối cảnh giúp trình bày ý tưởng thiết kế dễ hiểu với người không chuyên.'],
  },
  {
    id: 206,
    course_id: 2,
    title: 'Bài 13. Biểu diễn quy ước ren',
    description: 'Đọc và biểu diễn ren theo quy ước trong các chi tiết lắp ghép.',
    flow: 'drawing',
    key_points: ['Ren dùng để lắp ghép, truyền lực hoặc truyền chuyển động.', 'Bản vẽ ren dùng quy ước nét vẽ để biểu diễn nhanh, không vẽ đầy đủ biên dạng xoắn.', 'Cần phân biệt ren ngoài, ren trong và các thông số cơ bản của ren.'],
  },
  {
    id: 207,
    course_id: 2,
    title: 'Bài 14. Bản vẽ cơ khí',
    description: 'Đọc bản vẽ chi tiết và bản vẽ lắp trong cơ khí.',
    flow: 'drawing',
    key_points: ['Bản vẽ chi tiết cung cấp thông tin để chế tạo một chi tiết.', 'Bản vẽ lắp thể hiện vị trí, quan hệ và cách lắp các chi tiết trong cụm hoặc máy.', 'Đọc bản vẽ cơ khí cần kết hợp hình biểu diễn, kích thước, bảng kê và yêu cầu kĩ thuật.'],
  },
  {
    id: 208,
    course_id: 2,
    title: 'Bài 15. Bản vẽ xây dựng',
    description: 'Nhận biết mặt bằng, mặt đứng, mặt cắt và kí hiệu trong bản vẽ xây dựng.',
    flow: 'drawing',
    key_points: ['Bản vẽ xây dựng dùng để thiết kế, thi công và quản lí công trình.', 'Mặt bằng cho biết bố trí không gian; mặt đứng cho biết hình dáng ngoài; mặt cắt cho biết cấu tạo theo chiều cao.', 'Cần đọc đúng tỉ lệ, kích thước, kí hiệu cửa, tường, cầu thang và vật liệu.'],
  },
  {
    id: 209,
    course_id: 2,
    title: 'Bài 16. Vẽ kĩ thuật với sự trợ giúp của máy tính',
    description: 'Khai thác CAD để tạo, sửa, lưu trữ và chia sẻ bản vẽ.',
    flow: 'drawing',
    key_points: ['CAD giúp tăng tốc vẽ, chỉnh sửa, quản lí lớp, ghi kích thước và xuất bản vẽ.', 'Dùng CAD vẫn phải tuân thủ tiêu chuẩn trình bày bản vẽ kĩ thuật.', 'Năng lực CAD là nền tảng quan trọng cho thiết kế và sản xuất hiện đại.'],
  },
  {
    id: 301,
    course_id: 3,
    title: 'Bài 17. Khái quát về thiết kế kĩ thuật',
    description: 'Hiểu thiết kế kĩ thuật là hoạt động giải quyết vấn đề bằng giải pháp công nghệ.',
    flow: 'design',
    key_points: ['Thiết kế kĩ thuật bắt đầu từ nhu cầu hoặc vấn đề thực tế.', 'Kết quả thiết kế có thể là sản phẩm, quy trình, hệ thống hoặc giải pháp kĩ thuật.', 'Thiết kế tốt cần cân bằng công năng, an toàn, thẩm mĩ, chi phí và môi trường.'],
  },
  {
    id: 302,
    course_id: 3,
    title: 'Bài 18. Quy trình thiết kế kĩ thuật',
    description: 'Thực hành quy trình xác định vấn đề, nghiên cứu, đề xuất, chọn, tạo mẫu, thử nghiệm và cải tiến.',
    flow: 'design',
    key_points: ['Quy trình thiết kế là một vòng lặp, không phải đường thẳng một chiều.', 'Thử nghiệm giúp phát hiện lỗi trước khi hoàn thiện sản phẩm.', 'Cải tiến dựa trên dữ liệu, phản hồi và tiêu chí ban đầu.'],
  },
  {
    id: 303,
    course_id: 3,
    title: 'Bài 19. Những yếu tố ảnh hưởng đến thiết kế kĩ thuật',
    description: 'Phân tích yêu cầu người dùng, điều kiện sử dụng, vật liệu, công nghệ, kinh tế và môi trường.',
    flow: 'design',
    key_points: ['Thiết kế chịu ảnh hưởng bởi nhu cầu người dùng, bối cảnh, vật liệu, công nghệ và nguồn lực.', 'Ràng buộc càng rõ thì phương án thiết kế càng dễ đánh giá.', 'Bỏ qua an toàn hoặc môi trường có thể làm giải pháp không phù hợp dù hoạt động được.'],
  },
  {
    id: 304,
    course_id: 3,
    title: 'Bài 20. Nguyên tắc thiết kế kĩ thuật',
    description: 'Vận dụng nguyên tắc đơn giản, tin cậy, an toàn, tiết kiệm và thân thiện môi trường.',
    flow: 'design',
    key_points: ['Nguyên tắc thiết kế giúp giải pháp có tính sử dụng, chế tạo và bảo trì tốt hơn.', 'Thiết kế cần ưu tiên an toàn và độ tin cậy trong điều kiện làm việc thực tế.', 'Một sản phẩm tốt thường đơn giản vừa đủ, dễ dùng, dễ sửa và tiết kiệm tài nguyên.'],
  },
  {
    id: 305,
    course_id: 3,
    title: 'Bài 21. Phương pháp, phương tiện hỗ trợ thiết kế kĩ thuật',
    description: 'Sử dụng phác thảo, sơ đồ, mô hình, CAD, mô phỏng, in 3D và làm việc nhóm.',
    flow: 'design',
    key_points: ['Phác thảo và sơ đồ giúp biểu đạt ý tưởng nhanh ở giai đoạn đầu.', 'CAD, mô phỏng và in 3D giúp tăng tốc tạo mẫu, kiểm tra và cải tiến.', 'Làm việc nhóm giúp kết hợp nhiều góc nhìn khi giải quyết vấn đề kĩ thuật.'],
  },
]

const data = createKnttLmsData({
  theme: 'design',
  gradeTitle: 'Công nghệ 10 - Thiết kế và công nghệ',
  courseSpecs,
  lessonSpecs,
  assessmentPrefix: 'kntt10',
  defaultTitle: 'Công nghệ 10',
})

export const canhDieuCourses = data.courses
export const canhDieuLessons = data.lessons
export const canhDieuQuestions = data.questions
export const canhDieuActivities = data.activities
export const chapterAssessments = data.chapterAssessments
