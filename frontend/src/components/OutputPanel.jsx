import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import {
  Download,
  FileText,
  Clock,
  Layers,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function OutputPanel() {
  const { state, actions } = useApp();

  // Get the most recent history item for display
  const latestGeneration = state.history[0];

  if (!state.lastGeneratedFile && !latestGeneration) {
    return null;
  }

  return (
    <motion.div
      className="card-glass rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-400" />
        Generated Presentation
      </h3>

      <div className="space-y-4">
        {/* Success Message */}
        <motion.div
          className="p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <CheckCircle className="w-6 h-6 text-green-400" />
            </motion.div>
            <div>
              <h4 className="font-medium text-green-300">
                Presentation Ready!
              </h4>
              <p className="text-sm text-green-400/80">
                Your AI-generated presentation is ready for download
              </p>
            </div>
          </div>
        </motion.div>

        {/* Generation Details */}
        {latestGeneration && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white">Title</h4>
                  <p className="text-gray-300 text-sm">
                    {latestGeneration.title || "Generated Presentation"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white">Slides</h4>
                  <p className="text-gray-300 text-sm">
                    {latestGeneration.slides} slides
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white">Generated</h4>
                  <p className="text-gray-300 text-sm">
                    {formatDistanceToNow(new Date(latestGeneration.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white">Model Used</h4>
                  <p className="text-gray-300 text-sm">
                    {latestGeneration.model} ({latestGeneration.provider})
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Preview */}
        {latestGeneration?.text && (
          <div className="p-4 rounded-lg glass border border-white/10">
            <h4 className="font-medium text-white mb-2">Content Preview</h4>
            <p className="text-gray-300 text-sm line-clamp-3">
              {latestGeneration.text}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          <motion.button
            onClick={actions.downloadLastFile}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg btn-primary text-white font-semibold cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!state.lastGeneratedFile}
          >
            <Download className="w-5 h-5" />
            Download Presentation
          </motion.button>

          <motion.button
            onClick={async () => {
              if (latestGeneration) {
                actions.loadHistoryItem(latestGeneration);
                await actions.generatePresentation();
              }
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg glass border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText className="w-5 h-5" />
            Generate Again
          </motion.button>
        </div>

        {/* Performance Stats */}
        {state.responseTime > 0 && (
          <motion.div
            className="flex items-center justify-center gap-4 pt-4 border-t border-white/10 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span>Generation time: {state.responseTime}ms</span>
            <span>•</span>
            <span>API calls: {state.apiCalls}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default OutputPanel;
