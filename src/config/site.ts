/**
 * Configuración global del sitio.
 *
 * Edita este archivo para personalizar el boilerplate sin tocar componentes.
 * Si más adelante quieres que estos campos se editen desde TinaCMS,
 * créalos como una collection adicional (ver docs/tina.md).
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Highlight {
  icon: string;
  title: string;
  description: string;
}

export interface ValuePillar {
  icon: string;
  color: string;
  title: string;
  description: string;
}

export interface ContactInfo {
  emails: string[];
  phoneDisplay: string;
  phoneRaw: string;
  address: string;
  hours: { day: string; hours: string }[];
}

export interface SiteConfig {
  brand: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
  };
  hero: {
    badge: { icon: string; text: string };
    title: string;
    titleAccent: string;
    description: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    stats: Stat[];
    floatingCard: { icon: string; title: string; subtitle: string };
  };
  categories: { icon: string; label: string; href: string }[];
  ctaStrip: Highlight[];
  ctaBanner: {
    title: string;
    description: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  whatsapp: {
    /** Número en formato internacional sin "+", usado para wa.me */
    number: string;
    /** Prefijo de mensaje en el botón de contacto de cada producto */
    productInquiryPrefix: string;
    /** Prefijo de mensaje en el checkout del carrito */
    cartCheckoutPrefix: string;
  };
  contact: ContactInfo;
  social: SocialLink[];
  navLinks: NavLink[];
  about: {
    badge: string;
    title: string;
    intro: string;
    body: string[];
    stats: Stat[];
    mission: { icon: string; label: string; text: string };
    vision: { icon: string; label: string; text: string };
    pillarsTitle: string;
    pillarsSubtitle: string;
    pillars: ValuePillar[];
    cta: { title: string; description: string; ctaLabel: string; ctaHref: string };
  };
}

const site: SiteConfig = {
  brand: {
    name: 'Catálogo Base',
    shortName: 'CB',
    tagline: 'Tu catálogo autogestionable',
    description: 'Boilerplate de catálogo digital con TinaCMS, Astro y Vue 3.',
  },

  hero: {
    badge: { icon: '✨', text: 'Nuevo boilerplate' },
    title: 'Tu Catálogo Digital',
    titleAccent: 'Listo para Personalizar',
    description:
      'Un punto de partida moderno y autogestionable para mostrar tus productos o servicios. Edita el contenido desde TinaCMS sin tocar código.',
    primaryCta: { label: 'Ver Catálogo', href: '/productos' },
    secondaryCta: { label: 'Contactar', href: '/contacto' },
    stats: [
      { value: '100%', label: 'Personalizable' },
      { value: '0', label: 'Código requerido' },
      { value: '24/7', label: 'Disponible' },
    ],
    floatingCard: {
      icon: '🚀',
      title: 'Hecho con Astro',
      subtitle: 'Rápido y optimizado',
    },
  },

  categories: [
    { icon: '📦', label: 'Categoría 1', href: '/productos' },
    { icon: '🎨', label: 'Categoría 2', href: '/productos' },
    { icon: '⚙️', label: 'Categoría 3', href: '/productos' },
    { icon: '🔧', label: 'Categoría 4', href: '/productos' },
    { icon: '📚', label: 'Categoría 5', href: '/productos' },
    { icon: '🛠️', label: 'Categoría 6', href: '/productos' },
    { icon: '✨', label: 'Categoría 7', href: '/productos' },
  ],

  ctaStrip: [
    {
      icon: '⚡',
      title: 'Rápido y moderno',
      description: 'Construido con Astro para máximo rendimiento y SEO.',
    },
    {
      icon: '🎯',
      title: 'Fácil de editar',
      description: 'TinaCMS te permite modificar contenido sin programar.',
    },
    {
      icon: '💡',
      title: 'Totalmente flexible',
      description: 'Adapta el diseño y las secciones a tu marca.',
    },
  ],

  ctaBanner: {
    title: '¿Listo para empezar?',
    description:
      'Personaliza este boilerplate con tu marca, productos y contenido en minutos.',
    primaryCta: { label: 'Contactar Ahora', href: '/contacto' },
    secondaryCta: { label: 'Ver Productos', href: '/productos' },
  },

  whatsapp: {
    number: '34900123456',
    productInquiryPrefix: '¡Hola! Me interesa obtener más información sobre el siguiente producto:',
    cartCheckoutPrefix: '¡Hola! Me gustaría realizar un pedido con los siguientes productos:',
  },

  contact: {
    emails: ['info@tu-dominio.com', 'ventas@tu-dominio.com'],
    phoneDisplay: '+34 900 123 456',
    phoneRaw: '+34900123456',
    address: 'Av. Ejemplo 42, Tu Ciudad',
    hours: [
      { day: 'Lunes – Viernes', hours: '9:00 – 18:00' },
      { day: 'Sábado', hours: '9:00 – 13:00' },
      { day: 'Domingo', hours: 'Cerrado' },
    ],
  },

  social: [
    { label: 'Facebook', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'WhatsApp', href: '#' },
  ],

  navLinks: [
    { label: 'Inicio', href: '/' },
    { label: 'Productos', href: '/productos' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Contacto', href: '/contacto' },
  ],

  about: {
    badge: 'Nuestra Historia',
    title: 'Quiénes Somos',
    intro:
      'Un placeholder que puedes reemplazar con la presentación de tu empresa, proyecto o marca.',
    body: [
      'Edita este texto desde src/config/site.ts para contar la historia de tu proyecto. Habla de tu misión, el problema que resuelves y por qué tu audiencia debería importarle.',
      'Este párrafo adicional te permite añadir más contexto, casos de uso, o llamados a la acción. Mantenlo conciso y enfocado en el valor que ofreces.',
    ],
    stats: [
      { value: '10+', label: 'Años de experiencia' },
      { value: '500+', label: 'Clientes activos' },
      { value: '100%', label: 'Personalizable' },
    ],
    mission: {
      icon: '🎯',
      label: 'Nuestra Misión',
      text: 'Describe aquí la razón de ser de tu proyecto. ¿Qué problema resuelves? ¿Para quién? ¿Cómo lo haces diferente al resto?',
    },
    vision: {
      icon: '🔭',
      label: 'Nuestra Visión',
      text: 'Comparte hacia dónde se dirige tu proyecto. ¿Qué impacto quieres generar? ¿Qué quieres conseguir a largo plazo?',
    },
    pillarsTitle: 'Nuestros Pilares',
    pillarsSubtitle: 'Los valores que guían tu trabajo',
    pillars: [
      {
        icon: '🏆',
        color: 'bg-amber-500/10 text-amber-500',
        title: 'Calidad',
        description: 'Describe el primer valor o pilar fundamental de tu marca.',
      },
      {
        icon: '⚡',
        color: 'bg-brand-accent/10 text-brand-accent',
        title: 'Rapidez',
        description: 'Explica el segundo valor que diferencia tu propuesta.',
      },
      {
        icon: '🤝',
        color: 'bg-emerald-500/10 text-emerald-500',
        title: 'Cercanía',
        description: 'Cierra con el tercer valor que completa tu identidad.',
      },
    ],
    cta: {
      title: '¿Listo para trabajar juntos?',
      description: 'Contacta con nosotros y descubre cómo podemos ayudarte.',
      ctaLabel: 'Contactar',
      ctaHref: '/contacto',
    },
  },
};

export default site;
