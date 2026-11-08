# Escopo do MVP

## Objetivo

Dar ao representante comercial de cervejarias uma forma prática de descobrir pontos de venda, avaliar sinais públicos de cerveja artesanal e acompanhar a prospecção.

## Perfis e separação

- **Organização:** a conta comercial de um representante ou operação.
- **Membros:** proprietário, administrador e representante.
- **Cervejarias representadas:** marcas e informações básicas de cobertura.
- **Oportunidades:** estabelecimentos e seu histórico comercial.

Todos os registros de negócio pertencem a uma organização. A migração inicial usa RLS no banco para que uma conta não leia ou altere registros de outra. A criação de organizações e convites de membros deve passar por um fluxo confiável no servidor.

## Fluxo principal

1. Escolher cidade/região, raio e categorias de estabelecimento.
2. Consultar uma fonte de dados comerciais aprovada para uso e armazenamento no CRM.
3. Revisar os candidatos e evitar duplicidades.
4. Pesquisar evidências públicas de cerveja artesanal.
5. Registrar o resultado como **Encontrado**, **Não encontrado** ou **Precisa confirmar**, sempre com URL e data quando houver fonte.
6. Fazer contato, agendar visita, enviar proposta e acompanhar o resultado.

“Não encontrado” significa que a busca não achou evidência; não significa que o local não venda cerveja artesanal.

## Fora do primeiro piloto

- Cobrança e planos SaaS.
- Importação em massa ou enriquecimento automático sem fornecedor contratado.
- Envio automático de mensagens ou prospecção sem revisão do representante.
- Garantia de que a busca lista todos os estabelecimentos da região.
- Integração automática com WhatsApp.

## Critério para escolher a fonte

Antes de integrar um fornecedor, validar cobertura em São Carlos, categorias e campos retornados, preço por consulta, atualização, limites de uso e permissão expressa para salvar os dados no CRM e oferecer o app comercialmente.
