import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ProductIdea } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { formatScoreColor, formatScoreBgSubtle } from "../lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Accordion } from "./ui/Accordion";
import { Badge } from "./ui/Badge";
import { ExternalLink, Leaf, Recycle, Scale, Target } from "lucide-react";
import { Tooltip } from "./ui/Tooltip";

interface Props {
  idea: ProductIdea;
}

export function AnalysisDashboard({ idea }: Props) {
  if (!idea.analysis) return null;
  const { analysis } = idea;

  const carbonData = analysis.carbon.stages.map(s => ({
    name: s.name,
    kg: s.kg,
    fill: '#10b981' // emerald-500
  }));

  const sixRsData = [
    { subject: 'Refuse', A: analysis.sixRs.refuse.score, fullMark: 10 },
    { subject: 'Reduce', A: analysis.sixRs.reduce.score, fullMark: 10 },
    { subject: 'Reuse', A: analysis.sixRs.reuse.score, fullMark: 10 },
    { subject: 'Repair', A: analysis.sixRs.repair.score, fullMark: 10 },
    { subject: 'Repurpose', A: analysis.sixRs.repurpose.score, fullMark: 10 },
    { subject: 'Recycle', A: analysis.sixRs.recycle.score, fullMark: 10 },
  ];

  const pillarsData = [
    { name: 'Environmental', score: analysis.threePillars.environmental.score, fill: '#10b981' },
    { name: 'Social', score: analysis.threePillars.social.score, fill: '#3b82f6' },
    { name: 'Economic', score: analysis.threePillars.economic.score, fill: '#eab308' },
  ];

  const renderTextWithCitations = (text: string) => {
    // Regex to find [1], [2] etc and make them clickable links
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citationId = parseInt(match[1]);
        const citation = analysis.citations.find(c => c.id === citationId);
        if (citation) {
          return (
            <Tooltip
              key={i}
              className="z-[60]"
              content={
                <div className="max-w-xs text-left p-1">
                  <p className="font-bold mb-1 text-[10px] uppercase tracking-wider text-[#A3B18A]">Source [{citation.id}]</p>
                  <p className="font-semibold text-white mb-1 line-clamp-2">{citation.title || citation.url}</p>
                  {citation.snippet && <p className="text-gray-300 text-xs italic opacity-90 line-clamp-3">"{citation.snippet}"</p>}
                </div>
              }
            >
              <a href={citation.url} target="_blank" rel="noreferrer" className="text-[#059669] hover:underline text-xs align-super font-bold cursor-pointer mx-0.5" title={citation.title}>
                {part}
              </a>
            </Tooltip>
          );
        }
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div id="analysis-dashboard" className="w-full max-w-[1024px] mx-auto pb-12">
      {/* Target element for PDF export needs bg-white dark:bg-slate-950 for reliable printing */}
      <div className="bg-[#FDFBF7] text-[#1A2E22]">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* HERO */}
          <div className="lg:col-span-4 bg-white border border-[#E5E1D8] rounded-[2rem] p-8 shadow-sm flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#6B8E23]">Overall Assessment</span>
                <span className="bg-[#E7F3EF] text-[#064E3B] px-3 py-1 rounded-full text-[10px] font-bold italic">{idea.category || 'PRODUCT'}</span>
              </div>
              <h2 className="text-3xl font-bold leading-tight">{idea.name}</h2>
              <div className="text-sm text-[#6b7280] mt-2 italic">
                {renderTextWithCitations(analysis.verdict)}
              </div>
            </div>
            <div className="flex flex-col items-center mt-6">
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="#F3F0E9" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="64" cy="64" r="58" stroke="#064E3B" strokeWidth="8" fill="transparent" 
                    strokeLinecap="round"
                    strokeDasharray={`${(analysis.overallScore / 100) * 364} 364`}
                  />
                </svg>
                <span className="absolute text-4xl font-black text-[#064E3B]">{analysis.overallScore}</span>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm font-bold text-[#064E3B]">Sustainability Score</p>
              </div>
            </div>
          </div>

          {/* TOP LEVEL SCORES */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-white border-[#E5E1D8] rounded-[2rem] shadow-sm flex flex-col justify-center">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1 text-[#064E3B]">Carbon</p>
                  <div className="text-3xl font-bold text-[#1A2E22]">{analysis.carbon.score}/100</div>
                </div>
                <Leaf className="w-10 h-10 text-[#6B8E23] opacity-80" />
              </CardContent>
            </Card>
            <Card className="bg-[#064E3B] border-none text-white rounded-[2rem] shadow-sm flex flex-col justify-center">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1 text-[#A3B18A]">SDGs</p>
                  <div className="text-3xl font-bold">{analysis.sdgs.score}/100</div>
                </div>
                <Target className="w-10 h-10 text-[#A3B18A] opacity-80" />
              </CardContent>
            </Card>
            <Card className="bg-[#6B8E23] border-none text-white rounded-[2rem] shadow-sm flex flex-col justify-center">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1 text-white/80">Circularity</p>
                  <div className="text-3xl font-bold">{analysis.sixRs.score}/100</div>
                </div>
                <Recycle className="w-10 h-10 text-white/80 opacity-80" />
              </CardContent>
            </Card>
            <Card className="bg-white border-[#E5E1D8] rounded-[2rem] shadow-sm flex flex-col justify-center">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1 text-[#064E3B]">Pillars</p>
                  <div className="text-3xl font-bold text-[#1A2E22]">{analysis.threePillars.score}/100</div>
                </div>
                <Scale className="w-10 h-10 text-[#6B8E23] opacity-80" />
              </CardContent>
            </Card>
          </div>

          {/* COMPARATIVE ANALYSIS SECTION */}
          {analysis.comparativeAnalysis && (
            <div className="lg:col-span-12 bg-white border border-[#E5E1D8] rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#064E3B] mb-6">Deep Context & Comparative Analysis</h3>
              <div className="markdown-body">
                <ReactMarkdown>{analysis.comparativeAnalysis}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* IMPROVEMENTS */}
          <div className="lg:col-span-12 bg-white border border-[#E5E1D8] rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#064E3B] mb-6">Priority Improvements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analysis.improvements.map((imp, i) => (
                <div key={i} className="group flex flex-col justify-between cursor-pointer bg-[#FDFBF7] p-4 rounded-2xl border border-transparent hover:border-[#6B8E23] transition-all">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 shrink-0 bg-[#064E3B] text-white rounded-lg flex items-center justify-center font-bold">{i+1}</div>
                       <span className="font-bold text-sm leading-tight text-[#1A2E22]">{imp.target}</span>
                    </div>
                    <div className="text-xs text-[#6b7280] mb-4 ml-11">{renderTextWithCitations(imp.reason)}</div>
                  </div>
                  <div className="ml-11">
                    <span className="bg-[#E7F3EF] text-[#064E3B] text-[10px] px-2 py-1 rounded font-bold uppercase">{imp.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DETAILED ACORDIONS */}
        <div className="mt-6 bg-white border border-[#E5E1D8] rounded-[2rem] p-8 shadow-sm">
          <h3 className="text-xl font-bold text-[#064E3B] mb-6">Detailed Analysis Breakdown</h3>
          <div className="space-y-2">
          
          <Accordion title={<span className="text-lg font-semibold flex items-center"><Leaf className="w-5 h-5 mr-2" /> Lifecycle Carbon Breakthrough ({analysis.carbon.totalKg} kg CO₂e {analysis.carbon.uncertaintyRange})</span>} defaultOpen>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-4">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={carbonData} layout="vertical" margin={{ left: 40, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="kg" radius={[0, 4, 4, 0]}>
                      {carbonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {analysis.carbon.stages.map((stage, i) => (
                  <div key={i} className="border-b border-[#E5E1D8] pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between font-semibold mb-1">
                      <span>{stage.name}</span>
                      <span>{stage.kg} kg</span>
                    </div>
                    <div className="text-[#4b5563] text-sm">{renderTextWithCitations(stage.description)}</div>
                  </div>
                ))}
              </div>
            </div>
          </Accordion>

          <Accordion title={<span className="text-lg font-semibold flex items-center"><Target className="w-5 h-5 mr-2" /> UN SDGs Alignment</span>}>
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {analysis.sdgs.supported.map((sdg, i) => (
                <div key={i} className="p-4 rounded-lg bg-[#FDFBF7] border border-[#E5E1D8]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded bg-[#059669] text-white flex items-center justify-center font-bold text-xl">
                      {sdg.goalNumber}
                    </div>
                    <div className="font-semibold text-lg hover:underline"><a href={`https://sdgs.un.org/goals/goal${sdg.goalNumber}`} target="_blank" rel="noreferrer">Goal {sdg.goalNumber}</a></div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {sdg.targets.map(t => <Badge key={t} variant="outline">Target {t}</Badge>)}
                  </div>
                  <div className="text-sm text-[#4b5563]">{renderTextWithCitations(sdg.explanation)}</div>
                </div>
              ))}
            </div>
          </Accordion>

          <Accordion title={<span className="text-lg font-semibold flex items-center"><Recycle className="w-5 h-5 mr-2" /> 6Rs of Circularity</span>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 items-center">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={sixRsData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#888" tickCount={6} />
                    <Radar name="Score" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {Object.entries(analysis.sixRs).filter(([k]) => k !== 'score').map(([k, v]: [string, any]) => (
                  <div key={k} className="flex gap-4 p-3 rounded bg-[#FDFBF7]">
                    <div className="w-12 h-12 shrink-0 rounded flex flex-col items-center justify-center bg-white border border-[#E5E1D8]">
                      <span className="font-bold">{v.score}</span><span className="text-[10px] text-[#6b7280] uppercase">/10</span>
                    </div>
                    <div>
                      <h4 className="font-semibold capitalize">{k}</h4>
                      <div className="text-sm text-[#4b5563]">{renderTextWithCitations(v.reason)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Accordion>

          <Accordion title={<span className="text-lg font-semibold flex items-center"><Scale className="w-5 h-5 mr-2" /> Three Pillars</span>}>
            <div className="pt-4 space-y-6">
               {['environmental', 'social', 'economic'].map((pillar) => {
                 const data = (analysis.threePillars as any)[pillar];
                 return (
                   <div key={pillar} className="flex flex-col md:flex-row gap-6 items-start">
                     <div className="w-full md:w-48 shrink-0">
                       <h4 className="font-bold capitalize text-lg mb-1">{pillar}</h4>
                       <div className="h-3 w-full bg-[#E5E1D8] rounded-full overflow-hidden">
                         <div className="h-full bg-[#10b981]" style={{ width: `${data.score * 10}%` }} />
                       </div>
                       <div className="text-sm text-[#6b7280] font-medium mt-1">{data.score} / 10</div>
                     </div>
                     <div className="flex-1 text-[#374151]">{renderTextWithCitations(data.reason)}</div>
                   </div>
                 );
               })}
            </div>
          </Accordion>

          <Accordion title={<span className="text-lg font-semibold flex items-center"><ExternalLink className="w-5 h-5 mr-2" /> Sources & Citations</span>}>
             <div className="pt-4 space-y-3">
               {analysis.citations.map(c => (
                 <div key={c.id} className="text-sm">
                   <div className="flex font-medium items-start gap-2">
                     <span className="text-[#9ca3af] shrink-0">[{c.id}]</span>
                     <a href={c.url} target="_blank" rel="noreferrer" className="text-[#059669] hover:underline inline-flex items-center">
                       {c.title || c.url.slice(0, 50) + '...'}
                       <ExternalLink className="w-3 h-3 ml-1" />
                     </a>
                   </div>
                   {c.snippet && <p className="text-[#6b7280] mt-1 ml-6 italic">"{c.snippet}"</p>}
                 </div>
               ))}
             </div>
          </Accordion>

        </div>
        </div>
      </div>
    </div>
  )
}
