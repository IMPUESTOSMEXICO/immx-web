/**
 * ══════════════════════════════════════════════════════════════════════════
 * IMPUESTOS MÉXICO — Sitio Web Completo (Single-File Application)
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Versión:    2.0 — Release Candidate
 * Fecha:      08 de marzo de 2026
 * Stack:      React 18+ (JSX, hooks, CSS-in-JS inline styles)
 * Fonts:      Cormorant Garamond (display) + DM Sans (cuerpo) — Google Fonts
 * Routing:    Sistema de rutas por estado (currentPage) — sin dependencias externas
 * DB:         Supabase (opcional, para Horizontes) — fallback a datos estáticos
 *
 * ══════════════════════════════════════════════════════════════════════════
 * MAPA COMPLETO DE PÁGINAS Y RUTAS
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  currentPage          Página                    Componentes renderizados
 *  ────────────────────────────────────────────────────────────────────────
 *  null                 Landing (Home)            Navbar → Hero → Services → Sectors
 *                                                 → Horizons → About → Contact → Footer
 *
 *  "consultoria-fiscal" Consultoría Fiscal        ServiceNavbar → ServiceHero →
 *  "auditoria-assurance" Auditoría & Assurance    ServicePracticeAreas → ServiceMethodology
 *  "asesoria-legal"     Asesoría Legal            → ServiceSectors → ServiceInsights
 *  "consultoria-negocios" Consultoría de Negocios → ServiceContact → Footer
 *  "precios-transferencia" Precios de Transferencia
 *
 *  "legales"            Legales                   ServiceNavbar → LegalContent → Footer
 *
 *  "horizontes-page"    Horizontes (Biblioteca)   ServiceNavbar → HorizontesHero
 *                                                 → Biblioteca → Footer
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ÍNDICE DE SECCIONES DEL ARCHIVO
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  LÍNEA   SECCIÓN                         DESCRIPCIÓN
 *  ──────  ──────────────────────────────  ──────────────────────────────
 *  §1      DATOS GLOBALES                  SECTIONS, SERVICES, SECTORS,
 *                                          INSIGHTS, B (tokens de diseño)
 *  §2      HOOK: useInView                 IntersectionObserver one-shot
 *  §3      LANDING: Navbar                 Barra fija, logo animado, scroll-spy
 *  §4      LANDING: Hero                   Banner imagen + CTAs
 *  §5      LANDING: Services               Grid tarjetas con hover → página
 *  §6      LANDING: Sectors                Grid industrias con CTAs
 *  §7      LANDING: Horizons               Carrusel publicaciones (6s auto)
 *  §8      LANDING: About (IMMX)           2 columnas: texto + grid valores
 *  §9      LANDING: Contact                Formulario + datos contacto
 *  §10     LEGALES: Datos + Contenido      E, LEGAL_TABS, LS, 4 tabs legales
 *  §11     HORIZONTES: Datos + Biblioteca  LIBRARY, TAG_COLORS, Supabase,
 *                                          HorizontesHero, Biblioteca
 *  §12     FOOTER                          Marca, links funcionales, legales
 *  §13     SERVICE PAGES: Configs          PAGE_CONFIGS (5 servicios)
 *  §14     SERVICE PAGES: Componentes      ServiceHero, ServicePracticeAreas,
 *                                          ServiceMethodology, ServiceSectors,
 *                                          ServiceInsights, ServiceContact
 *  §15     SERVICE NAVBAR                  Navbar compartido páginas internas
 *  §16     APP ROOT                        Router, scroll-spy, estilos globales
 *
 * ══════════════════════════════════════════════════════════════════════════
 * SISTEMA DE DISEÑO
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Paleta:        Navy (#002244) dominante, blanco como acento.
 *                 Sand (#F7F3EE) para fondos claros (Horizontes).
 *  Tokens:        Centralizados en objeto B (Brand).
 *  Tipografía:    Cormorant Garamond → títulos (serif, elegancia).
 *                 DM Sans → cuerpo, labels, tags (sans, legibilidad).
 *  Transiciones:  cubic-bezier(0.4,0,0.2,1) → movimiento natural.
 *                 cubic-bezier(0.16,1,0.3,1) → entradas tipo spring.
 *  Animaciones:   Controladas por useInView (IntersectionObserver).
 *                 One-shot: se activan al entrar al viewport.
 *  Responsive:    Breakpoint 900px → menú hamburguesa.
 *                 Breakpoint 600px → padding reducido.
 *                 Grids colapsan a 1 columna vía media query.
 *  maxWidth:      1320px contenedor principal.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * PARA EDITAR CONTENIDO
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  → Servicios landing:    Modifica el arreglo SERVICES
 *  → Sectores landing:     Modifica el arreglo SECTORS
 *  → Publicaciones landing: Modifica el arreglo INSIGHTS
 *  → Colores globales:     Modifica el objeto B
 *  → Imagen hero:          Modifica HERO_CONFIG
 *  → Páginas de servicio:  Modifica PAGE_CONFIGS[ruta]
 *  → Publicaciones Horizontes: Modifica LIBRARY o conecta Supabase
 *  → Contenido legal:      Modifica los componentes §10
 *  → Datos corporativos:   Modifica el objeto E
 *
 * PARA DEPLOYMENT:
 *   Ver documentación técnica: documentacion-tecnica-immx.md
 * ══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef, createContext, useContext } from "react";

/* ════════════════════════════════════════════════════════════════════════════
   SISTEMA DE TRADUCCIÓN (ES/EN)
   ══════════════════════════════════════════════════════════════════════════════
   Context + hook para idioma. Todos los componentes acceden al idioma vía useLang().
   Las traducciones se centralizan en el objeto T.
   ════════════════════════════════════════════════════════════════════════════ */
const LangContext = createContext("es");
function useLang() { return useContext(LangContext); }

/** Helper: retorna texto según idioma actual */
function t(obj, lang) { return (obj && obj[lang]) || obj?.es || ""; }

/** TRADUCCIONES GLOBALES */
const T = {
  nav: {
    servicios: { es: "Servicios", en: "Services" },
    sectores: { es: "Sectores", en: "Industries" },
    horizontes: { es: "Horizontes", en: "Insights" },
    nosotros: { es: "Conozca IMMX", en: "About IMMX" },
    contacto: { es: "Contacto", en: "Contact" },
  },
  hero: {
    title1: { es: "Soluciones que", en: "Forward" },
    title2: { es: "transforman empresas", en: "leading solutions" },
    subtitle: { es: "Asesoría tributaria, legal y de negocios de alto nivel para empresas que exigen excelencia, rigor técnico y visión de largo plazo.", en: "Tax, legal and business advisory for organizations that demand precision, integrity and lasting impact." },
    cta: { es: "Nuestros Servicios", en: "Our Services" },
  },
  services: {
    label: { es: "Servicios", en: "Services" },
    h2Line1: { es: "Práctica multidisciplinaria", en: "A multidisciplinary practice" },
    h2Line2: { es: "de alto nivel", en: "built for complexity" },
    verMas: { es: "Ver más", en: "Learn more" },
    titles: {
      "Consultoría Fiscal": { en: "Tax Advisory" },
      "Auditoría & Assurance": { en: "Audit & Assurance" },
      "Asesoría Legal": { en: "Legal Advisory" },
      "Consultoría de Negocios": { en: "Business Consulting" },
      "Precios de Transferencia": { en: "Transfer Pricing" },
    },
    descs: {
      "Consultoría Fiscal": { en: "Navigating Mexico's tax landscape requires more than compliance — it demands foresight. We bring clarity to complex domestic and cross-border obligations so you can act decisively." },
      "Auditoría & Assurance": { en: "Independent assurance over financial reporting, delivered with the rigor and objectivity that stakeholders and regulators expect." },
      "Asesoría Legal": { en: "Corporate, regulatory and compliance counsel built on firsthand knowledge of how Mexico's legal framework impacts international operations." },
      "Consultoría de Negocios": { en: "From operational redesign to digital adoption, we help leadership teams turn complexity into competitive advantage — with measurable outcomes." },
      "Precios de Transferencia": { en: "Rigorous economic analysis and documentation that withstand regulatory scrutiny, protecting your intercompany structures across jurisdictions." },
    },
  },
  sectors: {
    label: { es: "Sectores de Industria", en: "Industry Focus" },
    h2Line1: { es: "Conocimiento profundo", en: "Industry" },
    h2Line2: { es: "de cada sector", en: "insight" },
    names: {
      "Manufactura e Industria": { en: "Manufacturing & Industrial" },
      "Infraestructura y Real Estate": { en: "Infrastructure & Real Estate" },
      "Retail y Consumo": { en: "Retail & Consumer" },
    },
    ctas: {
      "Manufactura e Industria": { en: "Structuring nearshoring investments for sustained fiscal efficiency →" },
      "Infraestructura y Real Estate": { en: "Aligning project structures with regulatory and fiscal frameworks →" },
      "Retail y Consumo": { en: "Strengthening value chains through integrated fiscal planning →" },
    },
  },
  horizons: {
    label: { es: "Horizontes", en: "Insights" },
    h2Line1: { es: "Liderazgo de", en: "Thought" },
    h2Line2: { es: "pensamiento", en: "leadership" },
    verTodas: { es: "Ver todas las publicaciones", en: "All publications" },
    leerMas: { es: "Leer más", en: "Read more" },
  },
  about: {
    label: { es: "Impuestos México", en: "Impuestos México" },
    h2Line1: { es: "Compromiso con la", en: "Committed to" },
    h2Accent: { es: "excelencia profesional", en: "professional excellence" },
    p1: { es: "Somos una firma multidisciplinaria que asesora a los principales grupos industriales, comerciales y financieros del país, así como a inversionistas internacionales.", en: "A multidisciplinary firm trusted by leading industrial and financial groups across Mexico, and by international investors who require local expertise with a global outlook." },
    p2: { es: "Nuestro enfoque combina profundidad técnica, conocimiento local y perspectiva global para crear valor sostenible.", en: "Technical proficiency. Local knowledge. Global perspective. That is how we create lasting value." },
    values: {
      es: [
        { icon: "✦", title: "Integridad", desc: "Ética y transparencia como pilares fundamentales de nuestra práctica." },
        { icon: "◈", title: "Excelencia", desc: "Estándares técnicos que superan las expectativas del mercado." },
        { icon: "▣", title: "Innovación", desc: "Soluciones a la vanguardia con tecnología y visión de futuro." },
        { icon: "◎", title: "Compromiso", desc: "Relaciones de largo plazo basadas en resultados y confianza." },
      ],
      en: [
        { icon: "✦", title: "Integrity", desc: "Ethical conduct and transparency in every engagement." },
        { icon: "◈", title: "Excellence", desc: "Standards that consistently exceed expectations." },
        { icon: "▣", title: "Innovation", desc: "Technology and strategic vision, applied." },
        { icon: "◎", title: "Commitment", desc: "Long-term relationships built on results." },
      ],
    },
  },
  contact: {
    label: { es: "Contacto", en: "Contact" },
    h2Line1: { es: "Agradecemos su interés", en: "Thank you for your interest" },
    h2Accent: { es: "en nuestros servicios", en: "in our services" },
    paragraph: { es: "Por favor, tome un momento para brindarnos mayor detalle sobre su requerimiento y necesidades.", en: "Please take a moment to share further details about your requirements and needs." },
    emailLabel: { es: "Correo electrónico", en: "Email" },
    formTitle: { es: "Solicitud de Propuesta", en: "Request for Proposal" },
    nombre: { es: "Nombre completo", en: "Full name" },
    empresa: { es: "Empresa", en: "Company" },
    correo: { es: "Correo electrónico", en: "Email address" },
    estado: { es: "Estado", en: "State" },
    telefono: { es: "Teléfono", en: "Phone" },
    servicio: { es: "Servicio de interés", en: "Service of interest" },
    seleccione: { es: "Seleccione un servicio", en: "Select a service" },
    enviar: { es: "Enviar solicitud", en: "Contact Us" },
    enviando: { es: "Enviando...", en: "Submitting..." },
    exito: { es: "✓ Solicitud enviada correctamente", en: "✓ Your inquiry has been received" },
    error: { es: "Error al enviar. Verifique los datos.", en: "Something went wrong. Please try again." },
    offline: { es: "Formulario no disponible temporalmente", en: "This form is temporarily unavailable" },
    rateLimited: { es: "Demasiados envíos. Intente más tarde.", en: "Too many requests. Please try later." },
  },
  footer: {
    servicios: { es: "Servicios", en: "Services" },
    firma: { es: "Firma", en: "Firm" },
    recursos: { es: "Recursos", en: "Resources" },
    quienes: { es: "Quiénes somos", en: "About us" },
    horizontes: { es: "Horizontes", en: "Insights" },
    legales: { es: "Legales", en: "Legal" },
    tagline: { es: "Firma multidisciplinaria de servicios profesionales en consultoría tributaria, legal y de negocios.", en: "Tax, legal and business advisory." },
    derechos: { es: "© 2026 Impuestos México, S.C. Todos los derechos reservados.", en: "© 2026 Impuestos México, S.C. All rights reserved." },
  },
  horizontesPage: {
    overline: { es: "Experiencias compartidas", en: "Shared experiences" },
    subtitle: { es: "Publicaciones, análisis y perspectivas del ambiente financiero y fiscal Mexicano.", en: "Publications, analysis and perspectives on the Mexican financial and tax environment." },
    newsletter: { es: "Agendar publicaciones semanales", en: "Subscribe to weekly publications" },
    suscribirse: { es: "Suscribirse →", en: "Subscribe →" },
    areasLabel: { es: "Áreas de práctica", en: "Practice areas" },
    exploreH2_1: { es: "Explore por", en: "Explore by" },
    exploreH2_2: { es: "especialidad", en: "specialty" },
    publicaciones: { es: "publicaciones", en: "publications" },
    cerrar: { es: "✕ Cerrar", en: "✕ Close" },
    leer: { es: "Leer", en: "Read" },
  },
};

/**
 * SECCIONES DE NAVEGACIÓN
 * Controla los links del navbar y el scroll-spy.
 * id: debe coincidir con el id="" del <section> correspondiente
 * label: texto visible en el menú de navegación
 */
const SECTIONS = [
  { id: "servicios", label: { es: "Servicios", en: "Services" } },
  { id: "sectores", label: { es: "Sectores", en: "Industries" } },
  { id: "horizontes", label: { es: "Horizontes", en: "Insights" } },
  { id: "nosotros", label: { es: "Conozca IMMX", en: "About IMMX" } },
  { id: "contacto", label: { es: "Contacto", en: "Contact" } },
];

/**
 * CATÁLOGO DE SERVICIOS
 * Cada entrada genera una tarjeta en la sección Servicios.
 * icon: carácter Unicode decorativo (se muestra centrado en reposo)
 * title: nombre del servicio (visible siempre)
 * desc: descripción (visible solo en hover)
 * tags: sub-servicios mostrados como badges en hover
 */
const SERVICES = [
  {
    icon: "◈",
    title: "Consultoría Fiscal",
    desc: "Soluciones tributarias integrales que optimizan la carga impositiva con pleno cumplimiento normativo.",
    tags: ["Impuestos Corporativos", "Tax Compliance", "Planeación Tributaria"],
    route: "consultoria-fiscal",
  },
  {
    icon: "◆",
    title: "Auditoría & Assurance",
    desc: "Opinión independiente sobre información financiera con los más altos estándares internacionales.",
    tags: ["Auditoría Financiera", "Control Interno", "IFRS"],
    route: "auditoria-assurance",
  },
  {
    icon: "◇",
    title: "Asesoría Legal",
    desc: "Representación y consultoría legal en materia corporativa, regulatoria y de cumplimiento.",
    tags: ["Litigio", "M&A", "Derecho Corporativo"],
    route: "asesoria-legal",
  },
  {
    icon: "▣",
    title: "Consultoría de Negocios",
    desc: "Transformación de negocios con enfoque en eficiencia operativa, tecnología e innovación.",
    tags: ["Transformación Digital", "ESG", "Gestión de Riesgos"],
    route: "consultoria-negocios",
  },
  {
    icon: "◎",
    title: "Precios de Transferencia",
    desc: "Análisis económico y documentación que aseguran el cumplimiento en operaciones intercompañía.",
    tags: ["Benchmarking", "Documentación", "APA"],
    route: "precios-transferencia",
  },
];

/**
 * SECTORES DE INDUSTRIA
 * name: nombre del sector (siempre visible)
 * cta: frase call-to-action en itálica (resaltada en hover)
 */
const SECTORS = [
  { name: "Manufactura e Industria", cta: "Maximice los beneficios del nearshoring con solidez tributaria →" },
  { name: "Infraestructura y Real Estate", cta: "Estructure sus proyectos con eficiencia impositiva desde el día uno →" },
  { name: "Retail y Consumo", cta: "Optimice su cadena de valor con estrategia tributaria de alto impacto →" },
];

/**
 * PUBLICACIONES / HORIZONTES
 * Cada entrada genera un slide en el carrusel.
 * tag: categoría (badge superior izquierdo)
 * date: fecha de publicación
 * title: título del artículo (panel izquierdo navy)
 * excerpt: resumen (panel derecho blanco)
 */
const INSIGHTS = [
  {
    tag: "FLASH INFORMATIVO",
    date: "07 Mar 2026",
    title: "Reforma Fiscal 2026: Implicaciones para el sector energético",
    excerpt: "Análisis de los cambios clave en materia de deducciones y estímulos fiscales para empresas del sector.",
  },
  {
    tag: "PERSPECTIVA",
    date: "02 Mar 2026",
    title: "Nearshoring: Oportunidades fiscales y legales para inversionistas",
    excerpt: "México se consolida como destino estratégico. Exploramos el marco regulatorio y fiscal que lo impulsa.",
  },
  {
    tag: "ARTÍCULO",
    date: "25 Feb 2026",
    title: "ESG y cumplimiento normativo: La nueva frontera empresarial",
    excerpt: "Cómo las regulaciones ambientales y de gobernanza están redefiniendo la práctica corporativa en LATAM.",
  },
];

/**
 * TOKENS DE DISEÑO (Brand Colors)
 * Para cambiar la paleta del sitio completo, edita estos valores.
 * En secciones con fondo blanco, se usa B.navy como texto (no B.accent).
 */
const IMMX_LOGO = "/images/immx-logo.png";

const B = {
  navy: "#002244",
  navyLight: "#003366",
  navyDark: "#001a33",
  white: "#FFFFFF",
  accent: "#FFFFFF",
  accentDark: "#E8E8E8",
  textMuted: "rgba(255,255,255,0.55)",
  sand: "#F7F3EE",
  sandDark: "#EDE7DF",
  parchment: "#FAF6F1",
  warmGray: "#8C8279",
};

/**
 * HOOK: useInView
 * Detecta cuándo un elemento entra al viewport (IntersectionObserver).
 * Se desconecta tras primera intersección (animación one-shot).
 * @param threshold - porcentaje visible para activar (0.0 a 1.0)
 * @returns [ref, visible] - ref para el elemento, visible como booleano
 */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ════════════════════════════════════════════════
   SECCIÓN 1: NAVBAR
   ──────────────────
   Barra fija. Logo "IMPUESTOS MÉXICO" → "IMMX" al scroll.
   Fondo navy sólido. Responsive con menú hamburguesa < 900px.
   Zona de marca separada de links por línea divisora vertical.
   ════════════════════════════════════════════════ */
function Navbar({ active, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(0,34,68,0.96)" : "rgba(0,34,68,1)",
      backdropFilter: "blur(20px)",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
      transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
      padding: scrolled ? "0 0" : "3px 0",
    }}>
      <div style={{
        maxWidth: 1320, margin: "0 auto", padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: scrolled ? 50 : 58, transition: "height 0.5s ease",
      }}>
        {/* Brand zone */}
        <a onClick={() => scrollTo("inicio")} style={{
          textDecoration: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <img src={IMMX_LOGO} alt="IMMX" style={{
            height: 46, width: "auto",
            transition: "all 0.4s ease",
          }} />
          <span style={{
            display: "flex", alignItems: "baseline", gap: 10,
            whiteSpace: "nowrap",
          }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
              fontSize: 25, color: B.accent, letterSpacing: "0.04em",
            }}>IMPUESTOS</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
              fontSize: 25, color: B.accent, letterSpacing: "0.04em",
            }}>MÉXICO</span>
          </span>
        </a>

        {/* Nav links + Lang toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }} className="nav-links-desktop">
          {SECTIONS.map((s) => (
            <a key={s.id} onClick={() => scrollTo(s.id)} style={{
              textDecoration: "none", padding: "8px 12px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
              color: active === s.id ? B.accent : "rgba(255,255,255,0.65)",
              letterSpacing: "0.03em", transition: "color 0.3s",
              borderBottom: active === s.id ? `2px solid ${B.accent}` : "2px solid transparent",
            }}>{t(s.label, lang)}</a>
          ))}
          <div style={{ marginLeft: 16, display: "flex", alignItems: "center", gap: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>
            <span onClick={() => setLang("es")} style={{ cursor: "pointer", color: lang === "es" ? B.accent : "rgba(255,255,255,0.35)", transition: "color 0.3s", padding: "4px 6px" }}>ES</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span onClick={() => setLang("en")} style={{ cursor: "pointer", color: lang === "en" ? B.accent : "rgba(255,255,255,0.35)", transition: "color 0.3s", padding: "4px 6px" }}>EN</span>
          </div>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} style={{
          display: "none", background: "none", border: "none",
          color: B.accent, fontSize: 28, cursor: "pointer",
        }} className="mobile-toggle">
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileOpen && (
        <div style={{
          background: "rgba(0,34,68,0.98)", padding: "20px 40px 30px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}>
          {SECTIONS.map((s) => (
            <a key={s.id} onClick={() => { scrollTo(s.id); setMobileOpen(false); }} style={{
              display: "block", padding: "14px 0", textDecoration: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 500,
              color: "rgba(255,255,255,0.7)", borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>{t(s.label, lang)}</a>
          ))}
          <div style={{ display: "flex", gap: 16, paddingTop: 16 }}>
            <span onClick={() => { setLang("es"); setMobileOpen(false); }} style={{ cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: lang === "es" ? B.accent : "rgba(255,255,255,0.4)" }}>Español</span>
            <span onClick={() => { setLang("en"); setMobileOpen(false); }} style={{ cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: lang === "en" ? B.accent : "rgba(255,255,255,0.4)" }}>English</span>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ════════════════════════════════════════════════
   HERO – Banner image + text below (Deloitte-style)
   ─────────────────────────────────────────────────
   Para cambiar la imagen del hero:
   1. Reemplaza HERO_CONFIG.image con tu URL o ruta
   2. Cambia useGradientPlaceholder a false
   El placeholder degradado simula el área de imagen.
   ════════════════════════════════════════════════ */
const HERO_IMAGE = "/images/hero.jpg";

const HERO_CONFIG = {
  image: HERO_IMAGE,
  useGradientPlaceholder: false,
  imageHeight: "50vh",
  overlayOpacity: 0.45,
  overlayColor: B.navy,
  backgroundPosition: "center 40%",
};

function Hero() {
  const [ref, visible] = useInView(0.05);
  const [imgLoaded, setImgLoaded] = useState(false);
  const lang = useLang();

  useEffect(() => {
    if (HERO_CONFIG.useGradientPlaceholder) {
      setImgLoaded(true);
      return;
    }
    const img = new Image();
    img.onload = () => setImgLoaded(true);
    img.src = HERO_CONFIG.image;
  }, []);

  return (
    <section id="inicio" ref={ref} style={{ background: B.navy }}>
      {/* ── Image / placeholder banner ── */}
      <div style={{
        position: "relative", width: "100%",
        height: HERO_CONFIG.imageHeight,
        overflow: "hidden",
        marginTop: 58,
      }}>
        {/* Gradient placeholder OR real image */}
        <div style={{
          position: "absolute", inset: 0,
          ...(HERO_CONFIG.useGradientPlaceholder
            ? {
                background: `
                  linear-gradient(135deg, 
                    #003366 0%, 
                    #1a5276 20%, 
                    #2e86c1 40%, 
                    #85c1e9 60%, 
                    #d4e6f1 75%,
                    #fdebd0 88%,
                    #f5cba7 100%
                  )`,
              }
            : {
                backgroundImage: `url(${HERO_CONFIG.image})`,
                backgroundSize: "cover",
                backgroundPosition: HERO_CONFIG.backgroundPosition,
                backgroundRepeat: "no-repeat",
              }),
          opacity: imgLoaded ? 1 : 0,
          transition: "opacity 1.2s ease",
        }} />

        {/* Overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: HERO_CONFIG.overlayColor,
          opacity: HERO_CONFIG.overlayOpacity,
        }} />

        {/* Placeholder label */}
        {HERO_CONFIG.useGradientPlaceholder && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              padding: "10px 24px",
              border: "1px dashed rgba(255,255,255,0.2)",
            }}>Área de imagen · {HERO_CONFIG.imageHeight} de alto</span>
          </div>
        )}

        {/* Bottom gradient fade into navy */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 120,
          background: `linear-gradient(to bottom, transparent, ${B.navy})`,
        }} />
      </div>

      {/* ── Text content below image ── */}
      <div style={{
        maxWidth: 900, margin: "0 auto",
        padding: "60px 40px 100px",
        textAlign: "center",
      }}>
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
        }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
            fontSize: "clamp(40px, 5.5vw, 76px)", lineHeight: 1.1,
            color: B.white, margin: "0 auto",
            letterSpacing: "-0.02em",
          }}>
            {t(T.hero.title1, lang)}<br />
            {t(T.hero.title2, lang)}
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.7,
            color: "rgba(255,255,255,0.55)", maxWidth: 560, margin: "32px auto 0",
            fontWeight: 400,
          }}>
            {t(T.hero.subtitle, lang)}
          </p>

          <div style={{
            display: "flex", gap: 16, marginTop: 44,
            justifyContent: "center", flexWrap: "wrap",
          }}>
            <a onClick={() => { const el = document.getElementById("servicios"); if (el) el.scrollIntoView({ behavior: "smooth" }); }} style={{
              padding: "16px 40px", background: B.white, color: B.navy,
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700,
              letterSpacing: "0.06em", textTransform: "uppercase",
              textDecoration: "none", transition: "all 0.3s", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 10,
            }}>
              {t(T.hero.cta, lang)} <span style={{ fontSize: 18 }}>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   SECCIÓN 3: SERVICIOS
   ──────────────────
   Grid de tarjetas sobre fondo blanco degradado.
   Reposo: ícono + título centrados.
   Hover: fondo navy, revela descripción + tags centrados.
   Colores de texto usan B.navy (no B.accent) por fondo claro.
   ════════════════════════════════════════════════ */
