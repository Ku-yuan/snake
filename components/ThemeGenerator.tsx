import React, { useState } from 'react';
import { Sparkles, Loader2, Palette } from 'lucide-react';
import { generateGameTheme } from '../services/geminiService';
import { GameTheme } from '../types';

interface ThemeGeneratorProps {
  onThemeGenerated: (theme: GameTheme) => void;
  currentTheme: GameTheme;
}

const ThemeGenerator: React.FC<ThemeGeneratorProps> = ({ onThemeGenerated, currentTheme }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    const theme = await generateGameTheme(prompt);
    setLoading(false);

    if (theme) {
      onThemeGenerated(theme);
      setPrompt('');
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full max-w-md mb-4 px-4">
        {!isOpen ? (
            <button 
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm text-gray-300"
            >
                <Sparkles size={16} className="text-yellow-400" />
                AI 自定义主题
            </button>
        ) : (
            <div className="bg-slate-800/80 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Palette size={16} className="text-purple-400"/> 
                        AI 主题生成器
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="text-xs text-gray-400 hover:text-white">取消</button>
                </div>
                <form onSubmit={handleGenerate} className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="例如：赛博朋克城市、糖果乐园、火山..."
                        className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !prompt.trim()}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        {loading ? '生成中...' : '生成主题'}
                    </button>
                </form>
                <p className="text-[10px] text-gray-500 mt-2 text-center">
                    由 Gemini 2.5 Flash 驱动
                </p>
            </div>
        )}
    </div>
  );
};

export default ThemeGenerator;