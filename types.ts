
export type Region = 'US' | 'EU' | 'IN' | 'BR' | 'UK';
export type Language = 'en' | 'es' | 'fr' | 'hi' | 'pt';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
}

export enum RewardSource {
  PAYPAL = 'PayPal',
  STRIPE = 'Card Rewards',
  AMEX = 'Member Points',
  APPLE_PAY = 'Apple Cash',
  UPI = 'PhonePe / GPay',
  PIX = 'Pix Cashback',
  REVOLUT = 'Revolut Spare Change',
  VENMO = 'Venmo Balance',
  STORE_CREDIT = 'Merchant Discount'
}

export enum Category {
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion',
  HOME = 'Home & Living',
  BEAUTY = 'Beauty & Health',
  FOOD = 'Food & Drinks'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  image: string;
  category: Category;
}

export interface IncomingReward {
  id: string;
  amount: number;
  source: RewardSource;
  timestamp: string;
}

export interface NGO {
  id: string;
  name: string;
  type: 'Orphanage' | 'Old Age Home' | 'Special Needs' | 'Environment' | 'Education';
  description: string;
  image: string;
  location: string;
  needs: string[];
}

export interface DonationRecord {
  id: string;
  date: string;
  amount: number;
  ngoId: string;
  source: RewardSource;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalDonated: number;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  region: Region;
  language: Language;
}

export type ViewState = 'dashboard' | 'capture' | 'ngos' | 'rewards' | 'ai-impact';
