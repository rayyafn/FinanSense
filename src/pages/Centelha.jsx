import React from 'react';
import { Award, Video, FileText, CheckCircle2, ExternalLink, Lightbulb, UserCheck, ShieldCheck } from 'lucide-react';

export const Centelha = () => {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Banner Centelha 3 */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Award size={14} />
            Programa Centelha 3 Rondônia
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            FinanSense: Controle Financeiro
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
            Fase 1 - Ideias Inovadoras. Proposta acadêmica individual voltada para a educação financeira, autonomia e tomada de decisões da Geração Z.
          </p>

          <div className="flex flex-wrap gap-4 mt-5 text-xs text-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Estudante:</span>
              <span className="font-bold text-white">Raiany Alexandra Felix do Nascimento</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Curso / Turma:</span>
              <span className="font-bold text-white">3º B - Técnico em Informática Integrado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Seções */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card do Vídeo Pitch Obrigatório */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Video size={16} />
              <span>Vídeo Pitch Obrigatório (Até 3 Minutos)</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Apresentação da Proposta Inovadora</h3>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              O vídeo pitch apresenta o problema enfrentado por jovens no controle do orçamento, a proposta de valor do FinanSense e os diferenciais perante soluções existentes (Mobills, Organizze).
            </p>

            <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-900 shadow-inner">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/iiRMwRVgXCI"
                title="Vídeo Pitch FinanSense - Raiany Alexandra"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Link Direto do YouTube:</p>
                <p className="text-[11px] text-slate-600 truncate max-w-[180px] sm:max-w-xs font-mono">
                  https://youtu.be/iiRMwRVgXCI
                </p>
              </div>
              <a
                href="https://youtu.be/iiRMwRVgXCI"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition shrink-0"
              >
                <span>Abrir no YouTube</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
            <CheckCircle2 size={16} className="text-emerald-700" />
            <span>Link testado e verificado conforme edital 03/2026</span>
          </div>
        </div>

        {/* Card de Diferenciais & Proposta de Valor */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <Lightbulb size={16} />
            <span>Diferencial Perante o Mercado</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Registro vs Orientação Ativa</h3>
          
          <div className="space-y-2.5 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">1. Diagnósticos em Linguagem Natural</span>
              <p className="text-slate-700">Em vez de tabelas complexas, o sistema emite avisos diretos como: "Seus gastos com Lazer estão 30% acima da sua média".</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">2. Previsão de Saldo e Prevenção de Déficit</span>
              <p className="text-slate-700">Calcula o saldo futuro projetado e avisa se o ritmo atual levará a saldo negativo antes do fim do mês.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">3. Foco nas Necessidades da Geração Z</span>
              <p className="text-slate-700">Gerenciamento ágil de bolsas, estágios, trabalhos freelancers e divisão de contas familiares.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
