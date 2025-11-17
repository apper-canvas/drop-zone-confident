import { useState, useRef } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const DropZone = ({ 
  onFilesAdded, 
  accept = "*/*",
  multiple = true,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = ""
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setIsActive(true);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);

    setTimeout(() => setIsActive(false), 200);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    e.target.value = ""; // Reset input
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        console.warn(`File ${file.name} is too large`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFilesAdded?.(validFiles);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      className={cn(
        "relative group cursor-pointer",
        className
      )}
      animate={{
        scale: isDragOver ? 1.02 : isActive ? 0.98 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Drop zone area */}
      <motion.div
        className={cn(
          "h-[400px] border-2 border-dashed rounded-2xl transition-all duration-300",
          "flex flex-col items-center justify-center space-y-6 p-12",
          "bg-gradient-to-br from-white/60 to-blue-50/60 backdrop-blur-sm",
          "shadow-premium hover:shadow-premium-lg",
          isDragOver 
            ? "border-primary bg-gradient-to-br from-primary/5 to-blue-100/60 border-solid shadow-premium-lg" 
            : "border-gray-300 hover:border-accent hover:bg-gradient-to-br hover:from-accent/5 hover:to-cyan-50/60"
        )}
      >
        {/* Icon */}
        <motion.div
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center shadow-lg",
            isDragOver 
              ? "bg-gradient-to-r from-primary to-blue-600" 
              : "bg-gradient-to-r from-accent to-cyan-600 group-hover:from-primary group-hover:to-blue-600"
          )}
          animate={{ 
            rotate: isDragOver ? [0, -10, 10, 0] : 0,
            scale: isDragOver ? 1.1 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          <ApperIcon 
            name={isDragOver ? "Download" : "Upload"} 
            className="w-10 h-10 text-white" 
          />
        </motion.div>

        {/* Text Content */}
        <div className="text-center space-y-3 max-w-md">
          <motion.h3 
            className={cn(
              "text-2xl font-bold transition-colors duration-300",
              isDragOver ? "text-primary" : "text-gray-900"
            )}
            animate={{ scale: isDragOver ? 1.05 : 1 }}
          >
            {isDragOver ? "Drop files here" : "Upload your files"}
          </motion.h3>
          
          <p className="text-gray-600 text-lg leading-relaxed">
            {isDragOver 
              ? "Release to upload your files"
              : "Drag and drop files here, or click to browse"
            }
          </p>

          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>Max size: {(maxSize / (1024 * 1024)).toFixed(0)}MB</span>
            <span>•</span>
            <span>Multiple files supported</span>
          </div>
        </div>

        {/* Browse Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={isDragOver ? "primary" : "accent"}
            size="lg"
            className="shadow-lg font-semibold px-8 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <ApperIcon name="FolderOpen" className="w-5 h-5 mr-3" />
            Browse Files
          </Button>
        </motion.div>
      </motion.div>

      {/* Drag overlay effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-100/20 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDragOver ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

export default DropZone;