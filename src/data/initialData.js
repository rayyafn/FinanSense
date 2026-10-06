// Dados iniciais baseados nas especificações do FinanSense (DER e Casos de Uso)

export const DEFAULT_CATEGORIES = [
  // Receitas (tipo: 'receita', eh_padrao: true)
  { id_categoria: 1, id_usuario: null, nome: 'Estágio / Salário', tipo: 'receita', eh_padrao: true, cor: '#10b981', icone: 'Briefcase' },
  { id_categoria: 2, id_usuario: null, nome: 'Bolsa de Estudos', tipo: 'receita', eh_padrao: true, cor: '#06b6d4', icone: 'GraduationCap' },
  { id_categoria: 3, id_usuario: null, nome: 'Freelance / Bicos', tipo: 'receita', eh_padrao: true, cor: '#8b5cf6', icone: 'Laptop' },
  { id_categoria: 4, id_usuario: null, nome: 'Auxílio Familiar / Outros', tipo: 'receita', eh_padrao: true, cor: '#ec4899', icone: 'HeartHandshake' },

  // Despesas (tipo: 'despesa', eh_padrao: true)
  { id_categoria: 5, id_usuario: null, nome: 'Alimentação', tipo: 'despesa', eh_padrao: true, cor: '#f97316', icone: 'Utensils' },
  { id_categoria: 6, id_usuario: null, nome: 'Transporte', tipo: 'despesa', eh_padrao: true, cor: '#3b82f6', icone: 'Bus' },
  { id_categoria: 7, id_usuario: null, nome: 'Lazer & Entretenimento', tipo: 'despesa', eh_padrao: true, cor: '#a855f7', icone: 'Gamepad2' },
  { id_categoria: 8, id_usuario: null, nome: 'Contas Fixas & Moradia', tipo: 'despesa', eh_padrao: true, cor: '#ef4444', icone: 'Home' },
  { id_categoria: 9, id_usuario: null, nome: 'Educação & Material', tipo: 'despesa', eh_padrao: true, cor: '#14b8a6', icone: 'BookOpen' },
  { id_categoria: 10, id_usuario: null, nome: 'Assinaturas & Celular', tipo: 'despesa', eh_padrao: true, cor: '#6366f1', icone: 'Smartphone' },
];

export const INITIAL_USER = {
  id_usuario: 1,
  nome: 'Raiany Alexandra Felix do Nascimento',
  email: 'raiany@finansense.com',
  turma: '3º B - Técnico em Informática',
  data_criacao: '2026-01-10T10:00:00Z',
};

// Funções auxiliares para datas dinâmicas no mês atual e meses anteriores
const today = new Date();
const formatDate = (d) => d.toISOString().split('T')[0];

const addDays = (d, days) => {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return formatDate(result);
};

const getRelativeMonthDate = (monthsAgo, dayOfMonth = 10) => {
  const d = new Date(today.getFullYear(), today.getMonth() - monthsAgo, dayOfMonth);
  return formatDate(d);
};

