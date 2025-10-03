# Plano Iterativo — Plataforma de Eventos e Ingressos

Guia de execução com ciclos: Refazer, Voltar, Avançar, Dividir em lotes.
Cada lote possui tarefas com checkboxes para acompanhamento.

## Lote 0 — Fundações (estado atual)
- [x] Scaffold Next.js + Firebase
- [x] Autenticação: login/registro (pessoa/empresa)
- [x] Dashboard empresa: perfil, criar eventos, listar/editar
- [x] Lista pública de eventos e página de detalhes com compra

Perguntas do ciclo:
- Deseja refazer algo do Lote 0?
- Deseja voltar e ajustar comportamentos do login/rotas?
- Avançar para o Lote 1?
- Dividir em mais lotes?

## Lote 1 — Modelo de Evento e CRUD completo (Empresa)
- [ ] Definir esquema do evento (categoria, descrição, local, data/hora, preço, capacidade, imagens)
- [ ] Atualizar formulários de criação/edição (incl. categoria, descrição, capacidade, imagens)
- [ ] Validações de formulário (campos obrigatórios, ranges, datas)
- [ ] Exibição de status (ativo/inativo, esgotado)
- [ ] Slug/ID amigável (opcional)

Perguntas do ciclo:
- Refazer algo no formulário atual?
- Voltar e ajustar campos obrigatórios?
- Avançar para integração com storage de imagens?
- Dividir upload de imagens em um sublote?

## Lote 2 — Explorar público e filtros
- [ ] Grid/Cards de eventos com paginação/scroll
- [ ] Filtros: categoria, faixa de preço, data (intervalo), cidade/local
- [ ] Ordenações: mais recentes, preço, data
- [ ] Barra de busca por texto (nome/descrição)
- [ ] Ajustar indexação no Firestore conforme necessário

Perguntas do ciclo:
- Refazer layout de listagem?
- Voltar e ajustar filtros prioritários?
- Avançar para performance (index/queries)?
- Dividir filtros em entregas menores?

## Lote 3 — Compra, ingressos e dashboard do usuário
- [ ] Modelo de ingressos do usuário (coleção `tickets` ou subcoleções)
- [ ] Fluxo de compra com quantidade, checagem de estoque e transação
- [ ] Comprovante/QR Code (geração e exibição)
- [ ] Dashboard do usuário: histórico de compras, ingressos ativos, re-download
- [ ] Política de reembolso/cancelamento (definição inicial)

Perguntas do ciclo:
- Refazer a UX da compra?
- Voltar e ajustar controle de estoque?
- Avançar para QR Code e validação?
- Dividir dashboard do usuário em sublotes?

## Lote 4 — Relatórios e analytics (Empresa)
- [ ] Visão geral de vendas por evento (faturamento, vendidos, restantes)
- [ ] Curva de vendas (séries temporais)
- [ ] Exportações (CSV)
- [ ] Integração com ferramentas externas (opcional)

Perguntas do ciclo:
- Refazer indicadores mostrados?
- Voltar e priorizar métricas diferentes?
- Avançar para exportação?
- Dividir relatórios por seção?

## Lote 5 — Operações e qualidade
- [ ] Regras de segurança Firestore (empresas editam só seus eventos; usuários só compram; etc.)
- [ ] Testes mínimos de integração (compra, criação/edição evento)
- [ ] Tratamento de erros e mensagens consistentes
- [ ] Acessibilidade e responsividade

Perguntas do ciclo:
- Refazer algo das regras?
- Voltar e ampliar cobertura de testes?
- Avançar para melhorias de UX?
- Dividir acessibilidade/responsividade em tarefas específicas?

---

Fluxo esperado a cada etapa:
- Refazer (correções), Voltar (ajustes anteriores), Avançar (próximo lote), Dividir (sublinhas). Marcaremos as tarefas concluídas aqui.


