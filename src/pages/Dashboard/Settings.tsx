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
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bell, 
  Lock, 
  Mail, 
  Shield, 
  Smartphone,
  Globe,
  Star,
  Link as LinkIcon,
  Languages,
  Clock,
  Eye,
  BookOpen,
  MessageSquare
} from 'lucide-react';

const accountSchema = z.object({
  email: z.string().email(),
  currentPassword: z.string().min(6).optional(),
  newPassword: z.string().min(6).optional(),
  confirmPassword: z.string().min(6).optional(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required when setting a new password",
  path: ["currentPassword"],
}).refine((data) => {
  if (data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  sessionReminders: z.boolean(),
  marketingEmails: z.boolean(),
  mobileNotifications: z.boolean(),
});

const privacySchema = z.object({
  profileVisibility: z.boolean(),
  showAvailability: z.boolean(),
  showRatings: z.boolean(),
  showSocialLinks: z.boolean(),
});

const preferencesSchema = z.object({
  language: z.string(),
  timezone: z.string(),
  emailUpdates: z.boolean(),
  sessionReminders: z.boolean(),
  learningPreferences: z.array(z.string()).optional(),
  communicationPreferences: z.array(z.string()).optional(),
});

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMentor = user?.role === 'mentor';

  const accountForm = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const notificationForm = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      sessionReminders: true,
      marketingEmails: false,
      mobileNotifications: true,
    },
  });

  const privacyForm = useForm({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      profileVisibility: true,
      showAvailability: true,
      showRatings: true,
      showSocialLinks: true,
    },
  });

  const preferencesForm = useForm({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      language: 'en',
      timezone: 'Asia/Dhaka',
      emailUpdates: true,
      sessionReminders: true,
    },
  });

  const onAccountSubmit = async (data: z.infer<typeof accountSchema>) => {
    try {
      // API call would go here
      console.log('Updating account settings:', data);
      
      toast({
        title: 'Settings Updated',
        description: 'Your account settings have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onNotificationSubmit = async (data: z.infer<typeof notificationSchema>) => {
    try {
      // API call would go here
      console.log('Updating notification settings:', data);
      
      toast({
        title: 'Settings Updated',
        description: 'Your notification preferences have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onPrivacySubmit = async (data: z.infer<typeof privacySchema>) => {
    try {
      // API call would go here
      console.log('Updating privacy settings:', data);
      
      toast({
        title: 'Settings Updated',
        description: 'Your privacy settings have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onPreferencesSubmit = async (data: z.infer<typeof preferencesSchema>) => {
    try {
      // API call would go here
      console.log('Updating preferences:', data);
      
      toast({
        title: 'Settings Updated',
        description: 'Your preferences have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update preferences. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          {isMentor && <TabsTrigger value="privacy">Privacy</TabsTrigger>}
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...accountForm}>
                <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-6">
                  <FormField
                    control={accountForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <div className="flex items-center px-3 border rounded-l-md bg-muted">
                              <Mail className="h-4 w-4" />
                            </div>
                            <Input {...field} type="email" className="rounded-l-none" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Change Password</h3>
                    
                    <FormField
                      control={accountForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <div className="flex items-center px-3 border rounded-l-md bg-muted">
                                <Lock className="h-4 w-4" />
                              </div>
                              <Input {...field} type="password" className="rounded-l-none" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={accountForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <div className="flex items-center px-3 border rounded-l-md bg-muted">
                                <Lock className="h-4 w-4" />
                              </div>
                              <Input {...field} type="password" className="rounded-l-none" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={accountForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <div className="flex items-center px-3 border rounded-l-md bg-muted">
                                <Lock className="h-4 w-4" />
                              </div>
                              <Input {...field} type="password" className="rounded-l-none" />
                            </div>
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

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <FormField
                    control={notificationForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                          </div>
                          <FormDescription>
                            Receive email notifications about your sessions and messages
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="sessionReminders"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            <FormLabel className="text-base">Session Reminders</FormLabel>
                          </div>
                          <FormDescription>
                            Get reminders before your scheduled sessions
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="mobileNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            <FormLabel className="text-base">Mobile Notifications</FormLabel>
                          </div>
                          <FormDescription>
                            Receive push notifications on your mobile device
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="marketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <FormLabel className="text-base">Marketing Emails</FormLabel>
                          </div>
                          <FormDescription>
                            Receive updates about new features and promotions
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
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
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...preferencesForm}>
                <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
                  {!isMentor && (
                    <>
                      <FormField
                        control={preferencesForm.control}
                        name="learningPreferences"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                <FormLabel className="text-base">Learning Style Updates</FormLabel>
                              </div>
                              <FormDescription>
                                Receive personalized learning recommendations
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value?.includes('personalized')}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  field.onChange(
                                    checked
                                      ? [...current, 'personalized']
                                      : current.filter((v) => v !== 'personalized')
                                  );
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={preferencesForm.control}
                        name="communicationPreferences"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                <FormLabel className="text-base">Session Communication</FormLabel>
                              </div>
                              <FormDescription>
                                Preferred method for session communications
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value?.includes('email')}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  field.onChange(
                                    checked
                                      ? [...current, 'email']
                                      : current.filter((v) => v !== 'email')
                                  );
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {isMentor && (
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...privacyForm}>
                  <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-6">
                    <FormField
                      control={privacyForm.control}
                      name="profileVisibility"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              <FormLabel className="text-base">Public Profile</FormLabel>
                            </div>
                            <FormDescription>
                              Make your profile visible to students
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={privacyForm.control}
                      name="showAvailability"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              <FormLabel className="text-base">Show Availability</FormLabel>
                            </div>
                            <FormDescription>
                              Display your available time slots to students
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={privacyForm.control}
                      name="showRatings"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              <FormLabel className="text-base">Show Ratings</FormLabel>
                            </div>
                            <FormDescription>
                              Display your ratings and reviews on your profile
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={privacyForm.control}
                      name="showSocialLinks"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <LinkIcon className="h-4 w-4" />
                              <FormLabel className="text-base">Show Social Links</FormLabel>
                            </div>
                            <FormDescription>
                              Display your social media links on your profile
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
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
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}