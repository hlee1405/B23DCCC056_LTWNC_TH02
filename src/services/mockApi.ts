import { ApiResponse, Assignment } from '../types';
import { createRelativeDate } from '../utils/dateUtils';
import { wrapApiResponse } from '../utils/generics';

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    course: 'Lập trình Web nâng cao',
    title: 'Bài tập lớn: Student Deadline Tracker',
    dueDate: createRelativeDate(2, 23, 59),
    priority: 'urgent',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'asg-2',
    course: 'Cấu trúc dữ liệu & Giải thuật',
    title: 'Cài đặt thuật toán Dijkstra và AVL Tree',
    dueDate: createRelativeDate(0, 23, 0),
    priority: 'high',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'asg-3',
    course: 'Cơ sở dữ liệu',
    title: 'Thiết kế lược đồ quan hệ chuẩn 3NF',
    dueDate: createRelativeDate(-2, 20, 0),
    priority: 'high',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'asg-4',
    course: 'Trí tuệ nhân tạo',
    title: 'Báo cáo: Huấn luyện mô hình CNN',
    dueDate: createRelativeDate(5, 17, 30),
    priority: 'medium',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'asg-5',
    course: 'Mạng máy tính',
    title: 'Lab: Phân tích gói tin Wireshark',
    dueDate: createRelativeDate(-1, 23, 59),
    priority: 'medium',
    isCompleted: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'asg-6',
    course: 'An toàn thông tin',
    title: 'Trắc nghiệm mã hóa RSA & AES',
    dueDate: createRelativeDate(7, 12, 0),
    priority: 'low',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'student_deadlines_data';

export const mockAssignmentApi = {
  async getAssignments(): Promise<ApiResponse<Assignment[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return wrapApiResponse<Assignment[]>(parsed);
        }
      } catch {
        // Fallback to default
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ASSIGNMENTS));
    return wrapApiResponse<Assignment[]>(INITIAL_ASSIGNMENTS);
  },

  save(assignments: Assignment[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  },

  async reset(): Promise<ApiResponse<Assignment[]>> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ASSIGNMENTS));
    return wrapApiResponse<Assignment[]>(INITIAL_ASSIGNMENTS);
  },
};
