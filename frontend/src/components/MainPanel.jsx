import { motion } from 'framer-motion'
import { useState } from 'react'
import ContentPanel from './ContentPanel'
import ProviderPanel from './ProviderPanel'
import OutputPanel from './OutputPanel'
import { useApp } from '../context/AppContext'
import { 
  Sparkles, 
  Download, 
  Eraser,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

function MainPanel() {
  const { state, actions, isFormValid } = useApp()
  const [activeTab, setActiveTab] = useState('content')

  const handleGenerate = async () => {
    try {
      await actions.generatePresentation()
    } catch (error) {
      console.error('Generation failed:', error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  }

  return (
    <motion.div
      className="h-full space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="card-glass rounded-xl p-6"
        variants={itemVariants}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-7 h-7 text-yellow-400" />
              </motion.div>
              Auto-generate a Presentation
            </h2>
            <p className="text-gray-400 max-w-2xl">
              Transform your text or Markdown into stunning presentations with AI. 
              Choose your provider, upload a template, and let the magic happen.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              onClick={actions.downloadLastFile}
              disabled={!state.lastGeneratedFile}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
              whileHover={state.lastGeneratedFile ? { scale: 1.05 } : {}}
              whileTap={state.lastGeneratedFile ? { scale: 0.95 } : {}}
            >
              <Download className="w-4 h-4" />
              Download Last
            </motion.button>
            
            <motion.button
              onClick={actions.clearForm}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-white/10 hover:border-red-500/30 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eraser className="w-4 h-4" />
              Clear
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation for Mobile */}
      <motion.div 
        className="lg:hidden card-glass rounded-xl p-2"
        variants={itemVariants}
      >
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer ${
              activeTab === 'content'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('provider')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer ${
              activeTab === 'provider'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Provider
          </button>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Content Panel */}
        <motion.div 
          className={`lg:col-span-7 ${activeTab === 'content' ? 'block' : 'hidden lg:block'}`}
          variants={itemVariants}
        >
          <ContentPanel />
        </motion.div>

        {/* Provider Panel */}
        <motion.div 
          className={`lg:col-span-5 ${activeTab === 'provider' ? 'block' : 'hidden lg:block'}`}
          variants={itemVariants}
        >
          <ProviderPanel />
        </motion.div>
      </div>

      {/* Generate Button */}
      <motion.div 
        className="flex justify-center"
        variants={itemVariants}
      >
        <motion.button
          onClick={handleGenerate}
          disabled={!isFormValid() || state.isGenerating}
          className={`
            relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 cursor-pointer
            ${isFormValid() && !state.isGenerating
              ? 'btn-primary text-white shadow-2xl hover:shadow-purple-500/50'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
          whileHover={isFormValid() && !state.isGenerating ? { 
            scale: 1.05,
            boxShadow: "0 25px 50px rgba(102, 126, 234, 0.5)"
          } : {}}
          whileTap={isFormValid() && !state.isGenerating ? { scale: 0.98 } : {}}
        >
          <div className="flex items-center gap-3">
            {state.isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Presentation
              </>
            )}
          </div>
          
          {/* Loading overlay */}
          {state.isGenerating && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.button>
      </motion.div>

      {/* Form Validation Status */}
      <motion.div 
        className="flex justify-center"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2 text-sm">
          {isFormValid() ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Ready to generate</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">Please complete all required fields</span>
            </>
          )}
        </div>
      </motion.div>

      {/* Output Panel */}
      {state.lastGeneratedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <OutputPanel />
        </motion.div>
      )}
    </motion.div>
  )
}

export default MainPanel
