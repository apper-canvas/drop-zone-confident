import { motion } from "framer-motion";
import FileUploader from "@/components/organisms/FileUploader";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-12"
    >
      <div className="container mx-auto px-4">
        <FileUploader />
      </div>
    </motion.div>
  );
};

export default Home;