function Services({ onNavigate }) {
  const [ref, visible] = useInView(0.1);
  const [hovered, setHovered] = useState(null);
  const lang = useLang();

  return (
    <section id="servicios" ref={ref} style={{
      background: "linear-gradient(180deg, #FFFFFF 0%, #F0F4F8 100%)",
      padding: "120px 40px", position: "relative",
    }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: 72, flexWrap: "wrap", gap: 20,
          opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)",
          transition: "all 0.8s ease",
        }}>
          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: B.navy, marginBottom: 16,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ display: "inline-block", width: 32, height: 1, background: B.navy }} />
              {t(T.services.label, lang)}
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(34px, 4vw, 52px)",
              fontWeight: 600, color: B.navy, lineHeight: 1.1, margin: 0,
            }}>
              {t(T.services.h2Line1, lang)}<br />
              <span style={{ color: B.navy }}>{t(T.services.h2Line2, lang)}</span>
            </h2>
          </div>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: 1, background: "rgba(0,34,68,0.06)",
        }}>
          {SERVICES.map((s, i) => {
            const isHovered = hovered === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onNavigate && onNavigate(s.route)}
                style={{
                  background: isHovered ? B.navy : "#FFFFFF",
                  padding: "44px 36px", cursor: "pointer",
                  transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(20px)",
                  transitionDelay: `${i * 0.08}s`,
                  minHeight: 220,
                  display: "flex", flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative", overflow: "hidden",
                }}
              >
                {/* ── Centered state: icon + title ── */}
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 14,
                  position: isHovered ? "absolute" : "relative",
                  opacity: isHovered ? 0 : 1,
                  transform: isHovered ? "translateY(-20px)" : "translateY(0)",
                  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                  width: "100%",
                  pointerEvents: isHovered ? "none" : "auto",
                }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 32,
                    color: B.navy, opacity: 0.7,
                  }}>{s.icon}</div>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 26,
                    fontWeight: 600, color: B.navy, textAlign: "center",
                    margin: 0,
                  }}>{lang === "en" && T.services.titles[s.title] ? T.services.titles[s.title].en : s.title}</h3>
                </div>

                {/* ── Hover state: full content + Ver más button ── */}
                <div style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1) 0.05s",
                  pointerEvents: isHovered ? "auto" : "none",
                  position: isHovered ? "relative" : "absolute",
                  width: "100%",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", textAlign: "center",
                }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 24,
                    color: B.white, marginBottom: 8, opacity: 0.8,
                  }}>{s.icon}</div>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
                    fontWeight: 600, color: B.white, margin: "0 0 12px",
                  }}>{lang === "en" && T.services.titles[s.title] ? T.services.titles[s.title].en : s.title}</h3>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                    lineHeight: 1.65, margin: "0 0 20px",
                    color: "rgba(255,255,255,0.55)", maxWidth: 320,
                  }}>{lang === "en" && T.services.descs[s.title] ? T.services.descs[s.title].en : s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   SECCIÓN 4: SECTORES
   Grid de industrias con CTAs. Fondo navy.
   Hover: fondo se aclara, CTA cambia a blanco, línea animada aparece.
   ════════════════════════════════════════════════ */
function Sectors() {
  const [ref, visible] = useInView(0.1);
  const lang = useLang();
  const [active, setActive] = useState(0);

  return (
    <section id="sectores" ref={ref} style={{
      background: B.navy, padding: "120px 40px", position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", right: "-10%", top: "-20%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
      }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative" }}>
        <div style={{
          opacity: visible ? 1 : 0, transition: "all 0.8s ease",
          transform: visible ? "none" : "translateY(30px)",
          marginBottom: 72,
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: B.accent, marginBottom: 16,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ width: 32, height: 1, background: B.accent, display: "inline-block" }} />
            {t(T.sectors.label, lang)}
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 600,
            color: B.white, lineHeight: 1.1, margin: 0,
          }}>
            {t(T.sectors.h2Line1, lang)}<br />
            <span style={{ color: B.accent }}>{t(T.sectors.h2Line2, lang)}</span>
          </h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 0,
        }}>
          {SECTORS.map((s, i) => (
            <div
              key={i}
              onMouseEnter={() => setActive(i)}
              style={{
                padding: "40px 36px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                background: active === i ? "rgba(255,255,255,0.06)" : "transparent",
                cursor: "pointer", transition: "all 0.4s",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(20px)",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <h3 style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 18,
                fontWeight: 600, color: B.white, margin: "0 0 14px",
              }}>{lang === "en" && T.sectors.names[s.name] ? T.sectors.names[s.name].en : s.name}</h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                lineHeight: 1.6, margin: 0,
                color: active === i ? B.accent : "rgba(255,255,255,0.4)",
                transition: "color 0.4s",
                fontStyle: "italic",
              }}>{lang === "en" && T.sectors.ctas[s.name] ? T.sectors.ctas[s.name].en : s.cta}</p>
              <div style={{
                width: active === i ? 40 : 0, height: 2,
                background: B.accent, marginTop: 20,
                transition: "width 0.4s ease",
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   SECCIÓN 5: HORIZONTES (Carrusel)
   Slider de publicaciones con auto-avance (6s).
   Layout 50/50: panel navy (título) + panel blanco (excerpt).
   Flechas + dots para navegación. Timer se resetea al interactuar.
   ════════════════════════════════════════════════ */
function Horizons({ onNavigate }) {
  const [ref, visible] = useInView(0.1);
  const lang = useLang();
  const [current, setCurrent] = useState(0);
  const total = INSIGHTS.length;
  const timerRef = useRef(null);

  const goTo = (idx) => {
    setCurrent((idx + total) % total);
  };

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [total]);

  const resetTimer = (idx) => {
    clearInterval(timerRef.current);
    goTo(idx);
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, 6000);
  };

  return (
    <section id="horizontes" ref={ref} style={{
      background: "linear-gradient(180deg, #F0F4F8 0%, #FFFFFF 100%)",
      padding: "120px 40px",
    }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: 64, flexWrap: "wrap", gap: 20,
          opacity: visible ? 1 : 0, transition: "all 0.8s ease",
        }}>
          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: B.navy, marginBottom: 16,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ width: 32, height: 1, background: B.navy, display: "inline-block" }} />
              {t(T.horizons.label, lang)}
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 600,
              color: B.navy, lineHeight: 1.1, margin: 0,
            }}>
              {t(T.horizons.h2Line1, lang)}<br />
              <span style={{ color: B.navy }}>{t(T.horizons.h2Line2, lang)}</span>
            </h2>
          </div>
          <a onClick={() => onNavigate && onNavigate("horizontes-page")} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
            color: B.navy, textDecoration: "none", letterSpacing: "0.06em",
            textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8,
            cursor: "pointer",
          }}>
            {t(T.horizons.verTodas, lang)} <span style={{ fontSize: 18 }}>→</span>
          </a>
        </div>

        {/* Carousel viewport */}
        <div style={{
          position: "relative", overflow: "hidden",
          opacity: visible ? 1 : 0, transition: "all 0.8s ease 0.2s",
        }}>
          <div style={{
            display: "flex",
            transform: `translateX(-${current * 100}%)`,
            transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
          }}>
            {INSIGHTS.map((ins, i) => (
              <div key={i} style={{
                minWidth: "100%", padding: "0 0",
              }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: 0, background: "#FFFFFF",
                  boxShadow: "0 2px 12px rgba(0,34,68,0.06)",
                  overflow: "hidden", minHeight: 360,
                }}>
                  {/* Left: accent panel */}
                  <div style={{
                    background: B.navy, padding: "60px 56px",
                    display: "flex", flexDirection: "column",
                    justifyContent: "center", position: "relative",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", right: -60, top: -60,
                      width: 200, height: 200, borderRadius: "50%",
                      background: "rgba(255,255,255,0.04)",
                    }} />
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      color: B.accent, padding: "5px 12px", alignSelf: "flex-start",
                      background: "rgba(255,255,255,0.12)", marginBottom: 24,
                    }}>{ins.tag}</span>
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif", fontSize: 32,
                      fontWeight: 600, color: B.white, margin: 0,
                      lineHeight: 1.25,
                    }}>{ins.title}</h3>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                      color: "rgba(255,255,255,0.3)", marginTop: 24,
                    }}>{ins.date}</span>
                  </div>

                  {/* Right: excerpt */}
                  <div style={{
                    padding: "60px 56px", display: "flex",
                    flexDirection: "column", justifyContent: "center",
                  }}>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 17,
                      lineHeight: 1.8, color: "rgba(0,34,68,0.6)", margin: "0 0 36px",
                    }}>{ins.excerpt}</p>
                    <a onClick={() => onNavigate && onNavigate("horizontes-page")} style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                      fontWeight: 600, color: B.navy, textDecoration: "none",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      display: "inline-flex", alignItems: "center", gap: 8,
                      alignSelf: "flex-start", cursor: "pointer",
                    }}>
                      {t(T.horizons.leerMas, lang)} <span style={{ fontSize: 18 }}>→</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button onClick={() => resetTimer(current - 1)} style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            width: 48, height: 48, borderRadius: "50%",
            background: "rgba(0,34,68,0.85)", border: "1px solid rgba(255,255,255,0.2)",
            color: B.accent, fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s", backdropFilter: "blur(8px)",
          }}
            onMouseEnter={e => e.currentTarget.style.background = B.navy}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,34,68,0.85)"}
          >←</button>
          <button onClick={() => resetTimer(current + 1)} style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
            width: 48, height: 48, borderRadius: "50%",
            background: "rgba(0,34,68,0.85)", border: "1px solid rgba(255,255,255,0.2)",
            color: B.accent, fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s", backdropFilter: "blur(8px)",
          }}
            onMouseEnter={e => e.currentTarget.style.background = B.navy}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,34,68,0.85)"}
          >→</button>
        </div>

        {/* Dots */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 12, marginTop: 32,
        }}>
          {INSIGHTS.map((_, i) => (
            <button key={i} onClick={() => resetTimer(i)} style={{
              width: current === i ? 32 : 10, height: 10,
              borderRadius: current === i ? 5 : "50%",
              background: current === i ? B.navy : "rgba(0,34,68,0.15)",
              border: "none", cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   SECCIÓN 6: IMPUESTOS MÉXICO (About)
   Layout 2 columnas: texto institucional a la izquierda,
   grid 2x2 de valores (Integridad, Excelencia, Innovación,
   Compromiso) a la derecha. Fondo navy.
   ════════════════════════════════════════════════ */
function About() {
  const [ref, visible] = useInView(0.1);
  const lang = useLang();

  return (
    <section id="nosotros" ref={ref} style={{
      background: B.navy, padding: "120px 40px", position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "45%",
        background: "linear-gradient(135deg, rgba(255,255,255,0.04), transparent)",
      }} />

      <div style={{
        maxWidth: 1320, margin: "0 auto", position: "relative",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80,
        alignItems: "center",
      }}>
        <div style={{
          opacity: visible ? 1 : 0, transition: "all 1s ease",
          transform: visible ? "none" : "translateX(-30px)",
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: B.accent, marginBottom: 16,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ width: 32, height: 1, background: B.accent, display: "inline-block" }} />
            {t(T.about.label, lang)}
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(34px, 4vw, 48px)", fontWeight: 600,
            color: B.white, lineHeight: 1.15, margin: "0 0 28px",
          }}>
            {t(T.about.h2Line1, lang)}<br />
            <span style={{ color: B.accent }}>{t(T.about.h2Accent, lang)}</span>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.8,
            color: B.textMuted, margin: "0 0 24px",
          }}>
            {t(T.about.p1, lang)}
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.8,
            color: B.textMuted, margin: "0 0 40px",
          }}>
            {t(T.about.p2, lang)}
          </p>
        </div>

        <div style={{
          opacity: visible ? 1 : 0, transition: "all 1s ease 0.3s",
          transform: visible ? "none" : "translateX(30px)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.08)" }}>
            {(T.about.values[lang] || T.about.values.es).map((v, i) => (
              <div key={i} style={{ background: B.navy, padding: "36px 28px" }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
                  color: B.accent, marginBottom: 14, opacity: 0.7,
                }}>{v.icon}</div>
                <h4 style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                  fontWeight: 600, color: B.white, margin: "0 0 8px",
                }}>{v.title}</h4>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  lineHeight: 1.6, color: "rgba(255,255,255,0.4)", margin: 0,
                }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   SECCIÓN 7: CONTACTO
   Layout 2 columnas: datos de contacto (email, tel, horario)
   a la izquierda, formulario RFP a la derecha.
   Fondo: degradado navy. Patrón de líneas decorativas.
   ════════════════════════════════════════════════ */
