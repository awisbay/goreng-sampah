/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RT, User, Deposit, WeeklySeason } from "../types";

export const MOCK_KELURAHAN = [
  { id: 'kel-01', name: 'Kelurahan Depok Jaya' }
];

export const MOCK_RWS = [
  { id: 'rw-01', name: 'RW 01', kelurahan_id: 'kel-01' },
  { id: 'rw-02', name: 'RW 02', kelurahan_id: 'kel-01' }
];

export const MOCK_RTS: RT[] = [
  { id: 'rt-01', name: 'RT 01', rw_id: 'rw-01', kk_count: 50, total_score: 1250, total_weight_kg: 85.5 },
  { id: 'rt-02', name: 'RT 02', rw_id: 'rw-01', kk_count: 45, total_score: 1180, total_weight_kg: 72.2 },
  { id: 'rt-03', name: 'RT 03', rw_id: 'rw-01', kk_count: 60, total_score: 950, total_weight_kg: 60.0 },
  { id: 'rt-04', name: 'RT 04', rw_id: 'rw-02', kk_count: 40, total_score: 1300, total_weight_kg: 90.0 },
  { id: 'rt-05', name: 'RT 05', rw_id: 'rw-02', kk_count: 55, total_score: 800, total_weight_kg: 55.5 }
];

export const MOCK_DROP_POINTS = [
  { id: 'dp-01', name: 'Bank Sampah Mawar', lat: -6.388, lng: 106.822, accepts: ['organik', 'daur_ulang', 'b3', 'residu'] },
  { id: 'dp-02', name: 'TPS3R Merpati', lat: -6.390, lng: 106.825, accepts: ['organik', 'daur_ulang'] }
];

export const MOCK_USERS: User[] = [
  { id: 'u-1', name: 'Bu Rini', role: 'citizen', rt_id: 'rt-01', email: 'rini@example.com', photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rini' },
  { id: 'u-2', name: 'Pak Joko', role: 'rt_leader', rt_id: 'rt-01', email: 'joko@example.com', photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joko' },
  { id: 'u-3', name: 'Ibu Fatma', role: 'lurah', rt_id: 'rt-01', email: 'fatma@example.com', photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatma' },
  { id: 'u-4', name: 'Ani', role: 'citizen', rt_id: 'rt-01', email: 'ani@example.com', photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ani' },
  { id: 'u-5', name: 'Budi', role: 'citizen', rt_id: 'rt-01', email: 'budi@example.com', photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=budi' }
];

export const MOCK_DEPOSITS: Deposit[] = [
  { id: 'd-1', user_id: 'u-1', rt_id: 'rt-01', drop_point_id: 'dp-01', weight_kg: 2.5, category: 'daur_ulang', verified: true, points: 45, photo_url: '', created_at: new Date() },
  { id: 'd-2', user_id: 'u-4', rt_id: 'rt-01', drop_point_id: 'dp-01', weight_kg: 1.2, category: 'organik', verified: true, points: 15, photo_url: '', created_at: new Date() },
  { id: 'd-3', user_id: 'u-5', rt_id: 'rt-01', drop_point_id: 'dp-02', weight_kg: 5.0, category: 'daur_ulang', verified: true, points: 90, photo_url: '', created_at: new Date() }
];

export const MOCK_SEASON: WeeklySeason = {
  id: 's-12',
  week_number: 12,
  start_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  end_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  reward_pool: {
    individual: ['Voucher Indomaret 150rb', 'Sembako Senilai 100rb'],
    rt: ['Dana Operasional 1jt', 'Alat Kebersihan Baru']
  }
};
