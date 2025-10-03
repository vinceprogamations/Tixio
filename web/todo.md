# Plano Iterativo — Plataforma de Eventos e Ingressos

Guia de execução com ciclos: Refazer, Voltar, Avançar, Dividir em lotes.
Cada lote possui tarefas com checkboxes para acompanhamento.

## Lote 0 — Fundações ✅ CONCLUÍDO
- [x] Scaffold Next.js + Firebase
- [x] Autenticação: login/registro (pessoa/empresa)
- [x] Dashboard empresa: perfil, criar eventos, listar/editar
- [x] Lista pública de eventos e página de detalhes com compra

## Lote 1 — Modelo de Evento e CRUD completo (Empresa) ✅ CONCLUÍDO
- [x] Definir esquema do evento (categoria, descrição, local, data/hora, preço, capacidade, imagens)
- [x] Atualizar formulários de criação/edição (incl. categoria, descrição, capacidade, imagens)
- [x] Validações de formulário (campos obrigatórios, ranges, datas)
- [x] Exibição de status (ativo/inativo, esgotado)
- [x] Slug/ID amigável (opcional)

## Lote 2 — Explorar público e filtros ✅ CONCLUÍDO
- [x] Grid/Cards de eventos com paginação/scroll
- [x] Filtros: categoria, faixa de preço, data (intervalo), cidade/local
- [x] Ordenações: mais recentes, preço, data
- [x] Barra de busca por texto (nome/descrição)
- [x] Ajustar indexação no Firestore conforme necessário

## Lote 3 — Compra, ingressos e dashboard do usuário ✅ CONCLUÍDO
- [x] Modelo de ingressos do usuário (coleção `tickets` ou subcoleções)
- [x] Fluxo de compra com quantidade, checagem de estoque e transação
- [x] Comprovante/QR Code (geração e exibição)
- [x] Dashboard do usuário: histórico de compras, ingressos ativos, re-download
- [x] Política de reembolso/cancelamento (definição inicial)

## Lote 4 — Relatórios e analytics (Empresa) ✅ CONCLUÍDO
- [x] Visão geral de vendas por evento (faturamento, vendidos, restantes)
- [x] Curva de vendas (séries temporais)
- [x] Exportações (CSV)
- [x] Integração com ferramentas externas (opcional)

## Lote 5 — Operações e qualidade ✅ CONCLUÍDO
- [x] Regras de segurança Firestore (empresas editam só seus eventos; usuários só compram; etc.)
- [x] Testes mínimos de integração (compra, criação/edição evento)
- [x] Tratamento de erros e mensagens consistentes
- [x] Acessibilidade e responsividade

---

Fluxo esperado a cada etapa:
- Refazer (correções), Voltar (ajustes anteriores), Avançar (próximo lote), Dividir (sublinhas). Marcaremos as tarefas concluídas aqui.


