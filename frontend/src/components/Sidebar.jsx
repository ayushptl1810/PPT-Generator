import { motion } from "framer-motion";
import {
  FileText,
  History,
  Download,
  Trash2,
  RotateCcw,
  Clock,
  Layers,
  User,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatDistanceToNow } from "date-fns";

function Sidebar() {
  const { state, actions } = useApp();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      className="h-full space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Tool Section */}
      <motion.div className="card-glass rounded-xl p-6" variants={itemVariants}>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          Active Tool
        </h3>

        <motion.div
          className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="p-2 rounded-lg bg-purple-500/30">
            <Layers className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h4 className="font-medium text-white">Slide Generator</h4>
            <p className="text-sm text-gray-400">AI-powered presentations</p>
          </div>
        </motion.div>
      </motion.div>

      {/* History Section */}
      <motion.div
        className="card-glass rounded-xl p-6 flex-1"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            History
          </h3>
          <div className="flex gap-2">
            <motion.button
              onClick={actions.exportHistory}
              className="p-2 rounded-lg glass border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Export History"
            >
              <Download className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              onClick={actions.clearHistory}
              className="p-2 rounded-lg glass border border-white/10 hover:border-red-500/30 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Clear History"
            >
              <Trash2 className="w-4 h-4 text-red-300" />
            </motion.button>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {state.history.length === 0 ? (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-300">No presentations yet</p>
              <p className="text-sm text-gray-400">
                Generate your first presentation to see history
              </p>
            </motion.div>
          ) : (
            state.history.map((item, index) => (
              <motion.div
                key={item.id}
                className="card-glass rounded-lg p-4 hover:border-white/20 transition-all duration-300 cursor-pointer group overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                      {item.title || "Untitled Presentation"}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {formatDistanceToNow(new Date(item.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white mt-2">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {item.slides} slides
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.model}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.loadHistoryItem(item);
                      }}
                      className="p-1.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title="Load Parameters"
                    >
                      <RotateCcw className="w-3 h-3 text-blue-400" />
                    </motion.button>
                    <motion.button
                      onClick={async (e) => {
                        e.stopPropagation();
                        actions.loadHistoryItem(item);
                        await actions.generatePresentation();
                      }}
                      className="p-1.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title="Regenerate & Download"
                    >
                      <Download className="w-3 h-3 text-green-400" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {state.history.length > 0 && (
          <motion.div
            className="mt-4 pt-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-gray-300 text-center">
              Showing {state.history.length} of 200 max items
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Info Panel */}
      <motion.div className="card-glass rounded-xl p-4" variants={itemVariants}>
        <p className="text-xs text-gray-400 text-center">
          💡 Local history stores only metadata
          <br />
          (no API keys or files)
        </p>
      </motion.div>
    </motion.div>
  );
}

export default Sidebar;
