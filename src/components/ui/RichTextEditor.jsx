import { useRef, useState, useEffect } from 'react';
import { cn } from '@utils/helpers';

const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = '',
  label,
  required,
  error,
  rows = 4,
  maxChars,
  hint,
}) => {
  const textareaRef = useRef(null);

  // Markdown insertion helper
  const handleFormat = (type) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let before = '';
    let after = '';
    let defaultText = '';

    switch (type) {
      case 'bold':
        before = '**';
        after = '**';
        defaultText = 'bold text';
        break;
      case 'italic':
        before = '*';
        after = '*';
        defaultText = 'italic text';
        break;
      case 'underline':
        before = '<u>';
        after = '</u>';
        defaultText = 'underlined text';
        break;
      case 'strikethrough':
        before = '~~';
        after = '~~';
        defaultText = 'strikethrough text';
        break;
      case 'code':
        before = '`';
        after = '`';
        defaultText = 'code';
        break;
      case 'link':
        before = '[';
        after = '](https://example.com)';
        defaultText = 'link text';
        break;
      case 'bullet':
        before = '\n• ';
        break;
      case 'number':
        before = '\n1. ';
        break;
      case 'clear':
        // Strip markdown and html tags
        const cleared = selectedText
          .replace(/[\*_~`]/g, '')
          .replace(/<\/?u>/g, '')
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
        const clearedVal = text.substring(0, start) + cleared + text.substring(end);
        onChange({ target: { value: clearedVal } });
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start, start + cleared.length);
        }, 0);
        return;
      default:
        return;
    }

    const insertion = selectedText || defaultText;
    const replacement = before + insertion + after;
    const newValue = text.substring(0, start) + replacement + text.substring(end);

    onChange({ target: { value: newValue } });

    // Focus and select the newly formatted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + insertion.length
      );
    }, 0);
  };

  const charCount = value ? value.length : 0;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-danger-500 ml-0.5">*</span>}
        </label>
      )}

      <div className={cn(
        "flex flex-col border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all overflow-hidden",
        error && "border-danger-500 focus-within:ring-danger-500 focus-within:border-danger-500"
      )}>
        {/* Formatting Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-surface-50 dark:bg-surface-900/50 border-b border-surface-200 dark:border-surface-700 select-none">
          <button
            type="button"
            onClick={() => handleFormat('bold')}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 font-bold text-sm transition-colors"
            title="Bold (Ctrl+B)"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => handleFormat('italic')}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 italic text-sm transition-colors"
            title="Italic (Ctrl+I)"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => handleFormat('underline')}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 underline text-sm transition-colors"
            title="Underline (Ctrl+U)"
          >
            U
          </button>
          <button
            type="button"
            onClick={() => handleFormat('strikethrough')}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 line-through text-sm transition-colors"
            title="Strikethrough"
          >
            S
          </button>

          <div className="w-px h-5 bg-surface-200 dark:bg-surface-700 mx-1" />

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => handleFormat('bullet')}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 transition-colors"
            title="Bullet List"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16M4 6h.01M4 12h.01M4 18h.01" />
            </svg>
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onClick={() => handleFormat('number')}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 font-mono text-xs transition-colors"
            title="Numbered List"
          >
            1.
          </button>

          <div className="w-px h-5 bg-surface-200 dark:bg-surface-700 mx-1" />

          {/* Link */}
          <button
            type="button"
            onClick={() => handleFormat('link')}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 transition-colors"
            title="Hyperlink"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>

          {/* Code */}
          <button
            type="button"
            onClick={() => handleFormat('code')}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 font-mono text-xs transition-colors"
            title="Code Block"
          >
            &lt;/&gt;
          </button>

          {/* Clear Format */}
          <button
            type="button"
            onClick={() => handleFormat('clear')}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 transition-colors ml-auto"
            title="Clear formatting"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Textarea */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full p-4 bg-transparent outline-none border-none resize-y text-sm text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 font-normal focus:ring-0"
          />

          {/* Bottom Resize icon / Char count */}
          <div className="absolute bottom-2 right-2 pointer-events-none flex items-center gap-1.5 opacity-60">
            <svg className="w-3.5 h-3.5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-5 5m5-5l-5-5m5 5H9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Helper character counters & hint */}
      <div className="flex justify-between items-center text-xs text-surface-400">
        <div>{hint}</div>
        {maxChars ? (
          <div className={cn(charCount > maxChars ? "text-danger-500 font-medium" : "")}>
            {charCount} / {maxChars} characters
          </div>
        ) : (
          <div>{charCount} characters</div>
        )}
      </div>
      
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
};

export default RichTextEditor;
