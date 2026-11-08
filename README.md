# Hoplink — prospecção cervejeira

MVP web para ajudar representantes comerciais de cervejarias artesanais a encontrar, avaliar e acompanhar pontos de venda.

> **Nome de trabalho:** Hoplink é provisório. O nome pode ser trocado sem afetar a estrutura técnica.

## O que já está neste primeiro esqueleto

- Dashboard responsivo com resumo comercial, funil e oportunidades de demonstração.
- Busca de empresas via API V4 da Econodata por cidade/UF e categorias CNAE (requer chave configurada).
- Inclusão manual dos resultados encontrados no funil de oportunidades.
- Filtro de oportunidades e avanço visual de etapa.
- Base de dados inicial preparada para organizações, membros, cervejarias, prospects e atividades.
- Políticas RLS para separar registros entre organizações.
- Exemplo de variáveis de ambiente sem credenciais reais.

Os indicadores e leads iniciais da tela são **de demonstração**. A integração de busca da Econodata está preparada, mas só retorna resultados depois da configuração de uma chave válida. A busca empresarial não confirma por si só que o estabelecimento vende cerveja artesanal; essa evidência precisa ser pesquisada e revisada à parte.

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

### Configurar a Econodata

1. Na conta Econodata, abra **Integrações & API v4** e crie uma chave com escopo de leitura.
2. No arquivo `.env.local`, preencha `ECONODATA_API_KEY` com a chave. Não use prefixo `NEXT_PUBLIC_` e não envie a chave ao GitHub.
3. Reinicie `npm run dev`, abra **Buscar oportunidades** e informe `Cidade, UF`, por exemplo `São Carlos, SP`.
4. Escolha as categorias e clique em **Buscar empresas**. Revise os resultados e adicione os leads desejados.

Para hospedar, configure a chave como variável de ambiente **server-side** no provedor de hospedagem. A busca em produção também exige Supabase Auth configurado e usuário autenticado. A chamada retorna até 25 resultados nesta primeira versão; o limite não representa a cobertura total da cidade.

O uso da API consome tokens conforme campos/buckets solicitados. A Econodata informa oferta de trial limitado; confirme saldo, preço, limites e autorização para persistir e revender os dados antes de uso comercial.

## Próximas etapas

1. Escolher o nome e a identidade visual finais.
2. Criar o projeto Supabase e aplicar a migração em `supabase/migrations/`.
3. Implementar cadastro/login e onboarding de organização por fluxo confiável.
4. Substituir os dados demonstrativos pela leitura e gravação no Supabase.
5. Validar a cobertura e o contrato da Econodata, incluindo autorização para persistir e oferecer os dados no CRM.
6. Integrar a IA para classificar evidências públicas de cerveja artesanal, sempre salvando fonte e data.
7. Conectar o repositório à Vercel e preparar o primeiro deploy.

## Segurança

- Nunca colocar chaves secretas em variáveis `NEXT_PUBLIC_*`.
- Não publicar `.env.local`.
- Manter RLS ativa em todas as tabelas acessíveis pela aplicação.
- Criar organizações e membros por onboarding controlado; não liberar auto associação a qualquer organização.

