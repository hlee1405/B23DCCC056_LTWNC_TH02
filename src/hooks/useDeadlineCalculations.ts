import { useEffect, useState } from 'react';
import { calculateDeadlineInfo, DeadlineInfo } from '../utils/dateUtils';

export function useDeadlineCalculations(dueDate: string, isCompleted: boolean): DeadlineInfo {
  const [info, setInfo] = useState<DeadlineInfo>(() =>
    calculateDeadlineInfo(dueDate, isCompleted)
  );

  useEffect(() => {
    setInfo(calculateDeadlineInfo(dueDate, isCompleted));
    if (isCompleted) return;

    const interval = setInterval(() => {
      setInfo(calculateDeadlineInfo(dueDate, isCompleted));
    }, 60000);

    return () => clearInterval(interval);
  }, [dueDate, isCompleted]);

  return info;
}
