import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, File, Search, Grid, List, SortAsc, SortDesc,
  Download, Trash2, Eye, Share2, MoreVertical, Filter,
  Calendar, FileText, Image, Video, Music, Archive, X
} from 'lucide-react';
import { FileManager as FileManagerLib, FileUploadResult } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import FileUpload from './FileUpload';
import FilePreview from './FilePreview';

interface FileItem {
  name: string;
  path: string;
  url: string;
  size: number;
  type: string;
  lastModified: Date;
  metadata?: any;
}

interface FileManagerProps {
  folder?: string;
  onFileSelect?: (file: FileItem) => void;
  showUpload?: boolean;
  viewMode?: 'grid' | 'list';
}

const FileManagerComponent: React.FC<FileManagerProps> = ({
  folder = 'general',
  onFileSelect,
  showUpload = true,
  viewMode: initialViewMode = 'grid'
}) => {
  const { userEmail } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fileTypes = [
    { value: 'all', label: 'All Files', icon: File },
    { value: 'image', label: 'Images', icon: Image },
    { value: 'video', label: 'Videos', icon: Video },
    { value: 'audio', label: 'Audio', icon: Music },
    { value: 'document', label: 'Documents', icon: FileText },
    { value: 'archive', label: 'Archives', icon: Archive }
  ];

  useEffect(() => {
    if (userEmail) {
      loadFiles();
    }
  }, [userEmail, folder]);

  const loadFiles = async () => {
    if (!userEmail) return;

    setLoading(true);
    try {
      const fileList = await FileManagerLib.listUserFiles(userEmail, folder);
      
      const fileItems: FileItem[] = await Promise.all(
        fileList.map(async (file) => {
          const url = await FileManagerLib.getFileUrl(`${folder}/${userEmail}/${file.name}`);
          return {
            name: file.name,
            path: `${folder}/${userEmail}/${file.name}`,
            url: url || '',
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || 'application/octet-stream',
            lastModified: new Date(file.updated_at || file.created_at),
            metadata: file.metadata
          };
        })
      );

      setFiles(fileItems);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploaded = (result: FileUploadResult) => {
    if (result.success && result.url && result.metadata) {
      const newFile: FileItem = {
        name: result.metadata.name,
        path: result.path || '',
        url: result.url,
        size: result.metadata.size,
        type: result.metadata.type,
        lastModified: new Date(result.metadata.lastModified),
        metadata: result.metadata
      };
      
      setFiles(prev => [newFile, ...prev]);
    }
  };

  const handleDeleteFile = async (file: FileItem) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return;

    try {
      const success = await FileManagerLib.deleteFile(file.path);
      if (success) {
        setFiles(prev => prev.filter(f => f.path !== file.path));
        setSelectedFiles(prev => prev.filter(path => path !== file.path));
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDownloadFile = (file: FileItem) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAndSortedFiles = files
    .filter(file => {
      // Search filter
      if (searchTerm && !file.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Type filter
      if (filterType !== 'all') {
        switch (filterType) {
          case 'image':
            return file.type.startsWith('image/');
          case 'video':
            return file.type.startsWith('video/');
          case 'audio':
            return file.type.startsWith('audio/');
          case 'document':
            return file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text');
          case 'archive':
            return file.type.includes('zip') || file.type.includes('rar');
          default:
            return true;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = a.lastModified.getTime() - b.lastModified.getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image size={20} className="text-blue-500" />;
    if (fileType.startsWith('video/')) return <Video size={20} className="text-purple-500" />;
    if (fileType.startsWith('audio/')) return <Music size={20} className="text-green-500" />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText size={20} className="text-red-500" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive size={20} className="text-orange-500" />;
    return <File size={20} className="text-gray-500" />;
  };

  const toggleFileSelection = (filePath: string) => {
    setSelectedFiles(prev => 
      prev.includes(filePath)
        ? prev.filter(path => path !== filePath)
        : [...prev, filePath]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">File Manager</h2>
          <p className="text-gray-600">{files.length} files in {folder}</p>
        </div>
        
        {showUpload && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Upload Files
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {fileTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            setSortBy(field as any);
            setSortOrder(order as any);
          }}
          className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="size-desc">Largest First</option>
          <option value="size-asc">Smallest First</option>
        </select>

        {/* View Mode */}
        <div className="flex border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Files */}
      {filteredAndSortedFiles.length === 0 ? (
        <div className="text-center py-12">
          <Folder size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No files found</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredAndSortedFiles.map((file) => (
            <motion.div
              key={file.path}
              layout
              className={`bg-white border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedFiles.includes(file.path) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => {
                if (onFileSelect) {
                  onFileSelect(file);
                } else {
                  setPreviewFile(file);
                }
              }}
            >
              <div className="text-center">
                <div className="mb-3">
                  {FileManagerLib.isImageFile(file.type) ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>
                
                <p className="font-medium text-gray-900 text-sm truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {FileManagerLib.formatFileSize(file.size)}
                </p>
              </div>
              
              <div className="flex justify-center space-x-1 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewFile(file);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Preview"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadFile(file);
                  }}
                  className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                  title="Download"
                >
                  <Download size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
            <div className="col-span-6">Name</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2">Modified</div>
            <div className="col-span-2">Actions</div>
          </div>
          
          {filteredAndSortedFiles.map((file) => (
            <motion.div
              key={file.path}
              layout
              className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                selectedFiles.includes(file.path) ? 'bg-blue-50' : ''
              }`}
            >
              <div className="col-span-6 flex items-center space-x-3">
                {getFileIcon(file.type)}
                <span className="font-medium text-gray-900 truncate">{file.name}</span>
              </div>
              <div className="col-span-2 flex items-center text-sm text-gray-600">
                {FileManagerLib.formatFileSize(file.size)}
              </div>
              <div className="col-span-2 flex items-center text-sm text-gray-600">
                {file.lastModified.toLocaleDateString()}
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <button
                  onClick={() => setPreviewFile(file)}
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Preview"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleDownloadFile(file)}
                  className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                  title="Download"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => handleDeleteFile(file)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Upload Files</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <FileUpload
                onFileUploaded={handleFileUploaded}
                folder={folder}
                multiple={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Preview */}
      {previewFile && (
        <FilePreview
          fileUrl={previewFile.url}
          fileName={previewFile.name}
          fileType={previewFile.type}
          fileSize={previewFile.size}
          onClose={() => setPreviewFile(null)}
          onDownload={() => handleDownloadFile(previewFile)}
        />
      )}
    </div>
  );
};

export default FileManagerComponent;