
import React from 'react';
import { FileText, ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { FileNode } from './types';

interface FileTreeItemProps {
  node: FileNode;
  selectedFileId: string | null;
  expandedDirs: Set<string>;
  onFileSelect: (file: FileNode) => void;
  onToggleDirectory: (dirId: string) => void;
}

export const FileTreeItem = ({
  node,
  selectedFileId,
  expandedDirs,
  onFileSelect,
  onToggleDirectory
}: FileTreeItemProps) => {
  if (node.type === 'directory') {
    return (
      <div className="directory">
        <div 
          className={`directory-header ${expandedDirs.has(node.id) ? 'expanded' : ''}`} 
          onClick={() => onToggleDirectory(node.id)}
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
            {node.children.map(childNode => (
              <FileTreeItem
                key={childNode.id}
                node={childNode}
                selectedFileId={selectedFileId}
                expandedDirs={expandedDirs}
                onFileSelect={onFileSelect}
                onToggleDirectory={onToggleDirectory}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`file-item ${selectedFileId === node.id ? 'selected' : ''}`}
      onClick={() => onFileSelect(node)}
    >
      <FileText className="file-icon" size={14} />
      <span className="file-name">{node.name}</span>
    </div>
  );
};
