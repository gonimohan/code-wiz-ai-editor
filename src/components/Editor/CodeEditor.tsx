import React from 'react';
import { Code, Play, Zap, X, CheckSquare } from 'lucide-react';
import { FileNode } from '../FileExplorer/types';

interface CodeEditorProps {
  selectedFile: FileNode | null;
  editorContent: string;
  viewMode: 'code' | 'preview';
  aiActive: boolean;
  aiThinking: boolean;
  aiSuggestion: string;
  onEditorChange: (content: string) => void;
  onViewModeChange: (mode: 'code' | 'preview') => void;
  onAcceptSuggestion: () => void;
  onClearSuggestion: () => void;
}

export const CodeEditor = ({
  selectedFile,
  editorContent,
  viewMode,
  aiActive,
  aiThinking,
  aiSuggestion,
  onEditorChange,
  onViewModeChange,
  onAcceptSuggestion,
  onClearSuggestion
}: CodeEditorProps) => {
  if (!selectedFile) {
    return (
      <div className="no-file-selected">
        <Code size={48} className="text-[#858585] mb-4" />
        <span>Select a file to edit</span>
      </div>
    );
  }

  return (
    <div className="editor-container h-full flex flex-col">
      <div className="editor-header">
        <div className="view-tabs">
          <button 
            className={`tab ${viewMode === 'code' ? 'active' : ''}`}
            onClick={() => onViewModeChange('code')}
          >
            <Code size={16} className="mr-1" /> Code
          </button>
          <button 
            className={`tab ${viewMode === 'preview' ? 'active' : ''}`}
            onClick={() => onViewModeChange('preview')}
          >
            <Play size={16} className="mr-1" /> Preview
          </button>
        </div>
        <div className="path-display">
          {selectedFile && (
            <div className="breadcrumb">
              <span className="breadcrumb-item">src</span>
              <span className="breadcrumb-separator">/</span>
              {selectedFile.id.includes('components') && (
                <>
                  <span className="breadcrumb-item">components</span>
                  <span className="breadcrumb-separator">/</span>
                </>
              )}
              <span className="breadcrumb-item">{selectedFile.name}</span>
            </div>
          )}
        </div>
      </div>

      {viewMode === 'code' ? (
        <div className="code-editor flex-1">
          <div className="line-numbers">
            {editorContent.split('\n').map((_, i) => (
              <div key={i} className="line-number">{i + 1}</div>
            ))}
          </div>
          <textarea
            value={editorContent}
            onChange={(e) => onEditorChange(e.target.value)}
            className="code-input"
            spellCheck="false"
          />
        </div>
      ) : (
        <div className="preview-pane">
          {selectedFile?.language === 'html' ? (
            <iframe
              title="HTML Preview"
              srcDoc={editorContent}
              className="html-preview"
            />
          ) : (
            <div className="preview-message">
              <div className="flex flex-col items-center">
                <Play size={24} className="mb-2 text-gray-400" />
                <span>Preview not available for this file type</span>
                <span className="text-xs mt-2 text-gray-500">Only HTML files can be previewed directly</span>
              </div>
            </div>
          )}
        </div>
      )}

      {aiActive && (
        <div className="ai-suggestion-panel">
          <div className="ai-header">
            <div className="flex items-center">
              <Zap size={16} className="mr-1" />
              <span>AI Assistant</span>
              {aiThinking && <span className="thinking-indicator">thinking...</span>}
            </div>
            <button 
              onClick={onClearSuggestion}
              className="text-xs hover:text-white"
              title="Clear suggestion"
            >
              <X size={14} />
            </button>
          </div>
          {aiSuggestion && (
            <div className="suggestion-content">
              <pre>{aiSuggestion}</pre>
              <button onClick={onAcceptSuggestion} className="accept-btn">
                <CheckSquare size={14} className="mr-1" /> 
                Accept Suggestion
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
