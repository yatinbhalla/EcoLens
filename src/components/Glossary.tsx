import React, { useState } from 'react';
import { Leaf, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GlossaryTerm {
  term: string;
  definition: string;
}

const glossary: GlossaryTerm[] = [
  { term: "Carbon Footprint", definition: "The total greenhouse gases (measured in CO2e or Carbon Dioxide Equivalent) caused by making and transporting your product. It includes all major greenhouse gases like methane and nitrous oxide, not just CO2. A lower number means less impact on climate change." },
  { term: "UN SDGs", definition: "Sustainable Development Goals set by the United Nations. They are 17 global goals to protect the planet and improve lives (e.g., Climate Action, Clean Water)." },
  { term: "6Rs of Circularity", definition: "Strategies to reduce waste: Refuse (avoid unnecessary materials), Reduce (minimize resource use), Reuse (use items multiple times), Repair (fix instead of discarding), Repurpose (adapt for a new use), Recycle (process into raw materials). A high score means your product is designed for a circular economy." },
  { term: "Lifecycle Stages", definition: "The phases of a product's life. Physical products: extraction of raw materials, manufacturing, transportation, use phase, and disposal/recycling. Digital products: server hosting/energy, data transfer networks, user device energy consumption, and electronic waste." },
  { term: "LCA (Lifecycle Assessment)", definition: "A scientific method used to evaluate the environmental impacts of a product throughout its entire lifecycle." },
  { term: "Three Pillars", definition: "True sustainability balances Environmental (planet: protecting ecosystems and resources), Social (people: fair labor, health, safety, and community impact), and Economic (profit: long-term financial viability without exploiting people or the planet)." }
];

export function Glossary({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#1A2E22]/50 dark:bg-slate-950/80 backdrop-blur flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] dark:bg-slate-900 rounded-[2rem] p-8 max-w-2xl w-full shadow-lg border border-[#E5E1D8] dark:border-slate-800 max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 dark:text-slate-500 hover:text-[#064E3B] dark:hover:text-emerald-400 transition-colors">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#064E3B] dark:text-emerald-400 mb-2 flex items-center justify-center gap-2"><Info className="w-8 h-8"/>EcoLens Glossary</h2>
            <p className="text-gray-500 dark:text-slate-400">Understanding the language of sustainability. Use this reference to decode analysis scores and reports.</p>
        </div>
        <div className="grid gap-4">
          {glossary.map((g, i) => (
            <div key={i} className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-[#E5E1D8] dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-[#064E3B] dark:text-emerald-400 mb-1">{g.term}</h3>
                <p className="text-sm text-[#1A2E22] dark:text-slate-300">{g.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
