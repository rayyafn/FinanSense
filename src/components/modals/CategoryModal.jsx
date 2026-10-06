import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, Tag, Plus, Check } from 'lucide-react';

export const CategoryModal = ({ isOpen, onClose, categoryToEdit = null }) => {
  const { addCategory, updateCategory } = useFinance();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('despesa');
  const [cor, setCor] = useState('#8b5cf6');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (categoryToEdit) {
      setNome(categoryToEdit.nome || '');
      setTipo(categoryToEdit.tipo || 'despesa');
      setCor(categoryToEdit.cor || '#8b5cf6');
    } else {
      setNome('');
      setTipo('despesa');
      setCor('#8b5cf6');
    }
    setErro('');
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const coresDisponiveis = [
    '#ef4444', '#f97316', '#f59e0b', '#10b981', 
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', 
    '#ec4899', '#64748b'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErro('Digite um nome para a categoria.');
      return;
    }

    if (categoryToEdit) {
      updateCategory(categoryToEdit.id_categoria, {
        nome: nome.trim(),
        tipo,
        cor,
        icone: 'Tag'
      });
    } else {
      addCategory({
        nome: nome.trim(),
        tipo,
        cor,
        icone: 'Tag'
      });
    }

    setNome('');
    setErro('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        
        <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {categoryToEdit ? 'Editar Categoria' : 'Nova Categoria Personalizada'}
            </h3>
            <p className="text-xs text-slate-600">
              {categoryToEdit ? 'Atualize os dados da sua categoria (RF10)' : 'Personalize o FinanSense com os seus próprios hábitos (RF10)'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {erro && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {erro}
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome da Categoria
            </label>
            <input
              type="text"
              placeholder="Ex: Cursos Online, Jogos na Steam, Cuidados Pessoais..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tipo de Lançamento
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipo('despesa')}
                className={`py-2 text-xs font-semibold rounded-lg border transition ${
                  tipo === 'despesa'
                    ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Para Despesas
              </button>
              <button
                type="button"
                onClick={() => setTipo('receita')}
                className={`py-2 text-xs font-semibold rounded-lg border transition ${
                  tipo === 'receita'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Para Receitas
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Cor de Identificação
            </label>
            <div className="flex flex-wrap gap-2">
              {coresDisponiveis.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                    cor === c ? 'scale-110 ring-2 ring-offset-2 ring-slate-800' : 'hover:scale-105'
                  }`}
                >
                  {cor === c && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition flex items-center gap-1.5"
            >
              <Check size={16} />
              {categoryToEdit ? 'Salvar Categoria' : 'Criar Categoria'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
