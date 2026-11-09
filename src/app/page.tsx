import Link from "next/link";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Building2, Check, MapPin,
  Search, Sparkles, Store, Workflow,
} from "lucide-react";

const steps = [
  { number: "01", title: "Escolha sua região", text: "Defina cidade, estado e os tipos de estabelecimento que fazem sentido para sua operação.", icon: MapPin },
  { number: "02", title: "Encontre novos pontos", text: "Consulte empresas pela integração com a Econodata e revise os dados disponíveis de cada cadastro.", icon: Search },
  { number: "03", title: "Organize sua prospecção", text: "Adicione os estabelecimentos ao funil e acompanhe os próximos passos comerciais.", icon: Workflow },
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
    <main className="marketing-site">
      <header className="marketing-header">
        <Link href="/" className="marketing-brand" aria-label="Hoplink início">
          <span className="brand-mark"><span /></span>
          <span>hoplink<span className="brand-dot">.</span><small>INTELIGÊNCIA COMERCIAL</small></span>
        </Link>
        <nav className="marketing-nav" aria-label="Navegação principal">
          <a href="#como-funciona">Como funciona</a>
          <a href="#recursos">Recursos</a>
          <a href="#sobre">Sobre a plataforma</a>
        </nav>
        <Link className="marketing-login" href="/app">Acessar plataforma <ArrowUpRight size={16} /></Link>
      </header>

      <section className="marketing-hero" id="sobre">
        <div className="hero-copy">
          <div className="marketing-eyebrow"><span /> PROSPECÇÃO FEITA PARA O MERCADO CERVEJEIRO</div>
          <h1>Encontre novos lugares para sua cerveja chegar.</h1>
          <p>Descubra bares, restaurantes e outros pontos de venda por cidade. Reúna as oportunidades e acompanhe sua prospecção em um só lugar.</p>
          <div className="hero-actions">
            <Link className="hero-primary" href="/app">Acessar o app <ArrowRight size={18}/></Link>
            <a className="hero-secondary" href="#como-funciona"><span><ArrowDown size={15}/></span> Entenda como funciona</a>
          </div>
          <div className="hero-footnote"><Check size={15}/> Busca empresarial integrada à Econodata</div>
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
          <div className="floating-note"><span><Check size={16}/></span><div><b>Prospecção organizada</b><small>Da descoberta ao acompanhamento</small></div></div>
        </div>
      </section>

      {showSearch && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowSearch(false); }}><section className="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-title"><button className="modal-close" onClick={() => setShowSearch(false)} aria-label="Fechar"><X size={18}/></button><div className="modal-icon"><MapPin size={21}/></div><div className="modal-kicker">RADAR DE OPORTUNIDADES</div><h2 id="search-title">Onde vamos procurar?</h2><p>Pesquise empresas por cidade e perfil. A Econodata retorna cadastros empresariais; a presença de cerveja artesanal deve ser confirmada separadamente.</p><label className="field-label" htmlFor="city">Cidade e UF</label><div className="modal-input"><MapPin size={17}/><input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex.: São Carlos, SP"/></div><label className="field-label">Tipos de estabelecimento</label><div className="category-chips">{(Object.entries(ECONODATA_CATEGORIES) as [EconodataCategory, {label: string}][]).map(([key, value]) => <button key={key} className={categories.includes(key) ? "selected" : ""} onClick={() => toggleCategory(key)}>{categories.includes(key) && <Check size={13}/>} {value.label}</button>)}</div><div className="source-note"><Sparkles size={16}/><span><b>Busca empresarial via Econodata</b><small>Busca por cidade e CNAE. A integração exige uma chave de API configurada no servidor.</small></span></div>{searchError && <div className="search-error" role="alert">{searchError}</div>}<button className="primary-button modal-submit" onClick={runDiscovery} disabled={searching}>{searching ? "Buscando empresas…" : "Buscar empresas"} {!searching && <ArrowUpRight size={16}/>}</button>{discovered.length > 0 && <div className="discovery-results"><h3>{discovered.length} empresas encontradas</h3>{discovered.map((item) => <article key={item.id}><div><b>{item.name}</b><small>{[item.category, item.city, item.state, item.phone].filter(Boolean).join(" · ")}</small></div><button onClick={() => addDiscovered(item)}>Adicionar lead</button></article>)}</div>}</section></div>}
    </main>
  );
}
