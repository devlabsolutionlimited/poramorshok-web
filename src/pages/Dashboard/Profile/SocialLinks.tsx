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
import { useMentorProfile } from '@/hooks/api/useMentorProfile';
import { Github, Globe, Linkedin, Twitter } from 'lucide-react';
import type { MentorProfile } from '@/types/mentor';

const socialLinksSchema = z.object({
  socialLinks: z.array(z.object({
    platform: z.enum(['twitter', 'linkedin', 'github', 'website']),
    url: z.string().url('Please enter a valid URL'),
  })),
});

interface SocialLinksProps {
  profile: MentorProfile;
}

export default function SocialLinks({ profile }: SocialLinksProps) {
  const { updateSocialLinks, isUpdating } = useMentorProfile();

  const form = useForm({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      socialLinks: profile.socialLinks,
    },
  });

  const handleSubmit = async (data: z.infer<typeof socialLinksSchema>) => {
    await updateSocialLinks(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="socialLinks"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-4">
                    {/* Twitter */}
                    <div>
                      <FormLabel>Twitter Profile</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="flex items-center px-3 border rounded-l-md bg-muted">
                            <Twitter className="h-4 w-4" />
                          </div>
                          <Input
                            value={field.value.find(link => link.platform === 'twitter')?.url || ''}
                            onChange={(e) => {
                              const newLinks = field.value.filter(link => link.platform !== 'twitter');
                              if (e.target.value) {
                                newLinks.push({ platform: 'twitter', url: e.target.value });
                              }
                              field.onChange(newLinks);
                            }}
                            className="rounded-l-none"
                            placeholder="https://twitter.com/username"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your Twitter profile URL
                      </FormDescription>
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <FormLabel>LinkedIn Profile</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="flex items-center px-3 border rounded-l-md bg-muted">
                            <Linkedin className="h-4 w-4" />
                          </div>
                          <Input
                            value={field.value.find(link => link.platform === 'linkedin')?.url || ''}
                            onChange={(e) => {
                              const newLinks = field.value.filter(link => link.platform !== 'linkedin');
                              if (e.target.value) {
                                newLinks.push({ platform: 'linkedin', url: e.target.value });
                              }
                              field.onChange(newLinks);
                            }}
                            className="rounded-l-none"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your LinkedIn profile URL
                      </FormDescription>
                    </div>

                    {/* GitHub */}
                    <div>
                      <FormLabel>GitHub Profile</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="flex items-center px-3 border rounded-l-md bg-muted">
                            <Github className="h-4 w-4" />
                          </div>
                          <Input
                            value={field.value.find(link => link.platform === 'github')?.url || ''}
                            onChange={(e) => {
                              const newLinks = field.value.filter(link => link.platform !== 'github');
                              if (e.target.value) {
                                newLinks.push({ platform: 'github', url: e.target.value });
                              }
                              field.onChange(newLinks);
                            }}
                            className="rounded-l-none"
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your GitHub profile URL
                      </FormDescription>
                    </div>

                    {/* Website */}
                    <div>
                      <FormLabel>Personal Website</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="flex items-center px-3 border rounded-l-md bg-muted">
                            <Globe className="h-4 w-4" />
                          </div>
                          <Input
                            value={field.value.find(link => link.platform === 'website')?.url || ''}
                            onChange={(e) => {
                              const newLinks = field.value.filter(link => link.platform !== 'website');
                              if (e.target.value) {
                                newLinks.push({ platform: 'website', url: e.target.value });
                              }
                              field.onChange(newLinks);
                            }}
                            className="rounded-l-none"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your personal website or portfolio URL
                      </FormDescription>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}