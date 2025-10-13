import React, { useState, useCallback } from 'react';
import { 
    getAllConfigs, 
    getCustomConfigs, 
    saveCustomConfig, 
    deleteCustomConfig,
    INDUSTRY_CONFIGS,
    DEFAULT_CONFIG
} from '../config/industryConfigs';
// FIX: The IndustryConfig type should be imported from the types file, not the config file.
import type { View, IndustryConfig } from '../types';
import { 
    TrashIcon, 
    EditIcon, 
    PlusIcon, 
    SaveIcon, 
    XIcon,
    CopyIcon,
    SparklesIcon,
    SettingsIcon
} from './icons/Icon';

interface IndustryConfigPageProps {
  setView: (view: View) => void;
}

const isBuiltIn = (id: string) => Object.keys(INDUSTRY_CONFIGS).includes(id);

export const IndustryConfigPage: React.FC<IndustryConfigPageProps> = ({ setView }) => {
  const [configs, setConfigs] = useState(getAllConfigs);
  const [editingConfig, setEditingConfig] = useState<IndustryConfig | null>(null);

  const refreshConfigs = useCallback(() => {
    setConfigs(getAllConfigs());
  }, []);

  const handleEdit = (config: IndustryConfig) => {
    // Deep copy to prevent direct state mutation
    setEditingConfig(JSON.parse(JSON.stringify(config)));
  };

  const handleClone = (config: IndustryConfig) => {
    const newConfig = JSON.parse(JSON.stringify(config));
    newConfig.id = `custom_${Date.now()}`;
    newConfig.name = `[Clone] ${config.name}`;
    setEditingConfig(newConfig);
  };

  const handleCreate = () => {
    const newConfig = {
      ...JSON.parse(JSON.stringify(DEFAULT_CONFIG)), // Start from default
      id: `custom_${Date.now()}`,
      name: 'New Custom Persona',
      description: 'A new custom analysis persona.',
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEditingConfig(newConfig);
  };

  const handleSave = () => {
    if (!editingConfig || !editingConfig.name || !editingConfig.systemPrompt) {
      alert('Persona must have a Name and a System Prompt.');
      return;
    }
    const configToSave = { ...editingConfig, updatedAt: new Date().toISOString() };
    saveCustomConfig(configToSave);
    refreshConfigs();
    setEditingConfig(null);
  };

  const handleCancel = () => {
    setEditingConfig(null);
  };

  const handleDelete = (id: string) => {
    if (isBuiltIn(id)) {
        alert("Built-in configurations cannot be deleted.");
        return;
    }
    if (window.confirm('Are you sure you want to delete this persona? This action cannot be undone.')) {
      deleteCustomConfig(id);
      refreshConfigs();
    }
  };

  return (
    <div className="relative text-gray-100 container mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Configuration
        </h2>
        <p className="text-xl text-gray-300">Manage your AI analysis personas</p>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreate}
          disabled={!!editingConfig}
          className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-5 h-5" />
          Create New Persona
        </button>
      </div>

      {editingConfig && (
        <div className="bg-slate-800/80 backdrop-blur-xl border-2 border-purple-500/50 rounded-2xl p-6 mb-8 animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-4">
                {isBuiltIn(editingConfig.id) ? 'Cloning Persona' : 'Editing Persona'}
            </h3>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Persona Name"
                    value={editingConfig.name}
                    onChange={(e) => setEditingConfig({ ...editingConfig, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                    type="text"
                    placeholder="Persona Description"
                    value={editingConfig.description}
                    onChange={(e) => setEditingConfig({ ...editingConfig, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                    placeholder="System Prompt..."
                    value={editingConfig.systemPrompt}
                    onChange={(e) => setEditingConfig({ ...editingConfig, systemPrompt: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                />
                 <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={editingConfig.enabled}
                            onChange={(e) => setEditingConfig({ ...editingConfig, enabled: e.target.checked })}
                            className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-purple-500 focus:ring-purple-500"
                        />
                        Enable this persona
                    </label>
                    <div className="flex gap-3">
                        <button onClick={handleCancel} className="px-5 py-2 bg-slate-700 text-gray-300 font-semibold rounded-lg hover:bg-slate-600 transition flex items-center gap-2">
                            <XIcon className="w-5 h-5" /> Cancel
                        </button>
                        <button onClick={handleSave} className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center gap-2">
                            <SaveIcon className="w-5 h-5" /> Save Persona
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="space-y-4">
        {configs.map(config => (
          <div key={config.id} className={`bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 transition-all duration-300 ${!config.enabled ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{config.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${isBuiltIn(config.id) ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'}`}>
                        {isBuiltIn(config.id) ? 'Built-in' : 'Custom'}
                    </span>
                    {!config.enabled && <span className="px-2 py-1 rounded text-xs font-semibold bg-slate-600/50 text-slate-400">Disabled</span>}
                </div>
                <p className="text-sm text-gray-400 mb-3">{config.description}</p>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-xs text-gray-500 font-mono line-clamp-2">{config.systemPrompt}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                {isBuiltIn(config.id) ? (
                    <button onClick={() => handleClone(config)} disabled={!!editingConfig} className="p-2 bg-slate-700/50 text-gray-300 font-semibold rounded-lg hover:bg-slate-700 transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <CopyIcon className="w-4 h-4"/> Clone
                    </button>
                ) : (
                    <>
                    <button onClick={() => handleEdit(config)} disabled={!!editingConfig} className="p-2 bg-slate-700/50 text-gray-300 font-semibold rounded-lg hover:bg-slate-700 transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <EditIcon className="w-4 h-4"/> Edit
                    </button>
                    <button onClick={() => handleDelete(config.id)} disabled={!!editingConfig} className="p-2 bg-red-900/50 text-red-400 font-semibold rounded-lg hover:bg-red-900/80 transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <TrashIcon className="w-4 h-4"/> Delete
                    </button>
                    </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
