import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-blue-100 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="FileQuestion" className="w-16 h-16 text-primary" />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-6xl font-bold gradient-text">404</h1>
          <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            The page you're looking for seems to have been moved or doesn't exist.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <Button
            onClick={() => navigate("/")}
            variant="primary"
            size="lg"
            className="w-full"
          >
            <ApperIcon name="Home" className="w-5 h-5 mr-2" />
            Back to Upload
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            size="md"
            className="w-full"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;