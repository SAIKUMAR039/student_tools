import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, X, File, Image, Video, Music, FileText, 
  Archive, AlertCircle, CheckCircle, Loader2, Eye,
  Download, Trash2
} from 'lucide-react';
import { FileManager, FileUploadResult } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface FileUploadProps {
  onFileUploaded: (result: FileUploadResult) => void;
  folder?: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  className?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  result?: FileUploadResult;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  folder = 'general',
  multiple = false,
  accept,
  maxSize = 10 * 1024 * 1024,
  className = ''
}) => {
  const { userEmail } = useAuth();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || !userEmail) return;

    const fileArray = Array.from(files);
    const newUploadingFiles: UploadingFile[] = fileArray.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Upload each file
    fileArray.forEach((file, index) => {
      uploadFile(file, newUploadingFiles.length - fileArray.length + index);
    });
  };

  const uploadFile = async (file: File, index: number) => {
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadingFiles(prev => prev.map((item, i) => 
          i === index && item.progress < 90
            ? { ...item, progress: item.progress + 10 }
            : item
        ));
      }, 200);

      const result = await FileManager.uploadFile(file, folder, userEmail!);

      clearInterval(progressInterval);

      setUploadingFiles(prev => prev.map((item, i) => 
        i === index
          ? {
              ...item,
              progress: 100,
              status: result.success ? 'success' : 'error',
              result,
              error: result.error
            }
          : item
      ));

      if (result.success) {
        onFileUploaded(result);
        
        // Remove from uploading list after 2 seconds
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter((_, i) => i !== index));
        }, 2000);
      }
    } catch (error) {
      setUploadingFiles(prev => prev.map((item, i) => 
        i === index
          ? {
              ...item,
              status: 'error',
              error: error instanceof Error ? error.message : 'Upload failed'
            }
          : item
      ));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeUploadingFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image size={20} className="text-blue-500" />;
    if (fileType.startsWith('video/')) return <Video size={20} className="text-purple-500" />;
    if (fileType.startsWith('audio/')) return <Music size={20} className="text-green-500" />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText size={20} className="text-red-500" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive size={20} className="text-orange-500" />;
    return <File size={20} className="text-gray-500" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <motion.div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Upload size={48} className={`mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isDragOver ? 'Drop files here' : 'Upload files'}
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop files here, or click to browse
        </p>
        <div className="text-sm text-gray-500">
          <p>Supported: Images, Videos, Audio, Documents, Archives</p>
          <p>Max size: {FileManager.formatFileSize(maxSize)}</p>
        </div>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Uploading Files */}
      <AnimatePresence>
        {uploadingFiles.map((uploadingFile, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {getFileIcon(uploadingFile.file.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {uploadingFile.file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {FileManager.formatFileSize(uploadingFile.file.size)}
                </p>
                
                {/* Progress Bar */}
                {uploadingFile.status === 'uploading' && (
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadingFile.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadingFile.progress}% uploaded
                    </p>
                  </div>
                )}
                
                {/* Error Message */}
                {uploadingFile.status === 'error' && (
                  <p className="text-sm text-red-600 mt-1">
                    {uploadingFile.error}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {uploadingFile.status === 'uploading' && (
                  <Loader2 size={20} className="text-blue-500 animate-spin" />
                )}
                {uploadingFile.status === 'success' && (
                  <CheckCircle size={20} className="text-green-500" />
                )}
                {uploadingFile.status === 'error' && (
                  <AlertCircle size={20} className="text-red-500" />
                )}
                
                <button
                  onClick={() => removeUploadingFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;