import { motion } from "framer-motion";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  FileText,
  Upload,
  Image,
  Hash,
  Lightbulb,
  RefreshCw,
} from "lucide-react";

function ContentPanel() {
  const { state, actions } = useApp();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (
        file.name.toLowerCase().endsWith(".pptx") ||
        file.name.toLowerCase().endsWith(".potx")
      ) {
        actions.setField("template", file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      actions.setField("template", e.target.files[0]);
    }
  };

  return (
    <div className="card-glass rounded-xl p-6 h-full">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-400" />
        Content & Settings
      </h3>

      <div className="space-y-6">
        {/* Text Content */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Text or Markdown
          </label>
          <motion.textarea
            value={state.text}
            onChange={(e) => actions.setField("text", e.target.value)}
            placeholder="Paste or type your content here... You can use Markdown formatting for better structure."
            className="w-full h-48 p-4 rounded-lg input-glass resize-none text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {state.text.length}/60,000 characters
            </span>
            {state.text.length > 50000 && (
              <span className="text-xs text-yellow-400">
                Consider shortening for better results
              </span>
            )}
          </div>
        </div>

        {/* Guidance and Slides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Presentation Style (Optional)
            </label>
            <motion.input
              type="text"
              value={state.guidance}
              onChange={(e) => actions.setField("guidance", e.target.value)}
              placeholder="e.g., investor pitch, tech summary, training session"
              className="w-full p-3 rounded-lg input-glass text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Slides
            </label>
            <motion.input
              type="text"
              value={
                state.numSlides === 10 && !state.numSlidesInput
                  ? ""
                  : state.numSlidesInput !== undefined
                  ? state.numSlidesInput
                  : state.numSlides
              }
              onChange={(e) => {
                const value = e.target.value;
                // Store the raw input value
                actions.setField("numSlidesInput", value);

                // Only update numSlides if it's a valid number
                if (value === "") {
                  // Don't update numSlides when empty, keep the input state
                  return;
                } else if (/^\d+$/.test(value)) {
                  const numValue = parseInt(value);
                  const clampedValue = Math.max(1, Math.min(40, numValue));
                  actions.setField("numSlides", clampedValue);
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value === "" || !/^\d+$/.test(value)) {
                  // If empty or invalid on blur, reset to default
                  actions.setField("numSlides", 10);
                  actions.setField("numSlidesInput", undefined);
                } else {
                  // Clear the input state when done typing
                  actions.setField("numSlidesInput", undefined);
                }
              }}
              placeholder="Enter number of slides"
              className="w-full p-3 rounded-lg input-glass text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <span className="text-xs text-gray-400 mt-1 block">
              1-40 slides
            </span>
          </div>
        </div>

        {/* Template Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Template Upload (Optional)
          </label>

          <motion.div
            className={`
              relative p-6 border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer
              ${
                dragActive
                  ? "border-purple-400 bg-purple-500/10"
                  : "border-gray-600 hover:border-gray-500"
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <input
              type="file"
              accept=".pptx,.potx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            <div className="text-center">
              {state.template ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <FileText className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {state.template.name}
                    </p>
                    <p className="text-sm text-gray-300">
                      {(state.template.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.setField("template", null);
                    }}
                    className="p-1 rounded-full hover:bg-red-500/20 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-4 h-4 text-red-400" />
                  </motion.button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-300 mb-1">
                    Drop your .pptx/.potx template here
                  </p>
                  <p className="text-sm text-gray-400">
                    or click to browse files
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Reuse Images Option */}
        <motion.label
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.input
            type="checkbox"
            checked={state.reuseImages}
            onChange={(e) => actions.setField("reuseImages", e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500/50"
            whileTap={{ scale: 0.95 }}
          />
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">Reuse images from template</span>
          </div>
        </motion.label>
      </div>
    </div>
  );
}

export default ContentPanel;
