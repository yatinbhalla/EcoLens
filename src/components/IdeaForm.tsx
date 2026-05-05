import React, { useState } from 'react';
import { ProductIdea } from "../types";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2 } from "lucide-react";
import { Accordion } from "./ui/Accordion";

interface Props {
  onSubmit: (ideas: ProductIdea[]) => void;
  initialIdeas?: ProductIdea[];
}

export function IdeaForm({ onSubmit, initialIdeas }: Props) {
  const [ideas, setIdeas] = useState<Partial<ProductIdea>[]>(
    initialIdeas?.length ? initialIdeas : [{ id: uuidv4(), name: '', description: '' }]
  );

  const handleUpdate = (index: number, field: keyof ProductIdea, value: string) => {
    const newIdeas = [...ideas];
    newIdeas[index] = { ...newIdeas[index], [field]: value };
    setIdeas(newIdeas);
  };

  const handleAdd = () => {
    if (ideas.length < 5) {
      setIdeas([...ideas, { id: uuidv4(), name: '', description: '' }]);
    }
  };

  const handleRemove = (index: number) => {
    if (ideas.length > 1) {
      const newIdeas = [...ideas];
      newIdeas.splice(index, 1);
      setIdeas(newIdeas);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    const validIdeas = ideas.filter(i => i.name?.trim() && i.description?.trim()) as ProductIdea[];
    if (validIdeas.length > 0) {
      // Add timestamp if fresh
      const toSubmit = validIdeas.map(i => ({ ...i, createdAt: i.createdAt || Date.now() }));
      onSubmit(toSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-[1024px] mx-auto text-[#1A2E22] dark:text-slate-100 pb-12">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-[#064E3B] dark:text-emerald-400">Idea Analysis</h1>
        <p className="text-gray-500 dark:text-gray-400">Analyze the environmental impact of your product idea, or compare multiple ideas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {ideas.map((idea, index) => (
          <div key={idea.id} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-[#E5E1D8] dark:border-slate-800 shadow-sm space-y-4 relative">
            {ideas.length > 1 && (
              <button 
                type="button" 
                onClick={() => handleRemove(index)}
                className="absolute top-6 right-6 text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                title="Remove idea"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            
            <h3 className="font-bold text-xl text-[#064E3B] dark:text-emerald-400">Idea {index + 1}</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 text-[11px]">Product Name *</label>
              <Input 
                required 
                placeholder="e.g. Stainless Steel Bottle" 
                value={idea.name || ''} 
                onChange={e => handleUpdate(index, 'name', e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 text-[11px]">Description *</label>
              <Textarea 
                required 
                placeholder="Describe what it is, how it's made, who it's for..." 
                value={idea.description || ''} 
                onChange={e => handleUpdate(index, 'description', e.target.value)} 
                rows={4}
              />
            </div>

            <Accordion title="Optional Details (improves accuracy)">
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Category</label>
                  <Input placeholder="e.g. Consumer Goods, Digital App" value={idea.category || ''} onChange={e => handleUpdate(index, 'category', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Known Materials/Tech</label>
                  <Input placeholder="e.g. Bamboo, AWS servers" value={idea.materials || ''} onChange={e => handleUpdate(index, 'materials', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Production/Hosting Location</label>
                  <Input placeholder="e.g. Vietnam, US-East" value={idea.productionLocation || ''} onChange={e => handleUpdate(index, 'productionLocation', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Distribution / Delivery</label>
                  <Input placeholder="e.g. Direct to consumer via ocean freight" value={idea.distributionChannel || ''} onChange={e => handleUpdate(index, 'distributionChannel', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Intended Lifespan</label>
                  <Input placeholder="e.g. 5+ years" value={idea.intendedLifespan || ''} onChange={e => handleUpdate(index, 'intendedLifespan', e.target.value)} />
                </div>
              </div>
            </Accordion>
          </div>
        ))}
        
        {ideas.length < 5 && (
          <button 
            type="button" 
            onClick={handleAdd}
            className="flex flex-col items-center justify-center p-8 h-full rounded-[2rem] border border-dashed border-[#E5E1D8] dark:border-slate-800 text-gray-400 dark:text-gray-500 hover:text-[#064E3B] dark:hover:text-emerald-400 hover:border-[#6B8E23] dark:hover:border-emerald-500 hover:bg-white dark:hover:bg-slate-800 transition-all min-h-[300px]"
          >
            <span className="text-xs font-bold uppercase tracking-widest">+ Add Idea to Compare</span>
          </button>
        )}
      </div>

      <div className="flex justify-center pt-8">
        <button type="submit" disabled={ideas.every(i => !i.name || !i.description)} className="px-8 py-3 bg-[#064E3B] dark:bg-emerald-600 text-white rounded-full font-bold shadow-sm hover:bg-[#064E3B]/90 dark:hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {ideas.length > 1 ? `Compare ${ideas.length} Ideas` : "Analyze Idea"}
        </button>
      </div>
    </form>
  )
}
