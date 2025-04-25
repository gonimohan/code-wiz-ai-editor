
import React, { useState, useEffect } from 'react';
import { Key, Plus, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface APIKey {
  id: string;
  provider: string;
  model: string;
  key: string;
}

// Expanded list of API providers and their models
const API_PROVIDERS_AND_MODELS = {
  'OpenAI': ['gpt-4', 'gpt-3.5-turbo'],
  'Anthropic': ['claude-3-opus', 'claude-3-sonnet', 'claude-2.1'],
  'DeepSeek': ['deepseek-chat', 'deepseek-coder'],
  'Groq': ['mixtral-8x7b', 'llama2-70b'],
  'OpenRouter': ['openchat', 'mistral-medium', 'mixtral-8x7b'],
  'Gemini': ['gemini-pro', 'gemini-pro-vision'],
  'Mistral': ['mistral-tiny', 'mistral-small', 'mistral-medium'],
  'Cohere': ['command', 'command-light', 'command-nightly'],
  'AI21': ['j2-ultra', 'j2-mid'],
  'Together AI': ['mixtral-8x7b', 'yi-34b']
};

export const APIKeyManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newKey, setNewKey] = useState({ provider: '', model: '', key: '' });
  const { toast } = useToast();

  useEffect(() => {
    const savedKeys = localStorage.getItem('api_keys');
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
  }, []);

  const saveKeys = (updatedKeys: APIKey[]) => {
    localStorage.setItem('api_keys', JSON.stringify(updatedKeys));
    setApiKeys(updatedKeys);
  };

  const addKey = () => {
    if (!newKey.provider || !newKey.model || !newKey.key) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
      });
      return;
    }

    const key: APIKey = {
      id: Date.now().toString(),
      ...newKey
    };

    const updatedKeys = [...apiKeys, key];
    saveKeys(updatedKeys);
    setNewKey({ provider: '', model: '', key: '' });
    
    toast({
      title: "API Key Added",
      description: `${newKey.provider} API key has been added for ${newKey.model}`,
    });
  };

  const removeKey = (id: string) => {
    const updatedKeys = apiKeys.filter(key => key.id !== id);
    saveKeys(updatedKeys);
    
    toast({
      title: "API Key Removed",
      description: "The API key has been removed",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-[#333333] hover:bg-[#404040] rounded-md"
      >
        <Key size={16} />
        <span>API Keys</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-[#252526] border border-[#404040] rounded-md shadow-lg p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-[#d4d4d4] mb-2">Add New API Key</h3>
            <div className="space-y-2">
              <select
                value={newKey.provider}
                onChange={(e) => {
                  setNewKey({ 
                    ...newKey, 
                    provider: e.target.value,
                    model: '' // Reset model when provider changes
                  });
                }}
                className="w-full bg-[#333333] border border-[#404040] rounded px-3 py-2 text-sm"
              >
                <option value="">Select Provider</option>
                {Object.keys(API_PROVIDERS_AND_MODELS).map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
              
              {newKey.provider && (
                <select
                  value={newKey.model}
                  onChange={(e) => setNewKey({ ...newKey, model: e.target.value })}
                  className="w-full bg-[#333333] border border-[#404040] rounded px-3 py-2 text-sm"
                >
                  <option value="">Select Model</option>
                  {API_PROVIDERS_AND_MODELS[newKey.provider as keyof typeof API_PROVIDERS_AND_MODELS].map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              )}
              
              <input
                type="password"
                placeholder="API Key"
                value={newKey.key}
                onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                className="w-full bg-[#333333] border border-[#404040] rounded px-3 py-2 text-sm"
              />
              <button
                onClick={addKey}
                className="flex items-center gap-2 w-full justify-center bg-[#0e639c] hover:bg-[#1177bb] text-white rounded px-4 py-2 text-sm"
              >
                <Plus size={14} />
                Add Key
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-[#d4d4d4] mb-2">Saved API Keys</h3>
            <div className="space-y-2">
              {apiKeys.map(key => (
                <div key={key.id} className="flex items-center justify-between bg-[#333333] rounded p-2">
                  <div>
                    <div className="text-sm font-medium">{key.provider}</div>
                    <div className="text-xs text-[#858585]">{key.model}</div>
                  </div>
                  <button
                    onClick={() => removeKey(key.id)}
                    className="text-[#858585] hover:text-white"
                    title="Remove Key"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
