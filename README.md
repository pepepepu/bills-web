<p align="center">
  <img src="public/icon-512.png" alt="Bills" width="96" />
</p>

<h1 align="center">Bills</h1>

<p align="center"><em>Porque boleto bom é boleto pago.</em></p>

O **Bills** é um app para organizar as finanças de uma casa: o que entra, o que precisa ser pago e quanto cada morador deve contribuir. Ele nasceu para substituir a planilha que era preenchida quase todo dia, com a mesma praticidade e sem as fórmulas quebradas.

Este repositório é o **front-end web** (PWA). A API fica em [`bills-api`](../bills-api).

## Por que existe

Dividir contas em casa parece simples até alguém ganhar um extra no mês, uma conta ser só de uma pessoa, ou uma dívida vir parcelada em dez vezes. A planilha resolvia, mas exigia atualização manual constante. O Bills faz essas contas sozinho e mostra, mês a mês, quem está em dia, quem deve à casa e quem tem a receber.

## Funcionalidades

- **Resumo do mês**: visão geral com entradas, contas, dívidas e o saldo de cada morador ("Em dia", "Deve à casa", "A receber").
- **Entradas**: salário, extras e vales. Os **extras** do mês somam na renda da pessoa e entram no cálculo do rateio.
- **Contas**: contas da casa com vencimento, status e quem pagou. Uma conta pode ser marcada como **"Só minha"** e fica fora da divisão.
- **Rateio proporcional à renda**: cada morador paga uma fatia das contas compartilhadas proporcional ao que ganha no mês.
- **Dívidas e parcelas**: dívidas pessoais ou da família, com parcelamento (`3/10`) que é lançado automaticamente no mês seguinte.
- **Pix**: chave Pix da casa visível no resumo, pronta para copiar.
- **Assinaturas**: serviços recorrentes, compartilhados ou da família.
- **Compras**: lista de mercado e suprimentos com custo estimado e real.
- **Agenda de pagamentos**: o que vence e quando, em ordem.
- **Casas compartilhadas**: quem cria a casa recebe um código; os outros moradores entram com ele no cadastro.

## Interface

Pensada primeiro para o celular e instalável como PWA. Visual inspirado no iOS, com superfícies de vidro (*glass*), cantos *squircle*, navegação inferior, *sheets* que sobem da base, gestos de deslizar nas linhas e animações com GSAP.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build | Vite |
| Estilo | styled-components (tema, glass, squircle) |
| Rotas | React Router 7 |
| Ícones | Phosphor Icons |
| Animações | GSAP |

## Rodando localmente

Requisitos: Node.js 20+ e a [`bills-api`](../bills-api) rodando (ou a API publicada).

```bash
npm install
npm run dev
```

O app abre em `http://localhost:5173` (o `--host` deixa acessível pelo celular na mesma rede).

### Variáveis de ambiente

Crie um `.env` na raiz se quiser apontar para outra API:

```env
VITE_API_URL=http://localhost:3333/api
```

Sem essa variável, o app usa a API publicada no Render.

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos e build de produção |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | ESLint |

## Estrutura

```
src/
├── components/   # atoms, molecules e templates (Atomic Design)
├── contexts/     # Auth, mês selecionado e toasts
├── hooks/        # useAuth, useMonth, useMembers, useAsync...
├── interfaces/   # tipos do domínio (finance, auth)
├── pages/        # Home, Entradas, Contas, Dívidas, Agenda, Compras, Login...
├── routes/       # rotas públicas e privadas
├── services/     # chamadas à API
├── styles/       # tema, glass, squircle, animações
└── utils/        # formatação de moeda/data e status
```

## Rotas

| Rota | Tela |
| --- | --- |
| `/` | Apresentação |
| `/login`, `/register` | Acesso e cadastro (criar casa ou entrar com código) |
| `/home` | Resumo do mês |
| `/entradas` | Entradas |
| `/contas` | Contas |
| `/dividas` | Dívidas e parcelas |
| `/agenda` | Agenda de pagamentos |
| `/compras` | Compras |
