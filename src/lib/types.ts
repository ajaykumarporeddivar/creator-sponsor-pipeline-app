export type ApiResponse<T> = { ok: boolean; data?: T; error?: string };
export type SortDir = 'asc' | 'desc';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  avatar: string;
  joinedAt: string;
}

export interface ICreator {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ISponsor {
  id: string;
  creatorId: string;
  name: string;
  contactPerson: string;
  contactEmail: string;
  industry: string;
  notes: string;
  status: 'active' | 'inactive' | 'on_hold';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ISponsorDealDeliverableInput {
  description: string;
  dueDate: string; // YYYY-MM-DD
}

export interface ISponsorshipDeal {
  id: string;
  creatorId: string;
  sponsorId: string;
  campaignName: string;
  description: string; // General description of the campaign
  value: number; // e.g., total deal value in USD
  currency: string; // e.g., 'USD'
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  status: 'draft' | 'pending_approval' | 'active' | 'completed' | 'canceled';
  deliverables: ISponsorDealDeliverableInput[]; // Array of deliverables for the deal
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}