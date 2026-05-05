import React, { useState, useEffect } from 'react';
import { ProductIdea } from "./types";
import { IdeaForm } from "./components/IdeaForm";
import { LoadingState } from "./components/LoadingState";
import { AnalysisDashboard } from "./components/AnalysisDashboard";
import { ComparisonDashboard } from "./components/ComparisonDashboard";
import { HistoryDashboard } from "./components/HistoryDashboard";
import { analyzeProductIdea } from "./lib/gemini";
import { loadHistory, addOrUpdateIdea, deleteIdea } from "./lib/storage";
import { exportToPDF } from "./lib/pdf";
import { Download, ChevronLeft, History, BookOpen, CircleHelp } from "lucide-react";
import { AuthProvider, useAuth } from './components/AuthProvider';
import { LoginModal } from './components/LoginModal';
import { Glossary } from './components/Glossary';
import { Onboarding } from './components/Onboarding';
import { ThemeToggle } from './components/ThemeToggle';

function AppContent() {
  const [ideas, setIdeas] = useState<ProductIdea[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [view, setView] = useState<'form' | 'analysis' | 'comparison' | 'history'>('form');
  const [historyItems, setHistoryItems] = useState<ProductIdea[]>([]);
  
  const [showGlossary, setShowGlossary] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const { user, logOut } = useAuth();

  useEffect(() => {
    // Show onboarding on first visit
    const hasSeenOnboarding = localStorage.getItem('ecolens_onboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
      localStorage.setItem('ecolens_onboarding', 'true');
    }
  }, []);

  useEffect(() => {
    if (view === 'history') {
      loadHistory().then(setHistoryItems);
    }
  }, [view, user]);

  const startAnalysis = async (submittedIdeas: ProductIdea[]) => {
    setIsAnalyzing(true);
    setIdeas(submittedIdeas);
    setView(submittedIdeas.length > 1 ? 'comparison' : 'analysis');

    let updatedIdeas = [...submittedIdeas];
    
    for (let i = 0; i < submittedIdeas.length; i++) {
        try {
            setLoadingMsg(`Analyzing ${submittedIdeas[i].name}...`);
            const analysis = await analyzeProductIdea(submittedIdeas[i], setLoadingMsg);
            updatedIdeas[i] = { ...submittedIdeas[i], analysis };
            await addOrUpdateIdea(updatedIdeas[i]); // Save to Firestore or local storage automatically
        } catch (error) {
            console.error("Failed", error);
            // In a real app we'd display this error in the UI
            alert(`Failed to analyze ${submittedIdeas[i].name}. Please check your API key or try again.`);
        }
    }
    
    setIdeas(updatedIdeas);
    setIsAnalyzing(false);
  };

  const handleExport = () => {
    const elId = view === 'analysis' ? 'analysis-dashboard' : 'comparison-dashboard';
    const name = ideas.length === 1 ? ideas[0].name : 'eco-comparison';
    exportToPDF(elId, `EcoLens_Report_${name}`);
  };

  const openHistory = () => {
    loadHistory().then(items => {
        setHistoryItems(items);
        setView('history');
    });
  }

  const handleDeleteHistory = async (id: string) => {
    const updated = await deleteIdea(id);
    setHistoryItems(updated);
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-950 text-[#1A2E22] dark:text-slate-100 font-sans selection:bg-[#6B8E23]/30 dark:selection:bg-emerald-500/30">
      <header className="sticky top-0 z-40 w-full flex-none bg-[#FDFBF7]/90 dark:bg-slate-950/90 backdrop-blur pb-4 pt-6">
        <div className="max-w-[1024px] mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('form')}>
            <div className="w-10 h-10 bg-[#064E3B] dark:bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">🌱</div>
            <h1 className="text-2xl font-bold tracking-tight text-[#064E3B] dark:text-emerald-400 hidden sm:block">EcoLens <span className="text-[#6B8E23] dark:text-emerald-500 font-normal">Sustainability Analyzer</span></h1>
            <h1 className="text-xl font-bold tracking-tight text-[#064E3B] dark:text-emerald-400 sm:hidden">EcoLens</h1>
          </div>

          <div className="flex flex-wrap items-center gap-1 sm:gap-3">
             <ThemeToggle />
             <button onClick={() => setShowOnboarding(true)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#064E3B] dark:hover:text-emerald-400 rounded-full transition-colors" title="Tour">
               <CircleHelp className="w-5 h-5"/>
             </button>
             <button onClick={() => setShowGlossary(true)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#064E3B] dark:hover:text-emerald-400 rounded-full transition-colors" title="Glossary">
               <BookOpen className="w-5 h-5"/>
             </button>

             <div className="flex items-center gap-2 sm:gap-3 bg-[#F3F0E9] dark:bg-slate-800 p-1 rounded-full ml-1">
               {view === 'form' && (
                   <button className="px-4 sm:px-6 py-2 bg-white dark:bg-slate-700 rounded-full text-sm font-semibold shadow-sm text-[#064E3B] dark:text-emerald-100" onClick={openHistory}>
                     History
                   </button>
               )}
               {view !== 'form' && !isAnalyzing && (
                 <>
                   <button onClick={() => setView('form')} className="hidden sm:inline-block px-4 sm:px-6 py-2 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-[#1A2E22] dark:hover:text-white transition-colors rounded-full">
                     Compare Ideas
                   </button>
                   {(view === 'analysis' || view === 'comparison') && (
                       <button onClick={handleExport} className="px-4 sm:px-6 py-2 bg-white dark:bg-slate-700 rounded-full text-sm font-semibold shadow-sm text-[#064E3B] dark:text-emerald-100 hover:bg-gray-50 dark:hover:bg-slate-600 flex items-center gap-2">
                         <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export PDF</span>
                       </button>
                   )}
                 </>
               )}
             </div>

             {user ? (
               <div className="relative group ml-2">
                 <button className="w-10 h-10 rounded-full bg-[#064E3B] dark:bg-emerald-600 text-white font-bold flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                    {user.photoURL ? <img src={user.photoURL} alt={user.displayName || ''} /> : (user.displayName || 'U').charAt(0).toUpperCase()}
                 </button>
                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-[#E5E1D8] dark:border-slate-700 shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-3 border-b border-[#E5E1D8] dark:border-slate-700">
                        <p className="text-sm font-bold text-[#1A2E22] dark:text-slate-100 truncate">{user.displayName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button onClick={logOut} className="w-full text-left p-3 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold rounded-b-xl">Sign Out</button>
                 </div>
               </div>
             ) : (
               <button onClick={() => setShowLogin(true)} className="ml-2 px-4 py-2 bg-[#064E3B] dark:bg-emerald-600 text-white rounded-full text-sm font-bold shadow-sm hover:bg-[#064E3B]/90 dark:hover:bg-emerald-500 transition-colors">
                  Sign In
               </button>
             )}
          </div>
        </div>
      </header>
      
      <main className="max-w-[1024px] mx-auto px-6 py-8 md:py-12">
        {isAnalyzing && <LoadingState message={loadingMsg} />}
        
        {!isAnalyzing && view === 'form' && (
          <IdeaForm onSubmit={startAnalysis} />
        )}
        
        {!isAnalyzing && view === 'analysis' && ideas.length === 1 && (
          <AnalysisDashboard idea={ideas[0]} />
        )}

        {!isAnalyzing && view === 'comparison' && ideas.length > 1 && (
          <ComparisonDashboard ideas={ideas} />
        )}

        {!isAnalyzing && view === 'history' && (
          <HistoryDashboard 
            history={historyItems}
            onSelect={(idea) => { setIdeas([idea]); setView('analysis'); }}
            onCompareSelected={(ideas) => { setIdeas(ideas); setView('comparison'); }}
            onDelete={handleDeleteHistory}
          />
        )}
      </main>

      {showGlossary && <Glossary onClose={() => setShowGlossary(false)} />}
      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
