# Hoplink — prospecção cervejeira

MVP web para ajudar representantes comerciais de cervejarias artesanais a encontrar, avaliar e acompanhar pontos de venda.

> **Nome de trabalho:** Hoplink é provisório. O nome pode ser trocado sem afetar a estrutura técnica.

## O que já está neste primeiro esqueleto

- Dashboard responsivo com resumo comercial, funil e oportunidades de demonstração.
- Busca demonstrativa por cidade, raio e categorias.
- Filtro de oportunidades e avanço visual de etapa.
- Base de dados inicial preparada para organizações, membros, cervejarias, prospects e atividades.
- Políticas RLS para separar registros entre organizações.
- Exemplo de variáveis de ambiente sem credenciais reais.

Os dados da tela são **de demonstração**. A busca não consulta ainda Econodata, Google Places ou outra fonte; o próximo passo é escolher o fornecedor, confirmar licença/armazenamento e conectar a integração.

## Stack

- Next.js + React + TypeScript
- Supabase Auth + Postgres (quando conectado)
- Vercel para hospedagem

## Executar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`.

## Próximas etapas

1. Escolher o nome e a identidade visual finais.
2. Criar o projeto Supabase e aplicar a migração em `supabase/migrations/`.
3. Implementar cadastro/login e onboarding de organização por fluxo confiável.
4. Substituir os dados demonstrativos pela leitura e gravação no Supabase.
5. Validar a Econodata (ou fornecedor alternativo), incluindo autorização para persistir os dados no CRM.
6. Integrar a IA para classificar evidências públicas de cerveja artesanal, sempre salvando fonte e data.
7. Publicar em repositório GitHub e conectar à Vercel.

## Segurança

- Nunca colocar chaves secretas em variáveis `NEXT_PUBLIC_*`.
- Não publicar `.env.local`.
- Manter RLS ativa em todas as tabelas acessíveis pela aplicação.
- Criar organizações e membros por onboarding controlado; não liberar auto associação a qualquer organização.
