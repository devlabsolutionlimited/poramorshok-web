import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { categorySchema } from '@/types/mentor';
import type { MentorSearchFilters } from '@/types/mentor';

const filterSchema = z.object({
  category: categorySchema.optional(),
  expertise: z.string().optional(),
  priceRange: z.array(z.number()).length(2),
  rating: z.string().optional(),
  language: z.string().optional(),
});

interface MentorFiltersProps {
  onFilterChange: (filters: MentorSearchFilters) => void;
}

export default function MentorFilters({ onFilterChange }: MentorFiltersProps) {
  const form = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      category: undefined,
      expertise: undefined,
      priceRange: [0, 5000],
      rating: undefined,
      language: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    onFilterChange({
      category: data.category,
      expertise: data.expertise ? [data.expertise] : undefined,
      priceRange: {
        min: data.priceRange[0],
        max: data.priceRange[1],
      },
      rating: data.rating ? Number(data.rating) : undefined,
      language: data.language ? [data.language] : undefined,
    });
  };

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Language">Language</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Career">Career</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expertise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expertise</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select expertise" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Range (৳)</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={5000}
                  step={100}
                  value={field.value}
                  onValueChange={field.onChange}
                  className="mt-2"
                />
              </FormControl>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>৳{field.value[0]}</span>
                <span>৳{field.value[1]}</span>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Rating</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select minimum rating" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="4.5">4.5 & above</SelectItem>
                  <SelectItem value="4.0">4.0 & above</SelectItem>
                  <SelectItem value="3.5">3.5 & above</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bengali">Bengali</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}