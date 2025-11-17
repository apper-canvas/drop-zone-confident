import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No files to upload",
  message = "Drag and drop files here or click browse to get started",
  icon = "Upload"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-8"
    >
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center"
        >
          <ApperIcon name={icon} className="w-12 h-12 text-primary" />
        </motion.div>

        <div className="space-y-3">
          <h3 className="text-2xl font-bold gradient-text">{title}</h3>
          <p className="text-secondary text-lg leading-relaxed max-w-md mx-auto">
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Empty;