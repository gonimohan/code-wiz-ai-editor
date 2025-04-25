import React, { useState, useRef, useEffect } from 'react';
import { Search, Code, Play, Save, Zap, GitBranch, Terminal as TerminalIcon, FileText, ChevronDown, ChevronRight, Folder, X, CheckSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { FileExplorer } from '@/components/FileExplorer/FileExplorer';
import { CodeEditor } from '@/components/Editor/CodeEditor';
import { Terminal } from '@/components/Terminal/Terminal';
import { Chat } from '@/components/Chat';
import type { FileNode } from '@/components/FileExplorer/types';

const Index = () => {
  const [fileSystem, setFileSystem] = useState<FileNode[]>([]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['src']));
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '~/project',
    '> npm install',
    'Installing dependencies...',
    'Done!',
    '~/project'
  ]);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [aiActive, setAiActive] = useState<boolean>(false);
  const [aiThinking, setAiThinking] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
  const [terminalHeight, setTerminalHeight] = useState<number>(200);
  const [isTerminalVisible, setIsTerminalVisible] = useState<boolean>(true);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarWidth, setSidebarWidth] = useState<number>(240);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initialFs: FileNode[] = [
      {
        id: 'src',
        name: 'src',
        type: 'directory',
        children: [
          {
            id: 'app-tsx',
            name: 'App.tsx',
            type: 'file',
            language: 'typescript',
            content: `import React, { useState, useEffect } from 'react';\nimport { MainMenu } from './components/MainMenu';\nimport { Simulator } from './components/Simulator';\nimport { LoadingScreen } from './components/LoadingScreen';\nimport { AIAgent } from './components/AIAgent';\n\nconst App: React.FC = () => {\n  const [isLoading, setIsLoading] = useState(true);\n\n  useEffect(() => {\n    // Simulate loading\n    const timer = setTimeout(() => setIsLoading(false), 2000);\n    return () => clearTimeout(timer);\n  }, []);\n\n  return (\n    <div className="app-container">\n      {isLoading ? (\n        <LoadingScreen />\n      ) : (\n        <>\n          <MainMenu />\n          <Simulator />\n          <AIAgent />\n        </>\n      )}\n    </div>\n  );\n};\n\nexport default App;`
          },
          {
            id: 'index-css',
            name: 'index.css',
            type: 'file',
            language: 'css',
            content: 'body { margin: 0; padding: 0; font-family: sans-serif; }'
          },
          {
            id: 'main-tsx',
            name: 'main.tsx',
            type: 'file',
            language: 'typescript',
            content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n);`
          },
          {
            id: 'vite-env-d-ts',
            name: 'vite-env.d.ts',
            type: 'file',
            language: 'typescript',
            content: '/// <reference types="vite/client" />'
          },
          {
            id: 'components',
            name: 'components',
            type: 'directory',
            children: [
              {
                id: 'MainMenu-tsx',
                name: 'MainMenu.tsx',
                type: 'file',
                language: 'typescript',
                content: `import React from 'react';\n\nexport const MainMenu: React.FC = () => {\n  return <div>Main Menu</div>;\n};`
              },
              {
                id: 'Simulator-tsx',
                name: 'Simulator.tsx',
                type: 'file',
                language: 'typescript',
                content: `import React from 'react';\n\nexport const Simulator: React.FC = () => {\n  return <div>Simulator</div>;\n};`
              },
              {
                id: 'LoadingScreen-tsx',
                name: 'LoadingScreen.tsx',
                type: 'file',
                language: 'typescript',
                content: `import React from 'react';\n\nexport const LoadingScreen: React.FC = () => {\n  return <div>Loading...</div>;\n};`
              },
              {
                id: 'AIAgent-tsx',
                name: 'AIAgent.tsx',
                type: 'file',
                language: 'typescript',
                content: `import React from 'react';\n\nexport const AIAgent: React.FC = () => {\n  return <div>AI Agent</div>;\n};`
              }
            ]
          }
        ]
      },
      {
        id: 'gitignore',
        name: '.gitignore',
        type: 'file',
        content: 'node_modules\ndist\n.env\n'
      },
      {
        id: 'eslint-config-js',
        name: 'eslint.config.js',
        type: 'file',
        language: 'javascript',
        content: 'export default {\n  extends: ["eslint:recommended", "plugin:react/recommended"],\n};'
      },
      {
        id: 'index-html',
        name: 'index.html',
        type: 'file',
        language: 'html',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>AI Code Editor</title>\n</head>\n<body>\n  <div id="root"></div>\n  <script type="module" src="/src/main.tsx"></script>\n</body>\n</html>'
      },
      {
        id: 'package-lock-json',
        name: 'package-lock.json',
        type: 'file',
        language: 'json',
        content: '{}'
      },
      {
        id: 'package-json',
        name: 'package.json',
        type: 'file',
        language: 'json',
        content: '{\n  "name": "ai-code-editor",\n  "private": true,\n  "version": "0.1.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "tsc && vite build",\n    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "lucide-react": "^0.263.1"\n  },\n  "devDependencies": {\n    "@types/react": "^18.2.15",\n    "@types/react-dom": "^18.2.7",\n    "@typescript-eslint/eslint-plugin": "^6.0.0",\n    "@typescript-eslint/parser": "^6.0.0",\n    "@vitejs/plugin-react": "^4.0.3",\n    "autoprefixer": "^10.4.14",\n    "eslint": "^8.45.0",\n    "eslint-plugin-react-hooks": "^4.6.0",\n    "eslint-plugin-react-refresh": "^0.4.3",\n    "postcss": "^8.4.27",\n    "tailwindcss": "^3.3.3",\n    "typescript": "^5.0.2",\n    "vite": "^4.4.5"\n  }\n}'
      }
    ];
    
    setFileSystem(initialFs);
    
    const appTsxFile = initialFs[0].children?.find(f => f.id === 'app-tsx');
    if (appTsxFile) {
      setSelectedFile(appTsxFile);
      setEditorContent(appTsxFile.content || '');
    }

    setExpandedDirs(prev => new Set([...prev, 'components']));
  }, []);

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      setEditorContent(file.content || '');
      editorRef.current?.focus();
      toast({
        title: "File opened",
        description: `${file.name} has been opened in the editor`,
      });
    }
  };

  const toggleDirectory = (dirId: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(dirId)) {
      newExpanded.delete(dirId);
    } else {
      newExpanded.add(dirId);
    }
    setExpandedDirs(newExpanded);
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    
    if (selectedFile) {
      updateFileContent(selectedFile.id, content);
    }
    
    if (aiActive && content.length > 0 && content !== selectedFile?.content) {
      generateAiSuggestion(content);
    }
  };

  const updateFileContent = (fileId: string, content: string) => {
    const updateNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === fileId) {
          return { ...node, content };
        }
        
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        
        return node;
      });
    };
    
    setFileSystem(updateNode(fileSystem));
  };

  const generateAiSuggestion = (currentCode: string) => {
    if (aiThinking) return;
    setAiThinking(true);
    
    setTimeout(() => {
      if (selectedFile?.language === 'typescript' || selectedFile?.language === 'javascript') {
        const suggestions = [
          "// Add a useEffect hook to handle component lifecycle\nuseEffect(() => {\n  // Your effect logic here\n  return () => {\n    // Cleanup logic\n  };\n}, []);",
          "// Consider adding error handling\ntry {\n  // Your code here\n} catch (error) {\n  console.error('An error occurred:', error);\n}",
          "// You might want to add a loading state\nconst [isLoading, setIsLoading] = useState(false);",
          "// Consider implementing memoization for performance\nconst memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);"
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        setAiSuggestion(randomSuggestion);
      } else {
        setAiSuggestion("// AI has analyzed your code and has no suggestions at this time.");
      }
      
      setAiThinking(false);
    }, 1500);
  };

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

  const acceptSuggestion = () => {
    if (aiSuggestion && selectedFile) {
      const newContent = editorContent + '\n\n' + aiSuggestion;
      setEditorContent(newContent);
      updateFileContent(selectedFile.id, newContent);
      setAiSuggestion('');
      toast({
        title: "AI Suggestion Applied",
        description: "The AI suggestion has been added to your code",
      });
    }
  };

  const saveFile = () => {
    if (selectedFile) {
      updateFileContent(selectedFile.id, editorContent);
      toast({
        title: "File saved",
        description: `${selectedFile.name} has been saved`,
      });
    }
  };

  const runCode = () => {
    setTerminalOutput(prev => [...prev, '> npm run dev', 'Starting development server...']);
    
    setTimeout(() => {
      setTerminalOutput(prev => [...prev, 'Server running at localhost:3000', 'Ready in 1.2s', '~/project']);
      toast({
        title: "Application Running",
        description: "Development server started successfully",
      });
    }, 1500);
  };

  const startResizingTerminal = (e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleTerminalResize);
    document.addEventListener('mouseup', stopResizingTerminal);
  };
  
  const handleTerminalResize = (e: MouseEvent) => {
    if (terminalRef.current) {
      const containerHeight = window.innerHeight;
      const newHeight = Math.max(100, containerHeight - e.clientY);
      setTerminalHeight(newHeight);
    }
  };
  
  const stopResizingTerminal = () => {
    document.removeEventListener('mousemove', handleTerminalResize);
    document.removeEventListener('mouseup', stopResizingTerminal);
  };

  const startResizingSidebar = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.addEventListener('mousemove', handleSidebarResize);
    document.addEventListener('mouseup', stopResizingSidebar);
  };
  
  const handleSidebarResize = (e: MouseEvent) => {
    if (sidebarRef.current) {
      const newWidth = Math.max(160, Math.min(500, e.clientX));
      setSidebarWidth(newWidth);
    }
  };
  
  const stopResizingSidebar = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleSidebarResize);
    document.removeEventListener('mouseup', stopResizingSidebar);
  };

  const toggleTerminal = () => {
    setIsTerminalVisible(!isTerminalVisible);
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  };

  const searchFiles = (query: string): FileNode[] => {
    const results: FileNode[] = [];
    
    const searchInNodes = (nodes: FileNode[]) => {
      for (const node of nodes) {
        if (node.name.toLowerCase().includes(query.toLowerCase())) {
          results.push(node);
        }
        
        if (node.type === 'directory' && node.children) {
          searchInNodes(node.children);
        }
      }
    };
    
    searchInNodes(fileSystem);
    return results;
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'tsx':
      case 'jsx':
        return <FileText className="file-icon file-icon-tsx" size={14} />;
      case 'css':
        return <FileText className="file-icon file-icon-css" size={14} />;
      case 'html':
        return <FileText className="file-icon file-icon-html" size={14} />;
      case 'json':
        return <FileText className="file-icon file-icon-json" size={14} />;
      case 'js':
      case 'ts':
        return <FileText className="file-icon file-icon-js" size={14} />;
      default:
        return <FileText className="file-icon" size={14} />;
    }
  };

  const createNewFile = () => {
    const newFileName = prompt('Enter file name:');
    
    if (newFileName) {
      const fileId = `new-file-${Date.now()}`;
      const extension = newFileName.split('.').pop()?.toLowerCase();
      let language = 'text';
      
      if (extension === 'ts' || extension === 'tsx') language = 'typescript';
      else if (extension === 'js' || extension === 'jsx') language = 'javascript';
      else if (extension === 'css') language = 'css';
      else if (extension === 'html') language = 'html';
      else if (extension === 'json') language = 'json';
      
      const newFile: FileNode = {
        id: fileId,
        name: newFileName,
        type: 'file',
        language,
        content: ''
      };
      
      setFileSystem(prev => [...prev, newFile]);
      handleFileSelect(newFile);
      toast({
        title: "File Created",
        description: `${newFileName} has been created`,
      });
    }
  };

  const createNewFolder = () => {
    const newDirName = prompt('Enter folder name:');
    
    if (newDirName) {
      const dirId = `new-dir-${Date.now()}`;
      
      const newDir: FileNode = {
        id: dirId,
        name: newDirName,
        type: 'directory',
        children: []
      };
      
      setFileSystem(prev => [...prev, newDir]);
      setExpandedDirs(prev => new Set([...prev, dirId]));
      toast({
        title: "Folder Created",
        description: `${newDirName} folder has been created`,
      });
    }
  };

  const highlightSyntax = (code: string, language?: string): JSX.Element => {
    if (!code) return <></>;
    
    if (language === 'typescript' || language === 'javascript') {
      const keywordPattern = /\b(const|let|var|function|return|if|else|for|while|import|export|from|default|class|interface|extends|implements|new|this|async|await|try|catch|throw|typeof|instanceof|in)\b/g;
      const stringPattern = /(["'`])(.*?)(\1)/g;
      const commentPattern = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
      const functionPattern = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
      const jsxPattern = /(<[^>]+>|<\/[^>]+>)/g;
      
      let highlightedCode = code
        .replace(commentPattern, '<span class="syntax-token-comment">$1</span>')
        .replace(keywordPattern, '<span class="syntax-token-keyword">$1</span>')
        .replace(stringPattern, '<span class="syntax-token-string">$1$2$3</span>')
        .replace(functionPattern, '<span class="syntax-token-function">$1</span>(')
        .replace(jsxPattern, '<span class="syntax-token-variable">$1</span>');
      
      return <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />;
    }
    
    return <>{code}</>;
  };

  const renderFileTree = (nodes: FileNode[]) => {
    return nodes.map(node => (
      <div key={node.id} className="file-tree-item">
        {node.type === 'directory' ? (
          <div className="directory">
            <div 
              className={`directory-header ${expandedDirs.has(node.id) ? 'expanded' : ''}`} 
              onClick={() => toggleDirectory(node.id)}
            >
              {expandedDirs.has(node.id) ? 
                <ChevronDown size={16} className="mr-1" /> : 
                <ChevronRight size={16} className="mr-1" />
              }
              <Folder size={16} className="mr-1.5" />
              <span>{node.name}</span>
            </div>
            
            {expandedDirs.has(node.id) && node.children && (
              <div className="directory-children">
                {renderFileTree(node.children)}
              </div>
            )}
          </div>
        ) : (
          <div 
            className={`file-item ${selectedFile?.id === node.id ? 'selected' : ''}`}
            onClick={() => handleFileSelect(node)}
          >
            {getFileIcon(node.name)}
            <span className="file-name">{node.name}</span>
          </div>
        )}
      </div>
    ));
  };

  const renderSearchResults = () => {
    if (!searchQuery) return null;
    
    const results = searchFiles(searchQuery);
    
    return (
      <div className="search-results mt-2">
        <div className="text-xs text-[#858585] mb-2">
          {results.length} results found
        </div>
        
        {results.map(file => (
          <div 
            key={file.id}
            className="file-item" 
            onClick={() => handleFileSelect(file)}
          >
            {getFileIcon(file.name)}
            <span className="file-name">{file.name}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderEditor = () => {
    return (
      <div className="editor-container h-full flex flex-col">
        <div className="editor-header">
          <div className="view-tabs">
            <button 
              className={`tab ${viewMode === 'code' ? 'active' : ''}`}
              onClick={() => setViewMode('code')}
            >
              <Code size={16} className="mr-1" /> Code
            </button>
            <button 
              className={`tab ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setViewMode('preview')}
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
              ref={editorRef}
              value={editorContent}
              onChange={(e) => handleEditorChange(e.target.value)}
              className="code-input"
              spellCheck="false"
            />
            <div className="syntax-highlighted">
              {highlightSyntax(editorContent, selectedFile?.language)}
            </div>
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
                onClick={() => setAiSuggestion('')}
                className="text-xs hover:text-white"
                title="Clear suggestion"
              >
                <X size={14} />
              </button>
            </div>
            {aiSuggestion ? (
              <div className="suggestion-content">
                <pre>{aiSuggestion}</pre>
                <button onClick={acceptSuggestion} className="accept-btn">
                  <CheckSquare size={14} className="mr-1" /> 
                  Accept Suggestion
                </button>
              </div>
            ) : (
              !aiThinking && (
                <div className="p-3 text-xs text-[#858585]">
                  AI is enabled and will analyze your code as you type.
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <div className="logo">
          <Code size={18} className="logo-icon" />
          CodeWiz Editor
        </div>
        <div className="actions">
          <button className="action-btn" onClick={toggleSearch} title="Search Files (Ctrl+P)">
            <Search size={16} />
            {!isSearchActive && "Search"}
          </button>
          <button className="action-btn" onClick={() => setAiActive(!aiActive)} title="Toggle AI Assistant">
            <Zap size={16} />
            {aiActive ? 'Disable AI' : 'Enable AI'}
          </button>
          <button className="action-btn" onClick={saveFile} title="Save File (Ctrl+S)">
            <Save size={16} />
            Save
          </button>
          <button className="action-btn" onClick={runCode} title="Run Code">
            <Play size={16} />
            Run
          </button>
        </div>
      </div>
      
      {isSearchActive && (
        <div className="search-bar p-2 bg-[#252526] border-b border-black">
          <div className="flex items-center bg-[#3c3c3c] rounded p-1">
            <Search size={16} className="ml-2 text-[#858585]" />
            <input
              id="search-input"
              type="text" 
              className="bg-transparent border-none outline-none text-white text-sm p-1 w-full"
              placeholder="Search files (ESC to close)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  toggleSearch();
                }
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[#858585] hover:text-white mr-2"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {renderSearchResults()}
        </div>
      )}
      
      <div className="main-content">
        <FileExplorer
          fileSystem={fileSystem}
          selectedFile={selectedFile}
          expandedDirs={expandedDirs}
          onFileSelect={handleFileSelect}
          onToggleDirectory={toggleDirectory}
          onCreateFile={createNewFile}
          onCreateFolder={createNewFolder}
        />

        <div 
          className="resize-handle cursor-col-resize w-1 bg-transparent hover:bg-[#0e639c]"
          onMouseDown={startResizingSidebar}
          style={{ cursor: isResizing ? 'col-resize' : 'default' }}
        />

        <div className="editor-area">
          <CodeEditor
            selectedFile={selectedFile}
            editorContent={editorContent}
            viewMode={viewMode}
            aiActive={aiActive}
            aiThinking={aiThinking}
            aiSuggestion={aiSuggestion}
            onEditorChange={handleEditorChange}
            onViewModeChange={setViewMode}
            onAcceptSuggestion={acceptSuggestion}
          />
        </div>

        <div className="w-[320px]">
          <Chat />
        </div>
      </div>
      
      <div 
        className="resize-handle-horizontal cursor-row-resize h-1 bg-transparent hover:bg-[#0e639c] relative"
        onMouseDown={startResizingTerminal}
      />

      <Terminal
        height={terminalHeight}
        isVisible={isTerminalVisible}
        onHeightChange={setTerminalHeight}
        onVisibilityChange={setIsTerminalVisible}
      />

      <div className="status-bar">
        <div className="flex space-x-4">
          <div className="status-item">
            <GitBranch size={14} className="mr-1" />
            <span>main</span>
          </div>
          <div className="status-item cursor-pointer" onClick={toggleTerminal}>
            <TerminalIcon size={14} className="mr-1" />
            <span>{isTerminalVisible ? 'Hide Terminal' : 'Show Terminal'}</span>
          </div>
        </div>
        <div className="flex space-x-4">
          {selectedFile && (
            <>
              <div className="status-item">
                {selectedFile.language || 'plain text'}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
