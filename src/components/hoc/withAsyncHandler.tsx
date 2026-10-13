import React, { ComponentType } from 'react';
import { AsyncStatus } from '../../types';

export interface WithAsyncHandlerProps {
  status: AsyncStatus;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
}

export function withAsyncHandler<P extends object>(
  WrappedComponent: ComponentType<P>
): React.FC<P & WithAsyncHandlerProps> {
  const ComponentWithAsync: React.FC<P & WithAsyncHandlerProps> = ({
    status,
    error,
    onRetry,
    isEmpty = false,
    ...restProps
  }) => {
    if (status === 'loading') {
      return (
        <div className="space-y-2 py-4 text-center text-slate-500 text-sm">
          Đang tải danh sách bài tập...
        </div>
      );
    }

    if (status === 'failed') {
      return (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-center space-y-2">
          <p className="text-sm font-semibold text-rose-800">
            {error || 'Lỗi khi tải dữ liệu bài tập.'}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded cursor-pointer"
            >
              Thử lại
            </button>
          )}
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="p-8 bg-white border border-slate-200 rounded-lg text-center text-sm text-slate-500">
          Chưa có bài tập nào phù hợp.
        </div>
      );
    }

    return <WrappedComponent {...(restProps as P)} />;
  };

  return ComponentWithAsync;
}
