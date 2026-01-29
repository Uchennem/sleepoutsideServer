export interface Product {
  _id: string;
  id: string;
  isClearance: boolean;
  category: string;
  isNew: boolean;
  url: string;
  reviews: {
    reviewsUrl: string;
    reviewCount: number;
    averageRating: number;
  };
  nameWithoutBrand: string;
  name: string;
  images: {
    primarySmall: string;
    primaryMedium: string;
    primaryLarge: string;
    primaryExtraLarge: string;
    extraImages: {
      title: string;
      src: string;
    }[];
  };
  sizesAvailable: {
    zipper: string[];
  };
  colors: Color[];
  descriptionHtmlSimple: string;
  suggestedRetailPrice: number;
  brand: Brand;
  listPrice: number;
  finalPrice: number;
}

export interface Color {
  colorCode: string;
  colorName: string;
  colorChipImageSrc: string;
  colorPreviewImageSrc: string;
}

export interface Brand {
  id: string;
  url: string;
  productsUrl: string;
  logoSrc: string;
  name: string;
}

export interface Reviews {
  _id: string;
  product_id: string;
  content: string[]; // review texts
}

export interface Cart {
  _id: string;
  user_id: string;
  items: string[]; // product ids
}

export interface UserName {
  firstName: string;
  lastName: string;
}

export interface UserRole {
  isCustomer: boolean;
  isAdmin: boolean;
}

export interface User {
  _id: string;
  name: UserName;
  email: string;
  hashedPassword: string;
  role: UserRole;
}

export interface OrderStatus {
  isPaid: boolean;
  isShipped: boolean;
}

export interface Order {
  _id: string;
  user_id: string;
  status: OrderStatus;
  shipping_address: string;
  items: string[]; // product ids
  total: number;
  createdAt: string; // ISO date-time
}

export type AlertType = "warning" | "info" | "promotion";
export type AlertStatus = "active" | "inactive";

export interface Alert {
  _id: string;
  title: string;
  type: AlertType;
  status: AlertStatus;
  createdAt: string;  // ISO date-time
  modifiedAt: string; // ISO date-time
}
