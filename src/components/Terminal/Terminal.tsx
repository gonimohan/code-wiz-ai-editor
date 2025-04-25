
import React, { useState } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, MinusSquare } from 'lucide-react';

interface TerminalProps {
  height: number;
  isVisible: boolean;
  onHeightChange: (height: number) => void;
  onVisibilityChange: (visible: boolean) => void;
}

export const Terminal = ({ height, isVisible, onHeightChange, onVisibilityChange }: TerminalProps) => {
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '~/project',
    '> npm install',
    'Installing dependencies...',
    'Done!',
    '~/project'
  ]);

  const executeCommand = (command: string) => {
    setTerminalOutput(prev => [...prev, `> ${command}`]);
    
    setTimeout(() => {
      if (command.includes('npm install')) {
        setTerminalOutput(prev => [...prev, 'Installing dependencies...', 'Done!', '~/project']);
      } else if (command.includes('npm run')) {
        setTerminalOutput(prev => [...prev, 'Starting development server...', 'Server running at localhost:3000', '~/project']);
      } else if (command.includes('clear')) {
        setTerminalOutput(['~/project']);
      } else {
        setTerminalOutput(prev => [...prev, `Command executed: ${command}`, '~/project']);
      }
    }, 700);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="terminal-area"
      style={{ height: `${height}px` }}
    >
      <div className="terminal-header">
        <div className="flex items-center">
          <TerminalIcon size={16} className="mr-1" />
          <span>Terminal</span>
        </div>
        <div className="terminal-actions">
          <button 
            className="terminal-btn" 
            title="Clear Terminal"
            onClick={() => setTerminalOutput(['~/project'])}
          >
            <X size={14} />
          </button>
          <button 
            className="terminal-btn" 
            title="Maximize Terminal"
            onClick={() => onHeightChange(Math.min(500, window.innerHeight / 2))}
          >
            <Maximize2 size={14} />
          </button>
          <button 
            className="terminal-btn" 
            title="Hide Terminal"
            onClick={() => onVisibilityChange(false)}
          >
            <MinusSquare size={14} />
          </button>
        </div>
      </div>
      <div className="terminal-content">
        {terminalOutput.map((line, i) => (
          <div key={i} className="terminal-line">
            {line}
          </div>
        ))}
        <div className="terminal-input-line">
          <span>{'>'}</span>
          <input 
            type="text" 
            className="terminal-input"
            placeholder="Enter command..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const command = e.currentTarget.value;
                executeCommand(command);
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
