# Supabase File Storage Setup Guide

This guide will help you set up Supabase for secure file storage and management in the AcademicFlow chat system.

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: AcademicFlow
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait for the project to be set up (2-3 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Set up Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Configure the bucket:
   - **Name**: `student-files`
   - **Public bucket**: ✅ Enabled (for easy file sharing)
   - **File size limit**: 10MB
   - **Allowed MIME types**: Leave empty (all types allowed)
4. Click "Create bucket"

## Step 5: Configure Storage Policies (Optional)

For enhanced security, you can set up Row Level Security (RLS) policies:

1. Go to **Storage** > **Policies**
2. Click "New Policy" for the `student-files` bucket
3. Create policies for different operations:

### Upload Policy
```sql
CREATE POLICY "Users can upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'student-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Read Policy
```sql
CREATE POLICY "Users can view files" ON storage.objects
FOR SELECT USING (bucket_id = 'student-files');
```

### Delete Policy
```sql
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'student-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Go to the Student Chat section
3. Try uploading a file in a chat message
4. Check your Supabase Storage dashboard to see the uploaded file

## File Organization Structure

Files are organized in the following structure:
```
student-files/
├── chat/
│   └── user@example.com/
│       ├── image1.jpg
│       ├── document.pdf
│       └── video.mp4
├── notes/
│   └── user@example.com/
│       ├── study-guide.pdf
│       └── lecture-notes.docx
└── general/
    └── user@example.com/
        └── misc-files...
```

## Features Enabled

### 🔐 **Secure File Storage**
- Files stored in Supabase's secure cloud infrastructure
- User-specific folder organization
- Automatic file validation and size limits
- Support for all common file types

### 📁 **Advanced File Management**
- **File Upload**: Drag-and-drop or click to upload
- **File Preview**: Built-in preview for images, videos, audio, PDFs
- **File Organization**: Automatic categorization by type and user
- **File Sharing**: Easy sharing through chat messages and notes
- **File Deletion**: Secure file removal with confirmation

### 🎨 **Beautiful UI Components**
- **FileUpload**: Modern drag-and-drop upload interface
- **FilePreview**: Full-screen preview with download options
- **FileManager**: Complete file browser with grid/list views
- **File Cards**: Elegant file display with metadata

### 📊 **File Analytics**
- File usage tracking
- Storage quota monitoring
- Popular file types analysis
- User engagement metrics

## File Type Support

### Images
- JPEG, PNG, GIF, WebP
- Automatic thumbnail generation
- Full-screen preview with zoom
- Image optimization

### Videos
- MP4, WebM
- Built-in video player
- Thumbnail previews
- Streaming support

### Audio
- MP3, WAV, OGG
- Audio player with controls
- Waveform visualization
- Background playback

### Documents
- PDF, DOC, DOCX, TXT
- In-browser PDF viewer
- Document preview
- Text extraction

### Archives
- ZIP, RAR
- File listing preview
- Extraction support
- Compression info

## Storage Limits

### Free Tier (Supabase)
- **Storage**: 500MB
- **Bandwidth**: 2GB/month
- **File uploads**: Unlimited

### Pro Tier (Supabase)
- **Storage**: 8GB included
- **Bandwidth**: 50GB/month
- **Additional storage**: $0.021/GB/month

## Security Best Practices

### File Validation
- File type checking
- Size limit enforcement
- Malware scanning (optional)
- Content validation

### Access Control
- User-specific folders
- Permission-based access
- Secure file URLs
- Automatic cleanup

### Privacy Protection
- No file content scanning
- Encrypted file storage
- Secure file transmission
- GDPR compliance

## Troubleshooting

### Common Issues

**Files not uploading:**
- Check Supabase credentials in `.env`
- Verify bucket exists and is public
- Check file size limits
- Ensure file type is supported

**Preview not working:**
- Check file URL accessibility
- Verify file type support
- Check browser compatibility
- Clear browser cache

**Storage quota exceeded:**
- Check Supabase dashboard usage
- Clean up old files
- Upgrade to Pro plan
- Implement file cleanup policies

### Error Messages

**"File too large"**
- Reduce file size or increase limit
- Check MAX_FILE_SIZE in supabase.ts

**"File type not supported"**
- Add file type to ALLOWED_FILE_TYPES
- Check file extension

**"Upload failed"**
- Check internet connection
- Verify Supabase credentials
- Check bucket permissions

## Advanced Configuration

### Custom File Processing
```typescript
// Add custom file processing
export const processFile = async (file: File) => {
  // Image compression
  if (file.type.startsWith('image/')) {
    return await compressImage(file);
  }
  
  // Video thumbnail generation
  if (file.type.startsWith('video/')) {
    await generateThumbnail(file);
  }
  
  return file;
};
```

### File Metadata Enhancement
```typescript
// Add custom metadata
const uploadWithMetadata = async (file: File) => {
  const metadata = {
    originalName: file.name,
    uploadedBy: userEmail,
    uploadedAt: new Date().toISOString(),
    fileHash: await generateFileHash(file),
    tags: extractTags(file.name)
  };
  
  return await FileManager.uploadFile(file, 'chat', userEmail, metadata);
};
```

## Next Steps

1. ✅ Test file upload and preview functionality
2. ✅ Monitor storage usage in Supabase dashboard
3. ✅ Set up automated file cleanup policies
4. ✅ Implement file sharing permissions
5. ✅ Add file search and filtering
6. ✅ Create file backup strategies

The Supabase file storage integration provides a robust, scalable solution for managing student files with enterprise-grade security and performance! 🚀