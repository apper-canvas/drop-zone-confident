import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
      {/* Drop zone skeleton */}
      <motion.div
        className="h-[400px] border-2 border-dashed border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 bg-gray-300 rounded w-48 mx-auto animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-64 mx-auto animate-pulse" />
          </div>
        </div>
      </motion.div>

      {/* File cards skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-premium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-300 rounded w-48 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-16 animate-pulse" />
                </div>
                <div className="h-2 bg-gray-300 rounded w-full animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;