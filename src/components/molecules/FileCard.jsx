import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProgressBar from "@/components/atoms/ProgressBar";
import { cn } from "@/utils/cn";

const FileCard = ({ 
  file, 
  onRemove, 
  onRetry,
  className = "" 
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "Image";
    if (type.includes("pdf")) return "FileText";
    if (type.includes("video/")) return "Video";
    if (type.includes("audio/")) return "Music";
    if (type.includes("zip") || type.includes("rar")) return "Archive";
    return "File";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "from-success to-emerald-600";
      case "error":
        return "from-error to-red-600";
      case "uploading":
        return "from-primary to-blue-600";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return "CheckCircle";
      case "error":
        return "XCircle";
      case "uploading":
        return "Upload";
      default:
        return "Clock";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      whileHover={{ y: -2, shadow: "0 8px 32px rgba(0, 0, 0, 0.12)" }}
      className={cn(
        "bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-premium border border-white/20",
        className
      )}
    >
      <div className="flex items-start space-x-4">
        {/* File Icon/Preview */}
        <div className="flex-shrink-0">
          {file.preview ? (
            <motion.img
              src={file.preview}
              alt={file.name}
              className="w-16 h-16 object-cover rounded-lg shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            />
          ) : (
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ApperIcon 
                name={getFileIcon(file.type)} 
                className="w-8 h-8 text-gray-600" 
              />
            </motion.div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h4 className="text-lg font-semibold text-gray-900 truncate">
                {file.name}
              </h4>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)} • {file.type}
              </p>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <motion.div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shadow-lg",
                  `bg-gradient-to-r ${getStatusColor(file.status)}`
                )}
                animate={file.status === "uploading" ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: file.status === "uploading" ? Infinity : 0, ease: "linear" }}
              >
                <ApperIcon 
                  name={getStatusIcon(file.status)} 
                  className="w-4 h-4 text-white" 
                />
              </motion.div>

              {file.status !== "uploading" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove?.(file.id)}
                  className="text-gray-400 hover:text-error p-2"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <AnimatePresence>
            {file.status === "uploading" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <ProgressBar 
                  progress={file.progress} 
                  variant="primary"
                  animated={true}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message & Retry */}
          <AnimatePresence>
            {file.status === "error" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                  <p className="text-sm text-error font-medium">
                    {file.error || "Upload failed"}
                  </p>
                </div>
                
                {onRetry && (
                  <Button
                    variant="error"
                    size="sm"
                    onClick={() => onRetry(file.id)}
                    className="w-full"
                  >
                    <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                    Retry Upload
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {file.status === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 text-success"
              >
                <ApperIcon name="CheckCircle" className="w-4 h-4" />
                <span className="text-sm font-medium">Upload complete</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;