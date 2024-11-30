import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Globe, 
  GraduationCap, 
  Star, 
  Briefcase, 
  MapPin,
  Users,
  Trophy,
  Share2,
  Twitter,
  Linkedin,
  Github,
  Globe2,
  CheckCircle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ReviewCard from '@/components/reviews/ReviewCard';
import BookingModal from '@/components/mentors/BookingModal';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getMentorById, getMentorReviews } from '@/lib/api/mentors';

export default function MentorProfile() {
  const { id } = useParams();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: mentor, isLoading: isMentorLoading } = useQuery({
    queryKey: ['mentor', id],
    queryFn: () => getMentorById(id!),
    enabled: !!id
  });

  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['mentor-reviews', id],
    queryFn: () => getMentorReviews(id!),
    enabled: !!id
  });

  const profileUrl = `${window.location.origin}/mentor/${mentor?.customUrl || id}`;

  const copyProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: 'Link Copied!',
        description: 'Profile URL has been copied to your clipboard.',
      });
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again or copy the URL manually.',
        variant: 'destructive',
      });
    }
  };

  const shareToSocial = (platform: 'twitter' | 'linkedin') => {
    const text = encodeURIComponent(`Check out ${mentor?.name}'s mentoring profile on Poramorshok!`);
    const url = encodeURIComponent(profileUrl);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (isMentorLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Mentor not found</h2>
          <p className="text-muted-foreground">The mentor you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <Avatar className="h-32 w-32">
                <AvatarImage src={mentor.avatar} alt={mentor.name} />
                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">{mentor.name}</h1>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsShareModalOpen(true)}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-xl text-muted-foreground mb-4">
                    {mentor.title} at {mentor.company}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{mentor.rating}</span>
                      <span className="text-muted-foreground">
                        ({mentor.totalReviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <span>{mentor.experience}+ years experience</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>Bangladesh</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mentor.languages.map((language) => (
                      <Badge key={language} variant="secondary">
                        <Globe className="h-3 w-3 mr-1" />
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center md:items-end gap-2">
                  <p className="text-2xl font-bold">৳{mentor.hourlyRate}/hour</p>
                  <Button size="lg" onClick={() => setIsBookingModalOpen(true)}>
                    Book a Session
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="about" className="space-y-8">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="expertise">Expertise</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">About Me</h2>
              <p className="text-muted-foreground whitespace-pre-line">{mentor.about}</p>

              {mentor.achievements && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Achievements</h3>
                  <div className="space-y-2">
                    {mentor.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mentor.socialLinks && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Connect with me</h3>
                  <div className="flex gap-2">
                    {mentor.socialLinks.map((link) => {
                      const Icon = {
                        twitter: Twitter,
                        linkedin: Linkedin,
                        github: Github,
                        website: Globe2
                      }[link.platform];

                      return (
                        <Button
                          key={link.platform}
                          variant="outline"
                          size="icon"
                          asChild
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Icon className="h-4 w-4" />
                          </a>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mentor.services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{service.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{service.duration} minutes</span>
                    </div>
                    {service.type === 'group' && service.maxParticipants && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Up to {service.maxParticipants} participants</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">৳{service.price}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expertise" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-base py-2">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="space-y-6">
                {mentor.education.map((edu, index) => (
                  <div key={index} className="flex gap-4">
                    <GraduationCap className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">Class of {edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Student Reviews</h2>
              {isReviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 bg-muted rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : reviews?.length ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      studentName="Student"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Availability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Available Days
                  </h3>
                  <div className="space-y-2">
                    <p>Monday - Friday</p>
                    <p>Sunday (Limited slots)</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Session Duration
                  </h3>
                  <div className="space-y-2">
                    <p>30 minutes</p>
                    <p>60 minutes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Share Profile Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Profile</DialogTitle>
            <DialogDescription>
              Share {mentor.name}'s profile with others
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                readOnly
                value={profileUrl}
                className="flex-1"
              />
              <Button variant="outline" onClick={copyProfileUrl}>
                Copy
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => shareToSocial('twitter')}
              >
                <Twitter className="h-4 w-4 mr-2" />
                Share on Twitter
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => shareToSocial('linkedin')}
              >
                <Linkedin className="h-4 w-4 mr-2" />
                Share on LinkedIn
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <BookingModal
        mentor={mentor}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}