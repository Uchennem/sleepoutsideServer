// export interface Product {
//   _id: string;
//   id: string;
//   isClearance: boolean;
//   category: string;
//   isNew: boolean;
//   url: string;
//   reviews: {
//     reviewsUrl: string;
//     reviewCount: number;
//     averageRating: number;
//   };
//   nameWithoutBrand: string;
//   name: string;
//   images: {
//     primarySmall: string;
//     primaryMedium: string;
//     primaryLarge: string;
//     primaryExtraLarge: string;
//     extraImages: {
//       title: string;
//       src: string;
//     }[];
//   };
//   sizesAvailable: {
//     zipper: string[];
//   };
//   colors: Color[];
//   descriptionHtmlSimple: string;
//   suggestedRetailPrice: number;
//   brand: Brand;
//   listPrice: number;
//   finalPrice: number;
// }

// export interface Color {
//   colorCode: string;
//   colorName: string;
//   colorChipImageSrc: string;
//   colorPreviewImageSrc: string;
// }

// export interface Brand {
//   id: string;
//   url: string;
//   productsUrl: string;
//   logoSrc: string;
//   name: string;
// }

// export interface Reviews {
//   _id: string;
//   product_id: string;
//   content: string[]; // review texts
// }

// export interface Cart {
//   _id: string;
//   user_id: string;
//   items: string[]; // product ids
// }

// export interface UserName {
//   firstName: string;
//   lastName: string;
// }

// export interface UserRole {
//   isCustomer: boolean;
//   isAdmin: boolean;
// }

// export interface User {
//   _id: string;
//   name: UserName;
//   email: string;
//   hashedPassword: string;
//   role: UserRole;
// }

// export interface OrderStatus {
//   isPaid: boolean;
//   isShipped: boolean;
// }

// export interface Order {
//   _id: string;
//   user_id: string;
//   status: OrderStatus;
//   shipping_address: string;
//   items: string[]; // product ids
//   total: number;
//   createdAt: string; // ISO date-time
// }

// export type AlertType = "warning" | "info" | "promotion";
// export type AlertStatus = "active" | "inactive";

// export interface Alert {
//   _id: string;
//   title: string;
//   type: AlertType;
//   status: AlertStatus;
//   createdAt: string;  // ISO date-time
//   modifiedAt: string; // ISO date-time
// }

import type { Filter } from "mongodb";


// Product schema
export interface Product {
  _id: string;
  id: string;
  isClearance: boolean;
  category: "tents" | "backpacks" | "sleeping-bags" | "hammocks";
  isNew: boolean;
  url: string;
  reviews: Review;
  nameWithoutBrand: string;
  name: string;
  images: Images;
  sizesAvailable: SizesAvailable;
  colors: Color[];
  descriptionHtmlSimple: string;
  suggestedRetailPrice: number;
  brand: Brand;
  listPrice: number;
  finalPrice: number;
}

export interface Review {
  reviewsUrl: string;
  reviewCount: number;
  averageRating: number;
}

export interface Images {
  primarySmall: string;
  primaryMedium: string;
  primaryLarge: string;
  primaryExtraLarge: string;
  extraImages: ExtraImage[];
}

export interface ExtraImage {
  title: string;
  src: string;
}

export interface SizesAvailable {
  zipper: string[];
  size: string[];
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

// User schema
export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  address?: Address;
  phoneNumbers?: PhoneNumber[];
  cart?: CartItem[];
  createdAt: Date;
  modifiedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state:
    | "AL"
    | "AK"
    | "AZ"
    | "AR"
    | "CA"
    | "CO"
    | "CT"
    | "DE"
    | "DC"
    | "FL"
    | "GA"
    | "HI"
    | "ID"
    | "IL"
    | "IN"
    | "IA"
    | "KS"
    | "KY"
    | "LA"
    | "ME"
    | "MD"
    | "MA"
    | "MI"
    | "MN"
    | "MS"
    | "MO"
    | "MT"
    | "NE"
    | "NV"
    | "NH"
    | "NJ"
    | "NM"
    | "NY"
    | "NC"
    | "ND"
    | "OH"
    | "OK"
    | "OR"
    | "PA"
    | "RI"
    | "SC"
    | "SD"
    | "TN"
    | "TX"
    | "UT"
    | "VT"
    | "VA"
    | "WA"
    | "WV"
    | "WI"
    | "WY";
  zipCode: string;
  country: string;
}

export interface PhoneNumber {
  type: string;
  number: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  finalPrice: number;
  productImageSrc: string;
  productUrl: string;
  productCategory: string;
  productColor: Color;
  productSize: string;
}

// Order schema
export interface Order {
  _id: string;
  userId: string;
  name: string,
  status: "pending" | "processing" | "shipped" | "delivered";
  cardNumber: string;
    cardExpiration: string;
    cardCode: number;
  shippingAddress: Address;
  orderItems: CartItem[];
  createdAt: Date;
  modifiedAt: Date;
  totalPrice: number;
  shippingCost: number;
  taxAmount: number;
}

// Alert schema
export interface Alert {
  _id: string;
  title: string;
  type: "warning" | "info" | "promotion";
  status: "active" | "inactive";
  createdAt: Date;
  modifiedAt: Date;
}

export interface QueryParams {
  category?: string;
  q?: string;
  limit?: string;
  offset?: string;
  fields?: string;
}
 
// Create a generic Mapped Type
type Projection<T> = {
  [K in keyof T]?: number;
};
 
export interface FindProductObj {
  search: {
    name?: string;
    descriptionHtmlSimple?: string;
    category?: string;
  };
  limit: number;
  offset: number;
  fieldFilters?: Projection<Product>;
}
   