function Contact() {
  const [ref, visible] = useInView(0.1);
  const { status, submit } = useContactForm();
  const lang = useLang();
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", state: "", service: "", message: "", honeypot: "" });
  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const handleSubmit = () => submit({ ...form, pageSource: "landing" });
  /* Reset form on success */
  useEffect(() => { if (status === "success") setForm({ name: "", company: "", email: "", phone: "", state: "", service: "", message: "", honeypot: "" }); }, [status]);
  const statusMsg = { success: t(T.contact.exito, lang), error: t(T.contact.error, lang), offline: t(T.contact.offline, lang), rate_limited: t(T.contact.rateLimited, lang), sending: t(T.contact.enviando, lang) };

  return (
    <section id="contacto" ref={ref} style={{
      background: `linear-gradient(165deg, ${B.navy}, ${B.navyLight})`,
      padding: "120px 40px", position: "relative",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.4) 60px, rgba(255,255,255,0.4) 61px)`,
      }} />
      <div style={{
        maxWidth: 1320, margin: "0 auto", position: "relative",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80,
        opacity: visible ? 1 : 0, transition: "all 1s ease",
        transform: visible ? "none" : "translateY(30px)",
      }}>
        <div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: B.accent, marginBottom: 16,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ width: 32, height: 1, background: B.accent, display: "inline-block" }} />
            {t(T.contact.label, lang)}
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(34px, 4vw, 48px)", fontWeight: 600,
            color: B.white, lineHeight: 1.15, margin: "0 0 28px",
          }}>
            {t(T.contact.h2Line1, lang)}<br />
            <span style={{ color: B.accent }}>{t(T.contact.h2Accent, lang)}</span>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.8,
            color: B.textMuted, margin: "0 0 40px",
          }}>
            {t(T.contact.paragraph, lang)}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              { label: t(T.contact.emailLabel, lang), detail: "contacto@impuestosmexico.com.mx" },
            ].map((c, i) => (
              <div key={i} style={{
                borderLeft: "2px solid rgba(255,255,255,0.2)", paddingLeft: 20,
                display: "flex", alignItems: "flex-start", gap: 14,
              }}>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: B.white, marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{c.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.04)", padding: "48px 40px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 26,
            fontWeight: 600, color: B.white, margin: "0 0 24px",
          }}>{t(T.contact.formTitle, lang)}</h3>

          {/* Honeypot — campo oculto anti-bot */}
          <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
            <input type="text" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={e => updateField("honeypot", e.target.value)} />
          </div>

          {[
            { label: t(T.contact.nombre, lang), type: "text", field: "name" },
            { label: t(T.contact.empresa, lang), type: "text", field: "company" },
            { label: t(T.contact.correo, lang), type: "email", field: "email" },
            { label: t(T.contact.telefono, lang), type: "tel", field: "phone" },
            { label: t(T.contact.estado, lang), type: "text", field: "state" },
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <label style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8,
              }}>{f.label}</label>
              <input type={f.type} value={form[f.field]} onChange={e => updateField(f.field, e.target.value)} style={{
                width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.15)", color: B.white,
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                outline: "none", boxSizing: "border-box", transition: "border-color 0.3s",
              }}
                onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
              />
            </div>
          ))}

          <div style={{ marginBottom: 28 }}>
            <label style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8,
            }}>{t(T.contact.servicio, lang)}</label>
            <select value={form.service} onChange={e => updateField("service", e.target.value)} style={{
              width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              outline: "none", boxSizing: "border-box",
            }}>
              <option value="">{t(T.contact.seleccione, lang)}</option>
              {SERVICES.map((s, i) => <option key={i} value={s.title}>{lang === "en" && T.services.titles[s.title] ? T.services.titles[s.title].en : s.title}</option>)}
            </select>
          </div>

          {/* Status message */}
          {status !== "idle" && status !== "sending" && (
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginBottom: 20, padding: "12px 16px",
              background: status === "success" ? "rgba(52,168,83,0.15)" : "rgba(220,53,69,0.15)",
              color: status === "success" ? "rgba(52,168,83,0.9)" : "rgba(220,53,69,0.9)",
            }}>{statusMsg[status]}</div>
          )}

          <button onClick={handleSubmit} disabled={status === "sending"} style={{
            width: "100%", padding: "16px", background: status === "sending" ? "#ccc" : B.accent, border: "none",
            color: B.navy, fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: status === "sending" ? "wait" : "pointer", transition: "all 0.3s",
          }}
            onMouseEnter={e => { if (status !== "sending") e.target.style.background = "#E0E0E0"; }}
            onMouseLeave={e => { if (status !== "sending") e.target.style.background = B.accent; }}
          >
            {status === "sending" ? t(T.contact.enviando, lang) : t(T.contact.enviar, lang)}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PÁGINA DE LEGALES — DATOS Y COMPONENTES
   ══════════════════════════════════════════════════════════════════════════════
   Datos corporativos, estilos tipográficos, contenido legal por pestaña
   y wrapper principal. Se renderiza cuando currentPage === "legales".
   ════════════════════════════════════════════════════════════════════════════ */

const E = {
  full: "Impuestos México, S.C.",
  short: "IMMX",
  address: "Prol. P. de la Reforma 1015 Torre A Piso 7, Lomas de Santa Fe, Cuajimalpa de Morelos, 01219, CDMX",
  web: "www.immx.com.mx",
  emailPrivacy: "privacidadycumplimiento@immx.com.mx",
};

const LEGAL_TABS = [
  { id: "clientes", label: { es: "Clientes", en: "Clients" } },
  { id: "candidatos", label: { es: "Candidatos y Trabajadores", en: "Candidates & Employees" } },
  { id: "proveedores", label: { es: "Proveedores", en: "Vendors" } },
  { id: "disclaimers", label: { es: "Confidencialidad y Disclaimers", en: "Confidentiality & Disclaimers" } },
];

const LS = {
  p: { fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.85, color: "rgba(255,255,255,0.58)", marginBottom: 24, fontWeight: 400 },
  h: { fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginTop: 48, marginBottom: 16 },
  sub: { fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.65)", marginTop: 32, marginBottom: 12 },
  ind: { fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.85, color: "rgba(255,255,255,0.5)", marginBottom: 10, paddingLeft: 24, fontWeight: 400 },
  b: { color: "rgba(255,255,255,0.72)", fontWeight: 600 },
};

function ClientesContent() {
  return (<div>
    <p style={LS.p}>Aviso de Privacidad Integral relativo al manejo de los Datos Personales de Clientes de {E.full} (en adelante <span style={LS.b}>"{E.short}"</span>).</p>
    <p style={LS.p}>En cumplimiento a lo previsto en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (en lo sucesivo "LFPDPPP"), su Reglamento y demás normatividad relativa y aplicable, nos permitimos informarle lo siguiente:</p>
    <h3 style={LS.h}>1. Responsable de los Datos Personales</h3>
    <p style={LS.p}>{E.full} (en lo sucesivo "{E.short}"), señalando para efectos del presente Aviso de Privacidad el domicilio ubicado en {E.address}, será el responsable de los datos personales que le sean proporcionados por las personas físicas a quienes correspondan los mismos (en lo sucesivo la persona "Titular").</p>
    <h3 style={LS.h}>2. Datos Personales que se Solicitan de la Persona Titular</h3>
    <p style={LS.p}>Para las finalidades señaladas en el presente Aviso de Privacidad, {E.short} podrá recabar los Datos Personales de la persona Titular como son: nombre completo y fotografía (identificación oficial así como la imagen de la persona Titular al ingresar a las instalaciones de {E.short} a través de las cámaras de video vigilancia y seguridad), domicilio (comprobante de domicilio), teléfono fijo, teléfono celular, correo electrónico, nacionalidad, fecha y lugar de nacimiento, estado civil, Registro Federal de Contribuyentes (RFC o Tax ID), Clave Única de Registro de Población (CURP), cargo, número de cuenta, actividad económica e información patrimonial (relación de bienes y relación de ingresos) (en adelante y en su conjunto los Datos Personales).</p>
    <p style={LS.p}>Para aquellas personas que tengan el carácter de contacto de alguna persona Titular se les informa que {E.short} únicamente requiere sus Datos Personales correspondientes a: nombre completo y fotografía, cargo, teléfono fijo, teléfono celular, correo electrónico.</p>
    <p style={LS.p}>Es responsabilidad de la persona Titular de los Datos Personales, el garantizar que los datos que facilite personal o directamente a {E.short} sean veraces y completos, así como de notificar a {E.short} cualquier modificación a los mismos para dar cumplimiento a la obligación de mantener la información actualizada.</p>
    <h3 style={LS.h}>3. Finalidades para las que se Recaban los Datos Personales</h3>
    <p style={LS.ind}>Para el cumplimiento y administración de los contratos que celebre {E.short} con la persona Titular.</p>
    <p style={LS.ind}>Para la identificación y contacto de la persona Titular.</p>
    <p style={LS.ind}>Para la administración y análisis de los Servicios.</p>
    <p style={LS.ind}>Para la actualización de datos de la persona Titular.</p>
    <p style={LS.ind}>Para llenar los formatos conocidos como "Know Your Customer".</p>
    <p style={LS.ind}>Para proporcionar seguridad a las instalaciones de {E.short} y a los Titulares que ingresen a éstas últimas.</p>
    <p style={LS.p}>Dichas finalidades son necesarias para cumplir las obligaciones derivadas de la relación jurídica que tenga {E.short} con la persona Titular.</p>
    <h3 style={LS.h}>4. Temporalidad, Remisiones y Transferencias</h3>
    <p style={LS.p}>La temporalidad del manejo de los Datos Personales de la persona Titular, dependerá de la relación jurídica que se tenga celebrada con {E.short}, así como de las obligaciones exigidas por la legislación vigente, las autoridades competentes y las políticas internas de {E.short}.</p>
    <p style={LS.p}>De acuerdo a lo dispuesto por la LFPDPPP, {E.short} dará acceso a los Datos Personales de la persona Titular (a través de remisiones) a aquellas personas que tengan el carácter de Encargados como pueden ser prestadores de servicios, o socios de negocios de {E.short}, que tengan una relación jurídica con éste último y asuman el compromiso de mantenerla bajo un estricto orden de confidencialidad y seguridad.</p>
    <h3 style={LS.h}>5. Derechos ARCO, Revocación y Limitación</h3>
    <p style={LS.p}>Las personas Titulares de la información tendrán derecho a solicitar el acceso, rectificación, revocación, cancelación u oposición, así como limitar el uso o divulgación de sus datos, mediante:</p>
    <p style={LS.ind}>a) Solicitud escrita dirigida a {E.full}, al siguiente domicilio: {E.address}, de las 10:00 a las 17:00 horas, en días hábiles, o</p>
    <p style={LS.ind}>b) Solicitud formulada al correo electrónico: {E.emailPrivacy}</p>
    <p style={LS.p}>{E.short} dará respuesta dentro de los veinte (20) días siguientes contados a partir de que reciba la solicitud, plazo que podrá ser ampliado conforme al artículo 32 de la LFPDPPP.</p>
    <h3 style={LS.h}>6. Modificaciones al Aviso de Privacidad</h3>
    <p style={LS.p}>En el supuesto de que {E.short} requiera usar sus Datos Personales con fines distintos a los pactados, se notificará a la persona Titular en forma escrita los nuevos usos que pretenda darle a dicha información a fin de obtener su consentimiento en términos de la LFPDPPP.</p>
    <p style={LS.p}>{E.short} se reserva el derecho a modificar el presente Aviso de Privacidad para adaptarlo a novedades legislativas o jurisprudenciales así como a prácticas comerciales. En dichos supuestos, se anunciará en la página de internet {E.web} los cambios de referencia.</p>
    <p style={LS.p}>El presente Aviso de Privacidad se rige por la legislación vigente y aplicable en los Estados Unidos Mexicanos, cualquier controversia que se suscite con motivo de su aplicación deberá ventilarse ante el Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI) o ante los Órganos Jurisdiccionales competentes en la Ciudad de México.</p>
  </div>);
}

function CandidatosContent() {
  return (<div>
    <p style={LS.p}>Aviso de Privacidad Integral relativo al manejo de los Datos Personales de Candidatos(as) y Trabajadores(as) de {E.full} (en adelante <span style={LS.b}>"{E.short}"</span>).</p>
    <p style={LS.p}>En cumplimiento a lo dispuesto por la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), su Reglamento y demás normatividad relativa y aplicable, hacemos de su conocimiento que el tratamiento a los Datos Personales que nos proporcionen con motivo de la solicitud como candidatos(as) y, en su caso, formalización de la relación como trabajadores(as) de {E.short} será el que resulte necesario, adecuado y vigente.</p>
    <h3 style={LS.h}>1. Responsable de los Datos Personales</h3>
    <p style={LS.p}>{E.full}, señalando para efectos del presente Aviso de Privacidad el domicilio ubicado en {E.address}, será el responsable de los datos personales que le sean proporcionados por las personas físicas a quienes correspondan los mismos (en lo sucesivo la persona "Titular").</p>
    <h3 style={LS.h}>2. Datos Personales que se Solicitan de la Persona Titular</h3>
    <p style={LS.p}>Para las finalidades señaladas en el presente Aviso de Privacidad, {E.short} podrá recabar los Datos Personales de la persona Titular como son: fotografía, nombre, domicilio, teléfono particular, teléfono celular, correo electrónico, nacionalidad o información migratoria, sexo, fecha de nacimiento y lugar de nacimiento, estado civil, RFC, CURP, Clave del IMSS, número de AFORE, título profesional, cédula profesional, experiencia profesional, teléfonos de emergencia, y número de cuenta bancaria, referencias laborales y/o personales, último ingreso percibido en el empleo anterior (en adelante los Datos Personales) además de datos relacionados al estado de vacunación, la orientación sexual, identidad o expresión de género (en adelante los Datos Personales Sensibles).</p>
    <h3 style={LS.h}>3. Finalidades para las que se Recaban los Datos Personales</h3>
    <p style={LS.sub}>Finalidades necesarias para cumplir la relación jurídica:</p>
    <p style={LS.ind}>Para la identificación y contacto de la persona Titular.</p>
    <p style={LS.ind}>Para incluirle en el proceso de reclutamiento y selección.</p>
    <p style={LS.ind}>Para la elaboración de los contratos de trabajo que, en su caso, sean celebrados.</p>
    <p style={LS.ind}>Integración y actualización del expediente de los candidatos(as) y trabajadores(as).</p>
    <p style={LS.ind}>Para dar cumplimiento a las obligaciones establecidas en las leyes aplicables.</p>
    <p style={LS.ind}>Para dar de alta en los sistemas de nómina y recursos humanos de {E.short}, en el IMSS y para la apertura de cuenta bancaria.</p>
    <p style={LS.ind}>Para dar de alta en la póliza de seguros de Gastos Médicos Mayores y seguro de vida.</p>
    <p style={LS.ind}>Para proporcionar seguridad a las instalaciones de {E.short}.</p>
    <p style={LS.sub}>Finalidades que no son necesarias para cumplir la relación jurídica:</p>
    <p style={LS.ind}>Para difundir las actividades de integración en los perfiles de {E.short} en redes sociales.</p>
    <p style={LS.ind}>Para la impresión de credenciales de empleado(a) y gestionar las sesiones fotográficas corporativas.</p>
    <p style={LS.ind}>Para dar cumplimiento a la Política de Gestión de Conflicto de Interés y la Política de Equidad, Diversidad e Inclusión.</p>
    <h3 style={LS.h}>4. Temporalidad, Remisiones y Transferencias</h3>
    <p style={LS.p}>La temporalidad del manejo de los Datos Personales de la persona Titular, dependerá de la relación jurídica que tenga celebrada con {E.short}, así como de las obligaciones exigidas por la legislación vigente o las autoridades competentes y las políticas internas de {E.short}.</p>
    <p style={LS.p}>{E.short} transfiere los Datos Personales de los Titulares (Trabajadores y beneficiarios) a Compañías de Seguros, instituciones bancarias, empresas emisoras de tarjetas corporativas, empresas de capacitación, Asociaciones Profesionales, la Administración del edificio y al proveedor del estacionamiento, conforme a las finalidades establecidas y de acuerdo al artículo 37 de la LFPDPPP.</p>
    <h3 style={LS.h}>5. Derechos ARCO, Revocación y Limitación</h3>
    <p style={LS.p}>Las personas Titulares tendrán derecho a solicitar el acceso, rectificación, revocación, cancelación u oposición así como limitar el uso o divulgación de sus Datos Personales, mediante:</p>
    <p style={LS.ind}>a) Solicitud escrita dirigida a {E.full}, al siguiente domicilio: {E.address}, de las 10:00 a las 17:00 horas, de lunes a viernes, o</p>
    <p style={LS.ind}>b) Solicitud formulada al correo electrónico: {E.emailPrivacy}</p>
    <p style={LS.p}>{E.short} dará respuesta dentro de los veinte (20) días siguientes contados a partir de que reciba la solicitud.</p>
    <h3 style={LS.h}>6. Modificaciones al Aviso de Privacidad</h3>
    <p style={LS.p}>{E.short} se reserva el derecho a modificar el presente Aviso de Privacidad para adaptarlo a novedades legislativas o jurisprudenciales. En dichos supuestos, se anunciará en la página de internet {E.web} los cambios de referencia.</p>
    <p style={LS.p}>El presente Aviso de Privacidad se rige por la legislación vigente y aplicable en los Estados Unidos Mexicanos.</p>
  </div>);
}

function ProveedoresContent() {
  return (<div>
    <p style={LS.p}>Aviso de Privacidad Integral relativo al manejo de los Datos Personales de Proveedores(as) de {E.full} (en adelante <span style={LS.b}>"{E.short}"</span>).</p>
    <p style={LS.p}>En cumplimiento a lo previsto en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (en lo sucesivo "la LFPDPPP"), su reglamento y demás normatividad relativa y aplicable, nos permitimos informarle lo siguiente:</p>
    <h3 style={LS.h}>1. Responsable de los Datos Personales</h3>
    <p style={LS.p}>{E.full} (en lo sucesivo "{E.short}"), señalando para efectos del presente Aviso de Privacidad el domicilio ubicado en {E.address}, será el responsable de los Datos Personales que le sean proporcionados por las personas físicas a quienes correspondan los mismos (en lo sucesivo la persona "Titular").</p>
    <h3 style={LS.h}>2. Datos Personales que se Solicitan de la Persona Titular</h3>
    <p style={LS.p}>Para las finalidades señaladas en el presente Aviso de Privacidad, {E.short} podrá recabar los Datos Personales de la persona Titular como son: nombre completo, domicilio de trabajo, teléfono fijo, teléfono celular, correo electrónico, RFC, CURP, puesto o cargo, trayectoria laboral, cédula profesional, certificados de escolaridad, información sobre seguros, firma autógrafa, cédula fiscal, número de cuenta bancaria y clabe interbancaria.</p>
    <h3 style={LS.h}>3. Finalidades para las que se Recaban los Datos Personales</h3>
    <p style={LS.ind}>Para el cumplimiento y administración de los contratos que celebre {E.short} con la persona Titular.</p>
    <p style={LS.ind}>Para la identificación y contacto de la persona Titular.</p>
    <p style={LS.ind}>Para la actualización de datos de la persona Titular.</p>
    <p style={LS.ind}>Para agregarlo a nuestra base de datos de proveedores.</p>
    <p style={LS.ind}>Para proporcionar seguridad a las instalaciones de {E.short}.</p>
    <p style={LS.ind}>Para dar cumplimiento a las obligaciones establecidas en las leyes aplicables.</p>
    <h3 style={LS.h}>4. Temporalidad, Remisiones y Transferencias</h3>
    <p style={LS.p}>La temporalidad del manejo de los Datos Personales del Titular, dependerá de la relación jurídica que se tenga celebrada con {E.short}, así como de las obligaciones exigidas por la legislación vigente, las autoridades competentes y las políticas internas de {E.short}.</p>
    <p style={LS.p}>De acuerdo a lo dispuesto por la LFPDPPP, {E.short} dará acceso a los Datos Personales de la persona Titular a aquellas personas que tengan el carácter de Encargados y asuman el compromiso de mantenerla bajo un estricto orden de confidencialidad y seguridad.</p>
    <h3 style={LS.h}>5. Derechos ARCO, Revocación y Limitación</h3>
    <p style={LS.p}>Las personas Titulares tendrán derecho a solicitar el acceso, rectificación, revocación, cancelación u oposición así como limitar el uso o divulgación de sus datos, mediante:</p>
    <p style={LS.ind}>a) Solicitud escrita dirigida a {E.full}, al siguiente domicilio: {E.address}, de las 10:00 a las 17:00 horas, en días hábiles, o</p>
    <p style={LS.ind}>b) Solicitud formulada al correo electrónico: {E.emailPrivacy}</p>
    <p style={LS.p}>{E.short} dará respuesta dentro de los veinte (20) días siguientes contados a partir de que reciba la solicitud.</p>
    <h3 style={LS.h}>6. Modificaciones al Aviso de Privacidad</h3>
    <p style={LS.p}>{E.short} se reserva el derecho a modificar el presente Aviso de Privacidad para adaptarlo a novedades legislativas o jurisprudenciales. En dichos supuestos, se anunciará en la página de internet {E.web} los cambios de referencia.</p>
    <p style={LS.p}>El presente Aviso de Privacidad se rige por la legislación vigente y aplicable en los Estados Unidos Mexicanos.</p>
  </div>);
}

function DisclaimersContent() {
  return (<div>
    <h3 style={LS.h}>Aviso de Confidencialidad</h3>
    <p style={LS.p}>Cualquier mensaje, documento o correo electrónico de {E.full} (en lo sucesivo "la Firma") y los archivos adjuntos son estrictamente confidenciales y reservados para uso exclusivo de la persona destinataria.</p>
    <p style={LS.p}>Si usted ha recibido un mensaje, documento o correo electrónico de la Firma por error, por favor notifíquelo inmediatamente al remitente y/o a {E.emailPrivacy} proceda a eliminarlo de su sistema. Se prohíbe la divulgación total o parcial de esta información.</p>
    <h3 style={LS.h}>Alcance de Contenido</h3>
    <p style={LS.p}>El contenido de cualquier correo electrónico enviado desde una cuenta de correo de la Firma no constituye una opinión legal por lo que no asume responsabilidad civil por las opiniones o recomendaciones expresadas por medios electrónicos, a menos que así se señale de manera expresa en el mensaje o documento enviado.</p>
    <p style={LS.p}>Si usted desea asesoría formal, agradeceremos ponerse en contacto con algún Socio o Socia del área de práctica correspondiente para tales efectos.</p>
    <h3 style={LS.h}>Esquemas Reportables</h3>
    <p style={LS.p}>Salvo que así se señale expresamente, en ningún mensaje, documento o correo electrónico nos pronunciamos respecto de la existencia de un "esquema reportable" conforme a lo establecido en el Código Fiscal de la Federación (CFF), en relación con los actos jurídicos que, en su caso, se mencionan en los mismos.</p>
    <p style={LS.p}>En caso de que existiera un "esquema reportable" conforme a lo establecido en el CFF, dentro de los servicios profesionales prestados por la Firma, usted asume la obligación de revelar dicho esquema de conformidad con lo establecido en el CFF, liberando a la Firma de tal responsabilidad, salvo pacto expreso y por escrito en contrario.</p>
    <h3 style={LS.h}>Propiedad Intelectual</h3>
    <p style={LS.p}>La propiedad intelectual de los documentos, elementos de trabajo y cualesquier materiales creados ("Contenido") y/o desarrollados con motivo de la prestación de servicios profesionales, pertenecerán única y exclusivamente a la Firma, por lo que queda estrictamente prohibido cualquier tipo de reproducción, distribución, comercialización, transformación, o cualquier uso no autorizado, total o parcial, del Contenido.</p>
    <h3 style={LS.h}>Límite de Responsabilidad</h3>
    <p style={LS.p}>Cualquier persona física o moral que entregue información a la Firma reconoce, comprende y acepta que alguna porción o la totalidad de la información entregada podría perderse o alterarse derivado de maniobras de contención, respuesta o recuperación de un incidente de seguridad de la información y/o ciberseguridad.</p>
    <p style={LS.p}>La Firma dispone de infraestructura de seguridad de la información que garantiza un nivel razonable de confidencialidad, seguridad, disponibilidad e integridad de los datos que nos entregan.</p>
    <p style={LS.p}>Sin embargo, esta garantía estará limitada:</p>
    <p style={LS.ind}>Cuando la parte interesada externa o su personal desconozca o no esté capacitada en el uso de las plataformas que la Firma ponga a su disposición.</p>
    <p style={LS.ind}>Si los dispositivos o sistemas operativos de la parte interesada externa no son compatibles con nuestras plataformas o sistemas.</p>
    <p style={LS.ind}>Cuando la parte interesada externa solicita la eliminación de los controles de seguridad establecidos en la información.</p>
    <p style={LS.ind}>Si una(s) autoridad(es) competente(s) solicita la eliminación de los controles de seguridad establecidos en la información proporcionada por la Firma.</p>
  </div>);
}

function ClientesContentEN() {
  return (<div>
    <p style={LS.p}>Comprehensive Privacy Notice regarding the handling of Personal Data of Clients of {E.full} (hereinafter <span style={LS.b}>"{E.short}"</span>).</p>
    <p style={LS.p}>In compliance with the Ley Federal de Protección de Datos Personales en Posesión de los Particulares ("LFPDPPP"), its Regulations and all applicable provisions, we hereby inform you of the following:</p>
    <h3 style={LS.h}>1. Data Controller</h3>
    <p style={LS.p}>{E.full} ("{E.short}"), with registered address at {E.address}, shall be the controller of the personal data provided by the individuals to whom such data pertains (hereinafter the "Data Subject").</p>
    <h3 style={LS.h}>2. Personal Data Collected</h3>
    <p style={LS.p}>For the purposes set forth in this Privacy Notice, {E.short} may collect the following Personal Data: full name and photograph (official identification and images captured via security cameras upon entering {E.short} premises), address, landline and mobile telephone numbers, email, nationality, date and place of birth, marital status, Registro Federal de Contribuyentes (RFC / Tax ID), Clave Única de Registro de Población (CURP), position, account number, economic activity and financial information.</p>
    <p style={LS.p}>For individuals acting as contact persons of a Data Subject, {E.short} only requires the following: full name and photograph, position, landline and mobile telephone numbers, and email address.</p>
    <p style={LS.p}>The Data Subject is responsible for ensuring that the data provided to {E.short} is accurate and complete, and for notifying any changes in order to keep the information up to date.</p>
    <h3 style={LS.h}>3. Purposes for Data Collection</h3>
    <p style={LS.ind}>To fulfill and manage contracts executed between {E.short} and the Data Subject.</p>
    <p style={LS.ind}>To identify and contact the Data Subject.</p>
    <p style={LS.ind}>For the administration and analysis of Services.</p>
    <p style={LS.ind}>To update the Data Subject's information.</p>
    <p style={LS.ind}>To complete "Know Your Customer" forms.</p>
    <p style={LS.ind}>To ensure the security of {E.short} premises and of Data Subjects entering such premises.</p>
    <p style={LS.p}>These purposes are necessary to fulfill the obligations arising from the legal relationship between {E.short} and the Data Subject.</p>
    <h3 style={LS.h}>4. Retention, Transfers and Disclosures</h3>
    <p style={LS.p}>The retention period of the Data Subject's Personal Data shall depend on the legal relationship with {E.short}, as well as on the obligations imposed by applicable legislation, competent authorities and {E.short} internal policies.</p>
    <p style={LS.p}>In accordance with the LFPDPPP, {E.short} may grant access to Personal Data (through disclosures) to data processors such as service providers or business partners that maintain a legal relationship with {E.short} and undertake to keep such data under strict confidentiality and security.</p>
    <h3 style={LS.h}>5. ARCO Rights, Revocation and Limitation</h3>
    <p style={LS.p}>Data Subjects may exercise their rights of access, rectification, cancellation or opposition, as well as limit the use or disclosure of their data, by means of:</p>
    <p style={LS.ind}>a) A written request addressed to {E.full} at the following address: {E.address}, between 10:00 and 17:00 hours on business days, or</p>
    <p style={LS.ind}>b) A request submitted via email to: {E.emailPrivacy}</p>
    <p style={LS.p}>{E.short} shall respond within twenty (20) business days from the date of receipt, a period that may be extended pursuant to Article 32 of the LFPDPPP.</p>
    <h3 style={LS.h}>6. Amendments to this Privacy Notice</h3>
    <p style={LS.p}>Should {E.short} need to use Personal Data for purposes other than those set forth herein, the Data Subject shall be notified in writing in accordance with the LFPDPPP.</p>
    <p style={LS.p}>{E.short} reserves the right to amend this Privacy Notice to reflect legislative, regulatory or judicial developments. Any such amendments shall be published at {E.web}.</p>
    <p style={LS.p}>This Privacy Notice is governed by the laws of the Estados Unidos Mexicanos. Any disputes arising from its application shall be submitted to the Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI) or to the competent courts in Ciudad de México.</p>
  </div>);
}

function CandidatosContentEN() {
  return (<div>
    <p style={LS.p}>Comprehensive Privacy Notice regarding the handling of Personal Data of Candidates and Employees of {E.full} (hereinafter <span style={LS.b}>"{E.short}"</span>).</p>
    <p style={LS.p}>In compliance with the Ley Federal de Protección de Datos Personales en Posesión de los Particulares ("LFPDPPP"), its Regulations and all applicable provisions, we hereby inform you that the processing of Personal Data provided in connection with your candidacy or, as applicable, the formalization of your employment with {E.short} shall be necessary, appropriate and in accordance with current regulations.</p>
    <h3 style={LS.h}>1. Data Controller</h3>
    <p style={LS.p}>{E.full}, with registered address at {E.address}, shall be the controller of the personal data provided by the individuals to whom such data pertains (hereinafter the "Data Subject").</p>
    <h3 style={LS.h}>2. Personal Data Collected</h3>
    <p style={LS.p}>For the purposes set forth in this Privacy Notice, {E.short} may collect the following Personal Data: photograph, name, address, telephone numbers, email, nationality or immigration status, gender, date and place of birth, marital status, RFC, CURP, IMSS registration number, AFORE number, professional degree and license, professional experience, emergency contacts, bank account number, employment and personal references, most recent salary, as well as Sensitive Personal Data related to vaccination status, sexual orientation, gender identity or expression.</p>
    <h3 style={LS.h}>3. Purposes for Data Collection</h3>
    <p style={LS.sub}>Purposes necessary to fulfill the legal relationship:</p>
    <p style={LS.ind}>To identify and contact the Data Subject.</p>
    <p style={LS.ind}>To include the Data Subject in recruitment and selection processes.</p>
    <p style={LS.ind}>To prepare employment contracts, as applicable.</p>
    <p style={LS.ind}>To create and update candidate and employee files.</p>
    <p style={LS.ind}>To comply with obligations established by applicable laws.</p>
    <p style={LS.ind}>To register the Data Subject in {E.short} payroll and human resources systems, with the IMSS and for bank account opening.</p>
    <p style={LS.ind}>To enroll the Data Subject in group medical and life insurance policies.</p>
    <p style={LS.ind}>To ensure the security of {E.short} premises.</p>
    <p style={LS.sub}>Purposes not necessary to fulfill the legal relationship:</p>
    <p style={LS.ind}>To share integration activities on {E.short} social media profiles.</p>
    <p style={LS.ind}>To produce employee credentials and coordinate corporate photography sessions.</p>
    <p style={LS.ind}>To comply with the Conflict of Interest Policy and the Equity, Diversity and Inclusion Policy.</p>
    <h3 style={LS.h}>4. Retention, Transfers and Disclosures</h3>
    <p style={LS.p}>The retention period shall depend on the legal relationship with {E.short}, applicable legislation, competent authorities and {E.short} internal policies.</p>
    <p style={LS.p}>{E.short} transfers Personal Data of Data Subjects (employees and beneficiaries) to insurance companies, banking institutions, corporate card issuers, training providers, professional associations, building management and parking providers, in accordance with the purposes set forth herein and pursuant to Article 37 of the LFPDPPP.</p>
    <h3 style={LS.h}>5. ARCO Rights, Revocation and Limitation</h3>
    <p style={LS.p}>Data Subjects may exercise their rights of access, rectification, cancellation or opposition, as well as limit the use or disclosure of their data, by means of:</p>
    <p style={LS.ind}>a) A written request addressed to {E.full} at: {E.address}, between 10:00 and 17:00 hours, Monday through Friday, or</p>
    <p style={LS.ind}>b) A request submitted via email to: {E.emailPrivacy}</p>
    <p style={LS.p}>{E.short} shall respond within twenty (20) business days from the date of receipt.</p>
    <h3 style={LS.h}>6. Amendments to this Privacy Notice</h3>
    <p style={LS.p}>{E.short} reserves the right to amend this Privacy Notice. Any amendments shall be published at {E.web}.</p>
    <p style={LS.p}>This Privacy Notice is governed by the laws of the Estados Unidos Mexicanos.</p>
  </div>);
}

function ProveedoresContentEN() {
  return (<div>
    <p style={LS.p}>Comprehensive Privacy Notice regarding the handling of Personal Data of Vendors of {E.full} (hereinafter <span style={LS.b}>"{E.short}"</span>).</p>
    <p style={LS.p}>In compliance with the Ley Federal de Protección de Datos Personales en Posesión de los Particulares ("LFPDPPP"), its Regulations and all applicable provisions, we hereby inform you of the following:</p>
    <h3 style={LS.h}>1. Data Controller</h3>
    <p style={LS.p}>{E.full} ("{E.short}"), with registered address at {E.address}, shall be the controller of the personal data provided by the individuals to whom such data pertains (hereinafter the "Data Subject").</p>
    <h3 style={LS.h}>2. Personal Data Collected</h3>
    <p style={LS.p}>For the purposes set forth in this Privacy Notice, {E.short} may collect the following Personal Data: full name, work address, landline and mobile telephone numbers, email, RFC, CURP, position, professional background, professional license, academic certificates, insurance information, handwritten signature, tax identification, bank account number and interbank transfer code (CLABE).</p>
    <h3 style={LS.h}>3. Purposes for Data Collection</h3>
    <p style={LS.ind}>To fulfill and manage contracts executed between {E.short} and the Data Subject.</p>
    <p style={LS.ind}>To identify and contact the Data Subject.</p>
    <p style={LS.ind}>To update the Data Subject's information.</p>
    <p style={LS.ind}>To add the Data Subject to our vendor database.</p>
    <p style={LS.ind}>To ensure the security of {E.short} premises.</p>
    <p style={LS.ind}>To comply with obligations established by applicable laws.</p>
    <h3 style={LS.h}>4. Retention, Transfers and Disclosures</h3>
    <p style={LS.p}>The retention period shall depend on the legal relationship with {E.short}, applicable legislation, competent authorities and {E.short} internal policies.</p>
    <p style={LS.p}>In accordance with the LFPDPPP, {E.short} may grant access to Personal Data to data processors that undertake to maintain strict confidentiality and security.</p>
    <h3 style={LS.h}>5. ARCO Rights, Revocation and Limitation</h3>
    <p style={LS.p}>Data Subjects may exercise their rights of access, rectification, cancellation or opposition, as well as limit the use or disclosure of their data, by means of:</p>
    <p style={LS.ind}>a) A written request addressed to {E.full} at: {E.address}, between 10:00 and 17:00 hours on business days, or</p>
    <p style={LS.ind}>b) A request submitted via email to: {E.emailPrivacy}</p>
    <p style={LS.p}>{E.short} shall respond within twenty (20) business days from the date of receipt.</p>
    <h3 style={LS.h}>6. Amendments to this Privacy Notice</h3>
    <p style={LS.p}>{E.short} reserves the right to amend this Privacy Notice. Any amendments shall be published at {E.web}.</p>
    <p style={LS.p}>This Privacy Notice is governed by the laws of the Estados Unidos Mexicanos.</p>
  </div>);
}

function DisclaimersContentEN() {
  return (<div>
    <h3 style={LS.h}>Confidentiality Notice</h3>
    <p style={LS.p}>Any message, document or email from {E.full} (hereinafter "the Firm") and its attachments are strictly confidential and intended solely for the use of the intended recipient.</p>
    <p style={LS.p}>If you have received a message, document or email from the Firm in error, please notify the sender immediately and/or contact {E.emailPrivacy}, and delete it from your system. Partial or total disclosure of this information is prohibited.</p>
    <h3 style={LS.h}>Scope of Content</h3>
    <p style={LS.p}>The content of any email sent from a Firm email account does not constitute a legal opinion. The Firm assumes no liability for opinions or recommendations expressed through electronic means, unless expressly stated in the message or document.</p>
    <p style={LS.p}>Should you require formal advice, please contact a Partner in the relevant practice area.</p>
    <h3 style={LS.h}>Reportable Schemes</h3>
    <p style={LS.p}>Unless expressly stated, no message, document or email constitutes a determination as to the existence of a "reportable scheme" (esquema reportable) as defined in the Código Fiscal de la Federación (CFF) in connection with any legal acts referenced therein.</p>
    <p style={LS.p}>Should a "reportable scheme" exist within the professional services rendered by the Firm, the client assumes the obligation to disclose such scheme in accordance with the CFF, releasing the Firm from such responsibility, unless otherwise expressly agreed in writing.</p>
    <h3 style={LS.h}>Intellectual Property</h3>
    <p style={LS.p}>All intellectual property rights in documents, work products and any materials created or developed in connection with the rendering of professional services shall belong exclusively to the Firm. Any reproduction, distribution, commercialization, transformation or unauthorized use, in whole or in part, is strictly prohibited.</p>
    <h3 style={LS.h}>Limitation of Liability</h3>
    <p style={LS.p}>Any individual or entity that provides information to the Firm acknowledges and accepts that some or all of such information may be lost or altered as a result of containment, response or recovery measures following an information security and/or cybersecurity incident.</p>
    <p style={LS.p}>The Firm maintains information security infrastructure that guarantees a reasonable level of confidentiality, security, availability and integrity of the data entrusted to it.</p>
    <p style={LS.p}>However, this guarantee shall be limited:</p>
    <p style={LS.ind}>When the external party or its personnel is unfamiliar with or untrained in the use of the platforms provided by the Firm.</p>
    <p style={LS.ind}>If the devices or operating systems of the external party are incompatible with our platforms or systems.</p>
    <p style={LS.ind}>When the external party requests the removal of security controls applied to the information.</p>
    <p style={LS.ind}>If a competent authority requests the removal of security controls applied to information provided by the Firm.</p>
  </div>);
}

function LegalContent() {
  const [ref, visible] = useInView(0.02);
  const [activeTab, setActiveTab] = useState("clientes");
  const lang = useLang();
  const renderContent = () => {
    if (lang === "en") {
      switch (activeTab) {
        case "clientes": return <ClientesContentEN />;
        case "candidatos": return <CandidatosContentEN />;
        case "proveedores": return <ProveedoresContentEN />;
        case "disclaimers": return <DisclaimersContentEN />;
        default: return <ClientesContentEN />;
      }
    }
    switch (activeTab) {
      case "clientes": return <ClientesContent />;
      case "candidatos": return <CandidatosContent />;
      case "proveedores": return <ProveedoresContent />;
      case "disclaimers": return <DisclaimersContent />;
      default: return <ClientesContent />;
    }
  };
  return (
    <section ref={ref} style={{ background: B.navy, padding: "160px 40px 120px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ maxWidth: 720, width: "100%", textAlign: "center", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)", marginBottom: 56 }}>
        <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.2)", margin: "0 auto 32px" }} />
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 24 }}>
          {lang === "en" ? "Privacy Notice, Confidentiality, Scope of Content and Reportable Schemes" : "Aviso de Privacidad Integral, Confidencialidad, Alcance de Contenido y Esquemas Reportables"}
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.12, color: B.white, letterSpacing: "-0.02em", margin: "0 0 20px" }}>
          {lang === "en" ? "Legal" : "Legales"}
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, maxWidth: 500, margin: "0 auto" }}>
          {E.full}
        </p>
      </div>
      <div style={{ maxWidth: 820, width: "100%", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 4, marginBottom: 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}>
        {LEGAL_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id}
              onClick={() => { setActiveTab(tab.id); window.scrollTo({ top: 280, behavior: "smooth" }); }}
              style={{ padding: "12px 24px", background: isActive ? "rgba(255,255,255,0.1)" : "transparent", border: isActive ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.06)", color: isActive ? B.white : "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: isActive ? 600 : 400, letterSpacing: "0.02em", cursor: "pointer", transition: "all 0.3s ease" }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}}
            >{typeof tab.label === "object" ? t(tab.label, lang) : tab.label}</button>
          );
        })}
      </div>
      <div style={{ width: 1, height: 48, background: "rgba(255,255,255,0.08)", margin: "0 auto 48px" }} />
      <div style={{ maxWidth: 720, width: "100%", textAlign: "left", opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
        {renderContent()}
      </div>
      <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.12)", margin: "56px auto 32px" }} />
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
        {lang === "en" ? "Last updated: March 2026" : "Última actualización: marzo de 2026"}
      </p>
    </section>
  );
}


/* ════════════════════════════════════════════════════════════════════════════
   PÁGINA DE HORIZONTES — BIBLIOTECA DE PUBLICACIONES
   ══════════════════════════════════════════════════════════════════════════════
   Datos estáticos de publicaciones, integración con Supabase (opcional),
   Hero con newsletter, y Biblioteca con grid desplegable por área.
   Se renderiza cuando currentPage === "horizontes-page".
   ════════════════════════════════════════════════════════════════════════════ */

const LIBRARY = [
  { id: "consultoria-fiscal", icon: "◈", area: "Consultoría Fiscal", subtitle: "Análisis, opiniones y guías en materia tributaria", publications: [
    { tag: "GUÍA PRÁCTICA", date: "06 Mar 2026", title: "Declaración Anual de Personas Físicas 2025", slug: "declaracion-anual-de-personas-fisicas-2025", excerpt: "Guía paso a paso para el cumplimiento de la declaración anual, incluyendo deducciones personales autorizadas, estímulos fiscales vigentes y las principales novedades del ejercicio.", readTime: "12 min" },
    { tag: "FLASH INFORMATIVO", date: "28 Feb 2026", title: "Reforma al Régimen de Incorporación Fiscal", slug: "reforma-al-regimen-de-incorporacion-fiscal", excerpt: "Análisis de las modificaciones recientes al RESICO y su impacto en contribuyentes personas físicas con actividades empresariales.", readTime: "6 min" },
    { tag: "ARTÍCULO", date: "20 Feb 2026", title: "CFDI 4.0: Problemáticas frecuentes y soluciones", slug: "cfdi-4-0-problematicas-frecuentes-y-soluciones", excerpt: "Revisión de los errores más comunes en la emisión de comprobantes fiscales digitales y estrategias para su corrección oportuna.", readTime: "8 min" },
    { tag: "PERSPECTIVA", date: "15 Feb 2026", title: "Estímulos fiscales para la frontera norte", slug: "estimulos-fiscales-para-la-frontera-norte", excerpt: "Evaluación del impacto económico y las oportunidades que representan los incentivos tributarios en la región fronteriza.", readTime: "10 min" },
    { tag: "OPINIÓN", date: "08 Feb 2026", title: "El futuro de la fiscalización digital en México", slug: "el-futuro-de-la-fiscalizacion-digital-en-mexico", excerpt: "Hacia dónde se dirige el SAT en materia de auditorías electrónicas, uso de inteligencia artificial y cruces de información.", readTime: "7 min" },
  ]},
  { id: "auditoria", icon: "◆", area: "Auditoría & Assurance", subtitle: "Estándares, normatividad y mejores prácticas", publications: [
    { tag: "ARTÍCULO", date: "04 Mar 2026", title: "NIA 600 Revisada: Auditorías de grupos", slug: "nia-600-revisada-auditorias-de-grupos", excerpt: "Implicaciones prácticas de la norma revisada sobre auditorías de estados financieros de grupo y el trabajo de auditores de componentes.", readTime: "14 min" },
    { tag: "GUÍA PRÁCTICA", date: "22 Feb 2026", title: "Control interno bajo el marco COSO 2025", slug: "control-interno-bajo-el-marco-coso-2025", excerpt: "Actualización del marco integrado de control interno y su aplicación en organizaciones mexicanas del sector manufacturero.", readTime: "11 min" },
    { tag: "FLASH INFORMATIVO", date: "18 Feb 2026", title: "Dictamen fiscal 2025: Plazos y novedades", slug: "dictamen-fiscal-2025-plazos-y-novedades", excerpt: "Calendario de obligaciones para la presentación del dictamen fiscal del ejercicio, con énfasis en los nuevos requerimientos del SAT.", readTime: "5 min" },
    { tag: "PERSPECTIVA", date: "10 Feb 2026", title: "Auditoría continua y analítica de datos", slug: "auditoria-continua-y-analitica-de-datos", excerpt: "Cómo las herramientas de data analytics están transformando la práctica de auditoría en firmas de todos los tamaños.", readTime: "9 min" },
  ]},
  { id: "asesoria-legal", icon: "◇", area: "Asesoría Legal", subtitle: "Regulación, cumplimiento y protección jurídica", publications: [
    { tag: "ARTÍCULO", date: "05 Mar 2026", title: "Compliance corporativo: Nueva Ley de Responsabilidad", slug: "compliance-corporativo-nueva-ley-de-responsabilida", excerpt: "Análisis de la nueva legislación en materia de responsabilidad penal de las personas jurídicas y programas de cumplimiento efectivo.", readTime: "13 min" },
    { tag: "FLASH INFORMATIVO", date: "25 Feb 2026", title: "Reformas laborales 2026: Lo que debe saber", slug: "reformas-laborales-2026-lo-que-debe-saber", excerpt: "Resumen ejecutivo de las modificaciones a la Ley Federal del Trabajo y su impacto en las relaciones obrero-patronales.", readTime: "7 min" },
    { tag: "GUÍA PRÁCTICA", date: "14 Feb 2026", title: "Protección de datos personales: Guía de implementación", slug: "proteccion-de-datos-personales-guia-de-implementac", excerpt: "Manual práctico para el cumplimiento integral de la LFPDPPP y la gestión adecuada de avisos de privacidad.", readTime: "15 min" },
    { tag: "PERSPECTIVA", date: "02 Feb 2026", title: "Arbitraje comercial internacional en México", slug: "arbitraje-comercial-internacional-en-mexico", excerpt: "El panorama actual del arbitraje como mecanismo alternativo de resolución de controversias para empresas transnacionales.", readTime: "10 min" },
  ]},
  { id: "consultoria-negocios", icon: "▣", area: "Consultoría de Negocios", subtitle: "Transformación, estrategia e innovación empresarial", publications: [
    { tag: "PERSPECTIVA", date: "03 Mar 2026", title: "ESG y reporteo de sostenibilidad: Marco normativo 2026", slug: "esg-y-reporteo-de-sostenibilidad-marco-normativo-2", excerpt: "Las nuevas obligaciones de reporte ESG para empresas listadas y las mejores prácticas para su implementación gradual.", readTime: "12 min" },
    { tag: "ARTÍCULO", date: "20 Feb 2026", title: "Nearshoring: Mapeo de oportunidades por sector", slug: "nearshoring-mapeo-de-oportunidades-por-sector", excerpt: "Identificación de los sectores con mayor potencial de captación de inversión extranjera y las ventajas competitivas de México.", readTime: "9 min" },
    { tag: "FLASH INFORMATIVO", date: "12 Feb 2026", title: "Transformación digital en PyMEs: Diagnóstico rápido", slug: "transformacion-digital-en-pymes-diagnostico-rapido", excerpt: "Herramienta de autoevaluación para que empresas medianas midan su nivel de madurez digital y tracen una ruta de adopción tecnológica.", readTime: "6 min" },
    { tag: "GUÍA PRÁCTICA", date: "01 Feb 2026", title: "Gestión de riesgos empresariales: Framework integrado", slug: "gestion-de-riesgos-empresariales-framework-integra", excerpt: "Metodología para identificar, evaluar y mitigar riesgos operativos, financieros y reputacionales en organizaciones complejas.", readTime: "16 min" },
  ]},
  { id: "precios-transferencia", icon: "◎", area: "Precios de Transferencia", subtitle: "Documentación, análisis y cumplimiento intercompañía", publications: [
    { tag: "FLASH INFORMATIVO", date: "07 Mar 2026", title: "Pillar Two: Impuesto mínimo global y sus efectos en México", slug: "pillar-two-impuesto-minimo-global-y-sus-efectos-en", excerpt: "Análisis del impacto que tendrá la implementación del impuesto mínimo global del 15% en los grupos multinacionales con presencia en México.", readTime: "11 min" },
    { tag: "GUÍA PRÁCTICA", date: "24 Feb 2026", title: "Documentación comprobatoria 2025: Checklist actualizado", slug: "documentacion-comprobatoria-2025-checklist-actuali", excerpt: "Lista de verificación completa para la preparación de la documentación de precios de transferencia conforme a las disposiciones vigentes.", readTime: "8 min" },
    { tag: "ARTÍCULO", date: "16 Feb 2026", title: "Análisis de comparabilidad: Errores que cuestan millones", slug: "analisis-de-comparabilidad-errores-que-cuestan-mil", excerpt: "Los cinco errores más frecuentes en la selección de comparables y cómo evitarlos para minimizar riesgos ante auditorías del SAT.", readTime: "10 min" },
    { tag: "PERSPECTIVA", date: "05 Feb 2026", title: "APAs bilaterales México-EUA: Tendencias recientes", slug: "apas-bilaterales-mexico-eua-tendencias-recientes", excerpt: "Estado actual de los acuerdos anticipados de precios y la evolución de las negociaciones entre ambas autoridades fiscales.", readTime: "9 min" },
  ]},
];

const TAG_COLORS = {
  "FLASH INFORMATIVO": { bg: "rgba(220,53,69,0.12)", text: "#B02A37" },
  "GUÍA PRÁCTICA": { bg: "rgba(25,135,84,0.12)", text: "#146C43" },
  "ARTÍCULO": { bg: "rgba(0,34,68,0.10)", text: B.navy },
  "PERSPECTIVA": { bg: "rgba(108,117,125,0.12)", text: "#495057" },
  "OPINIÓN": { bg: "rgba(160,120,60,0.15)", text: "#7A5C2E" },
};

/* ════════════════════════════════════════════════════════════════════════════
   SUPABASE — Configuración y Hooks
   ══════════════════════════════════════════════════════════════════════════════
   Conexión centralizada a Supabase para:
   1. Publicaciones (publications) — lectura pública
   2. Newsletter (suscriptores) — inserción pública
   3. Formulario de contacto (contact_requests) — inserción pública con seguridad

   SQL de setup:
   ─────────────
   CREATE TABLE public.publications (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     slug TEXT NOT NULL UNIQUE,
     tag TEXT NOT NULL,
     title TEXT NOT NULL,
     excerpt TEXT NOT NULL,
     content TEXT NOT NULL DEFAULT '',
     published_at DATE NOT NULL DEFAULT CURRENT_DATE,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Public read" ON public.publications FOR SELECT USING (true);
   CREATE POLICY "Auth insert" ON public.publications FOR INSERT TO authenticated WITH CHECK (true);
   CREATE POLICY "Auth update" ON public.publications FOR UPDATE TO authenticated USING (true);
   CREATE POLICY "Auth delete" ON public.publications FOR DELETE TO authenticated USING (true);

   CREATE TABLE public.suscriptores (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   ALTER TABLE public.suscriptores ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Public insert" ON public.suscriptores FOR INSERT WITH CHECK (true);
   CREATE POLICY "No read" ON public.suscriptores FOR SELECT USING (false);

   CREATE TABLE public.contact_requests (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     company TEXT DEFAULT '',
     email TEXT NOT NULL,
     phone TEXT DEFAULT '',
     state TEXT DEFAULT '',
     service TEXT DEFAULT '',
     message TEXT DEFAULT '',
     page_source TEXT DEFAULT 'landing',
     honeypot TEXT DEFAULT '',
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Public insert" ON public.contact_requests
     FOR INSERT WITH CHECK (honeypot = '' OR honeypot IS NULL);
   CREATE POLICY "Auth read" ON public.contact_requests
     FOR SELECT TO authenticated USING (true);

   Auth email templates: Configurar en Supabase Dashboard → Authentication → Email Templates
   Dominio de envío: notify.impuestosmexico.com.mx
   ════════════════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════
   SUPABASE — Config (usa variables de entorno en producción)
   
   SQL SCHEMA (ejecutar en SQL Editor de Supabase):
   ─────────────────────────────────────────────────
   CREATE TABLE public.publications (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     slug TEXT NOT NULL UNIQUE,
     area TEXT NOT NULL DEFAULT 'consultoria-fiscal',
     tag TEXT NOT NULL DEFAULT 'ARTÍCULO',
     title_es TEXT NOT NULL,
     title_en TEXT NOT NULL DEFAULT '',
     excerpt_es TEXT NOT NULL,
     excerpt_en TEXT NOT NULL DEFAULT '',
     content_es TEXT NOT NULL DEFAULT '',
     content_en TEXT NOT NULL DEFAULT '',
     published_at DATE NOT NULL DEFAULT CURRENT_DATE,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Public read" ON public.publications FOR SELECT USING (true);
   CREATE POLICY "Auth write" ON public.publications FOR ALL TO authenticated USING (true) WITH CHECK (true);

   CREATE TABLE public.suscriptores (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   ALTER TABLE public.suscriptores ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Public insert" ON public.suscriptores FOR INSERT WITH CHECK (true);

   CREATE TABLE public.contact_requests (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL, company TEXT DEFAULT '', email TEXT NOT NULL,
     phone TEXT DEFAULT '',
     state TEXT DEFAULT '', service TEXT DEFAULT '', message TEXT DEFAULT '',
     page_source TEXT DEFAULT 'landing', honeypot TEXT DEFAULT '',
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Public insert" ON public.contact_requests FOR INSERT WITH CHECK (honeypot = '' OR honeypot IS NULL);
   CREATE POLICY "Auth read" ON public.contact_requests FOR SELECT TO authenticated USING (true);
   ════════════════════════════════════════════════════════════════ */
const SUPABASE = {
  url: (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) || "",
  anonKey: (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) || "",
};

/** Helper: REST API call a Supabase (PostgREST) */
async function supabaseFetch(table, options = {}) {
  const { method = "GET", body, query = "" } = options;
  const res = await fetch(`${SUPABASE.url}/rest/v1/${table}${query ? "?" + query : ""}`, {
    method,
    headers: {
      "apikey": SUPABASE.anonKey,
      "Authorization": `Bearer ${SUPABASE.anonKey}`,
      "Content-Type": "application/json",
      "Prefer": method === "POST" ? "return=minimal" : undefined,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${res.statusText}`);
  if (method === "GET") return res.json();
  return true;
}

