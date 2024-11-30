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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Github, Globe, Linkedin, Twitter } from 'lucide-react';

const socialLinksSchema = z.object({
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
});

export default function SocialLinks({ profile }) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      linkedin: profile.socialLinks?.linkedin || '',
      github: profile.socialLinks?.github || '',
      twitter: profile.socialLinks?.twitter || '',
      website: profile.socialLinks?.website || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      // API call would go here
      console.log('Updating social links:', data);
      
      toast({
        title: 'Social Links Updated',
        description: 'Your social links have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update social links. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center px-3 border rounded-l-md bg-muted">
                        <Linkedin className="h-4 w-4" />
                      </div>
                      <Input
                        {...field}
                        className="rounded-l-none"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your LinkedIn profile URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Profile</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center px-3 border rounded-l-md bg-muted">
                        <Github className="h-4 w-4" />
                      </div>
                      <Input
                        {...field}
                        className="rounded-l-none"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your GitHub profile URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter Profile</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center px-3 border rounded-l-md bg-muted">
                        <Twitter className="h-4 w-4" />
                      </div>
                      <Input
                        {...field}
                        className="rounded-l-none"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your Twitter profile URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Website</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center px-3 border rounded-l-md bg-muted">
                        <Globe className="h-4 w-4" />
                      </div>
                      <Input
                        {...field}
                        className="rounded-l-none"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your personal website or portfolio URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}