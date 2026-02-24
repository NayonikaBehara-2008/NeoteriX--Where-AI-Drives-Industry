
import { NGO, Region, Language, CurrencyConfig, RewardSource, Product, Category } from './types';

export const REGION_CONFIGS: Record<Region, CurrencyConfig & { providers: RewardSource[] }> = {
  US: { code: 'USD', symbol: '$', locale: 'en-US', providers: [RewardSource.PAYPAL, RewardSource.VENMO, RewardSource.AMEX] },
  EU: { code: 'EUR', symbol: '€', locale: 'de-DE', providers: [RewardSource.STRIPE, RewardSource.REVOLUT, RewardSource.PAYPAL] },
  IN: { code: 'INR', symbol: '₹', locale: 'en-IN', providers: [RewardSource.UPI, RewardSource.STRIPE] },
  BR: { code: 'BRL', symbol: 'R$', locale: 'pt-BR', providers: [RewardSource.PIX, RewardSource.STRIPE] },
  UK: { code: 'GBP', symbol: '£', locale: 'en-GB', providers: [RewardSource.REVOLUT, RewardSource.APPLE_PAY, RewardSource.PAYPAL] },
};

export const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    welcome: "Welcome back",
    dashboard: "Dashboard",
    marketplace: "Giving Market",
    capture: "Fill the Jar",
    partners: "Hearts in Need",
    rewards: "Joy Wallet",
    ai: "Impact Advisor",
    totalImpact: "Total Joy Spread",
    points: "JoyCredits",
    confirm: "Confirm & Gift",
    switchProfile: "Switch Profile",
    logout: "Log Out",
    privacy: "Privacy Policy",
    settings: "Account Settings"
  },
  es: {
    welcome: "Bienvenido de nuevo",
    dashboard: "Panel",
    marketplace: "Mercado de Dar",
    capture: "Llenar el Tarro",
    partners: "Corazones Necesitados",
    rewards: "Billetera de Alegría",
    ai: "Asesor de Impacto",
    totalImpact: "Alegría Total",
    points: "Créditos de Alegría",
    confirm: "Confirmar y Regalar",
    switchProfile: "Cambiar Perfil",
    logout: "Cerrar Sesión",
    privacy: "Política de Privacidad",
    settings: "Configuración"
  },
  hi: {
    welcome: "नमस्ते",
    dashboard: "डैशबोर्ड",
    marketplace: "खुशी बाजार",
    capture: "जार भरें",
    partners: "जरूरतमंद दिल",
    rewards: "खुशी वॉलेट",
    ai: "प्रभाव सलाहकार",
    totalImpact: "कुल खुशी",
    points: "खुशी क्रेडिट",
    confirm: "पुष्टि करें और उपहार दें",
    switchProfile: "प्रोफ़ाइल बदलें",
    logout: "लॉग आउट",
    privacy: "गोपनीयता नीति",
    settings: "खाता सेटिंग"
  },
  fr: {
    welcome: "Bon retour",
    dashboard: "Tableau de bord",
    marketplace: "Marché du Don",
    capture: "Remplir le Pot",
    partners: "Cœurs à Soutenir",
    rewards: "Portefeuille de Joie",
    ai: "Conseiller Impact",
    totalImpact: "Joie Totale Répandue",
    points: "Crédits Joie",
    confirm: "Confirmer et Offrir",
    switchProfile: "Changer de Profil",
    logout: "Déconnexion",
    privacy: "Confidentialité",
    settings: "Paramètres"
  },
  pt: {
    welcome: "Bem-vindo de volta",
    dashboard: "Painel",
    marketplace: "Mercado de Doação",
    capture: "Encher o Jarro",
    partners: "Corações Necessitados",
    rewards: "Carteira de Alegria",
    ai: "Consultor de Impacto",
    totalImpact: "Alegria Total Espalhada",
    points: "Créditos de Alegria",
    confirm: "Confirmar e Doar",
    switchProfile: "Trocar Perfil",
    logout: "Sair",
    privacy: "Política de Privacidade",
    settings: "Configurações"
  }
};

export const SAMPLE_NGOS: NGO[] = [
  {
    id: 'ngo1',
    name: 'Little Hearts Haven',
    type: 'Orphanage',
    description: 'Providing a loving home, education, and nutrition to orphaned children.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&h=300&auto=format&fit=crop',
    location: 'Global Operations',
    needs: ['Supplies', 'Clothing', 'Books']
  },
  {
    id: 'ngo2',
    name: 'Golden Years Residence',
    type: 'Old Age Home',
    description: 'A community-focused home providing dignity and care for the elderly.',
    image: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=400&h=300&auto=format&fit=crop',
    location: 'Community Centers',
    needs: ['Medical Aid', 'Furniture', 'Mentors']
  },
  {
    id: 'ngo3',
    name: 'Bridge to Ability',
    type: 'Special Needs',
    description: 'Specialized education and therapy for children with neurodivergent needs.',
    image: 'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?q=80&w=400&h=300&auto=format&fit=crop',
    location: 'Global Support',
    needs: ['Sensory Equipment', 'Therapy Kits']
  }
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Eco-Friendly Water Bottle',
    description: 'BPA-free, reusable stainless steel bottle with thermal insulation.',
    price: 25.00,
    discountPrice: 20.00,
    image: 'https://images.unsplash.com/photo-1602143393494-1383e5894101?q=80&w=400&h=400&auto=format&fit=crop',
    category: Category.HOME
  },
  {
    id: 'p2',
    name: 'Noise Canceling Headphones',
    description: 'High-quality audio with advanced noise cancellation and 30h battery life.',
    price: 199.00,
    discountPrice: 179.00,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&h=400&auto=format&fit=crop',
    category: Category.ELECTRONICS
  },
  {
    id: 'p3',
    name: 'Organic Cotton T-Shirt',
    description: 'Soft, breathable shirt made from 100% certified organic cotton.',
    price: 35.00,
    discountPrice: 28.00,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&h=400&auto=format&fit=crop',
    category: Category.FASHION
  }
];
