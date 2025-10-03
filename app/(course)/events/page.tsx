'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ExternalLink, Loader } from 'lucide-react';

interface Event {
  title: string;
  location: string;
  date: string;
  link: string;
  type: 'hackathon' | 'meetup';
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState<'all' | 'hackathon' | 'meetup'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Error loading events. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (eventType !== 'all') {
      filtered = filtered.filter(event => event.type === eventType);
    }
    return filtered.sort((a, b) => (sortBy === 'date' ? new Date(a.date).getTime() - new Date(b.date).getTime() : a.title.localeCompare(b.title)));
  }, [events, searchTerm, eventType, sortBy]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Latest Meetups and Hackathons</h1>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-grow" />
        <Select value={eventType} onValueChange={(value) => setEventType(value)}>
          <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Event Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="hackathon">Hackathons</SelectItem>
            <SelectItem value="meetup">Meetups</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Sort By" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center my-8">
          <Loader className="animate-spin" size={32} />
        </div>
      )}

      {/* Error State */}
      {error && <p className="text-red-500 text-center my-4">{error}</p>}

      {/* Events List */}
      <AnimatePresence>
        {!loading && !error && (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
            {filteredEvents.map(event => (
              <motion.div key={event.title} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{event.title}</span>
                      <Badge variant={event.type === 'hackathon' ? 'default' : 'secondary'}>{event.type}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="flex items-center mb-2"><Calendar className="mr-2" size={16} />{new Date(event.date).toLocaleDateString()}</p>
                    <p className="flex items-center mb-4"><MapPin className="mr-2" size={16} />{event.location}</p>
                    <Button asChild className="w-full">
                      <a href={event.link} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2" size={16} />Learn More</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
