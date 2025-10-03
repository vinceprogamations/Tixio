# Tixio - Plataforma de Eventos e Ingressos

Uma plataforma completa para criação, gerenciamento e venda de ingressos para eventos, construída com Next.js 15, Firebase e Bootstrap.

## 🚀 Funcionalidades

### ✅ Implementado
- **Autenticação completa**: Login/registro para pessoas e empresas
- **Dashboard da empresa**: Criação e gerenciamento de eventos
- **Lista pública de eventos**: Com filtros avançados e busca
- **Sistema de compra**: Transações seguras com controle de estoque
- **Validação de ingressos**: Sistema de códigos únicos
- **Relatórios**: Analytics de vendas com exportação CSV
- **Acessibilidade**: WCAG 2.1 AA compliant
- **Responsividade**: Mobile-first design
- **Segurança**: Regras Firestore e validações

### 🎯 Características Técnicas
- **Framework**: Next.js 15 com App Router
- **Backend**: Firebase (Auth + Firestore)
- **UI**: Bootstrap 5 + CSS customizado
- **Testes**: Jest + Testing Library
- **TypeScript**: Tipagem completa
- **Acessibilidade**: ARIA labels, navegação por teclado
- **Performance**: Otimizações de carregamento

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Firebase

### 1. Clone o repositório
```bash
git clone <repository-url>
cd tixio-web
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Firebase
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative Authentication (Email/Password)
3. Crie um banco Firestore
4. Copie as credenciais para `src/controller.js`

### 4. Configure as regras de segurança
```bash
# Instale o Firebase CLI
npm install -g firebase-tools

# Faça login
firebase login

# Deploy das regras
firebase deploy --only firestore:rules
```

### 5. Execute o projeto
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── dashboard/         # Dashboard da empresa
│   ├── evento/           # Lista e detalhes de eventos
│   ├── login/            # Autenticação
│   ├── usuario/          # Dashboard do usuário
│   └── validar/          # Validação de ingressos
├── components/           # Componentes reutilizáveis
├── utils/               # Utilitários e helpers
├── __tests__/           # Testes de integração
└── controller.js        # Configuração Firebase
```

## 🔒 Segurança

### Regras Firestore
- Usuários só acessam seus próprios dados
- Empresas só editam seus eventos
- Validação de tipos e campos obrigatórios
- Controle de permissões por tipo de usuário

### Validações
- Sanitização de inputs
- Validação de tipos de dados
- Controle de transações atômicas
- Prevenção de race conditions

## 🎨 Acessibilidade

- **WCAG 2.1 AA**: Conformidade com padrões
- **Navegação por teclado**: Suporte completo
- **Screen readers**: Labels e ARIA adequados
- **Alto contraste**: Suporte a modo escuro
- **Reduced motion**: Respeita preferências do usuário

## 📱 Responsividade

- **Mobile-first**: Design otimizado para mobile
- **Breakpoints**: Bootstrap 5 responsivo
- **Touch targets**: Mínimo 44px para toque
- **Viewport**: Configuração adequada

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Instale Vercel CLI
npm install -g vercel

# Deploy
vercel

# Configure variáveis de ambiente
vercel env add FIREBASE_API_KEY
```

### Firebase Hosting
```bash
# Build do projeto
npm run build

# Deploy
firebase deploy
```

## 📊 Monitoramento

### Métricas importantes
- Tempo de carregamento das páginas
- Taxa de conversão de compras
- Erros de validação de ingressos
- Performance das queries Firestore

### Logs
- Erros são logados no console
- Firebase Analytics integrado
- Monitoramento de transações

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email: suporte@tixio.com

---

**Tixio** - Transformando a forma como você gerencia eventos 🎫
