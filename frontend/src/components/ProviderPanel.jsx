import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import {
  Bot,
  Key,
  Clipboard,
  Eye,
  EyeOff,
  Cpu,
  Zap,
  Brain,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

function ProviderPanel() {
  const { state, actions, models } = useApp();
  const [showApiKey, setShowApiKey] = useState(false);

  const providers = [
    {
      id: "openai",
      name: "OpenAI",
      description: "GPT models for high-quality content",
      icon: Brain,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
    },
    {
      id: "aipipe",
      name: "AI Pipe",
      description: "OpenRouter gateway with multiple models",
      icon: Zap,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      id: "gemini",
      name: "Google Gemini",
      description: "Google's powerful AI models",
      icon: Sparkles,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
    },
    {
      id: "anthropic",
      name: "Anthropic",
      description: "Claude models for thoughtful responses",
      icon: Cpu,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-500/30",
    },
  ];

  const selectedProvider = providers.find((p) => p.id === state.provider);

  return (
    <div className="card-glass rounded-xl p-6 h-full">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Bot className="w-5 h-5 text-purple-400" />
        AI Provider & Settings
      </h3>

      <div className="space-y-6">
        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Choose AI Provider
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {providers.map((provider) => {
              const IconComponent = provider.icon;
              const isSelected = state.provider === provider.id;

              return (
                <motion.button
                  key={provider.id}
                  onClick={() => actions.setProvider(provider.id)}
                  className={`
                    p-4 rounded-lg border text-left cursor-pointer
                    ${
                      isSelected
                        ? `${provider.bgColor} ${
                            provider.borderColor
                          } ring-2 ring-${provider.color.split("-")[1]}-500/50`
                        : "glass border-white/10 hover:border-white/20"
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${provider.bgColor}`}>
                      <IconComponent className={`w-5 h-5 ${provider.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-medium ${
                          isSelected ? "text-white" : "text-gray-200"
                        }`}
                      >
                        {provider.name}
                      </h4>
                      <p
                        className={`text-sm ${
                          isSelected ? "text-gray-200" : "text-white"
                        } mt-1`}
                      >
                        {provider.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* API Key Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Key className="w-4 h-4" />
            API Key / Token
          </label>
          <div className="relative">
            <motion.input
              type={showApiKey ? "text" : "password"}
              value={state.apiKey}
              onChange={(e) => actions.setField("apiKey", e.target.value)}
              placeholder={`Enter your ${
                selectedProvider?.name || "API"
              } key...`}
              className="w-full p-3 pr-20 rounded-lg input-glass text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <motion.button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-1.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={showApiKey ? "Hide API key" : "Show API key"}
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={actions.pasteFromClipboard}
                className="p-1.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Paste from clipboard"
              >
                <Clipboard className="w-4 h-4 text-gray-400" />
              </motion.button>
            </div>
          </div>
          {state.apiKey && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-green-400 flex items-center gap-1"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✓
              </motion.div>
              API key configured
            </motion.div>
          )}
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            AI Model
          </label>
          <motion.select
            value={state.model}
            onChange={(e) => actions.setField("model", e.target.value)}
            className="w-full p-3 rounded-lg input-glass text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {models.length === 0 ? (
              <option value="">Select a provider first</option>
            ) : (
              models.map((model) => (
                <option key={model.id} value={model.id} className="bg-gray-800">
                  {model.label}
                </option>
              ))
            )}
          </motion.select>

          <div className="mt-2 text-xs text-gray-300">
            {state.provider === "openai" &&
              "OpenAI models for high-quality generation"}
            {state.provider === "aipipe" && "AI Pipe (OpenRouter) models"}
            {state.provider === "gemini" && "Google Gemini models"}
            {state.provider === "anthropic" && "Anthropic Claude models"}
          </div>
        </div>

        {/* Provider Info */}
        {selectedProvider && (
          <motion.div
            className={`p-4 rounded-lg ${selectedProvider.bgColor} border ${selectedProvider.borderColor}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start gap-3">
              <selectedProvider.icon
                className={`w-5 h-5 ${selectedProvider.color} mt-0.5`}
              />
              <div>
                <h4 className="font-medium text-white mb-1">
                  {selectedProvider.name}
                </h4>
                <p className="text-sm text-gray-200 mb-2">
                  {selectedProvider.description}
                </p>
                <div className="text-xs text-gray-200">
                  {models.length} model{models.length !== 1 ? "s" : ""}{" "}
                  available
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ProviderPanel;
