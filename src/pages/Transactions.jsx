import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter, 
  Trash2, 
  Edit3,
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar,
  Layers,
  Plus
} from 'lucide-react';

export const Transactions = ({ onOpenTransactionModal, onEditTransaction }) => {
  const { 
    receitas, 
    despesas, 
    categories, 
    deleteReceita, 
    deleteDespesa, 
    toggleDespesaStatus,
    isDespesaVencida 
  } = useFinance();

  const [filterType, setFilterType] = useState('todas'); // 'todas', 'receitas', 'despesas', 'parceladas', 'vencidas'
  const [searchTerm, setSearchTerm] = useState('');

  const formatBRL = (val) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  // Unificar lançamentos para exibição na listagem
  const unifiedReceitas = receitas.map((r) => ({
    id: `rec-${r.id_receita}`,
    rawId: r.id_receita,
    kind: 'receita',
    descricao: r.descricao,
    valor: r.valor,
    data: r.data_recebimento,
    id_categoria: r.id_categoria,
    status: 'recebido',
    eh_recorrente: r.eh_recorrente,
    isVencida: false,
    tipo: 'recorrente'
  }));

  const unifiedDespesas = despesas.map((d) => {
    const vencida = isDespesaVencida(d);
    return {
      id: `desp-${d.id_despesa}`,
      rawId: d.id_despesa,
      kind: 'despesa',
      descricao: d.descricao,
      valor: d.valor_total,
      data: d.data_vencimento,
      id_categoria: d.id_categoria,
      status: d.status,
      eh_recorrente: false,
      isVencida: vencida,
      tipo: d.tipo,
      parcelamento_info: d.parcelamento_info
    };
  });

  const allItems = [...unifiedReceitas, ...unifiedDespesas].sort((a, b) => new Date(b.data) - new Date(a.data));

  // Aplicar filtros
  const filteredItems = allItems.filter((item) => {
    // Filtro por tipo
    if (filterType === 'receitas' && item.kind !== 'receita') return false;
    if (filterType === 'despesas' && item.kind !== 'despesa') return false;
    if (filterType === 'parceladas' && item.tipo !== 'parcelada') return false;
    if (filterType === 'vencidas' && !item.isVencida) return false;

    // Filtro de busca textual
    if (searchTerm.trim() !== '') {
      return item.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const getCategoryName = (id_cat) => {
    const cat = categories.find((c) => c.id_categoria === id_cat);
    return cat ? cat.nome : 'Sem Categoria';
  };

  const getCategoryColor = (id_cat) => {
    const cat = categories.find((c) => c.id_categoria === id_cat);
    return cat ? cat.cor : '#94a3b8';
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Lançamentos Financeiros
          </h1>
          <p className="text-sm text-slate-700">
            Gerenciamento completo de receitas, contas fixas e parcelamentos (RF05 a RF09).
          </p>
        </div>

        <button
          onClick={onOpenTransactionModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm"
        >
          <Plus size={18} />
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          
          {/* Seletor de Abas / Categorização */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {[
              { id: 'todas', label: 'Todas' },
              { id: 'despesas', label: 'Despesas' },
              { id: 'receitas', label: 'Receitas' },
              { id: 'parceladas', label: 'Compras Parceladas' },
              { id: 'vencidas', label: 'Contas Vencidas 🚨' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterType === tab.id
                    ? tab.id === 'vencidas' 
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Campo de Busca */}
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              placeholder="Buscar lançamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

        </div>
      </div>

      {/* Tabela de Lançamentos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-slate-600 text-xs">
            <Layers size={36} className="mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700">Nenhum lançamento encontrado nesta filtragem.</p>
            <p className="mt-1">Cadastre uma nova receita ou despesa para começar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                  <th className="py-3 px-4">Lançamento</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Vencimento / Data</th>
                  <th className="py-3 px-4">Tipo & Modalidade</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const isReceita = item.kind === 'receita';
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        item.isVencida ? 'bg-rose-50/50' : ''
                      }`}
                    >
                      {/* Descrição e Ícone */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isReceita ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {isReceita ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>
                        <div>
                          <p className="text-slate-900 font-bold">{item.descricao}</p>
                          {item.eh_recorrente && (
                            <span className="text-[10px] text-emerald-700 font-normal">Recorrência mensal ativa</span>
                          )}
                        </div>
                      </td>

                      {/* Categoria */}
                      <td className="py-3.5 px-4">
                        <span 
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-white"
                          style={{ backgroundColor: getCategoryColor(item.id_categoria) }}
                        >
                          {getCategoryName(item.id_categoria)}
                        </span>
                      </td>

                      {/* Data */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.data.split('-').reverse().join('/')}
                      </td>

                      {/* Tipo / Parcelamento */}
                      <td className="py-3.5 px-4">
                        {item.tipo === 'parcelada' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-semibold text-[10px]">
                            {item.parcelamento_info ? `${item.parcelamento_info.total_parcelas}x parcelas` : 'Parcelado'}
                          </span>
                        ) : item.tipo === 'fixa' ? (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">
                            Conta Fixa
                          </span>
                        ) : isReceita ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium text-[10px]">
                            Entrada
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">
                            Variável
                          </span>
                        )}
                      </td>

                      {/* Status com DESTAQUE EM VERMELHO PARA CONTAS VENCIDAS (RF07 / CA03) */}
                      <td className="py-3.5 px-4 text-center">
                        {isReceita ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Recebido
                          </span>
                        ) : item.isVencida ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] animate-pulse">
                            <AlertCircle size={10} />
                            Conta Vencida
                          </span>
                        ) : item.status === 'paga' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Paga
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                            A Pagar
                          </span>
                        )}
                      </td>

                      {/* Valor */}
                      <td className="py-3.5 px-4 text-right font-bold text-sm">
                        <span className={isReceita ? 'text-emerald-600' : item.isVencida ? 'text-rose-600 font-extrabold' : 'text-slate-900'}>
                          {isReceita ? '+' : '-'} {formatBRL(item.valor)}
                        </span>
                      </td>

                      {/* Ações (Pagar / Editar / Excluir) */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {!isReceita && (
                            <button
                              onClick={() => toggleDespesaStatus(item.rawId)}
                              title={item.status === 'paga' ? "Marcar como pendente" : "Marcar como paga"}
                              className={`p-1.5 rounded-lg transition ${
                                item.status === 'paga'
                                  ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                                  : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => onEditTransaction && onEditTransaction(item)}
                            title="Editar lançamento (RF09)"
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => isReceita ? deleteReceita(item.rawId) : deleteDespesa(item.rawId)}
                            title="Excluir lançamento"
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
