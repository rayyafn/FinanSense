import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, DollarSign, Calendar, Tag, Layers, RefreshCw, AlertCircle, Check } from 'lucide-react';

export const TransactionModal = ({ isOpen, onClose, transactionToEdit = null }) => {
  const { categories, addReceita, updateReceita, addDespesa, updateDespesa } = useFinance();

  const [activeType, setActiveType] = useState('despesa'); // 'despesa' ou 'receita'
  
  // Campos comuns
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [categoriaId, setCategoriaId] = useState('');
  const [erro, setErro] = useState('');

  // Campos específicos de Receita
  const [ehRecorrente, setEhRecorrente] = useState(false);

  // Campos específicos de Despesa
  const [tipoDespesa, setTipoDespesa] = useState('variavel'); // 'fixa', 'variavel', 'parcelada'
  const [totalParcelas, setTotalParcelas] = useState(6);
  const [status, setStatus] = useState('a_pagar'); // 'a_pagar' ou 'paga'

  useEffect(() => {
    if (transactionToEdit) {
      setActiveType(transactionToEdit.kind || 'despesa');
      setDescricao(transactionToEdit.descricao || '');
      setValor(transactionToEdit.valor !== undefined ? String(transactionToEdit.valor) : '');
      setData(transactionToEdit.data || new Date().toISOString().split('T')[0]);
      setCategoriaId(transactionToEdit.id_categoria || '');
      setEhRecorrente(Boolean(transactionToEdit.eh_recorrente));
      setTipoDespesa(transactionToEdit.tipo || 'variavel');
      setStatus(transactionToEdit.status || 'a_pagar');
    } else {
      setActiveType('despesa');
      setDescricao('');
      setValor('');
      setData(new Date().toISOString().split('T')[0]);
      setCategoriaId('');
      setEhRecorrente(false);
      setTipoDespesa('variavel');
      setStatus('a_pagar');
    }
    setErro('');
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => c.tipo === activeType);

  // Cálculo dinâmico do valor da parcela para compras parceladas (RF08 / CA02)
  const numericValor = parseFloat(valor) || 0;
  const valorParcelaCalculada = tipoDespesa === 'parcelada' && totalParcelas > 0 
    ? (numericValor / totalParcelas).toFixed(2) 
    : '0.00';

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');

    if (!descricao.trim()) {
      setErro('Informe uma descrição válida.');
      return;
    }

    if (isNaN(numericValor) || numericValor <= 0) {
      setErro('O valor deve ser maior que zero (R$ > 0,00).');
      return;
    }

    const catId = categoriaId || (filteredCategories[0] ? filteredCategories[0].id_categoria : 1);

    try {
      if (transactionToEdit) {
        if (activeType === 'receita') {
          updateReceita(transactionToEdit.rawId, {
            descricao,
            valor: numericValor,
            data_recebimento: data,
            id_categoria: catId,
            eh_recorrente: ehRecorrente
          });
        } else {
          updateDespesa(transactionToEdit.rawId, {
            descricao,
            valor_total: numericValor,
            data_vencimento: data,
            id_categoria: catId,
            tipo: tipoDespesa,
            status: status
          });
        }
      } else {
        if (activeType === 'receita') {
          addReceita({
            descricao,
            valor: numericValor,
            data_recebimento: data,
            id_categoria: catId,
            eh_recorrente: ehRecorrente
          });
        } else {
          addDespesa({
            descricao,
            valor_total: numericValor,
            data_vencimento: data,
            id_categoria: catId,
            tipo: tipoDespesa,
            total_parcelas: tipoDespesa === 'parcelada' ? parseInt(totalParcelas) : 1,
            status: status
          });
        }
      }

      // Limpar formulário e fechar
      setDescricao('');
      setValor('');
      onClose();
    } catch (err) {
      setErro(err.message || 'Erro ao registrar lançamento.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        
        {/* Header do Modal com Alternador Receita / Despesa */}
        <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {transactionToEdit ? 'Editar Lançamento' : 'Novo Lançamento Financeiro'}
            </h3>
            <p className="text-xs text-slate-600">
              {transactionToEdit ? 'Altere as informações do registro (RF09)' : 'Registre entradas, despesas fixas ou parcelamentos'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Botões de Tipo */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => { setActiveType('despesa'); setCategoriaId(''); }}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                activeType === 'despesa'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Despesa / Conta a Pagar
            </button>
            <button
              type="button"
              onClick={() => { setActiveType('receita'); setCategoriaId(''); }}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                activeType === 'receita'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Receita / Entrada
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {erro && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição do Lançamento
            </label>
            <input
              type="text"
              placeholder={activeType === 'receita' ? "Ex: Bolsa de Estudos, Salário, Freela..." : "Ex: Conta de Luz, Supermercado, Fone em 6x..."}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              required
            />
          </div>

          {/* Valor e Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Valor Total (R$)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600 text-sm font-semibold">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-sm font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {activeType === 'receita' ? 'Data de Recebimento' : 'Data de Vencimento'}
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                required
              />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Categoria
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition"
            >
              {filteredCategories.map((c) => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nome} {c.eh_padrao ? '' : '(Personalizada)'}
                </option>
              ))}
            </select>
          </div>

          {/* Condicional para Receita: Recorrência (RF05) */}
          {activeType === 'receita' && (
            <div className="flex items-center gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <input
                type="checkbox"
                id="eh_recorrente"
                checked={ehRecorrente}
                onChange={(e) => setEhRecorrente(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
              />
              <label htmlFor="eh_recorrente" className="text-xs text-slate-700 cursor-pointer">
                <span className="font-semibold block text-slate-900">Receita Recorrente Mensal</span>
                Recebe todo mês nesta mesma data (ex: salário, bolsa, mesada).
              </label>
            </div>
          )}

          {/* Condicional para Despesa: Tipo e Parcelamento (RF06, RF08 / CA02) */}
          {activeType === 'despesa' && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Despesa
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'variavel', label: 'Variável' },
                    { id: 'fixa', label: 'Fixa' },
                    { id: 'parcelada', label: 'Parcelada' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTipoDespesa(t.id)}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition ${
                        tipoDespesa === t.id
                          ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Se for parcelada: Configuração de parcelas e cálculo automático (RF08 / CA02) */}
              {tipoDespesa === 'parcelada' && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-indigo-900">
                      Quantidade de Parcelas (N vezes)
                    </label>
                    <select
                      value={totalParcelas}
                      onChange={(e) => setTotalParcelas(parseInt(e.target.value))}
                      className="px-2.5 py-1 text-xs font-bold border border-indigo-300 rounded-lg bg-white text-indigo-900 focus:ring-2 focus:ring-indigo-400 outline-none"
                    >
                      {[2, 3, 4, 5, 6, 8, 10, 12, 18, 24].map((num) => (
                        <option key={num} value={num}>{num}x</option>
                      ))}
                    </select>
                  </div>

                  {/* Prévia automática do cálculo de parcelamento */}
                  <div className="p-2.5 bg-white rounded-lg border border-indigo-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600">Cálculo individual por parcela:</span>
                    <span className="font-bold text-indigo-700 text-sm">
                      {totalParcelas}x de R$ {valorParcelaCalculada}
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-700 leading-tight">
                    ⚡ Conforme o requisito <strong>RF08</strong>, o FinanSense gerará automaticamente o registro das {totalParcelas} parcelas nos meses subsequentes na sua agenda de compromissos.
                  </p>
                </div>
              )}

              {/* Status da Conta */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-slate-700">Status de Pagamento:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('a_pagar')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                      status === 'a_pagar'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    A Pagar (Pendente)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('paga')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                      status === 'paga'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Já Paga
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-sm font-semibold rounded-xl text-white shadow-sm transition-all flex items-center gap-1.5 ${
                activeType === 'despesa'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
              }`}
            >
              <Check size={16} />
              {transactionToEdit ? 'Salvar Alterações' : 'Confirmar Lançamento'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
