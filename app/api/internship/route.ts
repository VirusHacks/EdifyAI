import { NextResponse } from 'next/server';
import { scrapeInternships } from '../lib/scrape';

export async function GET() {
  try {
    const internships = await scrapeInternships();
    return NextResponse.json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    return NextResponse.json({ error: 'Failed to fetch internships' }, { status: 500 });
  }
}

