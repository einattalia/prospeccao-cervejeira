"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight, Bell, Building2, CalendarDays, Check, ChevronDown,
  CircleHelp, Clock3, Filter, MapPin, Menu, MoreHorizontal, Plus, Search,
  SlidersHorizontal, Sparkles, Store, Users, X,
} from "lucide-react";
import { ECONODATA_CATEGORIES, type EconodataProspect, type EconodataCategory } from "@/lib/econodata/types";

type Prospect = {
  id: number;
  name: string;
  category: string;
  neighborhood: string;
  status: string;
  signal: "Encontrado" | "Sem evidência" | "Confirmar";
  source: string;
  date: string;
  initials: string;
  tone: string;
};

const initialProspects: Prospect[] = [
  { id: 1, name: "Armazém São Bento", category: "Empório", neighborhood: "Centro · São Carlos", status: "Novo lead", signal: "Encontrado", source: "Cardápio online", date: "há 2 dias", initials: "SB", tone: "mint" },
  { id: 2, name: "Cervejaria do Lago", category: "Bar e restaurante", neighborhood: "Jardim Alvorada · São Carlos", status: "Contato feito", signal: "Encontrado", source: "Instagram", date: "há 3 dias", initials: "CL", tone: "peach" },
  { id: 3, name: "Mercado Estação", category: "Mercado premium", neighborhood: "Vila Prado · São Carlos", status: "Visita marcada", signal: "Confirmar", source: "Ainda não verificado", date: "há 4 dias", initials: "ME", tone: "lavender" },
  { id: 4, name: "Quintal 27", category: "Bar", neighborhood: "Santa Paula · São Carlos", status: "Proposta enviada", signal: "Encontrado", source: "Site do local", date: "há 5 dias", initials: "Q27", tone: "blue" },
  { id: 5, name: "Empório da Praça", category: "Empório", neighborhood: "Centro · Ibaté", status: "Novo lead", signal: "Sem evidência", source: "Nenhuma fonte encontrada", date: "há 6 dias", initials: "EP", tone: "yellow" },
];

const stages = ["Novo lead", "Contato feito", "Visita marcada", "Proposta enviada", "Cliente ativo"];
const navItems = [
  { label: "Visão geral", icon: Store, active: true },
  { label: "Oportunidades", icon: Building2, count: "24" },
  { label: "Mapa de busca", icon: MapPin },
  { label: "Agenda", icon: CalendarDays, count: "3" },
];

function IconButton({ children, label }: { children: React.ReactNode; label: string }) {
  return <button className="icon-button" aria-label={label}>{children}</button>;
}