/**
 * Hook: usePublications
 * Carga publicaciones desde tabla `publications` (nuevo schema con UUID + slug).
 * Transforma filas a formato LIBRARY para la Biblioteca.
 * Fallback a datos estáticos si no hay Supabase.
 */
function useLibraryData() {
  const [data, setData] = useState(LIBRARY);
  const [source, setSource] = useState("local");
  const [loading, setLoading] = useState(!!(SUPABASE.url && SUPABASE.anonKey));
  const lang = useLang();
  useEffect(() => {
    if (!SUPABASE.url || !SUPABASE.anonKey) { setLoading(false); return; }
    const fetchData = async () => {
      try {
        setLoading(true);
        const rows = await supabaseFetch("publications", { query: "order=published_at.desc" });
        if (rows && rows.length > 0) {
          const areaMap = new Map();
          LIBRARY.forEach(a => areaMap.set(a.id, { ...a, publications: [] }));
          rows.forEach(r => {
            const areaId = r.area || "consultoria-fiscal";
            if (!areaMap.has(areaId)) areaMap.set(areaId, { id: areaId, icon: "◈", area: areaId, subtitle: "", publications: [] });
            areaMap.get(areaId).publications.push({
              tag: (r.tag || "ARTÍCULO").toUpperCase(),
              date: r.published_at ? new Date(r.published_at).toLocaleDateString(lang === "en" ? "en-US" : "es-MX", { day: "2-digit", month: "short", year: "numeric" }) : "",
              title: lang === "en" && r.title_en ? r.title_en : (r.title_es || r.title || ""),
              excerpt: lang === "en" && r.excerpt_en ? r.excerpt_en : (r.excerpt_es || r.excerpt || ""),
              readTime: "5 min",
              slug: r.slug || "",
            });
          });
          const result = Array.from(areaMap.values()).filter(a => a.publications.length > 0);
          if (result.length > 0) { setData(result); setSource("supabase"); }
        }
      } catch (err) {
        console.warn("Horizontes: fallback local.", err);
      } finally { setLoading(false); }
    };
    fetchData();
  }, [lang]);
  return { library: data, source, loading };
}

/**
 * Hook: useNewsletter
 * Registra suscriptores en Supabase. Si no hay conexión, muestra estado offline.
 */
function useNewsletter() {
  const [status, setStatus] = useState("idle");
  const subscribe = async (email) => {
    if (!SUPABASE.url || !SUPABASE.anonKey) { setStatus("offline"); setTimeout(() => setStatus("idle"), 3000); return; }
    try {
      setStatus("sending");
      await supabaseFetch("suscriptores", { method: "POST", body: { email } });
      setStatus("success");
      setTimeout(() => setStatus("idle"), 4000);
    } catch { setStatus("error"); setTimeout(() => setStatus("idle"), 3000); }
  };
  return { status, subscribe };
}

/**
 * Hook: useContactForm
 * Envía solicitudes de contacto a Supabase con medidas de seguridad:
 * - Honeypot field (campo oculto que bots llenan, humanos no)
 * - Validación de email
 * - Rate limiting por sesión (máx 3 envíos por sesión)
 * - Sanitización de inputs
 */
function useContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error | offline | rate_limited
  const submissionCount = useRef(0);
  const MAX_SUBMISSIONS = 3;

  const sanitize = (str) => String(str || "").trim().slice(0, 1000);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = async ({ name, company, email, phone, state, service, message, honeypot, pageSource }) => {
    /* Honeypot check — si el campo oculto tiene valor, es bot */
    if (honeypot && honeypot.trim() !== "") {
      setStatus("success"); // Simular éxito para no alertar al bot
      setTimeout(() => setStatus("idle"), 4000);
      return;
    }

    /* Rate limiting por sesión */
    if (submissionCount.current >= MAX_SUBMISSIONS) {
      setStatus("rate_limited");
      setTimeout(() => setStatus("idle"), 5000);
      return;
    }

    /* Validaciones */
    if (!name || !email) { setStatus("error"); setTimeout(() => setStatus("idle"), 3000); return; }
    if (!isValidEmail(email)) { setStatus("error"); setTimeout(() => setStatus("idle"), 3000); return; }

    /* Sin Supabase */
    if (!SUPABASE.url || !SUPABASE.anonKey) { setStatus("offline"); setTimeout(() => setStatus("idle"), 3000); return; }

    try {
      setStatus("sending");
      await supabaseFetch("contact_requests", {
        method: "POST",
        body: {
          name: sanitize(name),
          company: sanitize(company),
          email: sanitize(email),
          phone: sanitize(phone),
          state: sanitize(state),
          service: sanitize(service),
          message: sanitize(message).slice(0, 2000),
          page_source: sanitize(pageSource),
          honeypot: "", // Siempre vacío para envíos legítimos
        },
      });
      submissionCount.current += 1;
      setStatus("success");
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return { status, submit };
}

function HorizontesHero() {
  const [ref, visible] = useInView(0.05);
  const [email, setEmail] = useState("");
  const { status, subscribe } = useNewsletter();
  const lang = useLang();
  const handleSubscribe = () => { if (email && email.includes("@")) { subscribe(email); if (status !== "offline") setEmail(""); } };
  const statusMessages = { sending: { text: "Enviando...", color: "rgba(255,255,255,0.4)" }, success: { text: "✓ Suscripción confirmada", color: "rgba(52,168,83,0.8)" }, error: { text: "Error, intente de nuevo", color: "rgba(220,53,69,0.7)" }, offline: { text: "Próximamente disponible", color: "rgba(255,255,255,0.3)" } };
  const msg = statusMessages[status];
  return (
    <section ref={ref} style={{ position: "relative", height: "60vh", minHeight: 420, overflow: "hidden", background: B.navy, display: "flex", flexDirection: "column" }}>
      <div style={{ height: 58, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 40px 40px", textAlign: "center" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.2s" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 28, display: "inline-flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 40, height: 1, background: "rgba(255,255,255,0.2)", display: "inline-block" }} />
            {t(T.horizontesPage.overline, lang)}
            <span style={{ width: 40, height: 1, background: "rgba(255,255,255,0.2)", display: "inline-block" }} />
          </div>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(48px, 6vw, 88px)", lineHeight: 1.05, color: B.white, margin: 0, letterSpacing: "-0.02em", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.4s" }}>{lang === "en" ? "Insights" : "Horizontes"}</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", maxWidth: 500, margin: "24px auto 0", fontWeight: 400, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.7s" }}>
          {t(T.horizontesPage.subtitle, lang)}
        </p>
        <div style={{ marginTop: 36, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.9s", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0, letterSpacing: "0.06em", textTransform: "uppercase" }}>{t(T.horizontesPage.newsletter, lang)}</p>
          {status === "success" ? (
            <div style={{ padding: "12px 24px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: msg.color }}>{msg.text}</div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 0, maxWidth: 400, width: "100%" }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubscribe()} placeholder="correo@ejemplo.com" disabled={status === "sending"} style={{ flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRight: "none", color: B.white, fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: "none", transition: "border-color 0.3s", opacity: status === "sending" ? 0.5 : 1 }} onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.3)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
              <button onClick={handleSubscribe} disabled={status === "sending"} style={{ padding: "12px 20px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, cursor: status === "sending" ? "wait" : "pointer", transition: "all 0.3s", whiteSpace: "nowrap", opacity: status === "sending" ? 0.5 : 1 }} onMouseEnter={e => { if (status !== "sending") { e.target.style.background = "rgba(255,255,255,0.15)"; e.target.style.color = "rgba(255,255,255,0.8)"; }}} onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.08)"; e.target.style.color = "rgba(255,255,255,0.5)"; }}>{status === "sending" ? "..." : t(T.horizontesPage.suscribirse, lang)}</button>
            </div>
          )}
          {(status === "error" || status === "offline") && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: msg.color, margin: 0 }}>{msg.text}</p>}
        </div>
      </div>
    </section>
  );
}

function Biblioteca({ onNavigate }) {
  const [ref, visible] = useInView(0.1);
  const lang = useLang();
  const [hovered, setHovered] = useState(null);
  const [activeArea, setActiveArea] = useState(null);
  const [hoveredPub, setHoveredPub] = useState(null);
  const gridRef = useRef(null);
  const { library, source, loading } = useLibraryData();
  const handleAreaClick = (index) => { if (activeArea === index) { setActiveArea(null); } else { setActiveArea(index); setTimeout(() => { gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100); } };
  const activePubs = activeArea !== null ? library[activeArea]?.publications || [] : [];
  const activeLib = activeArea !== null ? library[activeArea] : null;
  return (
    <section id="biblioteca" ref={ref} style={{ background: B.sand, padding: "100px 40px 100px" }}>
      <style>{`@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ marginBottom: 56, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: B.warmGray, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 32, height: 1, background: "rgba(0,34,68,0.2)", display: "inline-block" }} />
            {t(T.horizontesPage.areasLabel, lang)}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 600, color: B.navy, lineHeight: 1.15, margin: 0 }}>
            {t(T.horizontesPage.exploreH2_1, lang)}<br /><span style={{ fontStyle: "italic", fontWeight: 500 }}>{t(T.horizontesPage.exploreH2_2, lang)}</span>
          </h2>
        </div>
        {loading && <div style={{ textAlign: "center", padding: "40px 0", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(0,34,68,0.3)" }}>{lang === "en" ? "Loading publications..." : "Cargando publicaciones..."}</div>}
        {source === "supabase" && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(0,34,68,0.2)", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34a853", display: "inline-block" }} />Conectado a Supabase</div>}
        {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 0 }}>
          {library.map((lib, i) => { const isHov = hovered === i; const isActive = activeArea === i; return (
            <div key={lib.id} onClick={() => handleAreaClick(i)} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ background: (isActive || isHov) ? B.navy : B.white, border: `1px solid ${B.navy}`, marginRight: -1, marginBottom: -1, padding: "44px 28px", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transitionDelay: `${i * 0.06}s`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 12, position: "relative", zIndex: (isHov || isActive) ? 2 : 1, boxShadow: isActive ? "0 8px 30px rgba(0,34,68,0.18)" : isHov ? "0 8px 30px rgba(0,34,68,0.12)" : "none" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, color: (isHov || isActive) ? "rgba(255,255,255,0.35)" : "rgba(0,34,68,0.18)", transition: "color 0.4s", lineHeight: 1 }}>{lib.icon}</span>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: (isHov || isActive) ? B.white : B.navy, margin: 0, transition: "color 0.4s", lineHeight: 1.35 }}>{lib.area}</h3>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: (isHov || isActive) ? "rgba(255,255,255,0.35)" : "rgba(0,34,68,0.3)", letterSpacing: "0.04em", transition: "color 0.4s" }}>{lib.publications.length} {t(T.horizontesPage.publicaciones, lang)}</span>
              <div style={{ width: (isHov || isActive) ? 28 : 0, height: 2, background: (isHov || isActive) ? "rgba(255,255,255,0.35)" : B.navy, transition: "all 0.4s ease", marginTop: 4 }} />
            </div>); })}
        </div>)}
        {activeArea !== null && (
          <div ref={gridRef} style={{ marginTop: 64, animation: "fadeSlideIn 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: B.warmGray, marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, opacity: 0.5 }}>{activeLib.icon}</span>
                  <span style={{ width: 20, height: 1, background: "rgba(0,34,68,0.2)", display: "inline-block" }} />{activeLib.area}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(0,34,68,0.4)", margin: 0 }}>{activeLib.subtitle}</p>
              </div>
              <button onClick={() => setActiveArea(null)} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: B.navy, letterSpacing: "0.04em", background: "none", border: "1px solid rgba(0,34,68,0.15)", padding: "10px 20px", cursor: "pointer", transition: "all 0.3s" }}>{t(T.horizontesPage.cerrar, lang)}</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {activePubs.map((pub, i) => { const tagStyle = TAG_COLORS[pub.tag] || TAG_COLORS["ARTÍCULO"]; const isHovPub = hoveredPub === `${activeArea}-${i}`; return (
                <div key={i} onMouseEnter={() => setHoveredPub(`${activeArea}-${i}`)} onMouseLeave={() => setHoveredPub(null)} onClick={() => pub.slug && onNavigate && onNavigate("pub-" + pub.slug)} style={{ background: B.white, border: `1px solid ${isHovPub ? "rgba(0,34,68,0.15)" : "rgba(0,34,68,0.07)"}`, cursor: "pointer", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)", transform: isHovPub ? "translateY(-4px)" : "none", boxShadow: isHovPub ? "0 16px 36px rgba(0,34,68,0.08), 0 6px 14px rgba(0,34,68,0.04)" : "0 2px 8px rgba(0,34,68,0.03)", display: "flex", flexDirection: "column", overflow: "hidden", animation: `fadeSlideIn 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both` }}>
                  <div style={{ height: 3, background: isHovPub ? `linear-gradient(90deg, ${B.navy}, ${B.navyLight})` : "rgba(0,34,68,0.06)", transition: "all 0.4s ease" }} />
                  <div style={{ padding: "30px 30px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 12 }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 12px", background: tagStyle.bg, color: tagStyle.text }}>{pub.tag}</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(0,34,68,0.3)" }}>{pub.date}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: B.navy, margin: "0 0 12px", lineHeight: 1.3 }}>{pub.title}</h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.65, color: "rgba(0,34,68,0.5)", margin: "0 0 22px", flex: 1 }}>{pub.excerpt}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 18, borderTop: "1px solid rgba(0,34,68,0.06)" }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(0,34,68,0.3)", display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14 }}>◷</span> {pub.readTime}</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: B.navy, letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 6, opacity: isHovPub ? 1 : 0.5, transform: isHovPub ? "translateX(4px)" : "none", transition: "all 0.3s ease" }}>{t(T.horizontesPage.leer, lang)} <span style={{ fontSize: 16 }}>→</span></span>
                    </div>
                  </div>
                </div>); })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


/* ════════════════════════════════════════════════
   SECCIÓN 8: FOOTER
   Marca (IMPUESTOS MÉXICO + IMMX logo temporal),
   3 columnas de links secundarios, barra de copyright.
   Fondo: navyDark (#001a33).
   ════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════════════════════════════════
   SUPABASE AUTH — Login/Logout helpers
   ════════════════════════════════════════════════════════════════════════════ */
async function supabaseSignIn(email, password) {
  const res = await fetch(`${SUPABASE.url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "apikey": SUPABASE.anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

async function supabaseAuthFetch(table, token, options = {}) {
  const { method = "GET", body, query = "" } = options;
  const res = await fetch(`${SUPABASE.url}/rest/v1/${table}${query ? "?" + query : ""}`, {
    method,
    headers: {
      "apikey": SUPABASE.anonKey,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Prefer": method === "POST" ? "return=representation" : method === "GET" ? undefined : "return=minimal",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status}`);
  if (method === "DELETE") return true;
  return res.json();
}

/* ════════════════════════════════════════════════════════════════════════════
   ADMIN PANEL — Login + CRUD de publicaciones
   ════════════════════════════════════════════════════════════════════════════ */
const AREA_OPTIONS = [
  { value: "consultoria-fiscal", label: "Consultoría Fiscal" },
  { value: "auditoria", label: "Auditoría & Assurance" },
  { value: "asesoria-legal", label: "Asesoría Legal" },
  { value: "consultoria-negocios", label: "Consultoría de Negocios" },
  { value: "precios-transferencia", label: "Precios de Transferencia" },
];

const TAG_OPTIONS = ["FLASH INFORMATIVO", "GUÍA PRÁCTICA", "ARTÍCULO", "PERSPECTIVA", "OPINIÓN"];

const adminInput = { width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 16 };
const adminLabel = { fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 };
const adminBtn = { padding: "12px 28px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "all 0.3s" };

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(""); setLoading(true);
    try {
      const data = await supabaseSignIn(email, password);
      onLogin(data.access_token);
    } catch { setError("Credenciales inválidas"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: B.navy, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ maxWidth: 400, width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", padding: "48px 40px" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: B.white, margin: "0 0 8px" }}>Panel de Administración</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 32px" }}>Ingrese sus credenciales</p>
        <label style={adminLabel}>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={adminInput} onKeyDown={e => e.key === "Enter" && handleLogin()} />
        <label style={adminLabel}>Contraseña</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={adminInput} onKeyDown={e => e.key === "Enter" && handleLogin()} />
        {error && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(220,53,69,0.9)", margin: "0 0 16px" }}>{error}</p>}
        <button onClick={handleLogin} disabled={loading} style={{ ...adminBtn, width: "100%", background: B.accent, color: B.navy, marginTop: 8 }}>
          {loading ? "Verificando..." : "Ingresar"}
        </button>
      </div>
    </div>
  );
}

function AdminPanel({ token, onNavigate }) {
  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list, "new" = create, slug = edit
  const [msg, setMsg] = useState("");

  const loadPubs = async () => {
    setLoading(true);
    try {
      const rows = await supabaseAuthFetch("publications", token, { query: "order=published_at.desc" });
      setPubs(rows || []);
    } catch { setPubs([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadPubs(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta publicación?")) return;
    try {
      await supabaseAuthFetch("publications", token, { method: "DELETE", query: `id=eq.${id}` });
      setMsg("Publicación eliminada");
      loadPubs();
      setTimeout(() => setMsg(""), 3000);
    } catch { setMsg("Error al eliminar"); }
  };

  const handleSave = async (formData) => {
    try {
      if (editing === "new") {
        await supabaseAuthFetch("publications", token, { method: "POST", body: formData });
        setMsg("Publicación creada");
      } else {
        await supabaseAuthFetch("publications", token, { method: "PATCH", query: `slug=eq.${editing}`, body: { ...formData, updated_at: new Date().toISOString() } });
        setMsg("Publicación actualizada");
      }
      setEditing(null);
      loadPubs();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) { setMsg("Error al guardar: " + err.message); }
  };

  if (editing) {
    const pub = editing === "new" ? null : pubs.find(p => p.slug === editing);
    return <AdminEditor pub={pub} onSave={handleSave} onCancel={() => setEditing(null)} />;
  }

  return (
    <div style={{ background: B.navy, minHeight: "100vh", padding: "40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: B.white, margin: 0 }}>Publicaciones</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>{pubs.length} publicaciones</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setEditing("new")} style={{ ...adminBtn, background: B.accent, color: B.navy }}>+ Nueva Publicación</button>
            <button onClick={() => onNavigate(null)} style={{ ...adminBtn, background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)" }}>← Volver al sitio</button>
          </div>
        </div>
        {msg && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "12px 16px", background: msg.includes("Error") ? "rgba(220,53,69,0.15)" : "rgba(52,168,83,0.15)", color: msg.includes("Error") ? "rgba(220,53,69,0.9)" : "rgba(52,168,83,0.9)", marginBottom: 24 }}>{msg}</div>}
        {loading ? (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>Cargando...</p>
        ) : (
          <div style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 140px 120px 100px", padding: "14px 20px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              {["Título (ES)", "Área", "Tag", "Fecha", "Acciones"].map(h => (
                <span key={h} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{h}</span>
              ))}
            </div>
            {pubs.map(p => (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 140px 140px 120px 100px", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center" }}>
                <div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: B.white, fontWeight: 500 }}>{p.title_es || p.title || "—"}</span>
                  {p.title_en && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 8 }}>EN ✓</span>}
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{AREA_OPTIONS.find(a => a.value === p.area)?.label || p.area}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{p.tag}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{p.published_at}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setEditing(p.slug)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)", padding: "6px 12px", fontFamily: "'DM Sans', sans-serif", fontSize: 11, cursor: "pointer" }}>Editar</button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: "none", border: "1px solid rgba(220,53,69,0.3)", color: "rgba(220,53,69,0.7)", padding: "6px 12px", fontFamily: "'DM Sans', sans-serif", fontSize: 11, cursor: "pointer" }}>×</button>
                </div>
              </div>
            ))}
            {pubs.length === 0 && <p style={{ padding: 40, textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>No hay publicaciones. Cree la primera.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminEditor({ pub, onSave, onCancel }) {
  const [form, setForm] = useState({
    slug: pub?.slug || "",
    area: pub?.area || "consultoria-fiscal",
    tag: pub?.tag || "ARTÍCULO",
    title_es: pub?.title_es || "",
    title_en: pub?.title_en || "",
    excerpt_es: pub?.excerpt_es || "",
    excerpt_en: pub?.excerpt_en || "",
    content_es: pub?.content_es || "",
    content_en: pub?.content_en || "",
    published_at: pub?.published_at || new Date().toISOString().split("T")[0],
  });
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const autoSlug = (title) => title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

  return (
    <div style={{ background: B.navy, minHeight: "100vh", padding: "40px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: B.white, margin: 0 }}>{pub ? "Editar Publicación" : "Nueva Publicación"}</h1>
          <button onClick={onCancel} style={{ ...adminBtn, background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)" }}>← Volver</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div><label style={adminLabel}>Área</label><select value={form.area} onChange={e => u("area", e.target.value)} style={adminInput}>{AREA_OPTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}</select></div>
          <div><label style={adminLabel}>Tag</label><select value={form.tag} onChange={e => u("tag", e.target.value)} style={adminInput}>{TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          <div><label style={adminLabel}>Fecha de publicación</label><input type="date" value={form.published_at} onChange={e => u("published_at", e.target.value)} style={adminInput} /></div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={adminLabel}>Slug (URL)</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={form.slug} onChange={e => u("slug", e.target.value)} style={{ ...adminInput, flex: 1, marginBottom: 0 }} placeholder="mi-publicacion" />
            <button onClick={() => u("slug", autoSlug(form.title_es))} style={{ ...adminBtn, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontSize: 11, padding: "12px 16px" }}>Auto</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          <div style={{ background: "rgba(255,255,255,0.02)", padding: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.6)", margin: "0 0 20px", letterSpacing: "0.06em" }}>🇲🇽 ESPAÑOL</h3>
            <label style={adminLabel}>Título</label>
            <input value={form.title_es} onChange={e => u("title_es", e.target.value)} style={adminInput} placeholder="Título de la publicación" />
            <label style={adminLabel}>Resumen</label>
            <textarea value={form.excerpt_es} onChange={e => u("excerpt_es", e.target.value)} rows={3} style={{ ...adminInput, resize: "vertical" }} placeholder="Resumen breve (1-2 oraciones)" />
            <label style={adminLabel}>Contenido</label>
            <textarea value={form.content_es} onChange={e => u("content_es", e.target.value)} rows={12} style={{ ...adminInput, resize: "vertical" }} placeholder="Contenido completo. Use doble salto de línea para separar párrafos." />
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", padding: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.6)", margin: "0 0 20px", letterSpacing: "0.06em" }}>🇺🇸 ENGLISH</h3>
            <label style={adminLabel}>Title</label>
            <input value={form.title_en} onChange={e => u("title_en", e.target.value)} style={adminInput} placeholder="Publication title" />
            <label style={adminLabel}>Excerpt</label>
            <textarea value={form.excerpt_en} onChange={e => u("excerpt_en", e.target.value)} rows={3} style={{ ...adminInput, resize: "vertical" }} placeholder="Brief summary (1-2 sentences)" />
            <label style={adminLabel}>Content</label>
            <textarea value={form.content_en} onChange={e => u("content_en", e.target.value)} rows={12} style={{ ...adminInput, resize: "vertical" }} placeholder="Full content. Use double line breaks for paragraphs." />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => { if (!form.slug || !form.title_es) { alert("Slug y Título (ES) son obligatorios"); return; } onSave(form); }} style={{ ...adminBtn, background: B.accent, color: B.navy }}>
            {pub ? "Guardar Cambios" : "Publicar"}
          </button>
          <button onClick={onCancel} style={{ ...adminBtn, background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)" }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PUBLICACIÓN INDIVIDUAL — Página de artículo
   Carga contenido por slug desde Supabase. Renderiza párrafos.
   ════════════════════════════════════════════════════════════════════════════ */
function PublicationPage({ slug, onNavigate }) {
  const lang = useLang();
  const [pub, setPub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (SUPABASE.url && SUPABASE.anonKey) {
          const rows = await supabaseFetch("publications", { query: `slug=eq.${slug}&limit=1` });
          if (rows && rows.length > 0) { setPub(rows[0]); setLoading(false); return; }
        }
        /* Fallback: buscar en LIBRARY */
        for (const area of LIBRARY) {
          for (const p of area.publications) {
            if (p.slug === slug) { setPub({ title_es: p.title, title_en: "", excerpt_es: p.excerpt, excerpt_en: "", content_es: p.excerpt, content_en: "", tag: p.tag, published_at: p.date, area: area.id }); setLoading(false); return; }
          }
        }
        setPub(null);
      } catch { setPub(null); }
      finally { setLoading(false); }
    };
    load();
  }, [slug]);

  const title = pub ? (lang === "en" && pub.title_en ? pub.title_en : pub.title_es) : "";
  const content = pub ? (lang === "en" && pub.content_en ? pub.content_en : pub.content_es) : "";
  const excerpt = pub ? (lang === "en" && pub.excerpt_en ? pub.excerpt_en : pub.excerpt_es) : "";
  const paragraphs = content ? content.split(/\n\n+/) : [excerpt];

  return (
    <div style={{ background: B.navy, minHeight: "100vh" }}>
      <div style={{ height: 58, flexShrink: 0 }} />
      {loading ? (
        <div style={{ padding: "120px 40px", textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>{lang === "en" ? "Loading..." : "Cargando..."}</div>
      ) : !pub ? (
        <div style={{ padding: "120px 40px", textAlign: "center" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.4)" }}>{lang === "en" ? "Publication not found." : "Publicación no encontrada."}</p>
          <button onClick={() => onNavigate("horizontes-page")} style={{ ...adminBtn, background: B.accent, color: B.navy, marginTop: 24 }}>{lang === "en" ? "Back to Insights" : "Volver a Horizontes"}</button>
        </div>
      ) : (
        <article style={{ maxWidth: 760, margin: "0 auto", padding: "60px 40px 120px" }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 12px", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>{pub.tag}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{pub.published_at}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{AREA_OPTIONS.find(a => a.value === pub.area)?.label || pub.area}</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, color: B.white, lineHeight: 1.2, margin: "0 0 24px" }}>{title}</h1>
            <div style={{ width: 48, height: 2, background: "rgba(255,255,255,0.15)" }} />
          </div>
          <div>
            {paragraphs.map((p, i) => {
              const trimmed = p.trim();
              if (!trimmed) return null;
              if (trimmed.startsWith("## ")) return <h2 key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.8)", margin: "48px 0 16px", letterSpacing: "0.02em" }}>{trimmed.slice(3)}</h2>;
              return <p key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.9, color: "rgba(255,255,255,0.55)", margin: "0 0 24px" }}>{trimmed}</p>;
            })}
          </div>
          <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button onClick={() => onNavigate("horizontes-page")} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", background: "none", border: "1px solid rgba(255,255,255,0.15)", padding: "12px 24px", cursor: "pointer", letterSpacing: "0.04em" }}>
              ← {lang === "en" ? "Back to Insights" : "Volver a Horizontes"}
            </button>
          </div>
        </article>
      )}
    </div>
  );
}

function Footer({ onNavigate }) {
  const lang = useLang();
  /* Mapa de servicios del footer → rutas de navegación */
  const footerServices = [
    { label: { es: "Consultoría Fiscal", en: "Tax Advisory" }, route: "consultoria-fiscal" },
    { label: { es: "Auditoría & Assurance", en: "Audit & Assurance" }, route: "auditoria-assurance" },
    { label: { es: "Asesoría Legal", en: "Legal Advisory" }, route: "asesoria-legal" },
    { label: { es: "Consultoría de Negocios", en: "Business Consulting" }, route: "consultoria-negocios" },
    { label: { es: "Precios de Transferencia", en: "Transfer Pricing" }, route: "precios-transferencia" },
  ];

  return (
    <footer style={{
      background: B.navyDark, padding: "60px 40px 40px",
      borderTop: "1px solid rgba(255,255,255,0.08)",
    }}>
      <div style={{
        maxWidth: 1320, margin: "0 auto",
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", flexWrap: "wrap", gap: 40,
      }}>
        <div>
          {/* Full name – same size, gold */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
              fontSize: 25, color: B.accent, letterSpacing: "0.04em",
            }}>IMPUESTOS</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
              fontSize: 25, color: B.accent, letterSpacing: "0.04em",
            }}>MÉXICO</span>
          </div>
          {/* IMMX logo below */}
          <div style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
            fontSize: 14, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)",
            marginBottom: 18,
          }}>IMMX</div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 15,
            color: "rgba(255,255,255,0.65)", maxWidth: 300, lineHeight: 1.6,
          }}>
            {t(T.footer.tagline, lang)}
          </p>
        </div>

        <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
          {/* ── Columna: Servicios (links funcionales) ── */}
          <div>
            <h4 style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: B.accent, margin: "0 0 16px",
            }}>{t(T.footer.servicios, lang)}</h4>
            {footerServices.map((s, j) => (
              <a key={j} onClick={() => onNavigate && onNavigate(s.route)}
                style={{
                  display: "block", fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15, color: "rgba(255,255,255,0.65)",
                  textDecoration: "none", marginBottom: 10, cursor: "pointer",
                  transition: "color 0.3s",
                }}
                onMouseEnter={e => e.target.style.color = B.accent}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.65)"}
              >{typeof s.label === "object" ? t(s.label, lang) : s.label}</a>
            ))}
          </div>

          {/* ── Columna: Firma ── */}
          <div>
            <h4 style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: B.accent, margin: "0 0 16px",
            }}>{t(T.footer.firma, lang)}</h4>
            <a onClick={() => onNavigate && onNavigate(null, "nosotros")} style={{
              display: "block", fontFamily: "'DM Sans', sans-serif",
              fontSize: 15, color: "rgba(255,255,255,0.65)",
              textDecoration: "none", marginBottom: 10, cursor: "pointer",
              transition: "color 0.3s",
            }}
              onMouseEnter={e => e.target.style.color = B.accent}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.65)"}
            >{t(T.footer.quienes, lang)}</a>
          </div>

          {/* ── Columna: Recursos ── */}
          <div>
            <h4 style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: B.accent, margin: "0 0 16px",
            }}>{t(T.footer.recursos, lang)}</h4>
            <a onClick={() => onNavigate && onNavigate("horizontes-page")} style={{
              display: "block", fontFamily: "'DM Sans', sans-serif",
              fontSize: 15, color: "rgba(255,255,255,0.65)",
              textDecoration: "none", marginBottom: 10, cursor: "pointer",
              transition: "color 0.3s",
            }}
              onMouseEnter={e => e.target.style.color = B.accent}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.65)"}
            >{t(T.footer.horizontes, lang)}</a>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 1320, margin: "29px auto 0",
        paddingTop: 17, borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 15,
          color: "rgba(255,255,255,0.65)",
        }}>{t(T.footer.derechos, lang)}</span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
        <a onClick={() => onNavigate && onNavigate("legales")} style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 15,
          color: "rgba(255,255,255,0.65)", textDecoration: "none", cursor: "pointer",
          transition: "color 0.3s",
        }}
          onMouseEnter={e => e.target.style.color = B.accent}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.65)"}
        >{t(T.footer.legales, lang)}</a>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PÁGINAS DE SERVICIO — CONFIGURACIÓN DE DATOS
   ══════════════════════════════════════════════════════════════════════════════
   Cada entrada en PAGE_CONFIGS contiene TODOS los datos únicos de una página
   de servicio. Los componentes genéricos (ServiceHero, ServicePracticeAreas, etc.)
   leen estos datos para renderizar cada página con contenido distinto pero
   estructura y diseño idénticos.
   ════════════════════════════════════════════════════════════════════════════ */
