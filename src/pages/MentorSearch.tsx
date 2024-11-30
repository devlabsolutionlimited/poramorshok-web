import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { PageLoader } from '@/components/ui/page-loader';
import MentorCard from '@/components/mentors/MentorCard';
import MentorFilters from '@/components/mentors/MentorFilters';
import type { Mentor, MentorSearchFilters } from '@/types/mentor';

// Mock data for development
const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Rahman Khan',
    title: 'Senior Software Engineer',
    company: 'Google',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    expertise: ['Web Development', 'System Design', 'React'],
    rating: 4.9,
    totalReviews: 124,
    hourlyRate: 2000,
    about: 'Experienced software engineer with 10+ years in full-stack development.',
    experience: 10,
    languages: ['Bengali', 'English'],
    category: 'Programming',
    education: [
      {
        degree: 'MSc in Computer Science',
        institution: 'BUET',
        year: 2015
      }
    ]
  },
  {
    id: '2',
    name: 'Sarah Ahmed',
    title: 'Product Manager',
    company: 'Microsoft',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    expertise: ['Product Management', 'Agile', 'UX Design'],
    rating: 4.8,
    totalReviews: 89,
    hourlyRate: 2500,
    about: 'Product leader with experience in both startups and large tech companies.',
    experience: 8,
    languages: ['Bengali', 'English', 'Hindi'],
    category: 'Business',
    education: [
      {
        degree: 'MBA',
        institution: 'IBA, DU',
        year: 2018
      }
    ]
  }
];

// Mock API call
const fetchMentors = async (
  searchQuery: string,
  filters: MentorSearchFilters
): Promise<Mentor[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return mockMentors.filter(mentor => {
    const matchesSearch = searchQuery
      ? mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const matchesCategory = filters.category
      ? mentor.category === filters.category
      : true;

    const matchesExpertise = filters.expertise
      ? filters.expertise.some(e => mentor.expertise.includes(e))
      : true;

    const matchesPrice = filters.priceRange
      ? mentor.hourlyRate >= filters.priceRange.min &&
        mentor.hourlyRate <= filters.priceRange.max
      : true;

    const matchesRating = filters.rating
      ? mentor.rating >= filters.rating
      : true;

    const matchesLanguage = filters.language
      ? filters.language.some(l => mentor.languages.includes(l))
      : true;

    return matchesSearch && matchesCategory && matchesExpertise && 
           matchesPrice && matchesRating && matchesLanguage;
  });
};

export default function MentorSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MentorSearchFilters>({});

  const { data: mentors, isLoading } = useQuery({
    queryKey: ['mentors', searchQuery, filters],
    queryFn: () => fetchMentors(searchQuery, filters),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <MentorFilters onFilterChange={setFilters} />
            </ScrollArea>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search mentors by name, expertise, or company..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Results */}
          {isLoading ? (
            <PageLoader />
          ) : mentors && mentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold">No mentors found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find more mentors
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}