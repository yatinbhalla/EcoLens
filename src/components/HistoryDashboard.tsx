import React from 'react';
import { ProductIdea } from "../types";
import { Button } from "./ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { Trash2 } from "lucide-react";
import { formatScoreColor } from "../lib/utils";

interface Props {
  history: ProductIdea[];
  onSelect: (idea: ProductIdea) => void;
  onCompareSelected: (ideas: ProductIdea[]) => void;
  onDelete: (id: string) => void;
}

export function HistoryDashboard({ history, onSelect, onCompareSelected, onDelete }: Props) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      if (newSelected.size < 5) {
        newSelected.add(id);
      }
    }
    setSelectedIds(newSelected);
  };

  const handleCompare = () => {
    const selectedIdeas = history.filter(i => selectedIds.has(i.id));
    onCompareSelected(selectedIdeas);
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-20 text-[#1A2E22] dark:text-slate-100">
        <h2 className="text-2xl font-bold text-gray-400 dark:text-slate-500">No History Yet</h2>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Analyze some ideas to see them here.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1024px] mx-auto space-y-8 text-[#1A2E22] dark:text-slate-100 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-[#064E3B] dark:text-emerald-400">Analysis History</h2>
          <p className="text-gray-500 dark:text-slate-400">Select up to 5 ideas to compare laterally.</p>
        </div>
        {selectedIds.size > 1 && (
          <button onClick={handleCompare} className="px-6 py-2 bg-[#064E3B] dark:bg-emerald-600 text-white rounded-full font-bold shadow-sm hover:bg-[#064E3B]/90 dark:hover:bg-emerald-500 transition-all">
            Compare {selectedIds.size} Selected
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map(idea => {
          const isSelected = selectedIds.has(idea.id);
          const date = new Date(idea.createdAt).toLocaleDateString();
          return (
            <div 
              key={idea.id} 
              className={`relative p-8 rounded-[2rem] border transition-all cursor-pointer shadow-sm ${isSelected ? 'border-[#064E3B] dark:border-emerald-500 bg-[#E7F3EF] dark:bg-emerald-950/20' : 'border-[#E5E1D8] dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#6B8E23] dark:hover:border-emerald-500'}`}
              onClick={() => toggleSelect(idea.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-[#064E3B] dark:text-emerald-400">{idea.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-500">{date}</p>
                </div>
                {idea.analysis && (
                   <div className={`text-2xl font-black ${isSelected ? 'text-[#064E3B] dark:text-emerald-400' : 'text-[#6B8E23] dark:text-emerald-500'}`}>
                     {idea.analysis.overallScore}
                   </div>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mb-6">
                {idea.description}
              </p>
              <div className="flex justify-between items-center mt-auto">
                <button 
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-[#E5E1D8] dark:border-slate-700 rounded-lg font-bold text-[#1A2E22] dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors" 
                  onClick={(e) => { e.stopPropagation(); onSelect(idea); }}
                >
                  View Full
                </button>
                <button 
                  className="text-gray-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 p-2 transition-colors"
                  onClick={(e) => { e.stopPropagation(); onDelete(idea.id); }}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
