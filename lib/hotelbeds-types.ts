// lib/hotelbeds-types.ts

// 1. Estructura RAW real que devuelve Hotelbeds
export interface HotelbedsCancellationPolicy {
  amount: string;
  from: string;
  hotelAmount?: string;
  hotelCurrency?: string;
}

export interface HotelbedsRate {
  rateKey: string;
  rateClass: string;
  rateType?: string;
  net: string;
  sellingRate?: string;
  hotelSellingRate?: string;
  hotelCurrency?: string;
  boardCode?: string;
  boardName: string;
  cancellationPolicies?: HotelbedsCancellationPolicy[];
  rooms?: number;
  adults?: number;
  children?: number;
  allotment?: number;
  rateCommentsId?: string;
  paymentType?: string;
  packaging?: boolean;
  promotions? : promotions[];
  hotelMandatory?: boolean; 
  commission?: string;
  commissionVAT?: string;
  commissionPCT?: string;
  childrenAges?: string;
}

export interface HotelbedsRoom {
  code: string;
  name: string;
  rates: HotelbedsRate[];
}


export interface promotions {
  code: string;
  name: string;
}

export interface creditCards{
  code?: string;  
  name?: string;  
  paymentType?: string;  
}

export interface HotelbedsRawHotel {
  code: number;
  name: string;
  categoryCode?: string;
  categoryName: string;
  destinationCode?: string;
  destinationName: string;
  zoneCode?: number;
  zoneName?: string;
  latitude?: string;
  longitude?: string;
  minRate?: string;
  maxRate?: string;
  currency?: string;
  rooms: HotelbedsRoom[];
  creditCards?: creditCards[];
}

export interface HotelbedsRawResponse {
  auditData: {
    processTime: string;
    timestamp: string;
    requestHost: string;
    serverId: string;
    environment: string;
    release: string;
    token: string;
    internal: string;
  };
  hotels?: {
    hotels?: HotelbedsRawHotel[];
    checkIn?: string;
    checkOut?: string;
    total?: number;
    allotment?: number;
  };
}

// 2. Estructura LIMPIA para renderizar en tus componentes de Next.js
export interface UIHotelCard {
  id: number;
  title: string;
  category: string;
  destination: string;
  startingPrice: string;
  currency: string;
  coverImage: string;
  boardType: string;
  totalRoomsAvailable: number;
  rawRooms: HotelbedsRoom[];
}