export default function Home() {
  const [prospects, setProspects] = useState(initialProspects);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("Todas as etapas");
  const [showSearch, setShowSearch] = useState(false);
  const [city, setCity] = useState("São Carlos, SP");
  const [categories, setCategories] = useState<EconodataCategory[]>(["bars", "restaurants"]);
  const [discovered, setDiscovered] = useState<EconodataProspect[]>([]);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => prospects.filter((p) => {
    const matchesQuery = `${p.name} ${p.category} ${p.neighborhood}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (stageFilter === "Todas as etapas" || p.status === stageFilter);
  }), [prospects, query, stageFilter]);

  async function runDiscovery() {
    const parts = city.split(",").map((part) => part.trim());
    if (parts.length < 2 || !parts[0] || !/^[A-Za-z]{2}$/.test(parts[1]) || categories.length === 0) {
      setSearchError("Informe a cidade e a UF (por exemplo, São Carlos, SP) e selecione ao menos uma categoria.");
      return;
    }
    setSearching(true);
    setSearchError("");
    try {
      const response = await fetch("/api/prospects/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: parts[0], state: parts[1], categories }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível concluir a busca.");
      setDiscovered(data.prospects ?? []);
      setSearchError(data.prospects?.length ? "" : "A Econodata respondeu, mas não encontramos empresas para estes filtros.");
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "Falha ao consultar a Econodata.");
    } finally {
      setSearching(false);
    }
  }

  function toggleCategory(category: EconodataCategory) {
    setCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
  }

  function addDiscovered(prospect: EconodataProspect) {
    setProspects((current) => current.some((item) => item.name.toLowerCase() === prospect.name.toLowerCase()) ? current : [{
      id: Date.now(), name: prospect.name, category: prospect.category, neighborhood: [prospect.neighborhood, prospect.city].filter(Boolean).join(" · "), status: "Novo lead", signal: "Confirmar", source: "Cadastro Econodata", date: "agora", initials: prospect.name.slice(0, 2).toUpperCase(), tone: "mint",
    }, ...current]);
    setNotice(`${prospect.name} adicionado às oportunidades para qualificação.`);
  }

  function advanceProspect(id: number) {
    setProspects((current) => current.map((p) => {
      if (p.id !== id) return p;
      const index = stages.indexOf(p.status);
      const next = stages[Math.min(index + 1, stages.length - 1)];
      return { ...p, status: next };
    }));
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="Hoplink início">
          <span className="brand-mark"><span /></span>
          <span className="brand-name">hoplink<span>.</span><small>INTELIGÊNCIA COMERCIAL</small></span>
        </a>
        <div className="workspace-switch">
          <div className="workspace-avatar">D</div>
          <div className="workspace-copy"><strong>Diegão Comercial</strong><span>Plano piloto</span></div>
          <ChevronDown size={15} />
        </div>
        <div className="nav-label">MENU PRINCIPAL</div>
        <nav className="main-nav" aria-label="Navegação principal">
          {navItems.map(({ label, icon: Icon, count, active }) => (
            <button key={label} className={`nav-link ${active ? "active" : ""}`} onClick={() => setNotice(`${label}: seção do MVP em estruturação.`)}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{count && <b>{count}</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="brewery-mini"><div className="brewery-icon">✳</div><div><strong>Representações</strong><span>3 cervejarias</span></div><button aria-label="Abrir representações"><Plus size={16} /></button></div>
          <button className="nav-link muted"><CircleHelp size={18} /><span>Ajuda e suporte</span></button>
          <div className="profile-row"><div className="profile-photo">D</div><div><strong>Diegão</strong><span>Administrador</span></div><MoreHorizontal size={19} /></div>
        </div>
      </aside>

      <section className="main-area" id="top">
        <header className="topbar"><button className="mobile-menu" aria-label="Abrir menu"><Menu size={20} /></button><div className="breadcrumb">Workspace <span>/</span> <strong>Visão geral</strong></div><div className="topbar-actions"><span className="today-label">Domingo, 8 de novembro</span><IconButton label="Notificações"><Bell size={18} /></IconButton><div className="top-avatar">D</div></div></header>
        <div className="content-wrap">
          {notice && <div className="notice"><Sparkles size={16} />{notice}<button onClick={() => setNotice("")} aria-label="Fechar aviso"><X size={16} /></button></div>}
          <div className="welcome-row"><div><div className="eyebrow"><span className="pulse-dot" />DOMINGO, 8 DE NOVEMBRO DE 2026</div><h1>Bom dia, Diegão <span>✳</span></h1><p>Aqui está o resumo da sua prospecção. Bora abrir novos pontos?</p></div><button className="primary-button" onClick={() => setShowSearch(true)}><Plus size={17} /> Buscar oportunidades</button></div>

          <div className="stats-grid">
            <article className="stat-card"><div className="stat-top"><span>Oportunidades no radar</span><div className="stat-icon soft-purple"><Users size={18} /></div></div><div className="stat-value">24 <span className="trend positive"><ArrowUpRight size={14} /> 12%</span></div><div className="stat-foot">em <b>3 cidades</b> atendidas</div><div className="mini-bars"><i style={{height:"35%"}}/><i style={{height:"54%"}}/><i style={{height:"42%"}}/><i style={{height:"69%"}}/><i style={{height:"48%"}}/><i style={{height:"78%"}}/><i style={{height:"100%"}}/></div></article>
            <article className="stat-card"><div className="stat-top"><span>Contatos em andamento</span><div className="stat-icon soft-blue"><ArrowUpRight size={18} /></div></div><div className="stat-value">08 <span className="trend positive"><ArrowUpRight size={14} /> 2 novos</span></div><div className="stat-foot">leads que precisam de <b>acompanhamento</b></div><div className="progress-line"><span style={{width:"58%"}}/></div><div className="progress-caption"><span>Meta mensal</span><b>8 de 14</b></div></article>
            <article className="stat-card"><div className="stat-top"><span>Visitas esta semana</span><div className="stat-icon soft-orange"><CalendarDays size={18} /></div></div><div className="stat-value">03 <span className="trend neutral"><Clock3 size={13} /> próximas</span></div><div className="stat-foot">A próxima é amanhã, às <b>14h</b></div><div className="visit-avatars"><span>AS</span><span>CL</span><span>+1</span><small>locais na agenda</small></div></article>
            <article className="ai-card"><div className="ai-orb"><Sparkles size={20} /></div><div className="ai-tag">RADAR HOPLINK</div><h3>Uma oportunidade<br/>pode estar passando.</h3><p>Há <b>6 estabelecimentos</b> novos na região para você analisar.</p><button onClick={() => setShowSearch(true)}>Ver oportunidades <ArrowUpRight size={15} /></button><span className="ai-decoration">✳</span></article>
          </div>

          <section className="pipeline-section"><div className="section-heading"><div><h2>Seu funil comercial</h2><p>Acompanhe cada oportunidade, da descoberta ao primeiro pedido.</p></div><button className="text-button" onClick={() => setNotice("Visão completa do funil será incluída na próxima etapa.")}>Ver funil completo <ArrowUpRight size={15} /></button></div>
            <div className="pipeline-grid">{stages.map((stage, i) => { const amount = prospects.filter((p) => p.status === stage).length; return <button className={`pipeline-column ${i === 0 ? "highlight-column" : ""}`} key={stage} onClick={() => setStageFilter(stageFilter === stage ? "Todas as etapas" : stage)}><span className="pipeline-dot" data-stage={i}/><span className="pipeline-label">{stage}</span><b>{String(amount).padStart(2,"0")}</b><div className="pipeline-track"><span style={{width:`${Math.max(amount * 30, 12)}%`}} data-stage={i}/></div></button>; })}</div>
          </section>

          <section className="leads-section"><div className="section-heading leads-heading"><div><h2>Oportunidades recentes</h2><p>Os estabelecimentos que merecem sua atenção agora.</p></div><button className="secondary-button" onClick={() => setNotice("Cadastro manual de oportunidade será disponibilizado na próxima etapa.")}><Plus size={16} /> Adicionar lead</button></div>
            <div className="table-tools"><div className="search-box"><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar estabelecimento..." /></div><label className="filter-box"><Filter size={15}/><select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}><option>Todas as etapas</option>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select><ChevronDown size={14}/></label><button className="filter-more" onClick={() => setNotice("Filtros por cidade, categoria e evidência serão adicionados junto à busca.")}><SlidersHorizontal size={16}/><span>Filtros</span></button></div>
            <div className="table-wrap"><table><thead><tr><th>ESTABELECIMENTO</th><th>ETAPA</th><th>INDÍCIO ARTESANAL</th><th>ÚLTIMA ATIVIDADE</th><th><span className="sr-only">Ações</span></th></tr></thead><tbody>{filtered.map((p) => <tr key={p.id}><td><div className="business-cell"><div className={`business-avatar ${p.tone}`}>{p.initials}</div><div><strong>{p.name}</strong><span>{p.category} <i>·</i> {p.neighborhood}</span></div></div></td><td><span className={`status-pill ${p.status.toLowerCase().replaceAll(" ","-")}`}><i/>{p.status}</span></td><td><div className={`signal-cell ${p.signal === "Encontrado" ? "signal-found" : p.signal === "Confirmar" ? "signal-check" : "signal-none"}`}><span>{p.signal === "Encontrado" ? <Check size={13}/> : p.signal === "Confirmar" ? <Search size={13}/> : <span className="dash">–</span>}</span><div><b>{p.signal}</b><small>{p.source}</small></div></div></td><td><span className="activity-date">{p.date}</span></td><td><button className="row-action" title="Avançar oportunidade" onClick={() => advanceProspect(p.id)}><ArrowUpRight size={17}/></button></td></tr>)}{filtered.length === 0 && <tr><td colSpan={5} className="empty-state">Nenhuma oportunidade encontrada para este filtro.</td></tr>}</tbody></table></div>
            <div className="table-footer"><span>Exibindo <b>{filtered.length}</b> de <b>{prospects.length}</b> oportunidades</span><button onClick={() => setNotice("A lista completa de oportunidades será exibida nesta seção.")}>Ver todas <ArrowUpRight size={14}/></button></div>
          </section>
          <footer className="footer-note"><span>✳</span> Feito para quem leva boas cervejas a novos lugares.</footer>
        </div>
      </section>

      {showSearch && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowSearch(false); }}><section className="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-title"><button className="modal-close" onClick={() => setShowSearch(false)} aria-label="Fechar"><X size={18}/></button><div className="modal-icon"><MapPin size={21}/></div><div className="modal-kicker">RADAR DE OPORTUNIDADES</div><h2 id="search-title">Onde vamos procurar?</h2><p>Pesquise empresas por cidade e perfil. A Econodata retorna cadastros empresariais; a presença de cerveja artesanal deve ser confirmada separadamente.</p><label className="field-label" htmlFor="city">Cidade e UF</label><div className="modal-input"><MapPin size={17}/><input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex.: São Carlos, SP"/></div><label className="field-label">Tipos de estabelecimento</label><div className="category-chips">{(Object.entries(ECONODATA_CATEGORIES) as [EconodataCategory, {label: string}][]).map(([key, value]) => <button key={key} className={categories.includes(key) ? "selected" : ""} onClick={() => toggleCategory(key)}>{categories.includes(key) && <Check size={13}/>} {value.label}</button>)}</div><div className="source-note"><Sparkles size={16}/><span><b>Busca empresarial via Econodata</b><small>Busca por cidade e CNAE. A integração exige uma chave de API configurada no servidor.</small></span></div>{searchError && <div className="search-error" role="alert">{searchError}</div>}<button className="primary-button modal-submit" onClick={runDiscovery} disabled={searching}>{searching ? "Buscando empresas…" : "Buscar empresas"} {!searching && <ArrowUpRight size={16}/>}</button>{discovered.length > 0 && <div className="discovery-results"><h3>{discovered.length} empresas encontradas</h3>{discovered.map((item) => <article key={item.id}><div><b>{item.name}</b><small>{[item.category, item.city, item.state, item.phone].filter(Boolean).join(" · ")}</small></div><button onClick={() => addDiscovered(item)}>Adicionar lead</button></article>)}</div>}</section></div>}
    </main>
  );
}
