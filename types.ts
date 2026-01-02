
export enum EquipmentCategory {
  EXCAVATOR = 'Excavator',
  BULLDOZER = 'Bulldozer',
  CRANE = 'Mobile Crane',
  LOADER = 'Skid Steer',
  LIFT = 'Scissor Lift',
  DUMP_TRUCK = 'Dump Truck'
}

export interface EquipmentListing {
  id: string;
  name: string;
  year: number;
  make: string;
  model: string;
  category: EquipmentCategory;
  location: string;
  serialNumber: string;
  hours?: number;
  weight?: string;
  netPower?: string;
  maxDigDepth?: string;
  engineModel?: string;
  buyPrice: number;
  rentDaily: number;
  rentWeekly: number;
  rentMonthly: number;
  images: string[];
  isReadyToWork: boolean;
  isVerifiedDealer: boolean;
  isAvailable: boolean;
  forSale: boolean;
  forRent: boolean;
  seller: {
    name: string;
    rating: number;
    reviewsCount: number;
    description: string;
    avatar: string;
  };
}

export type ViewState = 'search' | 'detail' | 'login' | 'signup' | 'create-listing' | 'my-fleet' | 'admin-panel';

export interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogoClick: () => void;
  onLoginClick?: () => void;
  onLogout?: () => void;
  onCreateListing?: () => void;
  onMyFleetClick?: () => void;
  onAdminPanelClick?: () => void;
  user?: any;
  userRole?: 'buyer' | 'dealer' | 'admin' | null;
}

export interface SearchFilters {
  keywords: string;
  category: string;
  location: string;
  radius: number;
  minPrice: string;
  maxPrice: string;
  conditions: string[];
}
