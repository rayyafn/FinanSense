import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  BrainCircuit, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Lightbulb, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const Insights = () => {
  const { 
    categories, 
    getCategoryStats, 
    projecaoSaldoFimDoMes, 
    riscoDeficit, 
    saldoDisponivel,
    receitasPrevistasMes,
    despesasAgendadasMes,
    alertasInteligentes 
  } = useFinance();

  const formatBRL = (val) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const despesasCategorias = categories.filter((c) => c.tipo === 'despesa');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} />
            Módulo Preditivo Exclusivo
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Análise Preditiva & Diagnósticos Inteligentes
        </h1>
        <p className="text-sm text-slate-700">
          Transformando números em orientações claras para a tomada de decisões financeiras (RF14 a RF18).
        </p>
      </div>

      {/* CARD 1: DIAGNÓSTICO DO RITMO ORÇAMENTÁRIO (RF17 / RF18 / CA05) */}
      <div className={`p-6 rounded-2xl border transition-all ${
        riscoDeficit 
          ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-200' 
          : 'bg-emerald-50/80 border-emerald-300'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${
            riscoDeficit ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
          }`}>
            {riscoDeficit ? <ShieldAlert size={28} /> : <CheckCircle2 size={28} />}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-extrabold text-lg text-slate-900">
                {riscoDeficit 
                  ? 'Alerta Preventivo: Projeção de Déficit no Final do Mês!' 
                  : 'Ritmo Saudável: Projeção Positiva para o Final do Mês!'}
              </h3>
              <span className={`text-sm font-black px-3 py-1 rounded-full self-start ${
                riscoDeficit ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                Estimativa: {formatBRL(projecaoSaldoFimDoMes)}
              </span>
            </div>

            <p className="text-xs text-slate-700 mt-2 leading-relaxed">
              {riscoDeficit ? (
                <>
                  Considerando o seu saldo atual, as receitas previstas ({formatBRL(receitasPrevistasMes)}) e todos os compromissos agendados até o fim do mês ({formatBRL(despesasAgendadasMes)}), o sistema estima que sua conta ficará com saldo negativo de <strong>{formatBRL(projecaoSaldoFimDoMes)}</strong>.
                </>
              ) : (
                <>
                  Mantendo as contas e parcelamentos agendados, você fechará o mês com uma margem de reserva estimada de <strong>{formatBRL(projecaoSaldoFimDoMes)}</strong>. Excelente controle!
                </>
              )}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
              <div>
                <span className="text-slate-600 font-normal">Saldo em Conta: </span>
                <span className="text-slate-900">{formatBRL(saldoDisponivel)}</span>
              </div>
              <div>
                <span className="text-slate-600 font-normal">Contas a Vencer no Mês: </span>
                <span className="text-rose-600">{formatBRL(despesasAgendadasMes)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: MÉDIA HISTÓRICA TRIMESTRAL POR CATEGORIA (RF14, RF15, RF16 / CA04) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit size={20} className="text-indigo-600" />
            <span>Comparativo: Mês Atual vs Média dos Últimos 3 Meses</span>
          </h2>
          <p className="text-xs text-slate-700">
            O FinanSense compara seus gastos com a sua própria evolução histórica para alertar quando um padrão foge do habitual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {despesasCategorias.map((cat) => {
            const stats = getCategoryStats(cat.id_categoria);
            const isAcimaDaMedia = stats.variacaoPercentual >= 25;
            const isAbaixo = stats.variacaoPercentual < 0;

            return (
              <div 
                key={cat.id_categoria} 
                className={`p-4 rounded-xl border transition-all ${
                  isAcimaDaMedia 
                    ? 'border-amber-300 bg-amber-50/50' 
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.cor }} />
                    <span className="font-bold text-sm text-slate-900">{cat.nome}</span>
                  </div>

                  {stats.mediaHistorica > 0 && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isAcimaDaMedia 
                        ? 'bg-amber-200 text-amber-900' 
                        : isAbaixo
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {stats.variacaoPercentual > 0 ? `+${stats.variacaoPercentual.toFixed(0)}%` : `${stats.variacaoPercentual.toFixed(0)}%`}
                    </span>
                  )}
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-2 my-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-600 block">Gasto Este Mês</span>
                    <span className="font-bold text-slate-900 text-sm">{formatBRL(stats.gastosMesAtual)}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-600 block">Média Últimos 3 Meses</span>
                    <span className="font-bold text-slate-700 text-sm">{formatBRL(stats.mediaHistorica)}</span>
                  </div>
                </div>

                {/* Feedback Interpretativo em Linguagem Natural (RF16 / CA04) */}
                {isAcimaDaMedia ? (
                  <p className="text-[11px] text-amber-900 font-medium mt-2 bg-amber-100/70 p-2 rounded-lg leading-tight">
                    🚨 <strong>Alerta:</strong> Este gasto está {stats.variacaoPercentual.toFixed(0)}% acima da sua média habitual. Verifique se foram compras pontuais ou novos hábitos.
                  </p>
                ) : stats.gastosMesAtual > 0 ? (
                  <p className="text-[11px] text-emerald-700 font-medium mt-2">
                    ✓ Dentro do padrão estabelecido no seu histórico.
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-600 mt-2">
                    Nenhum lançamento registrado nesta categoria no mês atual.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO 3: CARD EDUCATIVO - BASE DE PESQUISA DO PROJETO (CNDL / SEBRAE) */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Lightbulb size={16} />
          <span>Contexto da Pesquisa (CNDL / SPC Brasil / Sebrae)</span>
        </div>
        <h3 className="text-lg font-bold">Por que o FinanSense foi criado?</h3>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Embora os jovens da Geração Z sejam nativos digitais, pesquisas mostram que <strong>47% não controlam suas finanças</strong> e <strong>26% ainda usam cadernos de papel</strong>. O FinanSense resolve isso trazendo clareza sem termos técnicos complicados.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
            <span className="text-xl font-extrabold text-emerald-400">78%</span>
            <p className="text-[10px] text-slate-300">Jovens com renda própria</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
            <span className="text-xl font-extrabold text-indigo-400">65%</span>
            <p className="text-[10px] text-slate-300">Ajudam nas contas de casa</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
            <span className="text-xl font-extrabold text-amber-400">47%</span>
            <p className="text-[10px] text-slate-300">Não realizam controle</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
            <span className="text-xl font-extrabold text-teal-400">52%</span>
            <p className="text-[10px] text-slate-300">Têm potencial de poupança</p>
          </div>
        </div>
      </div>

    </div>
  );
};