export const INITIAL_TRANSACTIONS = {
  receitas: [
    {
      id_receita: 1,
      id_usuario: 1,
      id_categoria: 1,
      descricao: 'Bolsa Estágio em TI',
      valor: 1100.00,
      data_recebimento: getRelativeMonthDate(0, 5),
      eh_recorrente: true,
    },
    {
      id_receita: 2,
      id_usuario: 1,
      id_categoria: 3,
      descricao: 'Freelance Manutenção Web',
      valor: 400.00,
      data_recebimento: getRelativeMonthDate(0, 15),
      eh_recorrente: false,
    },
    // Histórico de receitas dos últimos 3 meses para alimentar projeções
    {
      id_receita: 101,
      id_usuario: 1,
      id_categoria: 1,
      descricao: 'Bolsa Estágio (Mês -1)',
      valor: 1100.00,
      data_recebimento: getRelativeMonthDate(1, 5),
      eh_recorrente: true,
    },
    {
      id_receita: 102,
      id_usuario: 1,
      id_categoria: 1,
      descricao: 'Bolsa Estágio (Mês -2)',
      valor: 1100.00,
      data_recebimento: getRelativeMonthDate(2, 5),
      eh_recorrente: true,
    },
    {
      id_receita: 103,
      id_usuario: 1,
      id_categoria: 1,
      descricao: 'Bolsa Estágio (Mês -3)',
      valor: 1100.00,
      data_recebimento: getRelativeMonthDate(3, 5),
      eh_recorrente: true,
    },
  ],

  despesas: [
    // 1. Despesa paga este mês
    {
      id_despesa: 1,
      id_usuario: 1,
      id_categoria: 8,
      descricao: 'Contribuição Conta de Luz da Casa',
      valor_total: 180.00,
      data_vencimento: getRelativeMonthDate(0, 8),
      status: 'paga',
      tipo: 'fixa',
    },
    // 2. Despesa VENCIDA (CA03: vencimento anterior à data atual e não paga)
    {
      id_despesa: 2,
      id_usuario: 1,
      id_categoria: 10,
      descricao: 'Plano Celular & Internet 4G',
      valor_total: 69.90,
      data_vencimento: addDays(today, -3), // 3 dias atrás = Vencida!
      status: 'a_pagar', // sistema detectará como vencida
      tipo: 'fixa',
    },
    // 3. Despesa nos próximos 15 dias (RF12)
    {
      id_despesa: 3,
      id_usuario: 1,
      id_categoria: 5,
      descricao: 'Supermercado e Lanche Mensal',
      valor_total: 350.00,
      data_vencimento: addDays(today, 5), // Daqui a 5 dias
      status: 'a_pagar',
      tipo: 'variavel',
    },
    // 4. Lazer no mês atual (CA04: atingiu R$ 260, que é 30% acima da média de R$ 200 dos últimos 3 meses)
    {
      id_despesa: 4,
      id_usuario: 1,
      id_categoria: 7,
      descricao: 'Cinema, Lanche e Jogos com amigos',
      valor_total: 260.00,
      data_vencimento: getRelativeMonthDate(0, 12),
      status: 'paga',
      tipo: 'variavel',
    },
    // 5. Transporte agendado
    {
      id_despesa: 5,
      id_usuario: 1,
      id_categoria: 6,
      descricao: 'Recarga Cartão Passe de Ônibus',
      valor_total: 120.00,
      data_vencimento: addDays(today, 10), // Daqui a 10 dias
      status: 'a_pagar',
      tipo: 'fixa',
    },
    // 6. Compra Parcelada Exemplo (CA02: R$ 600 em 6x de R$ 100)
    {
      id_despesa: 6,
      id_usuario: 1,
      id_categoria: 9,
      descricao: 'Headset e Teclado para Estudos (6x)',
      valor_total: 600.00,
      data_vencimento: getRelativeMonthDate(0, 20),
      status: 'a_pagar',
      tipo: 'parcelada',
      parcelamento_info: {
        total_parcelas: 6,
        valor_parcela: 100.00,
        numero_parcela_atual: 1
      }
    },

    // --- Histórico dos 3 meses anteriores para cálculo de médias históricas (RF14/CA04) ---
    // Mês -1 (Lazer = 200, Alimentação = 310, etc.)
    {
      id_despesa: 201,
      id_usuario: 1,
      id_categoria: 7,
      descricao: 'Passeio final de semana',
      valor_total: 200.00,
      data_vencimento: getRelativeMonthDate(1, 14),
      status: 'paga',
      tipo: 'variavel',
    },
    {
      id_despesa: 202,
      id_usuario: 1,
      id_categoria: 5,
      descricao: 'Mercado mês passado',
      valor_total: 310.00,
      data_vencimento: getRelativeMonthDate(1, 10),
      status: 'paga',
      tipo: 'variavel',
    },
    // Mês -2 (Lazer = 190, Alimentação = 320)
    {
      id_despesa: 203,
      id_usuario: 1,
      id_categoria: 7,
      descricao: 'Cinema e lanches',
      valor_total: 190.00,
      data_vencimento: getRelativeMonthDate(2, 16),
      status: 'paga',
      tipo: 'variavel',
    },
    {
      id_despesa: 204,
      id_usuario: 1,
      id_categoria: 5,
      descricao: 'Alimentação e feira',
      valor_total: 320.00,
      data_vencimento: getRelativeMonthDate(2, 12),
      status: 'paga',
      tipo: 'variavel',
    },
    // Mês -3 (Lazer = 210, Alimentação = 300)
    // Média de Lazer: (200 + 190 + 210) / 3 = R$ 200,00!
    {
      id_despesa: 205,
      id_usuario: 1,
      id_categoria: 7,
      descricao: 'Ingresso show local',
      valor_total: 210.00,
      data_vencimento: getRelativeMonthDate(3, 20),
      status: 'paga',
      tipo: 'variavel',
    },
    {
      id_despesa: 206,
      id_usuario: 1,
      id_categoria: 5,
      descricao: 'Compras de alimentação',
      valor_total: 300.00,
      data_vencimento: getRelativeMonthDate(3, 10),
      status: 'paga',
      tipo: 'variavel',
    },
  ],

  // Parcelamento detalhado gerado para a despesa 6 (CA02)
  parcelamentos: [
    { id_parcelamento: 1, id_despesa: 6, numero_parcela: 1, total_parcelas: 6, valor_parcela: 100.00, data_vencimento: getRelativeMonthDate(0, 20), status_parcela: 'a_pagar' },
    { id_parcelamento: 2, id_despesa: 6, numero_parcela: 2, total_parcelas: 6, valor_parcela: 100.00, data_vencimento: getRelativeMonthDate(-1, 20), status_parcela: 'a_pagar' },
    { id_parcelamento: 3, id_despesa: 6, numero_parcela: 3, total_parcelas: 6, valor_parcela: 100.00, data_vencimento: getRelativeMonthDate(-2, 20), status_parcela: 'a_pagar' },
    { id_parcelamento: 4, id_despesa: 6, numero_parcela: 4, total_parcelas: 6, valor_parcela: 100.00, data_vencimento: getRelativeMonthDate(-3, 20), status_parcela: 'a_pagar' },
    { id_parcelamento: 5, id_despesa: 6, numero_parcela: 5, total_parcelas: 6, valor_parcela: 100.00, data_vencimento: getRelativeMonthDate(-4, 20), status_parcela: 'a_pagar' },
    { id_parcelamento: 6, id_despesa: 6, numero_parcela: 6, total_parcelas: 6, valor_parcela: 100.00, data_vencimento: getRelativeMonthDate(-5, 20), status_parcela: 'a_pagar' },
  ]
};
