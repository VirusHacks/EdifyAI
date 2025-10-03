'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ExternalLink, DollarSign, Clock, Bookmark, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Internship {
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: string;
  posted_time: string;
  link: string;
}

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'posted_time' | 'stipend'>('posted_time');
  const [savedInternships, setSavedInternships] = useState<string[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    filterAndSortInternships();
  }, [internships, searchTerm, locationFilter, sortBy]);

  const fetchInternships = async () => {
    try {
      const response = await fetch('/api/internship');
      let data = await response.json();
        // remove first 10 element
        data = data.slice(10)
      setInternships(data);
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  };

  const filterAndSortInternships = () => {
    let filtered = internships.filter((internship) =>
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (locationFilter !== 'all') {
      filtered = filtered.filter((internship) => internship.location === locationFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'posted_time') {
        return new Date(b.posted_time).getTime() - new Date(a.posted_time).getTime();
      } 
        const stipendA = Number.parseInt(a.stipend.replace(/[^\d]/g, ''));
        const stipendB = Number.parseInt(b.stipend.replace(/[^\d]/g, ''));
        return stipendB - stipendA;
      
    });

    setFilteredInternships(filtered);
  };

  const toggleSaveInternship = (title: string) => {
    setSavedInternships((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const locations = Array.from(new Set(internships.map((internship) => internship.location)));

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Latest Internship Opportunities
      </h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Search internships..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={locationFilter} onValueChange={(value) => setLocationFilter(value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value: 'posted_time' | 'stipend') => setSortBy(value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="posted_time">Most Recent</SelectItem>
            <SelectItem value="stipend">Highest Stipend</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {filteredInternships.map((internship) => (
            <motion.div
              key={internship.title}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="text-lg font-semibold line-clamp-2">{internship.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSaveInternship(internship.title)}
                    >
                      <Bookmark
                        className={savedInternships.includes(internship.title) ? "fill-current" : ""}
                      />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{internship.company}</p>
                    <p className="flex items-center mb-2">
                      <MapPin className="mr-2" size={16} />
                      {internship.location}
                    </p>
                    <p className="flex items-center mb-2">
                      <Clock className="mr-2" size={16} />
                      {internship.duration}
                    </p>
                    <p className="flex items-center mb-2">
                      <DollarSign className="mr-2" size={16} />
                      {internship.stipend}
                    </p>
                    <p className="flex items-center mb-4 text-sm text-muted-foreground">
                      <Calendar className="mr-2" size={16} />
                      Posted {internship.posted_time}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-grow" onClick={() => setSelectedInternship(internship)}>
                          Quick View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{selectedInternship?.title}</DialogTitle>
                          <DialogDescription>{selectedInternship?.company}</DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <p className="flex items-center mb-2">
                            <MapPin className="mr-2" size={16} />
                            {selectedInternship?.location}
                          </p>
                          <p className="flex items-center mb-2">
                            <Clock className="mr-2" size={16} />
                            {selectedInternship?.duration}
                          </p>
                          <p className="flex items-center mb-2">
                            <DollarSign className="mr-2" size={16} />
                            {selectedInternship?.stipend}
                          </p>
                          <p className="flex items-center mb-4 text-sm text-muted-foreground">
                            <Calendar className="mr-2" size={16} />
                            Posted {selectedInternship?.posted_time}
                          </p>
                        </div>
                        <Button asChild className="w-full mt-4">
                          <a href={selectedInternship?.link} target="_blank" rel="noopener noreferrer">
                            Apply Now
                          </a>
                        </Button>
                      </DialogContent>
                    </Dialog>
                    <Button asChild className="flex-grow">
                      <a href={internship.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2" size={16} />
                        Apply
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}