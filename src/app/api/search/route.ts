import {
  MOCK_CREATORS,
  MOCK_SPONSORS,
  MOCK_SPONSORSHIP_DEALS,
  MOCK_DELIVERABLES,
} from '@/lib/data';
import { type ICreator, type ISponsor, type ISponsorshipDeal, type IDeliverable } from '@/lib/types';
import { type NextRequest } from 'next/server';

const MAX_RESULTS = 20;
const DEFAULT_EMPTY_QUERY_RESULTS = 5;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q')?.toLowerCase() || '';
  const type = searchParams.get('type')?.toLowerCase(); // e.g., 'deals', 'sponsors', 'creators', 'deliverables'

  let results: Array<ICreator | ISponsor | ISponsorshipDeal | IDeliverable> = [];

  const searchInCreators = () => MOCK_CREATORS.filter(c =>
    c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query)
  );

  const searchInSponsors = () => MOCK_SPONSORS.filter(s =>
    s.name.toLowerCase().includes(query) ||
    (s.contactPerson && s.contactPerson.toLowerCase().includes(query)) ||
    (s.contactEmail && s.contactEmail.toLowerCase().includes(query))
  );

  const searchInDeals = () => MOCK_SPONSORSHIP_DEALS.filter(d =>
    d.campaignName.toLowerCase().includes(query) || d.description.toLowerCase().includes(query)
  );

  const searchInDeliverables = () => MOCK_DELIVERABLES.filter(del =>
    del.title.toLowerCase().includes(query) || del.description.toLowerCase().includes(query)
  );

  if (!query) {
    // If query is empty, return first N deals
    results = MOCK_SPONSORSHIP_DEALS.slice(0, DEFAULT_EMPTY_QUERY_RESULTS);
  } else if (type) {
    switch (type) {
      case 'creators':
        results = searchInCreators();
        break;
      case 'sponsors':
        results = searchInSponsors();
        break;
      case 'deals':
        results = searchInDeals();
        break;
      case 'deliverables':
        results = searchInDeliverables();
        break;
      default:
        // Fallback to all types if unknown type specified
        results = [
          ...searchInCreators(),
          ...searchInSponsors(),
          ...searchInDeals(),
          ...searchInDeliverables(),
        ];
    }
  } else {
    // Search across all types if no type specified
    results = [
      ...searchInCreators(),
      ...searchInSponsors(),
      ...searchInDeals(),
      ...searchInDeliverables(),
    ];
  }

  // Limit results
  const limitedResults = results.slice(0, MAX_RESULTS);

  return new Response(JSON.stringify({
    ok: true,
    data: {
      results: limitedResults,
      total: limitedResults.length,
      query,
    },
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