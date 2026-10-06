import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEFAULT_CATEGORIES,
  INITIAL_USER,
  INITIAL_TRANSACTIONS
} from '../data/initialData';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  // Autenticação e Usuário
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('finansense_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Categorias (Padrão + Personalizadas do Usuário)
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('finansense_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  // Receitas
  const [receitas, setReceitas] = useState(() => {
    const saved = localStorage.getItem('finansense_receitas');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS.receitas;
  });

  // Despesas
  const [despesas, setDespesas] = useState(() => {
    const saved = localStorage.getItem('finansense_despesas');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS.despesas;
  });

  // Parcelamentos
  const [parcelamentos, setParcelamentos] = useState(() => {
    const saved = localStorage.getItem('finansense_parcelamentos');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS.parcelamentos;
  });

  // Persistência no LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('finansense_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('finansense_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('finansense_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('finansense_receitas', JSON.stringify(receitas));
  }, [receitas]);

  useEffect(() => {
    localStorage.setItem('finansense_despesas', JSON.stringify(despesas));
  }, [despesas]);

  useEffect(() => {
    localStorage.setItem('finansense_parcelamentos', JSON.stringify(parcelamentos));
  }, [parcelamentos]);

  // Helper de Data Hoje (formato YYYY-MM-DD)
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  // Helper para verificar se uma despesa está vencida (RF07 / CA03)
  const isDespesaVencida = (despesa) => {
    if (despesa.status === 'paga') return false;
    const today = getTodayStr();
    return despesa.data_vencimento < today;
  };

  // 1. MÓDULO DE AUTENTICAÇÃO (RF01, RF02, RF03)
  const login = (email, senha) => {
    // Simulação com validação segura
    if (!email || !senha) {
      return { success: false, message: 'Preencha e-mail e senha.' };
    }
    const user = {
      id_usuario: 1,
      nome: email.includes('raiany') ? 'Raiany Alexandra Felix do Nascimento' : 'Usuário FinanSense',
      email: email,
      turma: '3º B - Informática',
      data_criacao: new Date().toISOString()
    };
    setCurrentUser(user);
    return { success: true };
  };

  const register = (nome, email, senha) => {
    if (!nome || !email || !senha) {
      return { success: false, message: 'Todos os campos são obrigatórios.' };
    }
    const newUser = {
      id_usuario: Date.now(),
      nome,
      email,
      turma: 'Estudante / Jovem Autônomo',
      data_criacao: new Date().toISOString()
    };
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const requestPasswordReset = (email) => {
    if (!email) return { success: false, message: 'Informe o e-mail cadastrado.' };
    const fakeToken = Math.random().toString(36).substring(2, 8).toUpperCase();
    return {
      success: true,
      message: `Token temporário enviado com sucesso para ${email}! Token simulado: ${fakeToken}`
    };
  };

  // 2. MÓDULO DE CATEGORIAS (RF10 / CA06)
  const addCategory = ({ nome, tipo, cor = '#6366f1', icone = 'Tag' }) => {
    const newCategory = {
      id_categoria: Date.now(),
      id_usuario: currentUser ? currentUser.id_usuario : 1,
      nome,
      tipo, // 'receita' ou 'despesa'
      eh_padrao: false,
      cor,
      icone
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id_categoria, { nome, tipo, cor, icone }) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id_categoria === id_categoria) {
          return {
            ...c,
            nome: nome !== undefined ? nome : c.nome,
            tipo: tipo !== undefined ? tipo : c.tipo,
            cor: cor !== undefined ? cor : c.cor,
            icone: icone !== undefined ? icone : c.icone,
          };
        }
        return c;
      })
    );
  };

  const deleteCategory = (id_categoria) => {
    setCategories((prev) => prev.filter((c) => c.id_categoria !== id_categoria || c.eh_padrao));
  };

  // 3. MÓDULO DE RECEITAS (RF05, RF09)
  const addReceita = ({ descricao, valor, data_recebimento, id_categoria, eh_recorrente = false }) => {
    const parsedValor = parseFloat(valor);
    if (!descricao || isNaN(parsedValor) || parsedValor <= 0) {
      throw new Error('Informe uma descrição e um valor maior que zero.');
    }
    const newReceita = {
      id_receita: Date.now(),
      id_usuario: currentUser ? currentUser.id_usuario : 1,
      id_categoria: parseInt(id_categoria),
      descricao,
      valor: parsedValor,
      data_recebimento: data_recebimento || getTodayStr(),
      eh_recorrente: Boolean(eh_recorrente),
    };
    setReceitas((prev) => [newReceita, ...prev]);
    return newReceita;
  };

  const updateReceita = (id_receita, { descricao, valor, data_recebimento, id_categoria, eh_recorrente }) => {
    setReceitas((prev) =>
      prev.map((r) => {
        if (r.id_receita === id_receita) {
          const parsedValor = valor !== undefined ? parseFloat(valor) : r.valor;
          return {
            ...r,
            descricao: descricao !== undefined ? descricao : r.descricao,
            valor: parsedValor,
            data_recebimento: data_recebimento !== undefined ? data_recebimento : r.data_recebimento,
            id_categoria: id_categoria !== undefined ? parseInt(id_categoria) : r.id_categoria,
            eh_recorrente: eh_recorrente !== undefined ? Boolean(eh_recorrente) : r.eh_recorrente,
          };
        }
        return r;
      })
    );
  };

  const deleteReceita = (id_receita) => {
    setReceitas((prev) => prev.filter((r) => r.id_receita !== id_receita));
  };

  // 4. MÓDULO DE DESPESAS E PARCELAMENTOS (RF06, RF08, RF09 / CA02)
  const addDespesa = ({
    descricao,
    valor_total,
    data_vencimento,
    id_categoria,
    tipo = 'variavel', // 'fixa', 'variavel', 'parcelada'
    total_parcelas = 1,
    status = 'a_pagar'
  }) => {
    const parsedValor = parseFloat(valor_total);
    if (!descricao || isNaN(parsedValor) || parsedValor <= 0) {
      throw new Error('Informe uma descrição e um valor total válido maior que zero.');
    }

    const idDespesa = Date.now();
    const isParcelada = tipo === 'parcelada' && parseInt(total_parcelas) > 1;
    const numParcelas = isParcelada ? parseInt(total_parcelas) : 1;
    const valorParcela = parseFloat((parsedValor / numParcelas).toFixed(2));

    const novaDespesa = {
      id_despesa: idDespesa,
      id_usuario: currentUser ? currentUser.id_usuario : 1,
      id_categoria: parseInt(id_categoria),
      descricao,
      valor_total: parsedValor,
      data_vencimento: data_vencimento || getTodayStr(),
      status: status,
      tipo: tipo,
      parcelamento_info: isParcelada ? {
        total_parcelas: numParcelas,
        valor_parcela: valorParcela,
        numero_parcela_atual: 1
      } : null
    };

    setDespesas((prev) => [novaDespesa, ...prev]);

    // Geração automática das N parcelas com vencimentos nos meses subsequentes (RF08 / CA02)
    if (isParcelada) {
      const baseDate = new Date(data_vencimento || getTodayStr());
      const novasParcelas = [];

      for (let i = 1; i <= numParcelas; i++) {
        const dueDate = new Date(baseDate);
        dueDate.setMonth(baseDate.getMonth() + (i - 1));

        novasParcelas.push({
          id_parcelamento: Date.now() + i,
          id_despesa: idDespesa,
          numero_parcela: i,
          total_parcelas: numParcelas,
          valor_parcela: valorParcela,
          data_vencimento: dueDate.toISOString().split('T')[0],
          status_parcela: i === 1 && status === 'paga' ? 'paga' : 'a_pagar'
        });
      }

      setParcelamentos((prev) => [...novasParcelas, ...prev]);
    }

    return novaDespesa;
  };

  const updateDespesa = (id_despesa, {
    descricao,
    valor_total,
    data_vencimento,
    id_categoria,
    tipo,
    status
  }) => {
    setDespesas((prev) =>
      prev.map((d) => {
        if (d.id_despesa === id_despesa) {
          const parsedValor = valor_total !== undefined ? parseFloat(valor_total) : d.valor_total;
          return {
            ...d,
            descricao: descricao !== undefined ? descricao : d.descricao,
            valor_total: parsedValor,
            data_vencimento: data_vencimento !== undefined ? data_vencimento : d.data_vencimento,
            id_categoria: id_categoria !== undefined ? parseInt(id_categoria) : d.id_categoria,
            tipo: tipo !== undefined ? tipo : d.tipo,
            status: status !== undefined ? status : d.status,
          };
        }
        return d;
      })
    );
  };

  const deleteDespesa = (id_despesa) => {
    setDespesas((prev) => prev.filter((d) => d.id_despesa !== id_despesa));
    setParcelamentos((prev) => prev.filter((p) => p.id_despesa !== id_despesa));
  };

  const toggleDespesaStatus = (id_despesa) => {
    setDespesas((prev) =>
      prev.map((d) => {
        if (d.id_despesa === id_despesa) {
          const novoStatus = d.status === 'paga' ? 'a_pagar' : 'paga';
          return { ...d, status: novoStatus };
        }
        return d;
      })
    );
  };

  // Filtragem multi-tenant por usuário logado (RF04)
  const currentUserId = currentUser ? currentUser.id_usuario : 1;
  const userReceitas = receitas.filter((r) => r.id_usuario === currentUserId);
  const userDespesas = despesas.filter((d) => d.id_usuario === currentUserId);
  const userCategories = categories.filter((c) => c.eh_padrao || c.id_usuario === currentUserId);

  // 5. CÁLCULO DE INDICADORES DO DASHBOARD (RF11, RF12, RF13)
  // Saldo Disponível Atual = Total Receitas Acumuladas - Total Despesas Pagas
  const totalReceitas = userReceitas.reduce((acc, curr) => acc + curr.valor, 0);
  const totalDespesasPagas = userDespesas
    .filter((d) => d.status === 'paga')
    .reduce((acc, curr) => acc + curr.valor_total, 0);
  const saldoDisponivel = totalReceitas - totalDespesasPagas;

  // Total de contas pendentes
  const totalDespesasPendentes = userDespesas
    .filter((d) => d.status !== 'paga')
    .reduce((acc, curr) => acc + curr.valor_total, 0);

  // Contas Vencidas (RF07 / CA03)
  const contasVencidas = userDespesas.filter((d) => isDespesaVencida(d));
  const totalContasVencidas = contasVencidas.reduce((acc, curr) => acc + curr.valor_total, 0);

  // Agenda dos Próximos 15 dias (RF12)
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const limite15Dias = new Date(hoje);
  limite15Dias.setDate(limite15Dias.getDate() + 15);

  const contasProximos15Dias = userDespesas.filter((d) => {
    if (d.status === 'paga') return false;
    const vDate = new Date(d.data_vencimento);
    return vDate >= hoje && vDate <= limite15Dias;
  }).sort((a, b) => new Date(a.data_vencimento) - new Date(b.data_vencimento));

  const totalProximos15Dias = contasProximos15Dias.reduce((acc, curr) => acc + curr.valor_total, 0);

  // Distribuição de Gastos por Categoria (RF13)
  const gastosPorCategoria = userCategories
    .filter((c) => c.tipo === 'despesa')
    .map((cat) => {
      const total = userDespesas
        .filter((d) => d.id_categoria === cat.id_categoria)
        .reduce((acc, curr) => acc + curr.valor_total, 0);
      return {
        id_categoria: cat.id_categoria,
        nome: cat.nome,
        cor: cat.cor,
        total
      };
    })
    .filter((c) => c.total > 0);

  // 6. MOTOR PREDITIVO E DIAGNÓSTICOS EM LINGUAGEM NATURAL (RF14, RF15, RF16, RF17, RF18 / CA04, CA05)
  // Cálculo da média dos últimos 3 meses por categoria
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const getCategoryStats = (id_categoria) => {
    // Gastos no mês atual
    const gastosMesAtual = userDespesas
      .filter((d) => {
        const dDate = new Date(d.data_vencimento);
        return (
          d.id_categoria === id_categoria &&
          dDate.getMonth() === currentMonth &&
          dDate.getFullYear() === currentYear
        );
      })
      .reduce((acc, curr) => acc + curr.valor_total, 0);

    // Gastos nos 3 meses anteriores
    let soma3Meses = 0;
    for (let m = 1; m <= 3; m++) {
      const targetMonthDate = new Date(currentYear, currentMonth - m, 1);
      const tMonth = targetMonthDate.getMonth();
      const tYear = targetMonthDate.getFullYear();

      const gastoMes = userDespesas
        .filter((d) => {
          const dDate = new Date(d.data_vencimento);
          return (
            d.id_categoria === id_categoria &&
            dDate.getMonth() === tMonth &&
            dDate.getFullYear() === tYear
          );
        })
        .reduce((acc, curr) => acc + curr.valor_total, 0);

      soma3Meses += gastoMes;
    }

    const mediaHistorica = soma3Meses / 3;
    const variacaoPercentual = mediaHistorica > 0 ? ((gastosMesAtual - mediaHistorica) / mediaHistorica) * 100 : 0;

    return {
      gastosMesAtual,
      mediaHistorica,
      variacaoPercentual
    };
  };

  // Alertas interpretativos (RF16 / CA04)
  const alertasInteligentes = [];
  userCategories
    .filter((c) => c.tipo === 'despesa')
    .forEach((cat) => {
      const stats = getCategoryStats(cat.id_categoria);
      if (stats.mediaHistorica > 0 && stats.variacaoPercentual >= 25) {
        alertasInteligentes.push({
          id: `alerta-${cat.id_categoria}`,
          tipo: 'warning',
          categoria: cat.nome,
          mensagem: `Atenção: seus gastos com "${cat.nome}" estão ${stats.variacaoPercentual.toFixed(0)}% acima da sua média habitual dos últimos 3 meses (R$ ${stats.gastosMesAtual.toFixed(2)} vs média de R$ ${stats.mediaHistorica.toFixed(2)}).`,
          sugestao: 'Considere adiar novos gastos não essenciais nesta categoria até o próximo mês para manter o equilíbrio.'
        });
      }
    });

  // Projeção de Saldo Futuro e Alerta de Déficit (RF17, RF18 / CA05)
  // Receitas previstas deste mês + saldo atual - compromissos a vencer até o fim do mês
  const receitasPrevistasMes = userReceitas
    .filter((r) => {
      const rDate = new Date(r.data_recebimento);
      return rDate.getMonth() === currentMonth && rDate.getFullYear() === currentYear;
    })
    .reduce((acc, curr) => acc + curr.valor, 0);

  const despesasAgendadasMes = userDespesas
    .filter((d) => {
      const dDate = new Date(d.data_vencimento);
      return (
        d.status !== 'paga' &&
        dDate.getMonth() === currentMonth &&
        dDate.getFullYear() === currentYear
      );
    })
    .reduce((acc, curr) => acc + curr.valor_total, 0);

  // Estimativa de saldo ao fim do mês
  const projecaoSaldoFimDoMes = saldoDisponivel - despesasAgendadasMes;
  const riscoDeficit = projecaoSaldoFimDoMes < 0;

  if (riscoDeficit) {
    alertasInteligentes.unshift({
      id: 'alerta-deficit-mensal',
      tipo: 'danger',
      categoria: 'Projeção de Déficit',
      mensagem: `Alerta Preventivo: Risco de terminar o mês no vermelho! Mantendo as contas agendadas, seu saldo projetado para o fim do mês é de R$ ${projecaoSaldoFimDoMes.toFixed(2)}.`,
      sugestao: 'Reduza gastos variáveis ou antecipe receitas para evitar juros e dívidas.'
    });
  }

  return (
    <FinanceContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        requestPasswordReset,
        categories: userCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        receitas: userReceitas,
        addReceita,
        updateReceita,
        deleteReceita,
        despesas: userDespesas,
        addDespesa,
        updateDespesa,
        deleteDespesa,
        toggleDespesaStatus,
        parcelamentos,
        isDespesaVencida,
        saldoDisponivel,
        totalReceitas,
        totalDespesasPagas,
        totalDespesasPendentes,
        contasVencidas,
        totalContasVencidas,
        contasProximos15Dias,
        totalProximos15Dias,
        gastosPorCategoria,
        getCategoryStats,
        alertasInteligentes,
        projecaoSaldoFimDoMes,
        riscoDeficit,
        receitasPrevistasMes,
        despesasAgendadasMes,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
