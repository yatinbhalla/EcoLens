import React, { useState } from 'react';
import { Leaf, Info, Zap, ArrowRight, X, Play, BarChart2 } from 'lucide-react';

const steps = [
  {
    title: "Welcome to EcoLens 🌱",
    description: "EcoLens analyzes your product ideas to evaluate their environmental impact. Let's take a quick tour of how to use the app to design greener products.",
    icon: <Leaf className="w-12 h-12 text-[#6B8E23]" />
  },
  {
    title: "1. Define Your Idea",
    description: "Enter a product name and description. The more details you provide in the \"Optional Details\" section (like materials or manufacturing location), the more accurate our AI analysis will be.",
    icon: <Info className="w-12 h-12 text-[#064E3B]" />
  },
  {
    title: "2. The AI Magic",
    description: "Behind the scenes, we use Gemini paired with live web search to estimate carbon footprints, align with UN SDGs, and calculate circularity scores based on real-world data and LCA patterns.",
    icon: <Zap className="w-12 h-12 text-[#A3B18A]" />
  },
  {
    title: "3. Insights & Improvements",
    description: "Once analyzed, you'll receive a detailed dashboard. Pay special attention to the \"Priority Improvements\" section—it provides actionable steps to make your product more sustainable.",
    icon: <BarChart2 className="w-12 h-12 text-[#064E3B]" />
  }
];

export function Onboarding({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  }

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  }

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[60] bg-[#1A2E22]/50 dark:bg-slate-950/80 backdrop-blur flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] dark:bg-slate-900 rounded-[2rem] p-8 max-w-lg w-full shadow-lg border border-[#E5E1D8] dark:border-slate-800 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 dark:text-slate-500 hover:text-[#064E3B] dark:hover:text-emerald-400 transition-colors">
           <X className="w-5 h-5"/>
        </button>
        
        <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center shadow-sm border border-[#E5E1D8] dark:border-slate-800">
                {current.icon}
            </div>
        </div>

        <div className="text-center mb-8 min-h-[140px]">
            <h2 className="text-2xl font-bold text-[#064E3B] dark:text-emerald-400 mb-3">{current.title}</h2>
            <p className="text-[#1A2E22] dark:text-slate-300 leading-relaxed">{current.description}</p>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E5E1D8] dark:border-slate-800">
            <div className="flex gap-2">
                {steps.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-6 bg-[#064E3B] dark:bg-emerald-500' : 'w-2 bg-gray-300 dark:bg-slate-700'}`} />
                ))}
            </div>
            <div className="flex gap-2">
                {step > 0 && <button onClick={prevStep} className="px-4 py-2 font-bold text-gray-500 dark:text-slate-500 hover:text-[#1A2E22] dark:hover:text-slate-300 transition-colors">Back</button>}
                <button onClick={nextStep} className="px-6 py-2 bg-[#064E3B] dark:bg-emerald-600 text-white rounded-full font-bold flex items-center gap-2 hover:bg-[#064E3B]/90 dark:hover:bg-emerald-500 transition-colors">
                    {step === steps.length - 1 ? 'Get Started' : 'Next'} {step < steps.length - 1 && <ArrowRight className="w-4 h-4"/>}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
