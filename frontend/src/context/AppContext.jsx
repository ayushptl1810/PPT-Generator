import { createContext, useContext, useReducer, useEffect } from "react";
import toast from "react-hot-toast";

const AppContext = createContext();

// Initial state
const initialState = {
  // Form data
  text: "",
  guidance: "",
  numSlides: 10,
  numSlidesInput: undefined, // Temporary input state for number field
  template: null,
  reuseImages: false,

  // Provider settings
  provider: "openai",
  apiKey: "",
  model: "",

  // UI state
  isGenerating: false,
  lastGeneratedFile: null,

  // History
  history: [],
  maxHistory: 200,

  // Performance
  responseTime: 0,
  apiCalls: 0,
};

// Provider models mapping
export const PROVIDER_MODELS = {
  openai: [
    { id: "gpt-4o-mini", label: "GPT-4o Mini (Recommended)" },
    { id: "gpt-4o", label: "GPT-4o" },
    { id: "gpt-4-turbo", label: "GPT-4 Turbo" },
    { id: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  ],
  aipipe: [
    { id: "gpt-4o-mini", label: "GPT-4o Mini" },
    { id: "gpt-4o", label: "GPT-4o" },
    { id: "gpt-4-turbo", label: "GPT-4 Turbo" },
  ],
  gemini: [
    { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
    { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
    { id: "gemini-pro", label: "Gemini Pro" },
  ],
  anthropic: [
    { id: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet (Latest)" },
    { id: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku" },
    { id: "claude-3-opus-20240229", label: "Claude 3 Opus" },
    { id: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet" },
  ],
};

// Action types
const ACTION_TYPES = {
  SET_FIELD: "SET_FIELD",
  SET_PROVIDER: "SET_PROVIDER",
  SET_GENERATING: "SET_GENERATING",
  ADD_HISTORY: "ADD_HISTORY",
  CLEAR_HISTORY: "CLEAR_HISTORY",
  CLEAR_FORM: "CLEAR_FORM",
  LOAD_HISTORY_ITEM: "LOAD_HISTORY_ITEM",
  UPDATE_PERFORMANCE: "UPDATE_PERFORMANCE",

  LOAD_STATE: "LOAD_STATE",
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_FIELD:
      return {
        ...state,
        [action.field]: action.value,
      };

    case ACTION_TYPES.SET_PROVIDER:
      const models = PROVIDER_MODELS[action.provider] || [];
      return {
        ...state,
        provider: action.provider,
        model: models.length > 0 ? models[0].id : "",
      };

    case ACTION_TYPES.SET_GENERATING:
      return {
        ...state,
        isGenerating: action.isGenerating,
      };

    case ACTION_TYPES.ADD_HISTORY:
      const newHistory = [action.item, ...state.history].slice(0, 200);
      return {
        ...state,
        history: newHistory,
      };

    case ACTION_TYPES.CLEAR_HISTORY:
      return {
        ...state,
        history: [],
      };

    case ACTION_TYPES.CLEAR_FORM:
      return {
        ...state,
        text: "",
        guidance: "",
        numSlides: 10,
        template: null,
        reuseImages: false,
      };

    case ACTION_TYPES.LOAD_HISTORY_ITEM:
      return {
        ...state,
        text: action.item.text || state.text,
        guidance: action.item.guidance || state.guidance,
        numSlides: action.item.slides || state.numSlides,
        provider: action.item.provider || state.provider,
        model: action.item.model || state.model,
      };

    case ACTION_TYPES.UPDATE_PERFORMANCE:
      return {
        ...state,
        responseTime: action.responseTime || state.responseTime,
        apiCalls:
          action.apiCalls !== undefined ? action.apiCalls : state.apiCalls,
      };

    case ACTION_TYPES.LOAD_STATE:
      return {
        ...state,
        ...action.state,
      };

    default:
      return state;
  }
}

// Local storage keys
const STORAGE_KEYS = {
  HISTORY: "ppt-generator-history",
  STATE: "ppt-generator-state",
};

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]"
      );
      const savedState = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.STATE) || "{}"
      );

      dispatch({
        type: ACTION_TYPES.LOAD_STATE,
        state: {
          history: savedHistory,
          apiKey: savedState.apiKey || "",
          provider: savedState.provider || "openai",
        },
      });
    } catch (error) {
      console.error("Error loading saved state:", error);
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(state.history));
      localStorage.setItem(
        STORAGE_KEYS.STATE,
        JSON.stringify({
          apiKey: state.apiKey.slice(0, 10), // Only save prefix for security
          provider: state.provider,
        })
      );
    } catch (error) {
      console.error("Error saving state:", error);
    }
  }, [state.history, state.apiKey, state.provider]);

  // Actions
  const actions = {
    setField: (field, value) => {
      dispatch({ type: ACTION_TYPES.SET_FIELD, field, value });
    },

    setProvider: (provider) => {
      dispatch({ type: ACTION_TYPES.SET_PROVIDER, provider });
    },

    setGenerating: (isGenerating) => {
      dispatch({ type: ACTION_TYPES.SET_GENERATING, isGenerating });
    },

    addHistory: (item) => {
      dispatch({ type: ACTION_TYPES.ADD_HISTORY, item });
    },

    clearHistory: () => {
      dispatch({ type: ACTION_TYPES.CLEAR_HISTORY });
      toast.success("History cleared");
    },

    clearForm: () => {
      dispatch({ type: ACTION_TYPES.CLEAR_FORM });
      toast.success("Form cleared");
    },

    loadHistoryItem: (item) => {
      dispatch({ type: ACTION_TYPES.LOAD_HISTORY_ITEM, item });
      toast.success("Parameters loaded");
    },

    updatePerformance: (responseTime, apiCalls) => {
      dispatch({
        type: ACTION_TYPES.UPDATE_PERFORMANCE,
        responseTime,
        apiCalls,
      });
    },

    // Generate presentation
    generatePresentation: async () => {
      if (!state.text.trim() || !state.apiKey.trim()) {
        toast.error("Please fill in all required fields");
        return;
      }

      actions.setGenerating(true);
      const startTime = performance.now();

      try {
        const formData = new FormData();
        formData.append("text", state.text.trim());
        formData.append("guidance", state.guidance.trim());
        formData.append("provider", state.provider);
        formData.append("api_key", state.apiKey);
        formData.append("model", state.model);
        formData.append("num_slides", state.numSlides.toString());
        formData.append("reuse_images", state.reuseImages.toString());

        if (state.template) {
          formData.append("template", state.template);
        }

        const response = await fetch("/generate", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `Server error ${response.status}`;

          if (response.status === 401) {
            errorMessage += " - Invalid API key";
          } else if (response.status === 429) {
            errorMessage += " - Rate limit exceeded";
          } else if (errorText.includes("model")) {
            errorMessage += " - Model not available";
          }

          throw new Error(errorMessage);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Update state
        actions.setField("lastGeneratedFile", url);

        // Add to history
        const historyItem = {
          id: Date.now(),
          title: state.guidance || state.text.slice(0, 50),
          timestamp: new Date().toISOString(),
          slides: state.numSlides,
          provider: state.provider,
          model: state.model,
          text: state.text.slice(0, 200),
          guidance: state.guidance,
        };

        actions.addHistory(historyItem);

        // Update performance
        const responseTime = Math.round(performance.now() - startTime);
        actions.updatePerformance(responseTime, state.apiCalls + 1);

        toast.success("Presentation generated successfully!");

        return url;
      } catch (error) {
        console.error("Generation error:", error);
        toast.error(error.message || "Failed to generate presentation");
        throw error;
      } finally {
        actions.setGenerating(false);
      }
    },

    // Download last generated file
    downloadLastFile: () => {
      if (!state.lastGeneratedFile) {
        toast.error("No file available for download");
        return;
      }

      const link = document.createElement("a");
      link.href = state.lastGeneratedFile;
      link.download = "presentation.pptx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started");
    },

    // Export history
    exportHistory: () => {
      const dataStr = JSON.stringify(state.history, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "ppt-generator-history.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      toast.success("History exported");
    },

    // Paste from clipboard
    pasteFromClipboard: async () => {
      try {
        const text = await navigator.clipboard.readText();
        actions.setField("apiKey", text.trim());
        toast.success("API key pasted from clipboard");
      } catch (error) {
        toast.error("Failed to access clipboard");
      }
    },
  };

  // Validation
  const isFormValid = () => {
    return (
      state.text.trim().length > 10 &&
      state.apiKey.trim().length > 6 &&
      state.numSlides >= 1 &&
      state.numSlides <= 40
    );
  };

  const value = {
    state,
    actions,
    isFormValid,
    models: PROVIDER_MODELS[state.provider] || [],
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
