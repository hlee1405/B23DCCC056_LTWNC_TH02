import { Assignment, Priority } from '../types';

export const COURSES_SAMPLE = [
  'Lập trình Web nâng cao',
  'Cấu trúc dữ liệu & Giải thuật',
  'Cơ sở dữ liệu',
  'Trí tuệ nhân tạo',
  'Mạng máy tính',
  'An toàn thông tin',
  'Kiến trúc máy tính',
  'Hệ điều hành',
  'Công nghệ phần mềm',
  'Phát triển ứng dụng di động',
];

export const TITLES_SAMPLE = [
  'Bài tập lớn cuối kỳ',
  'Thực hành Lab 1',
  'Thực hành Lab 2',
  'Tiểu luận chuyên đề',
  'Báo cáo tiến độ đồ án',
  'Kiểm tra định kỳ 1',
  'Kiểm tra định kỳ 2',
  'Luyện tập trắc nghiệm',
  'Phân tích ca sử dụng',
  'Thiết kế cơ sở dữ liệu',
];

export function generate10kAssignments(count = 10000): Assignment[] {
  const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];
  const now = Date.now();
  const assignments: Assignment[] = new Array(count);

  for (let i = 0; i < count; i++) {
    const course = COURSES_SAMPLE[i % COURSES_SAMPLE.length];
    const baseTitle = TITLES_SAMPLE[i % TITLES_SAMPLE.length];
    const priority = priorities[i % priorities.length];
    // Ngày nộp dao động từ -10 ngày (quá hạn) đến +40 ngày (tương lai)
    const dayOffset = (i % 50) - 10;
    const dueDate = new Date(now + dayOffset * 24 * 60 * 60 * 1000).toISOString();
    const isCompleted = i % 4 === 0;

    assignments[i] = {
      id: `stress-asg-${i + 1}`,
      course,
      title: `${baseTitle} #${i + 1}`,
      dueDate,
      priority,
      isCompleted,
      createdAt: new Date(now - (i % 15) * 86400000).toISOString(),
    };
  }

  return assignments;
}
