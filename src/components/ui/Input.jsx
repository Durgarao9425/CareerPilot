import { forwardRef } from 'react';
import { cn } from '@utils/helpers';

const Input = forwardRef(
  ({ label, error, hint, className, containerClassName, required, ...props }, ref) => {
    return (
      <div className={cn(containerClassName)} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {label && (
          <label className="label">
            {label}
            {required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn('input', error && 'input-error', className)}
          {...props}
        />
        {error && (
          <p style={{ fontSize: 12, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg style={{ width: 12, height: 12, flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef(
  ({ label, error, hint, className, containerClassName, required, rows = 3, ...props }, ref) => {
    return (
      <div className={cn(containerClassName)} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {label && (
          <label className="label">
            {label}
            {required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn('input', error && 'input-error', className)}
          style={{ resize: 'none' }}
          {...props}
        />
        {error && <p style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</p>}
        {hint && !error && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export const Select = forwardRef(
  ({ label, error, children, className, containerClassName, required, ...props }, ref) => {
    return (
      <div className={cn(containerClassName)} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {label && (
          <label className="label">
            {label}
            {required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn('input', error && 'input-error', className)}
          {...props}
        >
          {children}
        </select>
        {error && <p style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Input;
