/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'citizen' | 'rt_leader' | 'lurah' | 'sponsor' | 'officer';

export interface User {
  id: string;
  name: string;
  rt_id?: string;
  role: UserRole;
  photo_url?: string;
  email: string;
}

export interface RT {
  id: string;
  name: string;
  rw_id: string;
  kk_count: number;
  total_score: number;
  total_weight_kg: number;
}

export interface RW {
  id: string;
  name: string;
  kelurahan_id: string;
}

export interface Kelurahan {
  id: string;
  name: string;
}

export interface DropPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  accepts: string[];
}

export type WasteCategory = 'organik' | 'daur_ulang' | 'b3' | 'residu';

export interface Deposit {
  id: string;
  user_id: string;
  rt_id: string;
  drop_point_id: string;
  weight_kg: number;
  category: WasteCategory;
  photo_url: string;
  verified: boolean;
  points: number;
  created_at: any; // Firestore Timestamp
}

export interface WeeklySeason {
  id: string;
  week_number: number;
  start_at: any;
  end_at: any;
  reward_pool: {
    individual: string[];
    rt: string[];
  };
}

export interface Reward {
  id: string;
  season_id: string;
  recipient_user_id?: string;
  recipient_rt_id?: string;
  type: string;
  amount: number;
  sponsor: string;
  claimed: boolean;
}

export interface ViolationReport {
  id: string;
  reporter_id: string;
  rt_id: string;
  photo_url: string;
  lat: number;
  lng: number;
  type: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: any;
}
