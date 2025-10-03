import { chromium } from 'playwright';

interface Hackathon {
  title: string;
  location: string;
  dates: string;
  link: string;
}

interface Meetup {
  title: string;
  location: string;
  date: string;
  link: string;
}

interface Internship {
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: string;
  posted_time: string;
  link: string;
}

export async function scrapeHackathons(): Promise<Hackathon[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://devpost.com/hackathons');
  
  const hackathons = await page.evaluate(() => {
    const cards = document.querySelectorAll('.hackathon-tile');
    return Array.from(cards).map(card => ({
      title: card.querySelector('h3')?.textContent?.trim() || 'N/A',
      location: card.querySelector('.location')?.textContent?.trim() || 'Online',
      dates: card.querySelector('.submission-period')?.textContent?.trim() || 'N/A',
      link: card.querySelector('a')?.href || 'No link'
    }));
  });

  await browser.close();
  return hackathons;
}

export async function scrapeMeetups(): Promise<Meetup[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.meetup.com/find/events/');
    
    // Wait for event cards to be loaded
    await page.waitForSelector('div[data-testid="categoryResults-eventCard"]', { timeout: 10000 });
    
    // Extract the rendered page source
    const html = await page.content();
    
    // Use evaluate to parse the HTML content (simulating BeautifulSoup functionality)
    const meetups = await page.evaluate((html: string) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const cards = doc.querySelectorAll('div[data-testid="categoryResults-eventCard"]');
      console.log(`Found ${cards.length} meetups.`);
      
      return Array.from(cards).map(card => ({
        title: card.querySelector('h2')?.textContent?.trim() || 'N/A',
        location: card.querySelector('p.line-clamp-1')?.textContent?.trim() || 'Online',
        date: card.querySelector('time')?.getAttribute('datetime') || 'No date',
        link: card.querySelector('a')?.getAttribute('href') || 'No link'
      }));
    }, html);
    
    return meetups;
  } catch (error) {
    console.error("Error scraping meetups:", error);
    return [];
  } finally {
    await browser.close();
  }
}

export async function scrapeInternships(): Promise<Internship[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('https://internshala.com/internships/');

    // Wait for the internship cards to load
    await page.waitForSelector('.individual_internship', { timeout: 10000 });

    // Extract internship details
    const internships = await page.evaluate(() => {
      const cards = document.querySelectorAll('.individual_internship');
      console.log(`Found ${cards.length} internships.`);

      return Array.from(cards).map(card => ({
        title: card.querySelector('.job-title-href')?.textContent?.trim() || 'N/A',
        company: card.querySelector('.company-name')?.textContent?.trim() || 'N/A',
        location: card.querySelector('.location')?.textContent?.trim() || 'Online',
        duration: card.querySelector('.duration')?.textContent?.trim() || 'N/A',
        stipend: card.querySelector('.stipend')?.textContent?.trim() || 'N/A',
        posted_time: card.querySelector('.status-success')?.textContent?.trim() || 'N/A',
        link: card.getAttribute('data-href') ? `https://internshala.com${card.getAttribute('data-href')}` : 'No link'
      }));
    });

    return internships;
  } catch (error) {
    console.error('Error scraping internships:', error);
    return [];
  } finally {
    await browser.close();
  }
}