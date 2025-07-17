import React, { useRef } from 'react';
import { ArrowRight, UploadCloud } from 'lucide-react';
import PromptChips from './PromptChips';

type PromptInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  disabled?: boolean;
  onFileIconClick?: () => void;
  fileCount?: number;
};

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, onSubmit, disabled, onFileIconClick, fileCount }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-2 pb-2">
      <PromptChips onChipClick={text => {
        if (textareaRef.current) {
          textareaRef.current.value = text;
          textareaRef.current.focus();
          onChange({ target: { value: text } } as React.ChangeEvent<HTMLInputElement>);
        }
      }} />
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
        className="relative flex items-end bg-white/30 rounded-full shadow-md px-4 py-4 gap-3 border border-teal-100 focus-within:ring-2 focus-within:ring-teal-300 backdrop-blur-md"
      >
        <div className="flex flex-col items-center justify-end">
          <button
            type="button"
            tabIndex={-1}
            onClick={onFileIconClick}
            className="p-2 rounded-full hover:bg-teal-100/40 transition-colors text-teal-500 focus:outline-none"
            aria-label="Upload file"
          >
            <UploadCloud className="w-6 h-6" />
          </button>
          {typeof fileCount === 'number' && (
            <span className="text-xs text-teal-500 font-semibold mt-0.5 select-none">{fileCount}/5</span>
          )}
        </div>
        <textarea
          ref={textareaRef}
          className={`flex-1 bg-transparent outline-none px-2 py-3 rounded-full text-lg placeholder-gray-400 resize-none ${value ? 'text-white' : 'text-gray-800'}`}
          placeholder="Type your message..."
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={1}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
        <button
          type="submit"
          className="p-3 rounded-full bg-teal-500 hover:bg-teal-600 transition-colors text-white disabled:opacity-50 ml-2"
          disabled={disabled || !value.trim()}
          aria-label="Send prompt"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default PromptInput;
