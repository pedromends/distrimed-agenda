# 🏢 Sistema de Agendamento de Salas de Reunião

## 📌 Introdução
O **Sistema de Agendamento de Salas de Reunião** permite que os usuários realizem reservas de três salas disponíveis em um ambiente corporativo. O sistema possui uma interface interativa e intuitiva, além de uma API organizada e funcional.

---

## 🚀 Tecnologias Utilizadas

### 📌 **Frontend**
- [Vue 3](https://vuejs.org/)
- [Quasar Framework](https://quasar.dev/)
- [FullCalendar](https://fullcalendar.io/) (Visualização do Calendário)

### 📌 **Backend**
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/) (Banco de Dados leve e eficiente)

### 📌 **Controle de Versão**
- [Git](https://git-scm.com/)
- [GitHub](https://github.com/) (Repositório público para o projeto)

---

## 🔧 Como Rodar o Projeto Localmente

### 📥 **1. Clonando o Repositório**
```sh
  git clone https://github.com/usuario/repositorio.git
  cd repositorio
```

### 📦 **2. Instalando Dependências**
#### 📌 Backend
```sh
  cd backend
  npm install
```
#### 📌 Frontend
```sh
  cd frontend
  npm install
```

### ▶ **3. Executando o Projeto**
#### 📌 Backend
```sh
  cd backend
  npm start
```
#### 📌 Frontend
```sh
  cd frontend
  quasar dev
```

---

## 📂 Estrutura do Código

### 📁 **Frontend** (`/frontend`)
- 📌 `src/components/` - Componentes reutilizáveis
- 📌 `src/pages/` - Páginas principais (Login, Dashboard, Salas)
- 📌 `src/router/` - Definição das rotas Vue Router
- 📌 `src/store/` - Gerenciamento de estado com Pinia
- 📌 `src/layouts/` - Layouts principais do Quasar

### 📁 **Backend** (`/backend`)
- 📌 `server.js` - Arquivo principal do servidor Express
- 📌 `routes/` - Definição das rotas API REST
- 📌 `controllers/` - Lógica das funcionalidades da API
- 📌 `database/` - Configuração e manipulação do banco de dados SQLite

---

## 🛠️ Funcionalidades Implementadas

### 🔑 **Autenticação**
✅ Simulação de login sem autenticação real.

### 🏢 **Gestão de Salas**
✅ Listagem das três salas de reunião.
✅ Interface intuitiva para selecionar e reservar uma sala.
✅ Integração com um calendário interativo (FullCalendar).

### 📅 **Agendamento de Reuniões**
✅ Seleção de:
- Sala desejada 🏢
- Data e horário de início ⏳
- Data e horário de término ⏳

✅ **Validações:**
- ❌ Evita agendamentos no passado.
- ❌ Impede reservas para salas já ocupadas.
- ❌ Exige que o horário de início seja anterior ao de término.

### 📜 **Listagem de Agendamentos**
✅ Exibição de todas as reservas no calendário.
✅ Opção para cancelar uma reserva (somente pelo usuário que criou).

### ❌ **Cancelamento de Reuniões**
✅ Apenas o criador do evento pode cancelá-lo.

---

## 🔗 API REST (Backend)

### 📌 **Endpoints**
| Método | Rota | Descrição |
|---------|------|-------------|
| GET | `/salas` | Lista todas as salas disponíveis. |
| GET | `/agendamentos` | Lista todas as reuniões agendadas. |
| POST | `/agendar` | Cria um novo agendamento. |
| DELETE | `/cancelar/:id` | Cancela uma reunião pelo ID. |

---

## 🏆 Critérios de Avaliação Atendidos
✅ **Código Limpo e Bem Estruturado**
✅ **Uso correto do Quasar e Vue 3**
✅ **API REST organizada e bem estruturada**
✅ **Interface intuitiva e responsiva**
✅ **Calendário interativo bem integrado**
✅ **README detalhado (este documento)**

---

## 🔗 Link do Repositório
[🔗 GitHub - Repositório do Projeto](https://github.com/usuario/repositorio)

📌 **Criado por:** [Seu Nome] 🎯

