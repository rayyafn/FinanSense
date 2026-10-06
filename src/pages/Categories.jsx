import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Tags, Plus, Trash2, Edit3, Shield, User, Sparkles } from 'lucide-react';

export const Categories = ({ onOpenCategoryModal, onEditCategory }) => {
  const { categories, deleteCategory } = useFinance();
  const [activeTab, setActiveTab] = useState('todas'); // 'todas', 'despesa', 'receita'

  const filteredCategories = categories.filter((c) => {
    if (activeTab === 'despesa') return c.tipo === 'despesa';
    if (activeTab === 'receita') return c.tipo === 'receita';
    return true;
  });

  const categoriasPadrao = filteredCategories.filter((c) => c.eh_padrao);
  const categoriasPersonalizadas = filteredCategories.filter((c) => !c.eh_padrao);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Gestão de Categorias
          </h1>
          <p className="text-sm text-slate-700">
            Personalize a organização dos seus gastos e receitas de acordo com a sua rotina (RF10 / CA06).
          </p>
        </div>

        <button
          onClick={onOpenCategoryModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm"
        >
          <Plus size={18} />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Filtros por Tipo */}
      <div className="flex gap-2">
        {[
          { id: 'todas', label: 'Todas as Categorias' },
          { id: 'despesa', label: 'Apenas Despesas' },
          { id: 'receita', label: 'Apenas Receitas' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid de Categorias Personalizadas (Criadas pelo Usuário - RF10 / CA06) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <User size={18} className="text-indigo-600" />
            <span>Suas Categorias Personalizadas</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
              {categoriasPersonalizadas.length} criadas
            </span>
          </div>
          <span className="text-xs text-slate-600">Vinculadas ao seu perfil</span>
        </div>

        {categoriasPersonalizadas.length === 0 ? (
          <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center">
            <p className="text-xs text-slate-600 font-semibold">Você ainda não criou nenhuma categoria personalizada.</p>
            <p className="text-[11px] text-slate-600 mt-1">
              Clique em "+ Nova Categoria" para adicionar gastos específicos como "Jogos", "Academia" ou "Cursos".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoriasPersonalizadas.map((cat) => (
              <div 
                key={cat.id_categoria} 
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: cat.cor }}
                  >
                    <Tags size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{cat.nome}</p>
                    <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {cat.tipo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditCategory && onEditCategory(cat)}
                    title="Editar categoria personalizada (RF10)"
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id_categoria)}
                    title="Excluir categoria personalizada"
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid de Categorias Padrão do Sistema (Nativas) */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Shield size={18} className="text-emerald-700" />
            <span>Categorias Padrão da Plataforma</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
              Nativas
            </span>
          </div>
          <span className="text-xs text-slate-600">Disponíveis para todos os usuários</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoriasPadrao.map((cat) => (
            <div 
              key={cat.id_categoria} 
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: cat.cor }}
                >
                  <Tags size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">{cat.nome}</p>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    cat.tipo === 'receita' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                  }`}>
                    {cat.tipo}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                Padrão
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
