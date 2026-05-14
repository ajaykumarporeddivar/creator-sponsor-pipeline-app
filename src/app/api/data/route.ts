import {
  MOCK_CREATORS,
  MOCK_SPONSORS,
  MOCK_SPONSORSHIP_DEALS,
  MOCK_DELIVERABLES,
  STATS
} from '@/lib/data';
import { type ICreator, type ISponsor, type ISponsorshipDeal, type IDeliverable } from '@/lib/types';
import { type NextRequest } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(): Promise<Response> {
  const data = {
    creators: MOCK_CREATORS,
    sponsors: MOCK_SPONSORS,
    sponsorshipDeals: MOCK_SPONSORSHIP_DEALS,
    deliverables: MOCK_DELIVERABLES,
    stats: STATS,
    totalCreators: MOCK_CREATORS.length,
    totalSponsors: MOCK_SPONSORS.length,
    totalSponsorshipDeals: MOCK_SPONSORSHIP_DEALS.length,
    totalDeliverables: MOCK_DELIVERABLES.length,
  };

  return new Response(JSON.stringify({ ok: true, data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json();
  return new Response(JSON.stringify({
    ok: true,
    message: 'Demo mode — data not persisted',
    received: body,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}