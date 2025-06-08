import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Download, Eye, ExternalLink, Play, Pause,
  Volume2, VolumeX, Maximize2, Minimize2
} from 'lucide-react';
import { FileManager } from '../lib/supabase';

interface FilePreviewProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  onClose: () => void;
  onDownload?: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  fileUrl,
  fileName,
  fileType,
  fileSize,
  onClose,
  onDownload
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const isImage = FileManager.isImageFile(fileType);
  const isVideo = FileManager.isVideoFile(fileType);
  const isAudio = FileManager.isAudioFile(fileType);
  const isPDF = fileType.includes('pdf');

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderPreview = () => {
    if (isImage) {
      return (
        <div className="relative group">
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="relative">
          <video
            src={fileUrl}
            controls
            className="max-w-full max-h-[70vh] rounded-lg"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Volume2 size={48} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{fileName}</h3>
            {fileSize && (
              <p className="text-purple-100">{FileManager.formatFileSize(fileSize)}</p>
            )}
          </div>
          
          <audio
            src={fileUrl}
            controls
            className="w-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="bg-gray-100 rounded-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📄</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{fileName}</h3>
            {fileSize && (
              <p className="text-gray-600">{FileManager.formatFileSize(fileSize)}</p>
            )}
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.open(fileUrl, '_blank')}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <ExternalLink size={20} />
              <span>Open in New Tab</span>
            </button>
            
            <iframe
              src={`${fileUrl}#toolbar=0`}
              className="w-full h-96 border border-gray-300 rounded-lg"
              title={fileName}
            />
          </div>
        </div>
      );
    }

    // Default preview for other file types
    return (
      <div className="bg-gray-100 rounded-2xl p-8 text-center">
        <div className="mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">{FileManager.getFileIcon(fileType)}</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{fileName}</h3>
          {fileSize && (
            <p className="text-gray-600">{FileManager.formatFileSize(fileSize)}</p>
          )}
        </div>
        
        <p className="text-gray-500 mb-6">
          Preview not available for this file type
        </p>
        
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 mx-auto"
        >
          <Download size={20} />
          <span>Download File</span>
        </button>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 ${
          isFullscreen ? 'bg-opacity-95' : ''
        }`}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto ${
            isFullscreen ? 'max-w-none max-h-none h-full' : ''
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{fileName}</h2>
              {fileSize && (
                <p className="text-sm text-gray-500">{FileManager.formatFileSize(fileSize)}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Download"
              >
                <Download size={20} />
              </button>
              
              {(isImage || isVideo) && (
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
              )}
              
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {renderPreview()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilePreview;