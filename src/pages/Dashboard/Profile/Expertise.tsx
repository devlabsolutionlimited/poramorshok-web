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
import { useToast } from '@/hooks/use-toast';

const expertiseSchema = z.object({
  expertise: z.string().min(2, 'Expertise must be at least 2 characters'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
});

export default function Expertise({ profile }) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(expertiseSchema),
    defaultValues: {
      expertise: '',
      languages: profile.languages,
    },
  });

  const onSubmit = async (data) => {
    try {
      // API call would go here
      console.log('Updating expertise:', data);
      
      toast({
        title: 'Expertise Updated',
        description: 'Your expertise has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update expertise. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddExpertise = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !profile.expertise.includes(value)) {
        profile.expertise.push(value);
        e.target.value = '';
      }
    }
  };

  const handleRemoveExpertise = (item) => {
    profile.expertise = profile.expertise.filter(exp => exp !== item);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Areas of Expertise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-2">
              {profile.expertise.map((item) => (
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

            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}