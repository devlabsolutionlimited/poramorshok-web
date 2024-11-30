import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Copy, Facebook, Linkedin, Twitter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  hourlyRate: z.string().optional(),
  expertise: z.string(),
  customUrl: z.string()
    .min(3, 'URL must be at least 3 characters')
    .max(30, 'URL must be less than 30 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'Only letters, numbers, and hyphens are allowed')
    .optional(),
  socialLinks: z.object({
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    facebook: z.string().url().optional(),
  }).optional(),
});

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isMentor = user?.role === 'mentor';

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      title: '',
      bio: '',
      hourlyRate: '',
      expertise: '',
      customUrl: '',
      socialLinks: {
        twitter: '',
        linkedin: '',
        facebook: '',
      },
    },
  });

  const customUrl = form.watch('customUrl');
  const profileUrl = `${window.location.origin}/mentor/${customUrl || user?.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copied!',
        description: 'Profile URL copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const shareToSocial = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const text = encodeURIComponent(`Book a mentoring session with me on Poramorshok!`);
    const url = encodeURIComponent(profileUrl);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      // API call would go here
      console.log('Profile data:', data);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isMentor && (
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate (৳)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="expertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Areas of Expertise</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Web Development, Machine Learning" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {isMentor && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Custom Profile URL</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom URL</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-2 rounded-lg border bg-muted px-3 text-muted-foreground">
                              <span>{window.location.origin}/mentor/</span>
                              <Input
                                {...field}
                                className="border-0 bg-transparent p-0 focus-visible:ring-0"
                                placeholder="your-custom-url"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              className="gap-2"
                              onClick={copyToClipboard}
                            >
                              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              {copied ? 'Copied!' : 'Copy'}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsPreviewOpen(true)}
                            >
                              Preview
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Create a memorable URL for your profile that you can share with others.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-4 pt-4">
                    <span className="text-sm font-medium">Share Profile:</span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => shareToSocial('twitter')}
                      >
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => shareToSocial('linkedin')}
                      >
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => shareToSocial('facebook')}
                      >
                        <Facebook className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="socialLinks.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Profile</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://twitter.com/username" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn Profile</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://linkedin.com/in/username" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook Profile</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://facebook.com/username" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </>
          )}

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>

      {/* Profile Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Profile Preview</DialogTitle>
            <DialogDescription>
              This is how your profile will appear to others
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 rounded-lg border bg-muted p-4">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold">{form.watch('name')}</h2>
              <p className="text-muted-foreground">{form.watch('title')}</p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">About</h3>
                <p>{form.watch('bio')}</p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Expertise</h3>
                <p>{form.watch('expertise')}</p>
              </div>
              {isMentor && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Rate</h3>
                  <p>৳{form.watch('hourlyRate')}/hour</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}