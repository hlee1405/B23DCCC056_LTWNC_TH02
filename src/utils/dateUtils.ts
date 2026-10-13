export interface DeadlineInfo {
  isOverdue: boolean;
  displayText: string;
  urgency: 'overdue' | 'today' | 'upcoming' | 'completed';
}

export function calculateDeadlineInfo(dueDateStr: string, isCompleted: boolean): DeadlineInfo {
  if (isCompleted) {
    return {
      isOverdue: false,
      displayText: 'Đã hoàn thành',
      urgency: 'completed',
    };
  }

  const now = new Date();
  const due = new Date(dueDateStr);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays);
    const overdueHours = Math.abs(Math.floor(diffHours));
    const text = overdueHours < 24 ? `Quá hạn ${overdueHours} giờ` : `Quá hạn ${overdueDays || 1} ngày`;
    return {
      isOverdue: true,
      displayText: text,
      urgency: 'overdue',
    };
  }

  const isToday =
    now.getFullYear() === due.getFullYear() &&
    now.getMonth() === due.getMonth() &&
    now.getDate() === due.getDate();

  if (isToday) {
    const hours = Math.max(1, Math.floor(diffHours));
    return {
      isOverdue: false,
      displayText: `Hôm nay (còn ${hours} giờ)`,
      urgency: 'today',
    };
  }

  const days = Math.max(1, Math.ceil(diffHours / 24));
  return {
    isOverdue: false,
    displayText: `Còn ${days} ngày`,
    urgency: 'upcoming',
  };
}

export function formatVietnameseDateTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

export function createRelativeDate(daysOffset: number, hour = 23, minute = 59): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/**
 * Tính số ngày còn lại đến hạn nộp (dương: còn hạn, âm: quá hạn)
 */
export function calcDaysLeft(dueDateStr: string, fromDate: Date = new Date()): number {
  const due = new Date(dueDateStr);
  const diffMs = due.getTime() - fromDate.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

