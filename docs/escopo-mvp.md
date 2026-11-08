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

1. Escolher cidade/UF e categorias de estabelecimento.
2. Consultar a API Econodata V4 por filtros geográficos e CNAE.
3. Revisar os candidatos e evitar duplicidades antes de adicioná-los ao funil.
4. Pesquisar separadamente evidências públicas de cerveja artesanal.
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

Antes do uso comercial, validar cobertura em São Carlos, categorias e campos retornados, preço por consulta, atualização, limites de uso e permissão expressa para salvar os dados no CRM e oferecer o app comercialmente. A integração inicial consulta no servidor e mantém a chave fora do navegador. Em produção, a rota exige configuração de Supabase Auth e sessão autenticada.