const PAGE_CONFIGS = {
  "consultoria-fiscal": {
    title: "Consultoría Fiscal",
    breadcrumb: "Consultoría Fiscal",
    heroParagraphs: [
      "Fiscalización digital, reformas constantes y estándares internacionales como BEPS y Pilar Dos exigen un asesor que anticipe la evolución normativa y transforme la complejidad en ventaja competitiva.",
      "Nuestra práctica de Consultoría Fiscal integra experiencia profunda en la materia con tecnología de vanguardia para ofrecer soluciones que van desde el cumplimiento operativo hasta la estructuración de operaciones complejas.",
    ],
    practiceAreas: {
      h2Line1: "Cobertura fiscal",
      h2Line2: "de amplio espectro",
      paragraph: "Nuestras áreas de especialización cubren cada dimensión de la práctica tributaria, desde el cumplimiento operativo hasta la planeación internacional más sofisticada.",
      items: [
        { icon: "◈", title: "Impuestos Corporativos", desc: "Asesoría integral en ISR, IVA, IEPS y contribuciones federales. Estructuración fiscal para operaciones nacionales e internacionales que optimiza la carga tributaria y se alinea con los objetivos financieros y comerciales de cada organización.", tags: ["ISR", "IVA", "IEPS", "Estructuración Fiscal", "Eficiencia Tributaria"] },
        { icon: "◇", title: "Cumplimiento Fiscal", desc: "Gestión integral del ciclo de obligaciones fiscales: declaraciones, pagos provisionales, dictámenes e informativas. Implementamos controles que minimizan riesgos y contingencias ante la autoridad.", tags: ["Declaraciones", "Dictamen Fiscal", "Informativas"] },
        { icon: "▣", title: "Defensa Fiscal", desc: "Representación ante autoridades fiscales en auditorías, revisiones, medios de defensa y litigios. Protegemos los intereses de nuestros clientes en cada instancia, desde recurso de revocación hasta amparo.", tags: ["Auditorías", "Litigio", "Recursos", "Amparo"] },
        { icon: "◎", title: "Impuestos Internacionales", desc: "Asesoría en tratados para evitar la doble tributación, establecimientos permanentes, estructuras de inversión extranjera y cumplimiento de regulaciones internacionales como BEPS y Pilar Dos.", tags: ["Tratados", "BEPS", "Pilar Dos", "EP"] },
        { icon: "▲", title: "Tax Technology", desc: "Transformación digital de la función fiscal. Diagnóstico, diseño e implementación de soluciones tecnológicas que automatizan procesos, mejoran la calidad de datos y habilitan decisiones en tiempo real.", tags: ["Automatización", "CFDI", "Data Analytics"] },
      ],
    },
    methodology: {
      h2Line1: "Metodología que",
      h2Line2: "genera certeza",
      paragraph: "Cada compromiso sigue un proceso disciplinado que combina rigor analítico, experiencia sectorial y tecnología para entregar soluciones que trascienden la consulta puntual y construyen valor sostenible.",
      steps: [
        { step: "01", title: "Diagnóstico", desc: "Evaluación exhaustiva de la situación fiscal actual, identificación de riesgos y oportunidades de optimización." },
        { step: "02", title: "Estructuración", desc: "Diseño de soluciones a la medida que alinean la estructura fiscal con los objetivos comerciales y de inversión." },
        { step: "03", title: "Implementación", desc: "Ejecución disciplinada de la estructura con acompañamiento en cada fase, desde restructuración hasta cumplimiento." },
        { step: "04", title: "Monitoreo", desc: "Seguimiento continuo del entorno regulatorio y fiscal para anticipar cambios y adaptar la estructura proactivamente." },
      ],
    },
    sectors: {
      h2Line1: "Fiscalidad especializada",
      h2Accent: "por industria",
      paragraph: "Cada sector tiene un marco regulatorio y fiscal único. Nuestros equipos combinan conocimiento tributario con experiencia operativa en cada industria.",
      items: [
        { name: "Manufactura e Industria", focus: "Beneficios fiscales del nearshoring, programas IMMEX, estímulos a la inversión productiva y optimización de la cadena de valor fiscal." },
        { name: "Infraestructura y Real Estate", focus: "Fideicomisos inmobiliarios (FIBRAS), estímulos a infraestructura, régimen de construcción y planeación fiscal de proyectos de largo plazo." },
        { name: "Retail y Consumo", focus: "Impuestos indirectos, optimización de la cadena de suministro, comercio electrónico transfronterizo y cumplimiento multijurisdiccional." },
      ],
    },
    insights: {
      h2Line1: "Liderazgo de",
      h2Line2: "pensamiento fiscal",
      items: [
        { tag: "FLASH INFORMATIVO", date: "07 Mar 2026", title: "Reforma Fiscal 2026: Cambios clave en deducciones corporativas", slug: "reforma-fiscal-2026-cambios-clave-en-deducciones-c", excerpt: "Análisis de las modificaciones a las deducciones autorizadas en materia de ISR y su impacto para el ejercicio fiscal 2026." },
        { tag: "PERSPECTIVA", date: "28 Feb 2026", title: "Pilar Dos en México: Preparándose para el impuesto mínimo global", slug: "pilar-dos-en-mexico-preparandose-para-el-impuesto-", excerpt: "Las reglas de impuesto mínimo global de la OCDE impactan a grupos multinacionales con presencia en México. Analizamos las implicaciones prácticas." },
        { tag: "ARTÍCULO", date: "15 Feb 2026", title: "Fiscalización digital del SAT: Lo que debe saber su empresa", slug: "fiscalizacion-digital-del-sat-lo-que-debe-saber-su", excerpt: "El SAT ha reforzado sus capacidades tecnológicas para detectar discrepancias. Exploramos cómo prepararse ante este nuevo paradigma de revisión." },
      ],
    },
    contact: {
      h2Pre: "Agradecemos su interés",
      h2Accent: "en nuestros servicios",
      paragraph: "Por favor, tome un momento para brindarnos mayor detalle sobre su requerimiento de servicios fiscales.",
      formTitle: "Solicitud de Consulta Fiscal",
      email: "contacto@impuestosmexico.com.mx",
    },
  },

  "auditoria-assurance": {
    title: "Auditoría & Assurance",
    breadcrumb: "Auditoría & Assurance",
    heroParagraphs: [
      "Reguladores más exigentes, inversionistas con mayores expectativas de transparencia y un entorno de reporte financiero en constante evolución requieren un auditor que combine independencia con profundidad técnica.",
      "Nuestra práctica de Auditoría & Assurance integra equipos especializados por industria con metodologías basadas en data analytics para entregar aseguramiento que genera confianza y valor más allá del dictamen.",
    ],
    practiceAreas: {
      h2Line1: "Aseguramiento con",
      h2Line2: "visión integral",
      paragraph: "Nuestras áreas de especialización abarcan cada dimensión del aseguramiento financiero y no financiero, desde la auditoría estatutaria hasta servicios forenses de alta complejidad.",
      items: [
        { icon: "◇", title: "Auditoría Interna & Co-sourcing", desc: "Evaluación sistemática de procesos, controles y gobierno corporativo. Diseñamos y ejecutamos planes de auditoría interna — como función tercerizada o en modelo de co-sourcing — que fortalecen la segunda y tercera línea de defensa de su organización.", tags: ["Plan de Auditoría", "Co-sourcing", "Gobierno Corporativo"] },
        { icon: "▣", title: "Control Interno & SOX", desc: "Evaluación, diseño y remediación del sistema de control interno sobre reporte financiero. Acompañamiento integral en cumplimiento con la Ley Sarbanes-Oxley, incluyendo pruebas de efectividad operativa y reporte a comités de auditoría.", tags: ["COSO", "SOX 404", "Remediación", "Comité de Auditoría"] },
        { icon: "◎", title: "Assurance & Atestiguamiento", desc: "Servicios de aseguramiento sobre información no financiera: reportes de sostenibilidad, métricas ESG, cumplimiento contractual y proyecciones financieras. Generamos credibilidad ante terceros mediante procedimientos acordados y revisiones limitadas.", tags: ["ESG", "ISAE 3000", "Procedimientos Acordados", "Sostenibilidad"] },
      ],
    },
    methodology: {
      h2Line1: "Rigor metodológico,",
      h2Line2: "valor tangible",
      paragraph: "Cada engagement de auditoría sigue un proceso estructurado que combina las Normas Internacionales de Auditoría con tecnología de data analytics y juicio profesional especializado por industria.",
      steps: [
        { step: "01", title: "Planeación", desc: "Comprensión del negocio, evaluación de riesgos de auditoría, determinación de materialidad y diseño de la estrategia de aseguramiento con enfoque top-down." },
        { step: "02", title: "Evaluación de Controles", desc: "Identificación y prueba de los controles internos clave. Determinación de la confianza en controles para definir la naturaleza, oportunidad y alcance de pruebas sustantivas." },
        { step: "03", title: "Procedimientos Sustantivos", desc: "Ejecución de pruebas analíticas y de detalle mediante técnicas avanzadas de data analytics, confirmaciones y revisión documental de las aserciones financieras." },
        { step: "04", title: "Dictamen y Reporte", desc: "Formación de la opinión de auditoría, comunicación de hallazgos al comité de auditoría y emisión del dictamen con observaciones y recomendaciones de mejora." },
      ],
    },
    sectors: {
      h2Line1: "Auditoría especializada",
      h2Accent: "por industria",
      paragraph: "Cada industria tiene dinámicas contables, regulatorias y de riesgo particulares. Nuestros equipos combinan competencia técnica en auditoría con conocimiento profundo del sector.",
      items: [
        { name: "Manufactura e Industria", focus: "Revisión de inventarios, costos de producción, activos fijos y operaciones IMMEX. Enfoque particular en reconocimiento de ingresos, arrendamientos y cadenas de suministro complejas." },
        { name: "Infraestructura y Real Estate", focus: "Auditoría de fideicomisos inmobiliarios (FIBRAS), proyectos de infraestructura de largo plazo, contratos de construcción y propiedades de inversión a valor razonable." },
        { name: "Retail y Consumo", focus: "Revisión de operaciones de alto volumen transaccional, programas de lealtad, inventarios en múltiples ubicaciones y reconocimiento de ingresos en comercio electrónico." },
      ],
    },
    insights: {
      h2Line1: "Liderazgo de",
      h2Line2: "pensamiento en assurance",
      items: [
        { tag: "FLASH INFORMATIVO", date: "05 Mar 2026", title: "Nuevas NIA revisadas: Impacto en la auditoría de estimaciones contables", slug: "nuevas-nia-revisadas-impacto-en-la-auditoria-de-es", excerpt: "La adopción de las NIA revisadas modifica el enfoque del auditor ante estimaciones complejas. Analizamos los cambios clave y las implicaciones prácticas para la temporada 2026." },
        { tag: "PERSPECTIVA", date: "20 Feb 2026", title: "ESG Assurance: El nuevo estándar de confianza corporativa", slug: "esg-assurance-el-nuevo-estandar-de-confianza-corpo", excerpt: "Los reportes de sostenibilidad verificados por terceros se consolidan como requisito de mercado. Exploramos el marco ISAE 3000 y su aplicación práctica en México." },
        { tag: "ARTÍCULO", date: "08 Feb 2026", title: "Inteligencia artificial en auditoría: De la automatización al juicio aumentado", slug: "inteligencia-artificial-en-auditoria-de-la-automat", excerpt: "Las herramientas de IA están transformando los procedimientos de auditoría. Evaluamos su impacto en el muestreo, la detección de anomalías y la eficiencia del engagement." },
      ],
    },
    contact: {
      h2Pre: "Agradecemos su interés",
      h2Accent: "en nuestros servicios",
      paragraph: "Por favor, tome un momento para brindarnos mayor detalle sobre su requerimiento de auditoría y aseguramiento.",
      formTitle: "Solicitud de Propuesta de Auditoría",
      email: "contacto@impuestosmexico.com.mx",
    },
  },

  "asesoria-legal": {
    title: "Asesoría Legal",
    breadcrumb: "Asesoría Legal",
    heroParagraphs: [
      "Un entorno regulatorio en constante evolución y reformas legislativas de amplio alcance exigen un asesor legal que entienda las implicaciones fiscales de cada decisión corporativa y convierta la complejidad normativa en ventaja estratégica.",
      "Nuestra práctica de Asesoría Legal nace de la convicción de que toda decisión jurídica tiene una dimensión tributaria. Integramos conocimiento legal especializado con visión fiscal para ofrecer soluciones que protegen el patrimonio y optimizan la estructura de cada operación.",
    ],
    practiceAreas: {
      h2Line1: "Asesoría legal con",
      h2Line2: "enfoque fiscal",
      paragraph: "Nuestras áreas de especialización se concentran en las dimensiones del derecho que impactan directamente la posición fiscal de las empresas: desde la estructuración corporativa hasta el cumplimiento regulatorio con consecuencias tributarias.",
      items: [
        { icon: "◈", title: "Derecho Corporativo y Societario", desc: "Asesoría en constitución de sociedades, gobierno corporativo, reestructuras societarias y operaciones de compraventa de acciones. Cada estructura se diseña considerando las implicaciones fiscales desde el origen, asegurando eficiencia tributaria y solidez jurídica.", tags: ["Constitución de Sociedades", "Reestructuras", "Due Diligence", "Gobierno Corporativo"] },
        { icon: "◇", title: "Defensa y Controversias Fiscales", desc: "Representación ante autoridades fiscales en revisiones, auditorías y procedimientos administrativos. Diseñamos estrategias de defensa que combinan rigor procesal con visión tributaria para proteger los intereses patrimoniales de cada cliente.", tags: ["Recurso de Revocación", "Juicio de Nulidad", "Amparo Fiscal", "Consultas Vinculativas"] },
        { icon: "▣", title: "Cumplimiento Regulatorio Fiscal", desc: "Diseño e implementación de marcos de cumplimiento normativo con enfoque en las obligaciones fiscales de cada entidad. Aseguramos que la estructura legal soporte la deducibilidad, el acreditamiento y la correcta documentación de operaciones ante la autoridad tributaria.", tags: ["Obligaciones Fiscales", "Documentación Soporte", "Protección de Datos", "Compliance Fiscal"] },
        { icon: "◎", title: "Derecho Laboral y Seguridad Social", desc: "Asesoría preventiva en relaciones laborales con enfoque en las implicaciones fiscales de la nómina, la subcontratación y las contribuciones de seguridad social. Acompañamos a las empresas en el cumplimiento del régimen REPSE, obligaciones ante IMSS e Infonavit, y en la correcta estructuración de esquemas de compensación.", tags: ["Relaciones Laborales", "REPSE", "IMSS / Infonavit"] },
        { icon: "▲", title: "Derecho Inmobiliario", desc: "Estructuración legal de operaciones inmobiliarias, fideicomisos, régimen de propiedad en condominio y controversias de arrendamiento. Asesoramos a desarrolladores e inversionistas en la documentación y cierre de transacciones complejas del sector.", tags: ["Fideicomisos", "Arrendamiento", "Régimen Condominal", "Due Diligence Inmobiliaria"] },
      ],
    },
    methodology: {
      h2Line1: "Metodología que",
      h2Line2: "genera certeza jurídica",
      paragraph: "Cada asunto sigue un proceso disciplinado que combina rigor técnico-jurídico, experiencia sectorial y visión de negocio para entregar soluciones que trascienden la consulta puntual y construyen valor sostenible para nuestros clientes.",
      steps: [
        { step: "01", title: "Análisis", desc: "Evaluación integral del contexto jurídico, identificación de riesgos legales y mapeo de las normas aplicables para definir la estrategia óptima de actuación." },
        { step: "02", title: "Estrategia", desc: "Diseño de la ruta legal a la medida del caso: selección de foros, construcción argumental, definición de plazos y articulación con los objetivos de negocio del cliente." },
        { step: "03", title: "Ejecución", desc: "Implementación disciplinada de la estrategia con acompañamiento cercano en cada fase procesal, negociación o trámite regulatorio, asegurando calidad y oportunidad." },
        { step: "04", title: "Seguimiento", desc: "Monitoreo continuo del entorno regulatorio y del estado de los asuntos activos para anticipar cambios normativos y adaptar la estrategia de forma proactiva." },
      ],
    },
    sectors: {
      h2Line1: "Asesoría legal especializada",
      h2Accent: "por industria",
      paragraph: "Cada sector opera bajo un marco regulatorio y legal distinto. Nuestros equipos combinan conocimiento jurídico profundo con experiencia operativa en cada industria.",
      items: [
        { name: "Manufactura e Industria", focus: "Contratos de operación bajo programas IMMEX, nearshoring, cumplimiento regulatorio con impacto fiscal, propiedad intelectual aplicada a procesos y asesoría laboral vinculada a obligaciones tributarias." },
        { name: "Infraestructura y Real Estate", focus: "Estructuración de proyectos de APP, fideicomisos inmobiliarios, régimen de propiedad en condominio y controversias de arrendamiento comercial." },
        { name: "Retail y Consumo", focus: "Asesoría legal para operaciones de alto volumen transaccional, contratos de franquicia, protección al consumidor y cumplimiento regulatorio en comercio electrónico con enfoque en las implicaciones fiscales de cada operación." },
      ],
    },
    insights: {
      h2Line1: "Liderazgo de",
      h2Line2: "pensamiento jurídico",
      items: [
        { tag: "FLASH INFORMATIVO", date: "05 Mar 2026", title: "Reforma Laboral 2026: Impacto fiscal en las obligaciones patronales", slug: "reforma-laboral-2026-impacto-fiscal-en-las-obligac", excerpt: "Analizamos las nuevas disposiciones en materia de subcontratación y REPSE que modifican la deducibilidad de servicios especializados y las contribuciones de seguridad social." },
        { tag: "PERSPECTIVA", date: "22 Feb 2026", title: "Nearshoring y estructuración societaria: Consideraciones legales con impacto tributario", slug: "nearshoring-y-estructuracion-societaria-considerac", excerpt: "México recibe flujos récord de inversión por nearshoring. Exploramos las estructuras corporativas óptimas desde la perspectiva legal-fiscal para proteger la inversión." },
        { tag: "ARTÍCULO", date: "10 Feb 2026", title: "Cumplimiento REPSE: La intersección entre derecho laboral y obligaciones fiscales", slug: "cumplimiento-repse-la-interseccion-entre-derecho-l", excerpt: "La regulación de servicios especializados redefine la relación entre cumplimiento laboral y deducibilidad fiscal. Evaluamos las mejores prácticas para asegurar ambos frentes." },
      ],
    },
    contact: {
      h2Pre: "Agradecemos su interés",
      h2Accent: "en nuestros servicios",
      paragraph: "Por favor, tome un momento para brindarnos mayor detalle sobre su requerimiento de asesoría legal.",
      formTitle: "Solicitud de Consulta Legal",
      email: "contacto@impuestosmexico.com.mx",
    },
  },

  "consultoria-negocios": {
    title: "Consultoría de Negocios",
    breadcrumb: "Consultoría de Negocios",
    heroParagraphs: [
      "Mercados volátiles, disrupción tecnológica y un entorno regulatorio en constante cambio exigen un asesor que combine visión estratégica con capacidad de ejecución para transformar la complejidad en oportunidad.",
      "Nuestra práctica de Consultoría de Negocios integra experiencia sectorial profunda con metodologías probadas para acompañar a las organizaciones desde la definición estratégica hasta la ejecución operativa, siempre con una perspectiva fiscal y financiera transversal.",
    ],
    practiceAreas: {
      h2Line1: "Soluciones estratégicas",
      h2Line2: "para cada desafío",
      paragraph: "Nuestras áreas de especialización cubren cada dimensión de la consultoría de negocios, desde la estrategia corporativa hasta la reestructuración operativa y las transacciones transformacionales.",
      items: [
        { icon: "◈", title: "Estrategia Corporativa", desc: "Desarrollo de planes estratégicos que alinean la visión de la organización con su entorno competitivo. Definimos modelos de negocio, rutas de crecimiento y posicionamiento de mercado con una perspectiva integral que incorpora las implicaciones fiscales y regulatorias de cada decisión.", tags: ["Plan Estratégico", "Modelo de Negocio", "Crecimiento", "Posicionamiento"] },
        { icon: "◇", title: "Transformación Digital", desc: "Diagnóstico, diseño y acompañamiento en la implementación de iniciativas de transformación digital. Ayudamos a las organizaciones a redefinir procesos, adoptar tecnologías habilitadoras y construir capacidades digitales que impulsen la eficiencia operativa y la innovación.", tags: ["Roadmap Digital", "Automatización", "Innovación", "Change Management"] },
        { icon: "▣", title: "Gestión del Desempeño", desc: "Diseño e implementación de modelos de gestión del desempeño organizacional: definición de indicadores clave, tableros de control y sistemas de seguimiento que conectan la operación diaria con los objetivos estratégicos y financieros de la empresa.", tags: ["KPIs", "Balanced Scorecard", "Tableros de Control", "Eficiencia Operativa"] },
        { icon: "◎", title: "Reestructuración Operativa", desc: "Rediseño de estructuras organizacionales, optimización de costos y mejora de procesos críticos. Acompañamos a las empresas en la transformación de sus operaciones para recuperar competitividad, mejorar márgenes y fortalecer la cadena de valor.", tags: ["Optimización de Costos", "Rediseño de Procesos", "Cadena de Valor"] },
      ],
    },
    methodology: {
      h2Line1: "Metodología que",
      h2Line2: "genera resultados",
      paragraph: "Cada compromiso sigue un proceso disciplinado que combina rigor analítico, experiencia sectorial y visión de negocio para entregar soluciones que trascienden la consulta puntual y construyen ventaja competitiva sostenible.",
      steps: [
        { step: "01", title: "Diagnóstico", desc: "Evaluación integral de la situación actual del negocio: modelo operativo, posición competitiva, capacidades organizacionales y oportunidades de mejora con perspectiva financiera y tributaria." },
        { step: "02", title: "Diseño", desc: "Construcción de la solución a la medida: definición de la estrategia, diseño del modelo operativo objetivo y planificación detallada de la ruta de implementación." },
        { step: "03", title: "Implementación", desc: "Ejecución disciplinada del plan con acompañamiento cercano en cada fase, gestión del cambio organizacional y seguimiento de hitos para asegurar resultados tangibles." },
        { step: "04", title: "Optimización", desc: "Monitoreo continuo de los resultados, ajuste de la estrategia ante cambios del entorno y mejora iterativa para sostener la ventaja competitiva en el tiempo." },
      ],
    },
    sectors: {
      h2Line1: "Consultoría especializada",
      h2Accent: "por industria",
      paragraph: "Cada sector opera con dinámicas competitivas, regulatorias y operativas distintas. Nuestros equipos combinan conocimiento de negocio con experiencia práctica en cada industria.",
      items: [
        { name: "Manufactura e Industria", focus: "Optimización de cadenas de suministro, estrategias de nearshoring, mejora de productividad en planta, automatización de procesos y evaluación de oportunidades de expansión en mercados emergentes." },
        { name: "Infraestructura y Real Estate", focus: "Evaluación de viabilidad de proyectos de infraestructura, estructuración de asociaciones público-privadas, análisis de portafolios inmobiliarios y estrategias de desarrollo de largo plazo." },
        { name: "Retail y Consumo", focus: "Transformación omnicanal, optimización de la experiencia del cliente, estrategias de pricing, rediseño de la cadena de suministro y evaluación de oportunidades de expansión comercial." },
      ],
    },
    insights: {
      h2Line1: "Liderazgo de",
      h2Line2: "pensamiento estratégico",
      items: [
        { tag: "FLASH INFORMATIVO", date: "06 Mar 2026", title: "Nearshoring 2026: Oportunidades estratégicas para empresas en México", slug: "nearshoring-2026-oportunidades-estrategicas-para-e", excerpt: "El flujo de inversión por nearshoring continúa transformando el panorama industrial mexicano. Analizamos las estrategias que están adoptando las empresas para capitalizar esta tendencia." },
        { tag: "PERSPECTIVA", date: "25 Feb 2026", title: "Transformación digital en PyMEs: De la supervivencia a la ventaja competitiva", slug: "transformacion-digital-en-pymes-de-la-supervivenci", excerpt: "Las empresas medianas mexicanas enfrentan el reto de digitalizarse en un entorno de márgenes ajustados. Exploramos las rutas más efectivas según el sector y la madurez organizacional." },
        { tag: "ARTÍCULO", date: "12 Feb 2026", title: "Due diligence en tiempos de incertidumbre: Lo que toda transacción necesita hoy", slug: "due-diligence-en-tiempos-de-incertidumbre-lo-que-t", excerpt: "La complejidad regulatoria y fiscal de México exige un enfoque de due diligence más profundo. Presentamos las mejores prácticas para proteger la inversión en operaciones de M&A." },
      ],
    },
    contact: {
      h2Pre: "Agradecemos su interés",
      h2Accent: "en nuestros servicios",
      paragraph: "Por favor, tome un momento para brindarnos mayor detalle sobre su requerimiento de consultoría de negocios.",
      formTitle: "Solicitud de Consultoría",
      email: "contacto@impuestosmexico.com.mx",
    },
  },

  "precios-transferencia": {
    title: "Precios de Transferencia",
    breadcrumb: "Precios de Transferencia",
    heroParagraphs: [
      "Las reglas de precios de transferencia son el eje central del cumplimiento fiscal internacional. Los estándares de la OCDE, el escrutinio creciente del SAT y la complejidad de las cadenas de valor globales exigen una estrategia que combine rigor técnico con visión de negocio.",
      "Nuestra práctica de Precios de Transferencia ofrece soluciones integrales que abarcan desde la documentación comprobatoria hasta la defensa ante autoridades fiscales, diseñadas para proteger la posición fiscal del grupo y alinear la política intercompañía con la realidad económica de cada operación.",
    ],
    practiceAreas: {
      h2Line1: "Soluciones integrales en",
      h2Line2: "precios de transferencia",
      paragraph: "Nuestras áreas de especialización cubren el ciclo completo de precios de transferencia: desde la planeación y documentación hasta la defensa y resolución de controversias.",
      items: [
        { icon: "◈", title: "Estudios de Precios de Transferencia", desc: "Elaboración de la documentación comprobatoria y estudios económicos que demuestran el cumplimiento del principio de plena competencia (arm's length) en operaciones intercompañía nacionales e internacionales, conforme a la LISR y las Guías de la OCDE.", tags: ["Documentación Local", "Análisis Económico", "Arm's Length", "Benchmarking"] },
        { icon: "◇", title: "Master File y Country-by-Country Report", desc: "Preparación y revisión del Archivo Maestro (Master File) y del Reporte País por País (CbCR) para grupos multinacionales, asegurando consistencia global y cumplimiento con los estándares internacionales de la OCDE y la legislación mexicana.", tags: ["Master File", "CbCR", "Documentación Global", "OCDE"] },
        { icon: "▣", title: "Planeación y Reestructuración Intercompañía", desc: "Diseño y optimización de políticas de precios de transferencia que soporten la cadena de valor del grupo. Reestructuración de operaciones intercompañía para alinear funciones, activos y riesgos con la remuneración económica correspondiente.", tags: ["Cadena de Valor", "Reestructuración", "Políticas Intercompañía", "FAR"] },
        { icon: "◎", title: "Defensa en Precios de Transferencia", desc: "Representación ante el SAT en auditorías y revisiones de precios de transferencia. Preparación de estrategias de defensa, negociación de acuerdos anticipados de precios (APA) y gestión de procedimientos amistosos (MAP) bajo tratados fiscales.", tags: ["Auditorías SAT", "APA", "MAP", "Defensa Fiscal"] },
        { icon: "▲", title: "Valoración de Intangibles y Operaciones Complejas", desc: "Análisis de precios de transferencia para transacciones de alto valor: licenciamiento de intangibles, servicios intragrupo, operaciones financieras intercompañía y reestructuraciones de negocio transfronterizas.", tags: ["Intangibles", "Servicios Intragrupo", "Financiamiento"] },
      ],
    },
    methodology: {
      h2Line1: "Rigor analítico que",
      h2Line2: "sostiene su posición",
      paragraph: "Cada estudio de precios de transferencia sigue un proceso meticuloso que integra análisis funcional, comparabilidad económica y conocimiento regulatorio para construir una posición fiscal sólida y defendible.",
      steps: [
        { step: "01", title: "Mapeo Funcional", desc: "Análisis detallado de funciones realizadas, activos empleados y riesgos asumidos (FAR) en cada entidad del grupo para comprender la cadena de valor intercompañía." },
        { step: "02", title: "Análisis Económico", desc: "Selección del método de precios de transferencia más apropiado y búsqueda de comparables en bases de datos especializadas para determinar rangos de plena competencia." },
        { step: "03", title: "Documentación y Cumplimiento", desc: "Preparación de estudios, declaraciones informativas y documentación comprobatoria que cumple con los requisitos de la LISR, el CFF y las Guías de la OCDE." },
        { step: "04", title: "Monitoreo y Defensa", desc: "Seguimiento continuo de márgenes, actualización de políticas ante cambios regulatorios y preparación de estrategias de defensa ante eventuales revisiones del SAT." },
      ],
    },
    sectors: {
      h2Line1: "Precios de transferencia",
      h2Accent: "por industria",
      paragraph: "Cada sector presenta retos únicos en materia de operaciones intercompañía. Nuestros equipos combinan expertise en precios de transferencia con conocimiento profundo de cada industria.",
      items: [
        { name: "Manufactura e Industria", focus: "Operaciones de maquila y manufactura bajo programas IMMEX, cadenas de suministro transfronterizas, análisis de márgenes operativos y documentación de operaciones intercompañía en entornos de nearshoring." },
        { name: "Infraestructura y Real Estate", focus: "Servicios intragrupo en proyectos de infraestructura, financiamiento intercompañía para desarrollos inmobiliarios y valoración de activos intangibles asociados a concesiones y proyectos de largo plazo." },
        { name: "Retail y Consumo", focus: "Distribución intercompañía, contribuciones de marketing, análisis de márgenes de reventa y estructuras de principal-comisionista con operaciones transfronterizas." },
      ],
    },
    insights: {
      h2Line1: "Liderazgo de pensamiento",
      h2Line2: "en materia intercompañía",
      items: [
        { tag: "FLASH INFORMATIVO", date: "05 Mar 2026", title: "SAT intensifica auditorías de precios de transferencia en operaciones con intangibles", slug: "sat-intensifica-auditorias-de-precios-de-transfere", excerpt: "La autoridad fiscal ha reforzado su escrutinio sobre regalías y licencias intercompañía. Analizamos los criterios que el SAT está aplicando y las estrategias de defensa más efectivas." },
        { tag: "PERSPECTIVA", date: "22 Feb 2026", title: "Amount B de Pilar Uno: Impacto en las políticas de distribución intercompañía en México", slug: "amount-b-de-pilar-uno-impacto-en-las-politicas-de-", excerpt: "El nuevo enfoque simplificado de la OCDE para actividades de distribución y marketing transformará la forma de documentar y remunerar a distribuidores de rutina en Latinoamérica." },
        { tag: "ARTÍCULO", date: "10 Feb 2026", title: "Operaciones financieras intercompañía: Nueva guía OCDE y su adopción en México", slug: "operaciones-financieras-intercompania-nueva-guia-o", excerpt: "Las directrices del Capítulo X de la OCDE sobre transacciones financieras definen un marco renovado. Exploramos su interacción con las reglas de capitalización delgada y la LISR." },
      ],
    },
    contact: {
      h2Pre: "Agradecemos su interés",
      h2Accent: "en nuestros servicios",
      paragraph: "Por favor, tome un momento para brindarnos mayor detalle sobre su requerimiento de precios de transferencia.",
      formTitle: "Solicitud de Consulta — Precios de Transferencia",
      email: "contacto@impuestosmexico.com.mx",
    },
  },
};


