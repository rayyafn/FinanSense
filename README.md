# 💰 FinanSense: Controle Financeiro Pessoal Inteligente

> **Projeto Desenvolvido por:** Raiany Alexandra Felix do Nascimento  
> **Curso / Turma:** 3º ano do Curso Técnico em Informática Integrado ao Ensino Médio (3º B)  
> **Evento / Submissão:** Simulado - Programa Centelha 3 Rondônia (Fase 1 - Ideias Inovadoras | Edital nº 03/2026)  
> 🎥 **Vídeo Pitch (YouTube):** [Assistir no YouTube](https://youtu.be/iiRMwRVgXCI)

---

## 📌 Sobre o Projeto

O **FinanSense** é uma aplicação web de controle financeiro pessoal desenvolvida especialmente para jovens de 18 a 24 anos (Geração Z). 

Diferente de sistemas convencionais de simples registro contábil (como Mobills e Organizze), o FinanSense atua como um **sistema de acompanhamento e orientação ativa**:
- Transforma registros frios em **diagnósticos em linguagem natural**.
- Compara seus gastos com a **sua própria evolução histórica dos últimos 3 meses**.
- **Projeta o saldo até o fim do mês** considerando compras parceladas e contas fixas agendadas, emitindo alertas preventivos de risco de déficit orçamentário.

---

## 📊 Evidências e Contexto de Mercado (Pesquisa CNDL / SPC Brasil / Sebrae)

- **47%** dos jovens de 18 a 24 anos não realizam nenhum controle financeiro (19% não sabem como fazer, 18% preguiça, 18% falta de disciplina).
- **26%** dos que controlam ainda utilizam papel ou bloquinhos.
- **78%** possuem renda própria e **65%** contribuem diretamente para o sustento do lar.
- **52%** possuem potencial de poupança, mas carecem de ferramentas intuitivas.

---

## 🚀 Funcionalidades Principais

1. **Gestão de Acesso & Segurança (Multi-tenant)**:
   - Autocadastro de usuários, login seguro e recuperação de senha com simulação de token temporário (RF01 a RF04).
2. **Dashboard Interativo**:
   - Saldo disponível em tempo real, projeção de encerramento do mês, agenda para os próximos 15 dias e contas vencidas em destaque vermelho (RF07, RF11, RF12, RF17).
   - Gráfico de distribuição percentual por categorias via Chart.js (RF13).
3. **Lançamentos & Parcelamentos Automáticos**:
   - Registro de receitas e despesas com recorrência mensal (RF05, RF06).
   - Divisão e cálculo automático de compras parceladas em $N$ vezes, gerando o cronograma futuro (RF08 / CA02).
   - Edição e exclusão completa com filtros rápidos (RF09).
4. **Categorias Customizadas**:
   - Categorias padrão + criação, edição e exclusão de categorias personalizadas vinculadas ao jovem (RF10 / CA06).
5. **Motor Preditivo & Inteligência Financeira**:
   - Análise dos últimos 3 meses por categoria com alertas automáticos para desvios $\ge 25\%$ (RF14 a RF16 / CA04).
   - Alerta preventivo contra endividamento e déficit (RF18 / CA05).
6. **Central do Projeto Centelha 3**:
   - Apresentação acadêmica e player do vídeo pitch embutido diretamente na interface (`https://youtu.be/iiRMwRVgXCI`).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React 18](https://react.dev/), [Vite](https://vite.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Gráficos & Ícones**: [Chart.js](https://www.chartjs.org/) + [React-ChartJS-2](https://react-chartjs-2.js.org/), [Lucide React](https://lucide.dev/)
- **Persistência**: LocalStorage com arquitetura extensível para API REST / MySQL

---

## 💻 Como Rodar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação e Execução

```bash
# 1. Clonar o repositório
git clone https://github.com/rayyafn/FinanSense.git

# 2. Entrar na pasta do projeto
cd FinanSense

# 3. Instalar as dependências
npm install

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## 📄 Licença
Desenvolvido para fins educacionais e de inovação no âmbito do **Programa Centelha 3 Rondônia**.
