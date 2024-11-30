import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { PageLoader } from '@/components/ui/page-loader';
import MentorCard from '@/components/mentors/MentorCard';
import MentorFilters from '@/components/mentors/MentorFilters';
import { useMentorSearch } from '@/hooks/api/useMentorSearch';
import type { MentorSearchFilters } from '@/types/mentor';

export default function MentorSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MentorSearchFilters>({});

  const { data, isLoading } = useMentorSearch({
    ...filters,
    search: searchQuery
  });

  const mentors = data?.mentors || [];

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
          ) : mentors.length > 0 ? (
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