import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Tags, 
  BrainCircuit, 
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const Sidebar = ({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }) => {
  const { contasVencidas, alertasInteligentes } = useFinance();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Visão Geral',
      icon: LayoutDashboard,
      badge: contasVencidas.length > 0 ? `${contasVencidas.length} vencida` : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'transactions',
      label: 'Lançamentos',
      icon: ArrowLeftRight,
      badge: null
    },
    {
      id: 'insights',
      label: 'Análise Preditiva',
      icon: BrainCircuit,
      badge: alertasInteligentes.length > 0 ? `${alertasInteligentes.length} alertas` : null,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'categories',
      label: 'Categorias',
      icon: Tags,
      badge: null
    },
    {
      id: 'centelha',
      label: 'Projeto Centelha 3',
      icon: Award,
      badge: 'Fase 1',
      badgeColor: 'bg-emerald-600 text-white'
    }
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (setMobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Overlay Mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 bg-slate-900/40 z-20 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-16 z-20 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 
        flex flex-col transition-transform duration-200 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Menu Principal
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-600'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                <Sparkles size={14} className="text-emerald-700" />
                <span>Diferencial FinanSense</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Transformando o controle financeiro de um mero registro em um guia orientador com linguagem natural.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
          <span>Versão 1.0 - Web</span>
          <span className="font-semibold text-emerald-700">Geração Z</span>
        </div>
      </aside>
    </>
  );
};
