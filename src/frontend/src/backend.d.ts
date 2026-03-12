import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type InquiryId = bigint;
export type Time = bigint;
export type PropertyId = bigint;
export interface PropertyListing {
    id: PropertyId;
    status: ListingStatus;
    title: string;
    propertyType: PropertyType;
    createdAt: Time;
    size: number;
    description: string;
    updatedAt: Time;
    price: number;
    location: string;
    images: Array<string>;
}
export interface Inquiry {
    id: InquiryId;
    name: string;
    createdAt: Time;
    propertyId: PropertyId;
    email: string;
    message: string;
    contacted: boolean;
    phone: string;
}
export enum ListingStatus {
    pending = "pending",
    sold = "sold",
    available = "available"
}
export enum PropertyType {
    commercial = "commercial",
    land = "land",
    plot = "plot"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createListing(title: string, description: string, propertyType: PropertyType, price: number, size: number, location: string, images: Array<string>): Promise<PropertyId>;
    deleteListing(id: PropertyId): Promise<void>;
    filterListingsByMaxPrice(maxPrice: number): Promise<Array<PropertyListing>>;
    filterListingsByType(propertyType: PropertyType): Promise<Array<PropertyListing>>;
    filterListingsByTypeAndPrice(propertyType: PropertyType, maxPrice: number): Promise<Array<PropertyListing>>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getAllListings(): Promise<Array<PropertyListing>>;
    getAvailableListings(): Promise<Array<PropertyListing>>;
    getCallerUserRole(): Promise<UserRole>;
    getInquiriesByContactStatus(contacted: boolean): Promise<Array<Inquiry>>;
    getInquiriesByProperty(propertyId: PropertyId): Promise<Array<Inquiry>>;
    getListing(id: PropertyId): Promise<PropertyListing>;
    getPropertyInquiryCounts(): Promise<Array<[PropertyId, bigint]>>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    loginAsAdminWithPassword(password: string): Promise<boolean>;
    markInquiryContacted(id: InquiryId): Promise<void>;
    submitInquiry(name: string, email: string, phone: string, message: string, propertyId: PropertyId): Promise<InquiryId>;
    updateListing(id: PropertyId, title: string, description: string, propertyType: PropertyType, price: number, size: number, location: string, status: ListingStatus, images: Array<string>): Promise<void>;
}
