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

const benefits = [
  { title: "Busca por perfil e localização", text: "Pesquise bares, restaurantes, empórios e outros estabelecimentos na cidade que você atende.", icon: MapPin },
  { title: "Informações reunidas", text: "Visualize os dados empresariais disponíveis, como nome, localização e contato, em uma lista clara.", icon: Building2 },
  { title: "Funil para acompanhar", text: "Registre oportunidades e organize a evolução do contato em etapas comerciais.", icon: Workflow },
];

export default function LandingPage() {
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
        <div className="hero-visual" aria-label="Prévia ilustrativa da plataforma">
          <div className="visual-glow" />
          <div className="visual-card">
            <div className="visual-top"><div><span className="visual-kicker">RADAR DE OPORTUNIDADES</span><h2>Uma nova rota começa aqui.</h2></div><span className="visual-icon"><Sparkles size={19}/></span></div>
            <div className="visual-search"><MapPin size={17}/><span>São Carlos, SP</span><span className="visual-search-tag">Região</span></div>
            <div className="visual-chips"><span className="visual-chip active"><Check size={13}/> Bares</span><span className="visual-chip active"><Check size={13}/> Restaurantes</span><span className="visual-chip">Empórios</span></div>
            <div className="visual-list-label">OPORTUNIDADES PARA REVISAR <span>PRÉVIA</span></div>
            <div className="visual-lead"><span className="visual-store"><Store size={17}/></span><span><b>Seu próximo cliente</b><small>Bar · São Carlos, SP</small></span><span className="visual-lead-arrow"><ArrowUpRight size={15}/></span></div>
            <div className="visual-lead"><span className="visual-store amber"><Store size={17}/></span><span><b>Um novo ponto de venda</b><small>Restaurante · região escolhida</small></span><span className="visual-lead-arrow"><ArrowUpRight size={15}/></span></div>
            <div className="visual-bottom"><span className="visual-pulse"/> Organize sua busca e avance no seu ritmo</div>
          </div>
          <div className="floating-note"><span><Check size={16}/></span><div><b>Prospecção organizada</b><small>Da descoberta ao acompanhamento</small></div></div>
        </div>
      </section>

      <div className="marketing-ribbon"><span>FEITO PARA QUEM LEVA BOAS CERVEJAS A NOVOS LUGARES</span><i>✳</i><span>BUSCA POR CIDADE E CATEGORIA</span><i>✳</i><span>OPORTUNIDADES EM UM SÓ LUGAR</span></div>

      <section className="marketing-how" id="como-funciona">
        <div className="marketing-section-heading"><div className="marketing-eyebrow"><span/> SIMPLES DE COMEÇAR</div><h2>Da região escolhida<br/>à próxima conversa.</h2><p>Um fluxo direto para encontrar estabelecimentos e organizar o trabalho comercial.</p></div>
        <div className="steps-grid">{steps.map(({number,title,text,icon:Icon})=><article className="step-card" key={number}><div className="step-top"><span>{number}</span><Icon size={21}/></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="marketing-features" id="recursos">
        <div className="features-intro"><div className="marketing-eyebrow"><span/> SUA PROSPECÇÃO, MAIS CLARA</div><h2>Menos tempo procurando.<br/><em>Mais foco nas relações.</em></h2><p>O Hoplink ajuda representantes e cervejarias a transformar uma busca por região em uma rotina comercial mais organizada.</p><Link href="/app" className="feature-link">Conhecer a plataforma <ArrowUpRight size={16}/></Link></div>
        <div className="feature-list">{benefits.map(({title,text,icon:Icon})=><article className="feature-item" key={title}><span className="feature-icon"><Icon size={19}/></span><div><h3>{title}</h3><p>{text}</p></div><ArrowRight size={17} className="feature-arrow"/></article>)}</div>
      </section>

      <section className="marketing-cta"><div className="cta-decoration">✳</div><div className="marketing-eyebrow"><span/> SEU PRÓXIMO PASSO</div><h2>Comece pela sua próxima região.</h2><p>Acesse o painel, escolha onde prospectar e veja como o fluxo funciona.</p><Link href="/app" className="hero-primary">Abrir o Hoplink <ArrowRight size={18}/></Link><small>Os dados de endereço e contato dependem das informações disponíveis no cadastro consultado.</small></section>
      <footer className="marketing-footer"><Link href="/" className="marketing-brand"><span className="brand-mark"><span/></span><span>hoplink<span className="brand-dot">.</span><small>INTELIGÊNCIA COMERCIAL</small></span></Link><span>Prospecção cervejeira com mais clareza.</span><Link href="/app">Acessar plataforma <ArrowUpRight size={14}/></Link></footer>
    </main>
  );
}
