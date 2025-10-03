import { NextResponse } from 'next/server';
import { scrapeHackathons, scrapeMeetups } from '../lib/scrape';

interface Event {
  title: string;
  location: string;
  date: string;
  link: string;
  type: 'hackathon' | 'meetup';
}

export async function GET() {
  try {
    const hackathons = await scrapeHackathons();
    const meetups = await scrapeMeetups();

    const events: Event[] = [
      ...hackathons.map((h) => ({
        ...h,
        date: h.dates,
        type: 'hackathon' as const,
      })),
      ...meetups.map((m) => ({
        ...m,
        type: 'meetup' as const,
      })),
    ];

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

