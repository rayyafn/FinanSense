import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  HelpCircle,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const Dashboard = ({ onOpenTransactionModal, onOpenCategoryModal, setActiveTab }) => {
  const {
    currentUser,
    saldoDisponivel,
    totalReceitas,
    totalDespesasPagas,
    totalDespesasPendentes,
    contasVencidas,
    totalContasVencidas,
    contasProximos15Dias,
    totalProximos15Dias,
    gastosPorCategoria,
    alertasInteligentes,
    projecaoSaldoFimDoMes,
    riscoDeficit,
    receitasPrevistasMes,
    despesasAgendadasMes,
    toggleDespesaStatus
  } = useFinance();

  const formatBRL = (val) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  // Configuração dos dados do Gráfico de Categorias (RF13)
  const chartData = {
    labels: gastosPorCategoria.map((g) => g.nome),
    datasets: [
      {
        data: gastosPorCategoria.map((g) => g.total),
        backgroundColor: gastosPorCategoria.map((g) => g.cor),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 12,
          font: { size: 11, family: 'Plus Jakarta Sans' },
          color: '#475569'
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${formatBRL(ctx.raw)}`,
        },
      },
    },
    cutout: '70%',
    maintainAspectRatio: false,
  };

  const totalGastosCategorias = gastosPorCategoria.reduce((a, b) => a + b.total, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Cabeçalho de Boas-Vindas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Olá, {currentUser?.nome?.split(' ')[0] || 'Jovem'}! 👋
          </h1>
          <p className="text-sm text-slate-700">
            Aqui está a interpretação em tempo real das suas finanças e compromissos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('insights')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
          >
            <Sparkles size={15} />
            <span>Ver Diagnósticos Preditivos</span>
          </button>
        </div>
      </div>

      {/* ALERTAS INTELIGENTES EM LINGUAGEM NATURAL (RF16, RF18 / CA04, CA05) */}
      {alertasInteligentes.length > 0 && (
        <div className="space-y-3">
          {alertasInteligentes.map((alerta) => (
            <div
              key={alerta.id}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all shadow-sm ${
                alerta.tipo === 'danger'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                alerta.tipo === 'danger' ? 'bg-rose-200/80 text-rose-700' : 'bg-amber-200/80 text-amber-800'
              }`}>
                {alerta.tipo === 'danger' ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    alerta.tipo === 'danger' ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {alerta.categoria}
                  </span>
                  <span className="text-xs font-semibold">Diagnóstico FinanSense</span>
                </div>
                <p className="text-sm font-semibold leading-snug mt-1">
                  {alerta.mensagem}
                </p>
                {alerta.sugestao && (
                  <p className="text-xs text-slate-700 mt-1 flex items-center gap-1">
                    💡 <span>{alerta.sugestao}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4 CARDS PRINCIPAIS DE INDICADORES (RF11, RF17 / CA05) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Saldo Disponível Atual (RF11) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Saldo Disponível</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatBRL(saldoDisponivel)}
          </div>
          <p className="text-[11px] text-slate-600 mt-2 flex items-center gap-1">
            <span>Receitas acumuladas</span>
            <span className="font-semibold text-slate-700">({formatBRL(totalReceitas)})</span>
            <span>menos despesas pagas</span>
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
        </div>

        {/* 2. Projeção de Saldo Fim do Mês (RF17 / CA05) */}
        <div className={`bg-white p-5 rounded-2xl border shadow-sm relative overflow-hidden ${
          riscoDeficit ? 'border-rose-300 ring-2 ring-rose-200' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Projeção Fim do Mês</span>
            <div className={`p-2 rounded-xl ${riscoDeficit ? 'bg-rose-100 text-rose-700' : 'bg-indigo-50 text-indigo-700'}`}>
              <Sparkles size={18} />
            </div>
          </div>
          <div className={`text-2xl font-extrabold tracking-tight ${
            projecaoSaldoFimDoMes >= 0 ? 'text-indigo-600' : 'text-rose-600'
          }`}>
            {formatBRL(projecaoSaldoFimDoMes)}
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              riscoDeficit ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'
            }`}>
              {riscoDeficit ? '⚠️ Déficit Previsto' : '✓ Saldo Positivo'}
            </span>
          </div>
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${
            riscoDeficit ? 'bg-rose-500' : 'bg-indigo-500'
          }`} />
        </div>

        {/* 3. Contas a Vencer Próximos 15 Dias (RF12) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Próximos 15 Dias</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Calendar size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatBRL(totalProximos15Dias)}
          </div>
          <p className="text-[11px] text-slate-600 mt-2">
            {contasProximos15Dias.length} {contasProximos15Dias.length === 1 ? 'compromisso agendado' : 'compromissos agendados'}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400" />
        </div>

        {/* 4. Contas Vencidas - DESTAQUE EM VERMELHO (RF07 / CA03) */}
        <div className={`bg-white p-5 rounded-2xl border shadow-sm relative overflow-hidden ${
          contasVencidas.length > 0 ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">Contas Vencidas</span>
            <div className={`p-2 rounded-xl ${contasVencidas.length > 0 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div className={`text-2xl font-extrabold tracking-tight ${
            contasVencidas.length > 0 ? 'text-rose-600' : 'text-slate-900'
          }`}>
            {formatBRL(totalContasVencidas)}
          </div>
          <p className="text-[11px] font-semibold mt-2 text-rose-600">
            {contasVencidas.length > 0 
              ? `🚨 ${contasVencidas.length} pendência com juros potenciais!` 
              : 'Nenhuma conta vencida 🎉'}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" />
        </div>

      </div>

      {/* SEÇÃO PRINCIPAL: AGENDA DE 15 DIAS E GRÁFICO POR CATEGORIA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna 1 & 2: Agenda dos Próximos 15 Dias e Vencidas (RF12 / CA03) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Card de Contas Vencidas se houver (Destaque em Vermelho RF07 / CA03) */}
          {contasVencidas.length > 0 && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <AlertCircle size={18} className="text-rose-600 animate-bounce" />
                  <span>Atenção: Contas Vencidas Requerem Regularização</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 bg-rose-200 text-rose-900 rounded-full font-bold">
                  {contasVencidas.length} em atraso
                </span>
              </div>
              <p className="text-xs text-rose-700 mb-4">
                Evite pagamento de juros ou multas que comprometam sua mesada, bolsa ou salário.
              </p>
              
              <div className="space-y-2">
                {contasVencidas.map((conta) => (
                  <div 
                    key={conta.id_despesa} 
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-rose-200 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{conta.descricao}</span>
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-rose-600 text-white tracking-wider">
                          Vencida
                        </span>
                      </div>
                      <p className="text-xs text-rose-600 mt-0.5">
                        Venceu em: {conta.data_vencimento.split('-').reverse().join('/')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-sm text-rose-600">
                        {formatBRL(conta.valor_total)}
                      </span>
                      <button
                        onClick={() => toggleDespesaStatus(conta.id_despesa)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1"
                      >
                        <CheckCircle size={14} />
                        <span>Pagar Agora</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agenda de Compromissos dos Próximos 15 Dias (RF12) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Calendar size={18} className="text-emerald-700" />
                  <span>Agenda Financeira: Próximos 15 Dias</span>
                </h3>
                <p className="text-xs text-slate-700">Contas a pagar agendadas e parcelamentos (RF12)</p>
              </div>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Ver todas</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {contasProximos15Dias.length === 0 ? (
              <div className="text-center py-8 text-slate-600 text-xs">
                <CheckCircle size={32} className="mx-auto mb-2 text-emerald-600" />
                <p className="font-semibold text-slate-700">Nenhuma conta agendada para os próximos 15 dias!</p>
                <p>Suas contas estão em dia ou ainda não foram cadastradas.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {contasProximos15Dias.map((conta) => (
                  <div key={conta.id_despesa} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                        {conta.data_vencimento.split('-')[2]}
                        <span className="text-[9px] block">/{conta.data_vencimento.split('-')[1]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">{conta.descricao}</p>
                          {conta.tipo === 'parcelada' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">
                              Parcelada
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600">
                          Vencimento: {conta.data_vencimento.split('-').reverse().join('/')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-slate-800">
                        {formatBRL(conta.valor_total)}
                      </span>
                      <button
                        onClick={() => toggleDespesaStatus(conta.id_despesa)}
                        title="Marcar conta como paga"
                        className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      >
                        <CheckCircle size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Coluna 3: Distribuição por Categoria (Gráfico RF13) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-base text-slate-900">Distribuição de Gastos</h3>
              <p className="text-xs text-slate-700">Porcentagem por categoria (RF13)</p>
            </div>
            <button
              onClick={onOpenCategoryModal}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded-lg"
            >
              + Categoria
            </button>
          </div>

          {gastosPorCategoria.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 text-slate-600 text-xs">
              <Layers size={36} className="text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">Nenhum gasto registrado ainda.</p>
              <p className="mt-1">Cadastre novas despesas para visualizar o gráfico comparativo.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between pt-2">
              <div className="h-56 relative flex items-center justify-center">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                  <span className="text-[10px] text-slate-600 uppercase font-semibold">Total</span>
                  <span className="text-base font-black text-slate-900">{formatBRL(totalGastosCategorias)}</span>
                </div>
              </div>

              {/* Lista com porcentagens calculadas */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                {gastosPorCategoria.slice(0, 4).map((item) => {
                  const perc = totalGastosCategorias > 0 
                    ? ((item.total / totalGastosCategorias) * 100).toFixed(1) 
                    : 0;
                  return (
                    <div key={item.id_categoria} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.cor }} />
                        <span className="font-medium text-slate-700 truncate max-w-[120px]">{item.nome}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{formatBRL(item.total)}</span>
                        <span className="text-slate-600 text-[11px] font-bold w-10 text-right">{perc}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
