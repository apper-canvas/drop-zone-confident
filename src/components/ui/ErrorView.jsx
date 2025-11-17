import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto p-8"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-premium-lg text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="AlertTriangle" className="w-10 h-10 text-error" />
        </motion.div>

        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">Upload Error</h3>
          <p className="text-gray-600 text-lg leading-relaxed">{message}</p>
        </div>

        {onRetry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={onRetry}
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-error to-red-600 hover:from-red-600 hover:to-red-700"
            >
              <ApperIcon name="RefreshCw" className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorView;