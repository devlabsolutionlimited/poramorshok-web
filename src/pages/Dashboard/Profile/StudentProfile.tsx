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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudentProfile } from '@/hooks/api/useStudentProfile';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { useAuth } from '@/contexts/AuthContext';

const profileSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  interests: z.string().min(1, 'Please add some interests'),
  learningGoals: z.string().min(1, 'Please add some learning goals'),
  education: z.object({
    level: z.string().min(1, 'Education level is required'),
    institution: z.string().min(1, 'Institution name is required'),
    field: z.string().min(1, 'Field of study is required'),
    graduationYear: z.string()
      .refine(val => !isNaN(Number(val)), 'Must be a valid year')
      .refine(val => Number(val) >= 1900 && Number(val) <= new Date().getFullYear() + 10, 'Invalid year')
  })
});

export default function StudentProfile() {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile, updateAvatar } = useStudentProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: profile?.bio || '',
      interests: profile?.interests?.join(', ') || '',
      learningGoals: profile?.learningGoals?.join(', ') || '',
      education: {
        level: profile?.education?.level || '',
        institution: profile?.education?.institution || '',
        field: profile?.education?.field || '',
        graduationYear: profile?.education?.graduationYear?.toString() || ''
      }
    }
  });

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      setIsSubmitting(true);
      await updateProfile({
        ...data,
        interests: data.interests.split(',').map(i => i.trim()),
        learningGoals: data.learningGoals.split(',').map(g => g.trim()),
        education: {
          ...data.education,
          graduationYear: parseInt(data.education.graduationYear)
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    await updateAvatar(file);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarUpload
            currentAvatar={user?.avatar}
            name={user?.name || ''}
            onUpload={handleAvatarUpload}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Web Development, Machine Learning, etc. (comma separated)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="learningGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Learning Goals</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Master React, Learn Python, etc. (comma separated)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="font-medium">Education</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="education.level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Bachelor's, Master's"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="education.institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., University of Dhaka"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="education.field"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Computer Science"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="education.graduationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 2024"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}