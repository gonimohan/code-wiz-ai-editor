
import React from 'react';
import { FileNode } from './types';
import { FileTreeItem } from './FileTreeItem';
import { FilePlus, FolderPlus, RefreshCw } from 'lucide-react';

interface FileExplorerProps {
  fileSystem: FileNode[];
  selectedFile: FileNode | null;
  expandedDirs: Set<string>;
  onFileSelect: (file: FileNode) => void;
  onToggleDirectory: (dirId: string) => void;
  onCreateFile: () => void;
  onCreateFolder: () => void;
}

export const FileExplorer = ({
  fileSystem,
  selectedFile,
  expandedDirs,
  onFileSelect,
  onToggleDirectory,
  onCreateFile,
  onCreateFolder
}: FileExplorerProps) => {
  return (
    <div className="sidebar">
      <div className="explorer-header">
        <span>EXPLORER</span>
        <div className="flex space-x-2">
          <button 
            className="text-[#858585] hover:text-white"
            onClick={onCreateFile}
            title="New File"
          >
            <FilePlus size={14} />
          </button>
          <button 
            className="text-[#858585] hover:text-white"
            onClick={onCreateFolder}
            title="New Folder"
          >
            <FolderPlus size={14} />
          </button>
          <button 
            className="text-[#858585] hover:text-white"
            title="Refresh Explorer"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      <div className="file-tree">
        {fileSystem.map(node => (
          <FileTreeItem
            key={node.id}
            node={node}
            selectedFileId={selectedFile?.id || null}
            expandedDirs={expandedDirs}
            onFileSelect={onFileSelect}
            onToggleDirectory={onToggleDirectory}
          />
        ))}
      </div>
    </div>
  );
};
