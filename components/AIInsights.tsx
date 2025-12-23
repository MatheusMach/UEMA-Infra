import React, { useState, useEffect } from 'react';
import { Ticket, AIAnalysisResult } from '../types';
import { analyzeMaintenanceData } from '../services/geminiService';
import { Sparkles, TrendingUp, AlertOctagon, Wrench, Loader2, Lightbulb, ChevronRight } from 'lucide-react';

/**
 * COMPONENTE DE INSIGHTS DA IA
 * Renderiza o painel lateral ou cards com diagnósticos do Gemini.
 */

interface AIInsightsProps {
  tickets: Ticket[]; // Recebe a lista de chamados como propriedade
}

const AIInsights: React.FC<AIInsightsProps> = ({ tickets }) => {
  // Estados para gerenciar dados da IA, carregamento e timestamp
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Função que dispara a requisição para o serviço de IA
  const runAnalysis = async () => {
    setLoading(true);
    const result = await analyzeMaintenanceData(tickets);
    setAnalysis(result);
    setLastUpdated(new Date());
    setLoading(false);
  };

  // Carrega a análise automaticamente na primeira vez que o componente aparece
  useEffect(() => {
    if (tickets.length > 0 && !analysis) {
      runAnalysis();
    }
  }, []);

  return (
    <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm">
      {/* Cabeçalho do Advisor */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md">
            <Sparkles size={20} />
          </div>
          <div>
             <h3 className="text-lg font-bold text-gray-800">UEMA AI Technical Advisor</h3>
             <p className="text-xs text-gray-500">Diagnóstico e Soluções em Tempo Real</p>
          </div>
        </div>
        <button 
          onClick={runAnalysis} 
          disabled={loading}
          className="w-full sm:w-auto text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
          {loading ? 'Processando Soluções...' : 'Atualizar Diagnósticos'}
        </button>
      </div>

      {/* ESTADO DE CARREGAMENTO (Loading) */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 space-y-4">
          <div className="relative">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
            <Sparkles className="absolute top-0 right-0 text-amber-400 animate-pulse" size={16} />
          </div>
          <p className="text-sm font-medium animate-pulse text-indigo-600">O Gemini está analisando os manuais técnicos e o histórico da UEMA...</p>
        </div>
      ) : analysis ? (
        <div className="space-y-8">
          {/* Card: Resumo Estratégico */}
          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
              <TrendingUp size={16}/> Resumo Estratégico
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">{analysis.summary}</p>
          </div>

          {/* LISTA DE SOLUÇÕES TÉCNICAS ESPECÍFICAS */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-500" /> Soluções Técnicas Sugeridas
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {analysis.specificSolutions.map((sol, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden hover:border-indigo-200 transition-colors shadow-sm">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">#{sol.ticketId}</span>
                    <span className="text-xs font-medium text-indigo-600">{sol.ticketTitle}</span>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Diagnóstico da IA */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-400 uppercase">Diagnóstico Provável</p>
                      <p className="text-sm text-gray-700 font-medium italic">"{sol.diagnostic}"</p>
                    </div>
                    {/* Passo a passo sugerido */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-400 uppercase">Passos para Reparo</p>
                      <ul className="space-y-1">
                        {sol.stepByStep.map((step, sIdx) => (
                          <li key={sIdx} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-indigo-500 font-bold">{sIdx + 1}.</span> {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
              {/* Feedback caso não haja chamados abertos */}
              {analysis.specificSolutions.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg">
                  Nenhum chamado aberto requer diagnóstico imediato no momento.
                </p>
              )}
            </div>
          </div>

          {/* Grid de Alertas e Prevenção */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hotspots (Problemas recorrentes) */}
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
               <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2 text-sm">
                  <AlertOctagon size={16} /> Hotspots Recorrentes
               </h4>
               <ul className="space-y-2">
                 {analysis.hotspots.map((spot, idx) => (
                   <li key={idx} className="flex items-center gap-3 text-sm text-red-700 bg-white/50 p-2 rounded-lg border border-red-200/50">
                     <ChevronRight size={14} className="flex-shrink-0" />
                     {spot}
                   </li>
                 ))}
               </ul>
            </div>

            {/* Ações Preventivas (Proativo) */}
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
               <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2 text-sm">
                  <Wrench size={16} /> Ações Preventivas Recomendadas
               </h4>
               <ul className="space-y-2">
                 {analysis.preventiveActions.map((action, idx) => (
                   <li key={idx} className="flex items-center gap-3 text-sm text-emerald-700 bg-white/50 p-2 rounded-lg border border-emerald-200/50">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                     {action}
                   </li>
                 ))}
               </ul>
            </div>
          </div>
          
          {/* Rodapé da análise com créditos e hora */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-[10px] text-gray-400">
             <span className="flex items-center gap-1 italic">
                <Sparkles size={10} /> Powered by Gemini 3.0 Flash Technical Insights
             </span>
             <span>Última análise: {lastUpdated?.toLocaleTimeString()}</span>
          </div>
        </div>
      ) : (
        /* Estado inicial vazio */
        <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="mb-4">Nenhuma análise técnica disponível.</p>
          <button onClick={runAnalysis} className="text-indigo-600 font-bold hover:underline">Gerar soluções agora</button>
        </div>
      )}
    </div>
  );
};

export default AIInsights;