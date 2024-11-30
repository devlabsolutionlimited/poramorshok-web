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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useMentorProfile } from '@/hooks/api/useMentorProfile';
import type { MentorProfile } from '@/types/mentor';

const expertiseSchema = z.object({
  expertise: z.array(z.string()).min(1, 'At least one expertise is required'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
});

interface ExpertiseProps {
  profile: MentorProfile;
}

export default function Expertise({ profile }: ExpertiseProps) {
  const { updateExpertise, isUpdating } = useMentorProfile();

  const form = useForm({
    resolver: zodResolver(expertiseSchema),
    defaultValues: {
      expertise: profile.expertise,
      languages: profile.languages,
    },
  });

  const handleSubmit = async (data: z.infer<typeof expertiseSchema>) => {
    await updateExpertise(data);
  };

  const handleAddExpertise = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !form.getValues('expertise').includes(value)) {
        const currentExpertise = form.getValues('expertise');
        form.setValue('expertise', [...currentExpertise, value]);
        e.currentTarget.value = '';
      }
    }
  };

  const handleRemoveExpertise = (item: string) => {
    const currentExpertise = form.getValues('expertise');
    form.setValue('expertise', currentExpertise.filter(exp => exp !== item));
  };

  const handleAddLanguage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !form.getValues('languages').includes(value)) {
        const currentLanguages = form.getValues('languages');
        form.setValue('languages', [...currentLanguages, value]);
        e.currentTarget.value = '';
      }
    }
  };

  const handleRemoveLanguage = (item: string) => {
    const currentLanguages = form.getValues('languages');
    form.setValue('languages', currentLanguages.filter(lang => lang !== item));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Areas of Expertise</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="expertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add Expertise</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type and press Enter to add"
                      onKeyDown={handleAddExpertise}
                    />
                  </FormControl>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((item) => (
                      <Badge key={item} variant="secondary" className="pl-2">
                        {item}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 ml-2"
                          onClick={() => handleRemoveExpertise(item)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
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
                  <FormControl>
                    <Input
                      placeholder="Type and press Enter to add"
                      onKeyDown={handleAddLanguage}
                    />
                  </FormControl>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((item) => (
                      <Badge key={item} variant="secondary" className="pl-2">
                        {item}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 ml-2"
                          onClick={() => handleRemoveLanguage(item)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
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