/* ════════════════════════════════════════════════════════════════════════════
   EN TRANSLATIONS — SERVICE PAGES
   C-Suite executive tone. Less is more. Deloitte-style formal English.
   Components select PAGE_EN[route] when lang === "en".
   ════════════════════════════════════════════════════════════════════════════ */
const PAGE_EN = {
  "consultoria-fiscal": {
    title: "Tax Advisory", breadcrumb: "Tax Advisory",
    heroParagraphs: [
      "Digital enforcement, ongoing reform and global standards such as BEPS and Pillar Two call for advisors who anticipate regulatory shifts and convert complexity into competitive advantage.",
      "Our Tax Advisory practice integrates seasoned expertise with leading technology — from day-to-day compliance to the structuring of highly complex transactions.",
    ],
    practiceAreas: { h2Line1: "Comprehensive tax", h2Line2: "capabilities", paragraph: "Our areas of specialization span every dimension of tax practice — from operational compliance to sophisticated international planning.",
      items: [
        { icon: "◈", title: "Corporate Tax", desc: "End-to-end advisory on income tax, VAT, excise duties and federal contributions. We align fiscal structures with business objectives across domestic and cross-border operations." },
        { icon: "◇", title: "Tax Compliance", desc: "Full-cycle management of filing obligations, provisional payments, statutory opinions and informational returns. Controls that minimize exposure before the tax authority." },
        { icon: "▣", title: "Tax Controversy", desc: "Representation before tax authorities in audits, administrative reviews, appeals and constitutional proceedings. Protection at every stage." },
        { icon: "◎", title: "International Tax", desc: "Double-tax treaties, permanent establishment matters, inbound investment structures and compliance with BEPS and Pillar Two frameworks." },
        { icon: "▲", title: "Tax Technology", desc: "Digital transformation of the tax function — automation, data quality and real-time decision-making." },
      ],
    },
    methodology: { h2Line1: "A methodology that", h2Line2: "delivers certainty", paragraph: "Every engagement follows a disciplined process combining analytical rigor, sector experience and technology to build sustainable value.",
      steps: [
        { step: "01", title: "Assessment", desc: "Thorough evaluation of the current tax position, identifying risks and optimization opportunities." },
        { step: "02", title: "Structuring", desc: "Tailored solutions aligning the fiscal framework with commercial and investment objectives." },
        { step: "03", title: "Implementation", desc: "Disciplined execution with hands-on support — from restructuring to compliance." },
        { step: "04", title: "Monitoring", desc: "Continuous tracking of the regulatory environment to anticipate change and adapt proactively." },
      ],
    },
    sectors: { h2Line1: "Sector-specific", h2Accent: "tax insight", paragraph: "Each industry operates within a distinct regulatory and fiscal framework. Our teams combine tax proficiency with sector experience.",
      items: [
        { name: "Manufacturing & Industrial", focus: "Nearshoring incentives, IMMEX programs, capital investment benefits and value-chain fiscal optimization." },
        { name: "Infrastructure & Real Estate", focus: "FIBRA structures, infrastructure incentives, construction regimes and long-horizon project planning." },
        { name: "Retail & Consumer", focus: "Indirect taxes, supply-chain optimization, cross-border e-commerce and multi-jurisdictional compliance." },
      ],
    },
    insights: { h2Line1: "Tax thought", h2Line2: "leadership" },
    contact: { h2Pre: "Thank you for your interest", h2Accent: "in our services", paragraph: "Please take a moment to share further details about your tax advisory requirements.", formTitle: "Request for Proposal" },
  },

  "auditoria-assurance": {
    title: "Audit & Assurance", breadcrumb: "Audit & Assurance",
    heroParagraphs: [
      "Heightened regulatory expectations and investor demand for transparency require an auditor that pairs independence with technical depth.",
      "Our Audit & Assurance practice deploys industry-aligned teams and data-analytics-driven methodologies to deliver assurance that builds confidence beyond the opinion letter.",
    ],
    practiceAreas: { h2Line1: "Assurance with", h2Line2: "a holistic view", paragraph: "Our specializations encompass every dimension of financial and non-financial assurance.",
      items: [
        { icon: "◇", title: "Internal Audit & Co-sourcing", desc: "Systematic evaluation of processes, controls and governance. Internal audit plans — outsourced or co-sourced — that strengthen your second and third lines of defense." },
        { icon: "▣", title: "Internal Controls & SOX", desc: "Assessment, design and remediation of internal controls over financial reporting. End-to-end Sarbanes-Oxley support including effectiveness testing and audit committee reporting." },
        { icon: "◎", title: "Assurance & Attestation", desc: "Sustainability reports, ESG metrics, contractual compliance and financial projections. Credibility through agreed-upon procedures and limited reviews." },
      ],
    },
    methodology: { h2Line1: "Methodological rigor,", h2Line2: "tangible value", paragraph: "Every audit engagement integrates International Standards on Auditing with data analytics and industry-specific professional judgment.",
      steps: [
        { step: "01", title: "Planning", desc: "Understanding the business, assessing audit risks, setting materiality and designing the assurance strategy." },
        { step: "02", title: "Controls Testing", desc: "Identifying and testing key internal controls to define the scope of substantive procedures." },
        { step: "03", title: "Substantive Procedures", desc: "Analytical and detail-level tests using data analytics, confirmations and document review." },
        { step: "04", title: "Opinion & Reporting", desc: "Forming the audit opinion, communicating findings and issuing the report with recommendations." },
      ],
    },
    sectors: { h2Line1: "Industry-specialized", h2Accent: "audit", paragraph: "Every industry carries unique accounting, regulatory and risk dynamics. Our teams pair audit competence with sector knowledge.",
      items: [
        { name: "Manufacturing & Industrial", focus: "Inventory, production costs, fixed assets and IMMEX operations. Revenue recognition, leases and complex supply chains." },
        { name: "Infrastructure & Real Estate", focus: "FIBRA trust audits, long-horizon infrastructure projects, construction contracts and investment property at fair value." },
        { name: "Retail & Consumer", focus: "High-volume transactional environments, loyalty programs, multi-location inventory and e-commerce revenue recognition." },
      ],
    },
    insights: { h2Line1: "Assurance thought", h2Line2: "leadership" },
    contact: { h2Pre: "Thank you for your interest", h2Accent: "in our services", paragraph: "Please take a moment to share further details about your audit and assurance requirements.", formTitle: "Request for Proposal" },
  },

  "asesoria-legal": {
    title: "Legal Advisory", breadcrumb: "Legal Advisory",
    heroParagraphs: [
      "A fast-changing regulatory landscape demands legal counsel that understands the tax implications of every corporate decision and turns complexity into strategic advantage.",
      "Our Legal Advisory practice integrates specialized legal knowledge with fiscal insight to protect assets and optimize the structure of every transaction.",
    ],
    practiceAreas: { h2Line1: "Legal counsel with", h2Line2: "a fiscal lens", paragraph: "Our practice areas focus on the dimensions of law that directly affect a company’s tax position.",
      items: [
        { icon: "◈", title: "Corporate & Commercial Law", desc: "Entity formation, governance, restructurings and share transactions. Every structure designed with tax implications considered from the outset." },
        { icon: "◇", title: "Tax Litigation & Disputes", desc: "Representation before tax authorities in audits, reviews and administrative proceedings. Procedural rigor combined with fiscal insight." },
        { icon: "▣", title: "Fiscal Regulatory Compliance", desc: "Compliance frameworks focused on each entity’s tax obligations — ensuring structures support deductibility, credits and proper documentation." },
      ],
    },
    methodology: { h2Line1: "Legal precision,", h2Line2: "fiscal alignment", paragraph: "Every engagement integrates legal analysis with fiscal evaluation, delivering solutions that are both legally sound and tax-efficient.",
      steps: [
        { step: "01", title: "Legal Assessment", desc: "Review of the corporate and regulatory landscape, identifying legal risks and fiscal implications." },
        { step: "02", title: "Strategy Design", desc: "Solutions balancing legal protection with fiscal optimization, aligned to commercial objectives." },
        { step: "03", title: "Implementation", desc: "Execution of legal instruments, corporate resolutions and regulatory filings with hands-on support." },
        { step: "04", title: "Ongoing Counsel", desc: "Continuous monitoring of legislative changes and proactive adaptation of legal and fiscal structures." },
      ],
    },
    sectors: { h2Line1: "Legal advisory", h2Accent: "by industry", paragraph: "Each sector faces distinct legal and regulatory challenges. Our teams combine legal expertise with practical industry knowledge.",
      items: [
        { name: "Manufacturing & Industrial", focus: "Labor and trade law, regulatory compliance for industrial operations, environmental permits and nearshoring legal frameworks." },
        { name: "Infrastructure & Real Estate", focus: "Concession and project-finance agreements, real estate trusts, construction regulation and land-use permits." },
        { name: "Retail & Consumer", focus: "Consumer protection, franchise regulation, e-commerce compliance and data-privacy frameworks." },
      ],
    },
    insights: { h2Line1: "Legal thought", h2Line2: "leadership" },
    contact: { h2Pre: "Thank you for your interest", h2Accent: "in our services", paragraph: "Please take a moment to share further details about your legal advisory requirements.", formTitle: "Request for Proposal" },
  },

  "consultoria-negocios": {
    title: "Business Consulting", breadcrumb: "Business Consulting",
    heroParagraphs: [
      "Market volatility, digital disruption and ESG imperatives are reshaping how organizations compete. Sustainable transformation requires strategic clarity and execution discipline.",
      "Our Business Consulting practice partners with leadership teams to design and implement change — from operational redesign to sustainability strategy.",
    ],
    practiceAreas: { h2Line1: "Consulting that", h2Line2: "drives transformation", paragraph: "Our specializations address the most pressing challenges facing modern organizations.",
      items: [
        { icon: "◈", title: "Corporate Strategy", desc: "Market analysis, competitive positioning, growth roadmaps and scenario planning. We help leadership teams define and execute strategies that create lasting advantage." },
        { icon: "◇", title: "Digital Transformation", desc: "Maturity assessment, technology roadmaps, process automation and data-driven decision frameworks. Bridging the gap between strategy and implementation." },
        { icon: "▣", title: "Enterprise Risk Management", desc: "Identification, assessment and mitigation of operational, financial and reputational risks. Resilient frameworks that protect value across the organization." },
        { icon: "◎", title: "ESG & Sustainability", desc: "ESG strategy design, sustainability reporting and regulatory compliance. Meeting stakeholder expectations with credibility." },
      ],
    },
    methodology: { h2Line1: "From insight", h2Line2: "to impact", paragraph: "Every consulting engagement moves from diagnosis through design to measurable implementation — ensuring strategies translate into results.",
      steps: [
        { step: "01", title: "Diagnostic", desc: "Analysis of the organization’s current state, competitive landscape and strategic priorities." },
        { step: "02", title: "Design", desc: "Tailored solution: strategy definition, target operating model and implementation roadmap." },
        { step: "03", title: "Implementation", desc: "Hands-on execution with milestone tracking and continuous course correction." },
        { step: "04", title: "Measurement", desc: "Performance monitoring, impact assessment and knowledge transfer for sustainable outcomes." },
      ],
    },
    sectors: { h2Line1: "Consulting expertise", h2Accent: "by industry", paragraph: "Each sector faces unique strategic and operational challenges. Our teams combine consulting rigor with practical industry insight.",
      items: [
        { name: "Manufacturing & Industrial", focus: "Operational excellence, supply-chain optimization, Industry 4.0 adoption and nearshoring readiness." },
        { name: "Infrastructure & Real Estate", focus: "Project governance, capital allocation, stakeholder management and sustainability reporting for large-scale developments." },
        { name: "Retail & Consumer", focus: "Omnichannel strategy, customer analytics, margin optimization and digital commerce transformation." },
      ],
    },
    insights: { h2Line1: "Business thought", h2Line2: "leadership" },
    contact: { h2Pre: "Thank you for your interest", h2Accent: "in our services", paragraph: "Please take a moment to share further details about your business consulting requirements.", formTitle: "Request for Proposal" },
  },

  "precios-transferencia": {
    title: "Transfer Pricing", breadcrumb: "Transfer Pricing",
    heroParagraphs: [
      "Transfer pricing rules sit at the core of international tax compliance. OECD standards, increased SAT scrutiny and global value-chain complexity demand analytical rigor and business acumen.",
      "Our Transfer Pricing practice delivers end-to-end solutions — from benchmarking documentation to defense before tax authorities — protecting the group’s fiscal position and aligning intercompany policy with economic substance.",
    ],
    practiceAreas: { h2Line1: "End-to-end transfer", h2Line2: "pricing solutions", paragraph: "Our specializations cover the full transfer pricing lifecycle: planning, documentation, defense and dispute resolution.",
      items: [
        { icon: "◈", title: "Transfer Pricing Studies", desc: "Supporting documentation and economic analyses demonstrating arm’s-length compliance under Mexican law and OECD Guidelines." },
        { icon: "◇", title: "Master File & CbCR", desc: "Preparation and review of Master File and Country-by-Country Report for multinational groups — global consistency and regulatory compliance." },
        { icon: "▣", title: "Intercompany Restructuring", desc: "Optimization of transfer pricing policies supporting the group’s value chain. Aligning functions, assets and risks with appropriate remuneration." },
        { icon: "◎", title: "Transfer Pricing Defense", desc: "Representation before the SAT in audits and reviews. Negotiation of APAs and mutual agreement procedures under tax treaties." },
        { icon: "▲", title: "Intangibles & Complex Transactions", desc: "Transfer pricing for high-value transactions: intangible licensing, intra-group services, intercompany financing and cross-border restructurings." },
      ],
    },
    methodology: { h2Line1: "Analytical rigor that", h2Line2: "sustains your position", paragraph: "Every study integrates functional analysis, economic comparability and regulatory expertise to build a robust, defensible fiscal position.",
      steps: [
        { step: "01", title: "Functional Mapping", desc: "Analysis of functions performed, assets used and risks assumed (FAR) across each group entity." },
        { step: "02", title: "Economic Analysis", desc: "Selection of the appropriate method and comparable search to determine arm’s-length ranges." },
        { step: "03", title: "Documentation", desc: "Studies, informational returns and supporting documentation compliant with Mexican tax law and OECD Guidelines." },
        { step: "04", title: "Monitoring & Defense", desc: "Continuous margin tracking, policy updates and defense strategies for potential SAT reviews." },
      ],
    },
    sectors: { h2Line1: "Transfer pricing", h2Accent: "by industry", paragraph: "Each sector presents unique intercompany challenges. Our teams combine transfer pricing expertise with industry knowledge.",
      items: [
        { name: "Manufacturing & Industrial", focus: "Maquila and IMMEX operations, cross-border supply chains, operating margin analysis and nearshoring documentation." },
        { name: "Infrastructure & Real Estate", focus: "Intra-group services in infrastructure projects, intercompany financing for real estate and intangible valuation for concessions." },
        { name: "Retail & Consumer", focus: "Intercompany distribution, marketing contributions, resale margin analysis and principal-commissionaire structures." },
      ],
    },
    insights: { h2Line1: "Intercompany thought", h2Line2: "leadership" },
    contact: { h2Pre: "Thank you for your interest", h2Accent: "in our services", paragraph: "Please take a moment to share further details about your transfer pricing requirements.", formTitle: "Request for Proposal" },
  },
};



