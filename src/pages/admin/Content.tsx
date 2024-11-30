import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AdminLayout from './Layout';
import { PageLoader } from '@/components/ui/page-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import PermissionGuard from '@/components/admin/PermissionGuard';
import { FileText, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

const heroSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  ctaText: z.string().min(1, 'CTA text is required'),
  ctaLink: z.string().min(1, 'CTA link is required'),
});

const featureSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
});

const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  company: z.string().min(1, 'Company is required'),
  content: z.string().min(1, 'Content is required'),
  avatar: z.string().url('Must be a valid URL'),
});

// Mock data fetching
const fetchContent = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    hero: {
      title: 'Learn from Expert Mentors',
      subtitle: 'Connect with industry-leading professionals for personalized 1-on-1 mentoring sessions',
      ctaText: 'Find Your Mentor',
      ctaLink: '/mentors'
    },
    features: [
      {
        title: 'Expert Guidance',
        description: 'Learn from professionals with real industry experience',
        icon: 'BookOpen'
      },
      {
        title: '1:1 Sessions',
        description: 'Personalized mentoring sessions tailored to your needs',
        icon: 'Users'
      }
    ],
    testimonials: [
      {
        name: 'Sarah Ahmed',
        role: 'Software Developer',
        company: 'Google',
        content: 'The mentoring sessions helped me improve my coding skills significantly.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
      }
    ]
  };
};

export default function AdminContent() {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-content'],
    queryFn: fetchContent
  });

  const heroForm = useForm({
    resolver: zodResolver(heroSchema),
    defaultValues: data?.hero
  });

  const featureForm = useForm({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      title: '',
      description: '',
      icon: ''
    }
  });

  const testimonialForm = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: '',
      role: '',
      company: '',
      content: '',
      avatar: ''
    }
  });

  const onHeroSubmit = async (data: z.infer<typeof heroSchema>) => {
    try {
      // API call would go here
      console.log('Updating hero section:', data);
      
      toast({
        title: 'Hero Section Updated',
        description: 'The hero section has been updated successfully.',
      });
      
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update hero section. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onFeatureSubmit = async (data: z.infer<typeof featureSchema>) => {
    try {
      // API call would go here
      console.log('Adding/updating feature:', data);
      
      toast({
        title: selectedFeature ? 'Feature Updated' : 'Feature Added',
        description: `The feature has been ${selectedFeature ? 'updated' : 'added'} successfully.`,
      });
      
      setSelectedFeature(null);
      featureForm.reset();
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save feature. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onTestimonialSubmit = async (data: z.infer<typeof testimonialSchema>) => {
    try {
      // API call would go here
      console.log('Adding/updating testimonial:', data);
      
      toast({
        title: selectedTestimonial ? 'Testimonial Updated' : 'Testimonial Added',
        description: `The testimonial has been ${selectedTestimonial ? 'updated' : 'added'} successfully.`,
      });
      
      setSelectedTestimonial(null);
      testimonialForm.reset();
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save testimonial. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFeature = async (index: number) => {
    try {
      // API call would go here
      console.log('Deleting feature at index:', index);
      
      toast({
        title: 'Feature Deleted',
        description: 'The feature has been deleted successfully.',
      });
      
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete feature. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTestimonial = async (index: number) => {
    try {
      // API call would go here
      console.log('Deleting testimonial at index:', index);
      
      toast({
        title: 'Testimonial Deleted',
        description: 'The testimonial has been deleted successfully.',
      });
      
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PermissionGuard permissions={['manage_content']}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Content Management</h1>
          </div>

          <Tabs defaultValue="hero" className="space-y-6">
            <TabsList>
              <TabsTrigger value="hero">Hero Section</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            </TabsList>

            <TabsContent value="hero">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>
                    Update the main hero section content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...heroForm}>
                    <form onSubmit={heroForm.handleSubmit(onHeroSubmit)} className="space-y-4">
                      <FormField
                        control={heroForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={heroForm.control}
                        name="subtitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subtitle</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={heroForm.control}
                          name="ctaText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CTA Button Text</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={heroForm.control}
                          name="ctaLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CTA Button Link</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Features</CardTitle>
                      <CardDescription>
                        Manage feature sections
                      </CardDescription>
                    </div>
                    <Button onClick={() => setSelectedFeature({})}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {data?.features.map((feature, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{feature.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {feature.description}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedFeature(feature);
                                  featureForm.reset(feature);
                                }}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteFeature(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testimonials">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Testimonials</CardTitle>
                      <CardDescription>
                        Manage testimonial sections
                      </CardDescription>
                    </div>
                    <Button onClick={() => setSelectedTestimonial({})}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Testimonial
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {data?.testimonials.map((testimonial, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <h3 className="font-semibold">{testimonial.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {testimonial.role} at {testimonial.company}
                                </p>
                                <p className="text-sm mt-2">{testimonial.content}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedTestimonial(testimonial);
                                  testimonialForm.reset(testimonial);
                                }}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTestimonial(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Feature Dialog */}
          <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedFeature?.title ? 'Edit Feature' : 'Add Feature'}
                </DialogTitle>
                <DialogDescription>
                  {selectedFeature?.title ? 'Edit existing feature details' : 'Add a new feature section'}
                </DialogDescription>
              </DialogHeader>

              <Form {...featureForm}>
                <form onSubmit={featureForm.handleSubmit(onFeatureSubmit)} className="space-y-4">
                  <FormField
                    control={featureForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={featureForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={featureForm.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., BookOpen, Users, etc." />
                        </FormControl>
                        <FormDescription>
                          Enter a valid Lucide icon name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedFeature(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {selectedFeature?.title ? 'Save Changes' : 'Add Feature'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Testimonial Dialog */}
          <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedTestimonial?.name ? 'Edit Testimonial' : 'Add Testimonial'}
                </DialogTitle>
                <DialogDescription>
                  {selectedTestimonial?.name ? 'Edit existing testimonial' : 'Add a new testimonial'}
                </DialogDescription>
              </DialogHeader>

              <Form {...testimonialForm}>
                <form onSubmit={testimonialForm.handleSubmit(onTestimonialSubmit)} className="space-y-4">
                  <FormField
                    control={testimonialForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={testimonialForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={testimonialForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={testimonialForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Testimonial</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={testimonialForm.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a valid image URL for the avatar
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedTestimonial(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {selectedTestimonial?.name ? 'Save Changes' : 'Add Testimonial'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </PermissionGuard>
    </AdminLayout>
  );
}