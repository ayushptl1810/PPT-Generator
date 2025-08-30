import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { Zap, Clock, Activity } from "lucide-react";

function PerformancePanel() {
  const { state } = useApp();

  if (!state.settings.showPerformance) {
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-40"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <motion.div
        className="card-glass rounded-xl p-4 min-w-[200px]"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Activity className="w-5 h-5 text-green-400" />
          </motion.div>
          <h3 className="font-semibold text-white">Performance</h3>
        </div>

        <div className="space-y-3">
          {/* Response Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Response</span>
            </div>
            <motion.span
              className="text-sm font-mono text-white"
              key={state.responseTime}
              initial={{ scale: 1.2, color: "#22d3ee" }}
              animate={{ scale: 1, color: "#ffffff" }}
              transition={{ duration: 0.3 }}
            >
              {state.responseTime}ms
            </motion.span>
          </div>

          {/* API Calls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">API Calls</span>
            </div>
            <motion.span
              className="text-sm font-mono text-white"
              key={state.apiCalls}
              initial={{ scale: 1.2, color: "#fbbf24" }}
              animate={{ scale: 1, color: "#ffffff" }}
              transition={{ duration: 0.3 }}
            >
              {state.apiCalls}
            </motion.span>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-sm text-gray-300">Status</span>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="text-sm text-green-400 font-medium">Ready</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PerformancePanel;
