import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppDispatch } from '../app/hooks';
import { addAssignment } from '../features/assignments/assignmentSlice';
import { NewAssignmentPayload, Priority } from '../types';

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableCourses: string[];
}

export const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({
  isOpen,
  onClose,
  availableCourses,
}) => {
  const dispatch = useAppDispatch();

  const [course, setCourse] = useState<string>('Lập trình Web nâng cao');
  const [customCourse, setCustomCourse] = useState<string>('');
  const [isCustomCourse, setIsCustomCourse] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  const getDefaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setHours(23, 59, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const [dueDate, setDueDate] = useState<string>(getDefaultDueDate());
  const [priority, setPriority] = useState<Priority>('high');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCourse = isCustomCourse ? customCourse.trim() : course.trim();

    if (!finalCourse) {
      setError('Vui lòng chọn hoặc nhập tên môn học.');
      return;
    }
    if (!title.trim()) {
      setError('Vui lòng nhập tên bài tập.');
      return;
    }
    if (!dueDate) {
      setError('Vui lòng chọn hạn nộp bài.');
      return;
    }

    const payload: NewAssignmentPayload = {
      course: finalCourse,
      title: title.trim(),
      dueDate: new Date(dueDate).toISOString(),
      priority,
    };

    dispatch(addAssignment(payload));
    setTitle('');
    setCustomCourse('');
    setIsCustomCourse(false);
    setError('');
    onClose();
  };

  const allCourses = Array.from(
    new Set([
      'Lập trình Web nâng cao',
      'Cấu trúc dữ liệu & Giải thuật',
      'Cơ sở dữ liệu',
      'Trí tuệ nhân tạo',
      'Mạng máy tính',
      'An toàn thông tin',
      ...availableCourses,
    ])
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
      data-testid="add-modal-overlay"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-modal-title"
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
          <h2 id="add-modal-title" className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Thêm bài tập mới
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {error && (
            <div
              data-testid="form-error"
              className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded border border-rose-200 dark:border-rose-800"
            >
              {error}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="course-select" className="font-semibold text-slate-700 dark:text-slate-300">
                Môn học
              </label>
              <button
                type="button"
                onClick={() => setIsCustomCourse(!isCustomCourse)}
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {isCustomCourse ? 'Chọn từ danh sách' : '+ Nhập môn khác'}
              </button>
            </div>
            {isCustomCourse ? (
              <input
                id="course-input"
                aria-label="Tên môn học khác"
                type="text"
                value={customCourse}
                onChange={(e) => setCustomCourse(e.target.value)}
                placeholder="Nhập tên môn học..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            ) : (
              <select
                id="course-select"
                aria-label="Chọn môn học"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {allCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="title-input" className="font-semibold text-slate-700 dark:text-slate-300">
              Tên bài tập
            </label>
            <input
              id="title-input"
              aria-label="Tên bài tập"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Bài tập lớn Redux Toolkit, Lab 4..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="duedate-input" className="font-semibold text-slate-700 dark:text-slate-300">
                Hạn nộp
              </label>
              <input
                id="duedate-input"
                aria-label="Hạn nộp"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="priority-select" className="font-semibold text-slate-700 dark:text-slate-300">
                Độ ưu tiên
              </label>
              <select
                id="priority-select"
                aria-label="Độ ưu tiên"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="urgent">Khẩn cấp</option>
                <option value="high">Ưu tiên cao</option>
                <option value="medium">Bình thường</option>
                <option value="low">Thấp</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold cursor-pointer shadow-xs"
            >
              Tạo bài tập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
