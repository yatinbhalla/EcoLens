import React from 'react';
import { ProductIdea } from "../types";
import { RadialBarChart, RadialBar, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface Props {
  ideas: ProductIdea[];
}

export function ComparisonDashboard({ ideas }: Props) {
  // Only valid analyzed ideas
  const analyzedIdeas = ideas.filter(i => i.analysis);
  if (analyzedIdeas.length < 2) return null;

  const compareScores = analyzedIdeas.map((idea, i) => ({
    name: idea.name,
    Score: idea.analysis?.overallScore || 0,
    fill: `hsl(${150 + i * 40}, 80%, 45%)`
  }));

  const carbonData = analyzedIdeas.map((idea, i) => ({
    name: idea.name,
    Carbon: idea.analysis?.carbon.totalKg || 0,
    fill: `hsl(${200 + i * 40}, 80%, 55%)`
  }));

  // Identify winners
  const bestOverall = [...analyzedIdeas].sort((a, b) => (b.analysis?.overallScore || 0) - (a.analysis?.overallScore || 0))[0];
  const lowestCarbon = [...analyzedIdeas].sort((a, b) => (a.analysis?.carbon.totalKg || Infinity) - (b.analysis?.carbon.totalKg || Infinity))[0];
  const bestSDGs = [...analyzedIdeas].sort((a, b) => (b.analysis?.sdgs.score || 0) - (a.analysis?.sdgs.score || 0))[0];
  const best6Rs = [...analyzedIdeas].sort((a, b) => (b.analysis?.sixRs.score || 0) - (a.analysis?.sixRs.score || 0))[0];
  const bestPillars = [...analyzedIdeas].sort((a, b) => (b.analysis?.threePillars.score || 0) - (a.analysis?.threePillars.score || 0))[0];
  
  return (
    <div id="comparison-dashboard" className="w-full max-w-[1024px] mx-auto space-y-8 pb-12 text-[#1A2E22]">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Comparison Report</h2>
        <p className="text-gray-500">Comparing {analyzedIdeas.length} ideas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E5E1D8] rounded-[2rem] p-8 shadow-sm">
          <h3 className="font-bold text-xl mb-6 text-center text-[#064E3B]">Overall Sustainability Score</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={20} data={compareScores}>
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  dataKey="Score"
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                <RechartsTooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-500">Leader: <span className="font-bold text-[#6B8E23]">{bestOverall.name}</span></p>
          </div>
        </div>

        <div className="bg-white border border-[#E5E1D8] rounded-[2rem] p-8 shadow-sm">
          <h3 className="font-bold text-xl mb-6 text-center text-[#064E3B]">Lifetime Carbon Footprint (kg CO₂e)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={carbonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E1D8" />
                <XAxis dataKey="name" tick={{fill: '#1A2E22'}} />
                <YAxis tick={{fill: '#1A2E22'}} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="Carbon" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-500">Lowest Impact: <span className="font-bold text-[#6B8E23]">{lowestCarbon.name}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {analyzedIdeas.map(idea => (
          <div key={idea.id} className="bg-white border border-[#E5E1D8] rounded-[2rem] p-8 shadow-sm flex flex-col h-full">
            <h3 className="font-bold text-xl mb-2 text-[#064E3B]">{idea.name}</h3>
            <div className="text-3xl font-bold text-[#6B8E23] mb-4">{idea.analysis?.overallScore} / 100</div>
            <p className="text-sm text-gray-500 mb-6 italic">"{idea.analysis?.verdict}"</p>
            
            <div className="space-y-3 mt-auto bg-[#FDFBF7] p-4 rounded-xl border border-[#F3F0E9]">
              <div className="flex justify-between text-sm">
                 <span className="font-medium">Carbon Score</span>
                 <span className="font-bold">{idea.analysis?.carbon.score}/100</span>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="font-medium">Circularity (6Rs)</span>
                 <span className="font-bold">{idea.analysis?.sixRs.score}/100</span>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="font-medium">UN SDGs</span>
                 <span className="font-bold">{idea.analysis?.sdgs.score}/100</span>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="font-medium">Three Pillars</span>
                 <span className="font-bold">{idea.analysis?.threePillars.score}/100</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-[#E7F3EF] border border-[#064E3B]/20 rounded-[2rem] p-8 text-[#064E3B]">
        <h4 className="font-bold mb-4 text-center text-2xl">Nuanced Verdict</h4>
        <div className="max-w-4xl mx-auto space-y-4 leading-relaxed opacity-90">
          <p>
            While <strong className="font-extrabold">{bestOverall.name}</strong> scores highest overall, 
            it's important to weigh specific trade-offs across different sustainability frameworks to ensure your product aligns with your core mission.
          </p>
          <ul className="list-disc pl-5 space-y-4 mt-4">
            <li>
              <strong className="font-bold text-[#1A2E22]">Carbon Emissions & Footprint:</strong> <span className="font-bold text-[#6B8E23]">{lowestCarbon.name}</span> leads here with an estimated {lowestCarbon.analysis?.carbon.totalKg} kg CO₂e. 
              Its specific strength lies in minimizing greenhouse gas output across its lifecycle compared to the others. Consider this if combating climate change is your absolute primary goal.
            </li>
            <li>
              <strong className="font-bold text-[#1A2E22]">Circularity (6Rs):</strong> <span className="font-bold text-[#6B8E23]">{best6Rs.name}</span> is the best modeled for a circular economy (Score: {best6Rs.analysis?.sixRs.score}/100). 
              Its strongest circularity strategies often lie in its approach to {Object.entries(best6Rs.analysis?.sixRs || {}).filter(([k]) => k !== 'score').sort((a: any, b: any) => b[1].score - a[1].score)[0]?.[0] || 'reusability'}, prioritizing end-of-life repurposing and reducing waste.
            </li>
            <li>
              <strong className="font-bold text-[#1A2E22]">UN SDGs Alignment:</strong> <span className="font-bold text-[#6B8E23]">{bestSDGs.name}</span> has the most robust alignment with global sustainability goals (Score: {bestSDGs.analysis?.sdgs.score}/100), actively supporting targets like {bestSDGs.analysis?.sdgs.supported?.[0]?.targets?.join(', ') || 'environmental protection'}.
              It tackles broader developmental targets effectively.
            </li>
            <li>
              <strong className="font-bold text-[#1A2E22]">Three Pillars (ESG):</strong> <span className="font-bold text-[#6B8E23]">{bestPillars.name}</span> achieves the best balance of Environmental, Social, and Economic factors (Score: {bestPillars.analysis?.threePillars.score}/100). 
              It demonstrates a highly viable long-term business model while maintaining strong performance in {Object.entries(bestPillars.analysis?.threePillars || {}).filter(([k]) => k !== 'score').sort((a: any, b: any) => b[1].score - a[1].score)[0]?.[0] || 'environmental'} sustainability.
            </li>
          </ul>
          <div className="mt-6 p-4 bg-white/60 rounded-xl border border-[#064E3B]/10">
            <h5 className="font-bold text-[#1A2E22] mb-2">Improvement Guide:</h5>
            <p className="text-sm">
               To improve <strong className="font-bold">{bestOverall.name}</strong>, look at its weakest performing framework. 
               If its Carbon Score ({bestOverall.analysis?.carbon.score}/100) is low, focus on reducing emissions in its heaviest stage (often Manufacturing or Materials).
               If its Circularity is lacking ({bestOverall.analysis?.sixRs.score}/100), consider adopting the repair or reuse strategies modeled in <span className="font-medium italic">{best6Rs.name}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
