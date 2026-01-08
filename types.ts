
export enum EquipmentCategory {
  CRAWLER_DOZER = 'Crawler Dozer',
  ARTICULATED_DUMP_TRUCK = 'Articulated Dump Truck',
  RIGID_DUMP_TRUCK = 'Rigid Dump Truck',
  OFF_ROAD_TANKER = 'Off-Road Tanker',
  MINI_EXCAVATOR = 'Mini Excavator',
  MEDIUM_EXCAVATOR = 'Medium Excavator',
  LARGE_EXCAVATOR = 'Large Excavator',
  LONG_BOOM_EXCAVATOR = 'Long-Boom Excavator',
  WHEEL_EXCAVATOR = 'Wheel Excavator',
  WHEEL_LOADER = 'Wheel Loader',
  CRAWLER_LOADER = 'Crawler Loader',
  BACKHOE_LOADER = 'Backhoe Loader',
  SKID_STEER_LOADER = 'Skid Steer Loader',
  SINGLE_DRUM_ROLLER = 'Single-Drum Roller',
  DOUBLE_DRUM_ROLLER = 'Double-Drum Roller',
  PLATE_COMPACTOR = 'Plate Compactor',
  CRAWLER_CRANE = 'Crawler Crane',
  MOBILE_CRANE = 'Mobile Crane',
  SCISSOR_LIFT = 'Scissor Lift',
  BOOM_LIFT = 'Boom Lift',
  FORKLIFT = 'Forklift',
  CRUSHER = 'Crusher',
  SCREENER = 'Screener',
  MILLER = 'Miller',
  PAVER = 'Paver',
  GRADER = 'Grader',
  DRILL_RIG = 'Drill Rig',
  SHEET_PILING_RIG = 'Sheet Piling Rig',
  TIPPER_DUMPER_TRUCK = 'Tipper/Dumper Truck',
  CONCRETE_MIXER_TRUCK = 'Concrete Mixer Truck',
  CONCRETE_PUMP_TRUCK = 'Concrete Pump Truck',
  WATER_TRUCK = 'Water Truck',
  PNEUMATIC_ROLLER = 'Pneumatic Roller',
  TELESCOPIC_HANDLER = 'Telescopic Handler',
  EXCAVATOR_GENERAL = 'Excavator (General)',
  BULLDOZER_GENERAL = 'Bulldozer (General)',
  LOADER_GENERAL = 'Loader (General)',
  LIFT_GENERAL = 'Lift (General)',
  DUMP_TRUCK_GENERAL = 'Dump Truck (General)'
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

export type ViewState = 'search' | 'detail' | 'login' | 'signup' | 'create-listing' | 'my-fleet' | 'admin-panel' | 'profile' | 'my-bookings' | 'how-it-works';

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
