
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
  location: string | any;
  serialNumber: string;
  hours?: number;
  weight?: string;
  netPower?: string;
  maxDigDepth?: string;
  engineModel?: string;
  buyPrice: number;
  rentDaily: number;
  rentMonthly: number;
  images: string[];
  isReadyToWork: boolean;
  isVerifiedDealer: boolean;
  isAvailable: boolean;
  forSale: boolean;
  forRent: boolean;
  seller?: {
    name: string;
    rating: number;
    reviewsCount: number;
    description: string;
    avatar: string;
  };
  sellerId?: string;
  status: 'draft' | 'pending' | 'active' | 'rejected';
  approvedAt?: any; // Firestore Timestamp
  createdAt?: any; // Firestore Timestamp

  // Compat fields between prototype schemas
  title?: string;
  price?: any;
  specs?: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  companyName?: string;
  photoURL?: string;
  location?: string;
  role: 'buyer' | 'dealer' | 'admin';
  createdAt: any;
  updatedAt: any;
}

export interface Booking {
  id?: string;
  listingId: string;
  listingTitle: string;
  startDate: any; // Firestore Timestamp or Date ISO string
  endDate: any;
  totalPrice: number;
  userId: string;
  sellerId: string;
  renterName: string;
  renterPhone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: any;
  updatedAt: any;
}

export type ViewState = 'search' | 'detail' | 'login' | 'signup' | 'create-listing' | 'my-fleet' | 'admin-panel' | 'profile' | 'my-bookings';

export interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogoClick: () => void;
  onLoginClick?: () => void;
  onLogout?: () => void;
  onCreateListing?: () => void;
  onMyFleetClick?: () => void;
  onAdminPanelClick?: () => void;
  onProfileClick?: () => void;
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

export interface DeletionRequest {
  id?: string;
  userId: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  createdAt: any;
  updatedAt: any;
  approvedAt?: any;
  approvedBy?: string;
}
