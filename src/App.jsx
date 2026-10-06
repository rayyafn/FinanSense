import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Insights } from './pages/Insights';
import { Categories } from './pages/Categories';
import { Centelha } from './pages/Centelha';
import { Auth } from './pages/Auth';
import { TransactionModal } from './components/modals/TransactionModal';
import { CategoryModal } from './components/modals/CategoryModal';

const MainLayout = () => {
  const { currentUser } = useFinance();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenCreateTransaction = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleOpenEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsTransactionModalOpen(true);
  };

  const handleCloseTransactionModal = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(false);
  };

  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(false);
  };

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Barra de Navegação Superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTransactionModal={handleOpenCreateTransaction}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Menu Lateral / Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Área Central de Conteúdo */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <Dashboard
              onOpenTransactionModal={handleOpenCreateTransaction}
              onOpenCategoryModal={handleOpenCreateCategory}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'transactions' && (
            <Transactions
              onOpenTransactionModal={handleOpenCreateTransaction}
              onEditTransaction={handleOpenEditTransaction}
            />
          )}

          {activeTab === 'insights' && (
            <Insights />
          )}

          {activeTab === 'categories' && (
            <Categories
              onOpenCategoryModal={handleOpenCreateCategory}
              onEditCategory={handleOpenEditCategory}
            />
          )}

          {activeTab === 'centelha' && (
            <Centelha />
          )}
        </main>
      </div>

      {/* Modais Globais */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={handleCloseTransactionModal}
        transactionToEdit={editingTransaction}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        categoryToEdit={editingCategory}
      />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainLayout />
    </FinanceProvider>
  );
}
