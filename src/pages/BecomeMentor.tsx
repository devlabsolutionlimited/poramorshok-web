import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const mentorApplicationSchema = z.object({
  expertise: z.array(z.string()).min(1, 'Select at least one area of expertise'),
  experience: z.string().min(1, 'Years of experience is required'),
  currentRole: z.string().min(2, 'Current role is required'),
  company: z.string().min(2, 'Company name is required'),
  education: z.string().min(2, 'Education details are required'),
  bio: z.string().min(100, 'Bio must be at least 100 characters'),
  hourlyRate: z.string().min(1, 'Hourly rate is required'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  linkedin: z.string().url('Invalid LinkedIn URL'),
});

const expertiseOptions = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'UI/UX Design',
  'Product Management',
  'Digital Marketing',
  'Business Strategy',
];

const languageOptions = [
  'Bengali',
  'English',
  'Hindi',
  'Urdu',
];

export default function BecomeMentor() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof mentorApplicationSchema>>({
    resolver: zodResolver(mentorApplicationSchema),
    defaultValues: {
      expertise: [],
      languages: [],
      experience: '',
      currentRole: '',
      company: '',
      education: '',
      bio: '',
      hourlyRate: '',
      linkedin: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof mentorApplicationSchema>) => {
    try {
      // API call would go here
      console.log('Application data:', data);
      toast({
        title: 'Application Submitted!',
        description: 'We will review your application and get back to you soon.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary/50 py-12">
      <div className="container mx-auto px-4">
        {step === 1 ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Become a Mentor</h1>
              <p className="text-xl text-muted-foreground">
                Share your expertise and help others grow while earning
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <GraduationCap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Share Knowledge</h3>
                <p className="text-muted-foreground">
                  Help students learn from your real-world experience
                </p>
              </Card>
              <Card className="p-6">
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
                <p className="text-muted-foreground">
                  Choose your own hours and mentor at your convenience
                </p>
              </Card>
              <Card className="p-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Build Network</h3>
                <p className="text-muted-foreground">
                  Connect with passionate learners and expand your network
                </p>
              </Card>
              <Card className="p-6">
                <Award className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Earn Income</h3>
                <p className="text-muted-foreground">
                  Set your own rates and earn while making an impact
                </p>
              </Card>
            </div>

            <div className="text-center">
              <Button size="lg" onClick={() => setStep(2)}>
                Apply Now
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Mentor Application</h2>
              <p className="text-muted-foreground">
                Fill out the form below to start your journey as a mentor
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Areas of Expertise</FormLabel>
                      <FormDescription>
                        Select the areas where you can provide mentorship
                      </FormDescription>
                      <div className="grid grid-cols-2 gap-2">
                        {expertiseOptions.map((expertise) => (
                          <Button
                            key={expertise}
                            type="button"
                            variant={field.value.includes(expertise) ? 'default' : 'outline'}
                            className="justify-start"
                            onClick={() => {
                              const newValue = field.value.includes(expertise)
                                ? field.value.filter((v) => v !== expertise)
                                : [...field.value, expertise];
                              field.onChange(newValue);
                            }}
                          >
                            {expertise}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Senior Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Current company" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select years of experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '10+'].map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year} {year === 1 ? 'year' : 'years'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., BSc in Computer Science, University of Dhaka"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages</FormLabel>
                      <FormDescription>
                        Select languages you can mentor in
                      </FormDescription>
                      <div className="grid grid-cols-2 gap-2">
                        {languageOptions.map((language) => (
                          <Button
                            key={language}
                            type="button"
                            variant={field.value.includes(language) ? 'default' : 'outline'}
                            className="justify-start"
                            onClick={() => {
                              const newValue = field.value.includes(language)
                                ? field.value.filter((v) => v !== language)
                                : [...field.value, language];
                              field.onChange(newValue);
                            }}
                          >
                            {language}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormDescription>
                        Tell students about yourself and your mentoring style
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Share your experience and what students can expect from your sessions..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate (৳)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 1000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn Profile</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://linkedin.com/in/username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit">Submit Application</Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}