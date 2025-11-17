import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import DropZone from "@/components/molecules/DropZone";
import FileCard from "@/components/molecules/FileCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { useDispatch, useSelector } from "react-redux";
import { setFiles, addFile, updateFile, removeFile } from "@/store/uploadSlice";
import uploadedFileService from "@/services/api/uploadedFileService";
const FileUploader = () => {
const dispatch = useDispatch();
  const { files } = useSelector(state => state.uploads);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // Load files from database on component mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const loadedFiles = await uploadedFileService.getAll();
      if (loadedFiles && loadedFiles.length > 0) {
        // Transform database records to UI format
        const transformedFiles = loadedFiles.map(file => ({
          id: file.Id,
          name: file.name_c || file.Name,
          size: file.size_c,
          type: file.type_c,
          preview: file.preview_c,
          status: file.status_c || "success",
          progress: 100,
          error: null,
          uploadedAt: file.CreatedOn,
          databaseId: file.Id
        }));
        dispatch(setFiles(transformedFiles));
      }
    } catch (err) {
      console.error("Error loading files:", err);
    }
  };

  // Generate unique ID for files
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  // Create preview for image files
  const createPreview = (file) => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  };

  // Handle new files added
const handleFilesAdded = useCallback(async (newFiles) => {
    setError(null);
    
    const filePromises = newFiles.map(async (file) => {
      const preview = await createPreview(file);
      
      return {
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview,
        progress: 0,
        status: "idle",
        error: null,
        uploadedAt: null
      };
    });

    const processedFiles = await Promise.all(filePromises);
    
    processedFiles.forEach(file => dispatch(addFile(file)));
    
    // Auto-start upload
    setTimeout(() => {
      processedFiles.forEach(file => startUpload(file.id));
    }, 500);
    
    toast.info(`Added ${processedFiles.length} file${processedFiles.length > 1 ? "s" : ""} to queue`);
  }, [dispatch]);

  // Simulate file upload with progress
const startUpload = useCallback((fileId) => {
    const fileToUpload = files.find(f => f.id === fileId);
    if (!fileToUpload) return;

    dispatch(updateFile({ id: fileId, status: "uploading", progress: 0 }));

    // Simulate upload progress
    const interval = setInterval(() => {
      dispatch(updateFile(prev => {
        const file = files.find(f => f.id === fileId);
        if (file && file.status === "uploading") {
          const newProgress = Math.min(file.progress + Math.random() * 20, 100);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            
            // Save to database on success (90% success rate)
            const isSuccess = Math.random() > 0.1;
            
            setTimeout(() => {
              if (isSuccess) {
                // Save to database
                saveFileToDB(fileToUpload, fileId);
              } else {
                dispatch(updateFile({ 
                  id: fileId, 
                  status: "error", 
                  progress: file.progress,
                  error: "Network error occurred"
                }));
                toast.error(`Failed to upload ${fileToUpload.name}`);
              }
            }, 300);
            
            return { ...file, progress: 100 };
          }
          
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 200);
  }, [files, dispatch]);

  const saveFileToDB = async (file, localId) => {
    try {
      const fileData = {
        name_c: file.name,
        size_c: file.size,
        type_c: file.type,
        preview_c: file.preview,
        status_c: "success"
      };

      const savedFile = await uploadedFileService.create(fileData);
      
      if (savedFile) {
        dispatch(updateFile({ 
          id: localId, 
          status: "success", 
          progress: 100,
          uploadedAt: new Date(),
          databaseId: savedFile.Id
        }));
        toast.success(`${file.name} uploaded successfully!`);
      } else {
        throw new Error("Failed to save file");
      }
    } catch (err) {
      console.error("Error saving file to database:", err);
      dispatch(updateFile({ 
        id: localId, 
        status: "error", 
        error: "Failed to save file to database"
      }));
      toast.error(`Failed to upload ${file.name}`);
    }
  };

  // Remove file from queue
const handleRemoveFile = useCallback(async (fileId) => {
    const file = files.find(f => f.id === fileId);
    
    // Delete from database if it exists
    if (file?.databaseId) {
      const deleted = await uploadedFileService.deleteFile(file.databaseId);
      if (deleted) {
        dispatch(removeFile(fileId));
        toast.success("File deleted successfully");
      } else {
        toast.error("Failed to delete file");
      }
    } else {
      dispatch(removeFile(fileId));
      toast.info("File removed from queue");
    }
  }, [files, dispatch]);

  // Retry failed upload
const handleRetryUpload = useCallback((fileId) => {
    dispatch(updateFile({ id: fileId, status: "idle", progress: 0, error: null }));
    
    setTimeout(() => startUpload(fileId), 100);
    toast.info("Retrying upload...");
  }, [dispatch, startUpload]);

  // Clear all files
  const handleClearAll = useCallback(() => {
    setFiles([]);
    toast.info("All files cleared");
  }, []);

  // Get upload stats
const getUploadStats = () => {
    const total = files.length;
    const completed = files.filter(f => f.status === "success").length;
    const failed = files.filter(f => f.status === "error").length;
    const uploading = files.filter(f => f.status === "uploading").length;
    
    return { total, completed, failed, uploading };
  };

  const stats = getUploadStats();

  if (error) {
    return <ErrorView message={error} onRetry={() => setError(null)} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold gradient-text">
          Drop Zone
        </h1>
        <p className="text-xl text-secondary max-w-2xl mx-auto">
          Upload files quickly with clear visual feedback. 
          Drag and drop or browse to get started.
        </p>
      </motion.div>

      {/* Drop Zone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <DropZone
          onFilesAdded={handleFilesAdded}
          accept="*/*"
          multiple={true}
          maxSize={50 * 1024 * 1024} // 50MB
        />
      </motion.div>

      {/* Upload Stats */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-premium"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-500">Total Files</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{stats.completed}</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.uploading}</div>
                  <div className="text-sm text-gray-500">Uploading</div>
                </div>
                {stats.failed > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-error">{stats.failed}</div>
                    <div className="text-sm text-gray-500">Failed</div>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="text-gray-600 border-gray-300 hover:border-error hover:text-error"
              >
                <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Queue */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onRemove={handleRemoveFile}
              onRetry={handleRetryUpload}
            />
          ))}
        </AnimatePresence>

        {files.length === 0 && (
          <Empty 
            title="No files selected"
            message="Use the drop zone above to start uploading files"
            icon="Upload"
          />
        )}
      </div>

      {/* Upload Complete Message */}
      <AnimatePresence>
        {files.length > 0 && stats.total === stats.completed && stats.failed === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-r from-success/10 to-emerald-100/60 backdrop-blur-sm border border-success/20 rounded-xl p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-success to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <ApperIcon name="CheckCircle" className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-success mb-2">All uploads complete!</h3>
            <p className="text-gray-600">
              Successfully uploaded {stats.completed} file{stats.completed > 1 ? "s" : ""}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;