/* ════════════════════════════════════════════════════════════════════════════
   COMPONENTES GENÉRICOS DE PÁGINAS DE SERVICIO
   ══════════════════════════════════════════════════════════════════════════════
   Componentes reutilizables que reciben datos vía props desde PAGE_CONFIGS.
   Cada componente replica fielmente el diseño de las páginas individuales
   originales, manteniendo las mismas animaciones, tipografías y colores.
   ════════════════════════════════════════════════════════════════════════════ */

function ServiceHero({ config, onNavigate }) {
  const [ref, visible] = useInView(0.05);
  const lang = useLang();
  return (
    <section ref={ref} style={{
      background: B.navy, paddingTop: 58, minHeight: "50vh",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        maxWidth: 1000, margin: "0 auto", padding: "60px 40px", textAlign: "center",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.35)", marginBottom: 32,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <span onClick={() => onNavigate(null)} style={{ cursor: "pointer", transition: "color 0.3s" }}>{lang === "en" ? "Home" : "Inicio"}</span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span onClick={() => onNavigate(null, "servicios")} style={{ cursor: "pointer", transition: "color 0.3s" }}>{lang === "en" ? "Services" : "Servicios"}</span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: B.accent }}>{config.breadcrumb}</span>
        </div>
        <div style={{ marginBottom: 24, opacity: 0.6 }}>
          <span style={{ display: "inline-block", width: 80, height: 1, background: B.white }} />
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
          fontSize: "clamp(38px, 5vw, 68px)", lineHeight: 1.08,
          color: B.white, margin: "0 0 32px", letterSpacing: "-0.02em",
        }}>{config.title}</h1>
        {config.heroParagraphs.map((p, i) => (
          <p key={i} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.8,
            color: "rgba(255,255,255,0.5)", maxWidth: 680,
            margin: i < config.heroParagraphs.length - 1 ? "0 auto 24px" : "0 auto",
            fontWeight: 400,
          }}>{p}</p>
        ))}
      </div>
    </section>
  );
}

function ServicePracticeAreas({ config }) {
  const [ref, visible] = useInView(0.08);
  const [hovered, setHovered] = useState(null);
  const lang = useLang();
  const pa = config.practiceAreas;
  return (
    <section ref={ref} style={{
      background: "linear-gradient(180deg, #FFFFFF 0%, #F0F4F8 100%)",
      padding: "120px 40px", position: "relative",
    }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ opacity: visible ? 1 : 0, transition: "all 0.8s ease", transform: visible ? "none" : "translateY(30px)", marginBottom: 72 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: B.navy, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 32, height: 1, background: B.navy, display: "inline-block" }} />
            {lang === "en" ? "Practice Areas" : "Áreas de Práctica"}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 600, color: B.navy, lineHeight: 1.1, margin: "0 0 16px" }}>
            {pa.h2Line1}<br />{pa.h2Line2}
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.7, color: "rgba(0,34,68,0.5)", maxWidth: 600, margin: 0 }}>{pa.paragraph}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 1, background: "rgba(0,34,68,0.06)" }}>
          {pa.items.map((area, i) => {
            const isHov = hovered === i;
            return (
              <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{
                background: isHov ? B.navy : "#FFFFFF", padding: "44px 40px", cursor: "default",
                transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
                opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transitionDelay: `${i * 0.08}s`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: isHov ? B.accent : B.navy, opacity: isHov ? 1 : 0.5, transition: "all 0.5s" }}>{area.icon}</div>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 19, fontWeight: 600, color: isHov ? B.white : B.navy, margin: 0, transition: "color 0.5s" }}>{area.title}</h3>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: isHov ? "rgba(255,255,255,0.55)" : "rgba(0,34,68,0.5)", margin: "0 0 20px", paddingLeft: 40, transition: "color 0.5s" }}>{area.desc}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingLeft: 40 }}>
                  {(area.tags || []).map((tg, j) => (
                    <span key={j} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.04em", padding: "5px 14px", background: isHov ? "rgba(255,255,255,0.12)" : "rgba(0,34,68,0.06)", color: isHov ? "#FFFFFF" : "rgba(0,34,68,0.5)", transition: "all 0.5s" }}>{tg}</span>
                  ))}
                </div>
                <div style={{ width: isHov ? 48 : 0, height: 2, background: isHov ? B.accent : B.navy, marginTop: 24, marginLeft: 40, transition: "all 0.4s ease" }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceMethodology({ config }) {
  const [ref, visible] = useInView(0.1);
  const lang = useLang();
  const m = config.methodology;
  return (
    <section ref={ref} style={{ background: "linear-gradient(180deg, #F0F4F8 0%, #FFFFFF 100%)", padding: "120px 40px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ opacity: visible ? 1 : 0, transition: "all 0.8s ease", transform: visible ? "none" : "translateY(30px)", marginBottom: 72 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: B.navy, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "inline-block", width: 32, height: 1, background: B.navy }} />
            {lang === "en" ? "Our Approach" : "Nuestro Enfoque"}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 3.5vw, 46px)", fontWeight: 600, color: B.navy, lineHeight: 1.15, margin: "0 0 20px" }}>
            {m.h2Line1}<br />{m.h2Line2}
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.8, color: "rgba(0,34,68,0.5)", margin: 0, maxWidth: 600 }}>{m.paragraph}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(0,34,68,0.06)" }}>
          {m.steps.map((s, i) => (
            <div key={i} style={{
              background: "#FFFFFF", padding: "48px 40px",
              opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
              transition: `all 0.6s ease ${0.2 + i * 0.12}s`,
            }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: "rgba(0,34,68,0.12)", lineHeight: 1, marginBottom: 20 }}>{s.step}</div>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 600, color: B.navy, margin: "0 0 12px" }}>{s.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: "rgba(0,34,68,0.45)", margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceSectors({ config }) {
  const [ref, visible] = useInView(0.1);
  const lang = useLang();
  const [active, setActive] = useState(0);
  const sec = config.sectors;
  return (
    <section ref={ref} style={{ background: B.navy, padding: "120px 40px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "-8%", bottom: "-15%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)" }} />
      <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative" }}>
        <div style={{ opacity: visible ? 1 : 0, transition: "all 0.8s ease", transform: visible ? "none" : "translateY(30px)", marginBottom: 72 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: B.accent, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 32, height: 1, background: B.accent, display: "inline-block" }} />
            {lang === "en" ? "Industry Experience" : "Experiencia Sectorial"}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 600, color: B.white, lineHeight: 1.1, margin: "0 0 16px" }}>
            {sec.h2Line1}<br /><span style={{ color: B.accent }}>{sec.h2Accent}</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.7, color: B.textMuted, maxWidth: 600, margin: 0 }}>{sec.paragraph}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 0 }}>
          {sec.items.map((s, i) => (
            <div key={i} onMouseEnter={() => setActive(i)} style={{
              padding: "40px 36px", borderBottom: "1px solid rgba(255,255,255,0.06)", borderRight: "1px solid rgba(255,255,255,0.06)",
              background: active === i ? "rgba(255,255,255,0.05)" : "transparent", cursor: "default", transition: "all 0.4s",
              opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transitionDelay: `${i * 0.08}s`,
            }}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 600, color: B.white, margin: "0 0 14px" }}>{s.name}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: active === i ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)", margin: 0, transition: "color 0.4s" }}>{s.focus}</p>
              <div style={{ width: active === i ? 40 : 0, height: 2, background: B.accent, marginTop: 20, transition: "width 0.4s ease" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceInsights({ config, onNavigate }) {
  const [ref, visible] = useInView(0.1);
  const lang = useLang();
  const ins = config.insights;
  return (
    <section ref={ref} style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F0F4F8 100%)", padding: "120px 40px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 20, opacity: visible ? 1 : 0, transition: "all 0.8s ease" }}>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: B.navy, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 32, height: 1, background: B.navy, display: "inline-block" }} />
              {lang === "en" ? "Insights" : "Horizontes"}
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 600, color: B.navy, lineHeight: 1.1, margin: 0 }}>
              {ins.h2Line1}<br />{ins.h2Line2}
            </h2>
          </div>
          <span onClick={() => onNavigate && onNavigate("horizontes-page")} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: B.navy, letterSpacing: "0.06em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            {t(T.horizons.verTodas, lang)} <span style={{ fontSize: 18 }}>→</span>
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 24 }}>
          {ins.items.map((item, i) => (
            <div key={i} style={{
              background: "#FFFFFF", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,34,68,0.06)",
              opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
              transition: `all 0.6s ease ${0.2 + i * 0.12}s`, cursor: "pointer",
            }}>
              <div style={{ height: 4, background: B.navy }} />
              <div style={{ padding: "36px 32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: B.navy, padding: "4px 10px", background: "rgba(0,34,68,0.06)" }}>{item.tag}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(0,34,68,0.3)" }}>{item.date}</span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: B.navy, margin: "0 0 16px", lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: "rgba(0,34,68,0.5)", margin: "0 0 24px" }}>{item.excerpt}</p>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: B.navy, letterSpacing: "0.06em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {t(T.horizons.leerMas, lang)} <span style={{ fontSize: 18 }}>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceContact({ config }) {
  const [ref, visible] = useInView(0.1);
  const lang = useLang();
  const c = config.contact;
  const practiceNames = config.practiceAreas.items.map(a => a.title);
  const { status, submit } = useContactForm();
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", state: "", service: "", message: "", honeypot: "" });
  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const handleSubmit = () => submit({ ...form, pageSource: config.title });
  useEffect(() => { if (status === "success") setForm({ name: "", company: "", email: "", phone: "", state: "", service: "", message: "", honeypot: "" }); }, [status]);
  const statusMsg = { success: t(T.contact.exito, lang), error: t(T.contact.error, lang), offline: t(T.contact.offline, lang), rate_limited: t(T.contact.rateLimited, lang), sending: t(T.contact.enviando, lang) };

  return (
    <section id="contacto" ref={ref} style={{
      background: `linear-gradient(165deg, ${B.navy}, ${B.navyLight})`,
      padding: "120px 40px", position: "relative",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.4) 60px, rgba(255,255,255,0.4) 61px)` }} />
      <div style={{
        maxWidth: 1320, margin: "0 auto", position: "relative",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80,
        opacity: visible ? 1 : 0, transition: "all 1s ease", transform: visible ? "none" : "translateY(30px)",
      }}>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: B.accent, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 32, height: 1, background: B.accent, display: "inline-block" }} />
            {t(T.contact.label, lang)}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(34px, 4vw, 48px)", fontWeight: 600, color: B.white, lineHeight: 1.15, margin: "0 0 28px" }}>
            {c.h2Pre}<br /><span style={{ color: B.accent }}>{c.h2Accent}</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.8, color: B.textMuted, margin: "0 0 40px" }}>{c.paragraph}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[{ label: t(T.contact.emailLabel, lang), detail: c.email }].map((item, i) => (
              <div key={i} style={{ borderLeft: "2px solid rgba(255,255,255,0.2)", paddingLeft: 20, display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: B.white, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", padding: "48px 40px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: B.white, margin: "0 0 24px" }}>{c.formTitle}</h3>

          {/* Honeypot anti-bot */}
          <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
            <input type="text" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={e => updateField("honeypot", e.target.value)} />
          </div>

          {[
            { label: t(T.contact.nombre, lang), type: "text", field: "name" },
            { label: t(T.contact.empresa, lang), type: "text", field: "company" },
            { label: t(T.contact.correo, lang), type: "email", field: "email" },
            { label: t(T.contact.telefono, lang), type: "tel", field: "phone" },
            { label: t(T.contact.estado, lang), type: "text", field: "state" },
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>{f.label}</label>
              <input type={f.type} value={form[f.field]} onChange={e => updateField(f.field, e.target.value)} style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)", color: B.white, fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.3s" }}
                onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} />
            </div>
          ))}
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>{lang === "en" ? "Area of interest" : "Área de interés"}</label>
            <select value={form.service} onChange={e => updateField("service", e.target.value)} style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }}>
              <option value="">{lang === "en" ? "Select an area" : "Seleccione un área"}</option>
              {practiceNames.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>{lang === "en" ? "Message" : "Mensaje"}</label>
            <textarea rows={4} value={form.message} onChange={e => updateField("message", e.target.value)} style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)", color: B.white, fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical", transition: "border-color 0.3s" }}
              onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} />
          </div>

          {status !== "idle" && status !== "sending" && (
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginBottom: 20, padding: "12px 16px", background: status === "success" ? "rgba(52,168,83,0.15)" : "rgba(220,53,69,0.15)", color: status === "success" ? "rgba(52,168,83,0.9)" : "rgba(220,53,69,0.9)" }}>{statusMsg[status]}</div>
          )}

          <button onClick={handleSubmit} disabled={status === "sending"} style={{ width: "100%", padding: "16px", background: status === "sending" ? "#ccc" : B.accent, border: "none", color: B.navy, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: status === "sending" ? "wait" : "pointer", transition: "all 0.3s" }}
            onMouseEnter={e => { if (status !== "sending") e.target.style.background = "#E0E0E0"; }}
            onMouseLeave={e => { if (status !== "sending") e.target.style.background = B.accent; }}>
            {status === "sending" ? t(T.contact.enviando, lang) : t(T.contact.enviar, lang)}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SERVICE PAGE NAVBAR
   ══════════════════════════════════════════════════════════════════════════════
   Navbar específico para páginas de servicio. Los links del menú navegan
   de regreso al landing (a la sección correspondiente). El logo navega a inicio.
   ════════════════════════════════════════════════════════════════════════════ */
function ServiceNavbar({ onNavigate, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(0,34,68,0.96)" : "rgba(0,34,68,1)",
      backdropFilter: "blur(20px)",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
      transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
      padding: scrolled ? "0 0" : "3px 0",
    }}>
      <div style={{
        maxWidth: 1320, margin: "0 auto", padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: scrolled ? 50 : 58, transition: "height 0.5s ease",
      }}>
        <a onClick={() => onNavigate(null)} style={{
          textDecoration: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <img src={IMMX_LOGO} alt="IMMX" style={{ height: 46, width: "auto" }} />
          <span style={{ display: "flex", alignItems: "baseline", gap: 10, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 25, color: B.accent, letterSpacing: "0.04em" }}>IMPUESTOS</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 25, color: B.accent, letterSpacing: "0.04em" }}>MÉXICO</span>
          </span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }} className="nav-links-desktop">
          {SECTIONS.map((s) => (
            <a key={s.id} onClick={() => onNavigate(null, s.id)} style={{
              textDecoration: "none", padding: "8px 12px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
              color: "rgba(255,255,255,0.65)", letterSpacing: "0.03em", transition: "color 0.3s",
              borderBottom: "2px solid transparent",
            }}>{t(s.label, lang)}</a>
          ))}
          <div style={{ marginLeft: 16, display: "flex", alignItems: "center", gap: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>
            <span onClick={() => setLang("es")} style={{ cursor: "pointer", color: lang === "es" ? B.accent : "rgba(255,255,255,0.35)", transition: "color 0.3s", padding: "4px 6px" }}>ES</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span onClick={() => setLang("en")} style={{ cursor: "pointer", color: lang === "en" ? B.accent : "rgba(255,255,255,0.35)", transition: "color 0.3s", padding: "4px 6px" }}>EN</span>
          </div>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{
          display: "none", background: "none", border: "none",
          color: B.accent, fontSize: 28, cursor: "pointer",
        }} className="mobile-toggle">
          {mobileOpen ? "\u2715" : "\u2630"}
        </button>
      </div>
      {mobileOpen && (
        <div style={{ background: "rgba(0,34,68,0.98)", padding: "20px 40px 30px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {SECTIONS.map((s) => (
            <a key={s.id} onClick={() => { setMobileOpen(false); onNavigate(null, s.id); }} style={{
              display: "block", padding: "14px 0", textDecoration: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 500,
              color: "rgba(255,255,255,0.7)", borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>{t(s.label, lang)}</a>
          ))}
          <div style={{ display: "flex", gap: 16, paddingTop: 16 }}>
            <span onClick={() => { setLang("es"); setMobileOpen(false); }} style={{ cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: lang === "es" ? B.accent : "rgba(255,255,255,0.4)" }}>Español</span>
            <span onClick={() => { setLang("en"); setMobileOpen(false); }} style={{ cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: lang === "en" ? B.accent : "rgba(255,255,255,0.4)" }}>English</span>
          </div>
        </div>
      )}
    </nav>
  );
}


/* ════════════════════════════════════════════════════════════════════════════
   COMPONENTE RAÍZ: APP
   ══════════════════════════════════════════════════════════════════════════════
   Orquesta landing + páginas de servicio. Sistema de rutas por estado.
   - currentPage = null  → Landing page completo
   - currentPage = "consultoria-fiscal" (etc.) → Página de servicio
   
   Navegación:
   - Tarjetas de servicio (click o "Ver más") → setCurrentPage(route)
   - Navbar de páginas internas → setCurrentPage(null) + scroll a sección
   - Breadcrumb de hero → regreso a landing
   ════════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [activeSection, setActiveSection] = useState("inicio");
  const [currentPage, setCurrentPage] = useState(null);
  const [lang, setLang] = useState("es");

  const handleNavigate = (route, sectionId) => {
    if (route === null) {
      setCurrentPage(null);
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
      setCurrentPage(route);
    }
  };

  /* Scroll to top on page change */
  useEffect(() => {
    if (currentPage) {
      window.scrollTo({ top: 0, behavior: "instant" });
      // Sync hash with current page for deep linking
      if (currentPage === "admin" || currentPage.startsWith("pub-")) {
        window.history.replaceState(null, "", "#" + currentPage);
      }
    } else {
      if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
    }
  }, [currentPage]);

  /* Read hash on load for deep linking (admin, publications) */
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === "admin" || hash.startsWith("pub-")) {
      setCurrentPage(hash);
    }
  }, []);

  useEffect(() => {
    if (currentPage) return;
    const handler = () => {
      const scrollPos = window.scrollY + 200;
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(s.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [currentPage]);

  const specialPages = ["legales", "horizontes-page", "admin"];
  const isAdmin = currentPage === "admin";
  const isPub = currentPage && currentPage.startsWith("pub-");
  const pubSlug = isPub ? currentPage.slice(4) : null;
  const baseConfig = (currentPage && !specialPages.includes(currentPage) && !isPub) ? PAGE_CONFIGS[currentPage] : null;
  const pageConfig = baseConfig && lang === "en" && PAGE_EN[currentPage]
    ? { ...baseConfig, ...PAGE_EN[currentPage], practiceAreas: { ...baseConfig.practiceAreas, ...PAGE_EN[currentPage].practiceAreas }, methodology: { ...baseConfig.methodology, ...PAGE_EN[currentPage].methodology }, sectors: { ...baseConfig.sectors, ...PAGE_EN[currentPage].sectors }, insights: { ...baseConfig.insights, ...PAGE_EN[currentPage].insights }, contact: { ...baseConfig.contact, ...PAGE_EN[currentPage].contact } }
    : baseConfig;
  const isLegales = currentPage === "legales";
  const isHorizontes = currentPage === "horizontes-page";

  /* Admin auth state */
  const [adminToken, setAdminToken] = useState(null);

  return (
    <LangContext.Provider value={lang}>
    <div style={{ background: B.navy, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,500&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { margin: 0; padding: 0; width: 100%; background: ${B.navy}; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(0,34,68,0.2); color: ${B.navy}; }
        input::placeholder, select { color: rgba(255,255,255,0.25); }
        select option { background: ${B.navy}; color: ${B.white}; }
        textarea::placeholder { color: rgba(255,255,255,0.25); }
        @media (max-width: 900px) {
          .nav-links-desktop { display: none !important; }
          .mobile-toggle { display: block !important; }
          section > div { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── ADMIN ── */}
      {isAdmin && (
        adminToken
          ? <AdminPanel token={adminToken} onNavigate={handleNavigate} />
          : <AdminLogin onLogin={(token) => setAdminToken(token)} />
      )}

      {/* ── PUBLICATION PAGE ── */}
      {isPub && (
        <>
          <ServiceNavbar onNavigate={handleNavigate} lang={lang} setLang={setLang} />
          <PublicationPage slug={pubSlug} onNavigate={handleNavigate} />
          <Footer onNavigate={handleNavigate} />
        </>
      )}

      {/* ── LANDING ── */}
      {!currentPage && (
        <>
          <Navbar active={activeSection} lang={lang} setLang={setLang} />
          <Hero />
          <Services onNavigate={(route) => handleNavigate(route)} />
          <Sectors />
          <Horizons onNavigate={handleNavigate} />
          <About />
          <Contact />
          <Footer onNavigate={handleNavigate} />
        </>
      )}

      {/* ── SERVICE PAGES ── */}
      {pageConfig && (
        <>
          <ServiceNavbar onNavigate={handleNavigate} lang={lang} setLang={setLang} />
          <ServiceHero config={pageConfig} onNavigate={handleNavigate} />
          <ServicePracticeAreas config={pageConfig} />
          <ServiceMethodology config={pageConfig} />
          <ServiceSectors config={pageConfig} />
          <ServiceInsights config={pageConfig} onNavigate={handleNavigate} />
          <ServiceContact config={pageConfig} />
          <Footer onNavigate={handleNavigate} />
        </>
      )}

      {/* ── LEGALES ── */}
      {isLegales && (
        <>
          <ServiceNavbar onNavigate={handleNavigate} lang={lang} setLang={setLang} />
          <LegalContent />
          <Footer onNavigate={handleNavigate} />
        </>
      )}

      {/* ── HORIZONTES ── */}
      {isHorizontes && (
        <div style={{ background: B.sand }}>
          <ServiceNavbar onNavigate={handleNavigate} lang={lang} setLang={setLang} />
          <HorizontesHero />
          <Biblioteca onNavigate={handleNavigate} />
          <Footer onNavigate={handleNavigate} />
        </div>
      )}
    </div>
    </LangContext.Provider>
  );
}
