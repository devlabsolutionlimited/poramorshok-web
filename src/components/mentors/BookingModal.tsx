import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Mentor } from '@/types/mentor';
import { CalendarIcon, Clock, Users, CreditCard } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const bookingSchema = z.object({
  date: z.date(),
  time: z.string(),
  duration: z.string(),
  message: z.string().min(10, 'Please provide more details about your goals'),
});

interface BookingModalProps {
  mentor: Mentor;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ mentor, isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      message: '',
      duration: '60',
    },
  });

  const calculateTotal = (duration: string) => {
    const hours = parseInt(duration) / 60;
    return mentor.hourlyRate * hours;
  };

  const handlePayment = async (sessionDetails: z.infer<typeof bookingSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Create a payment intent on your backend
      const response = await fetch('https://api.poramorshok.com/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: calculateTotal(sessionDetails.duration),
          mentorId: mentor.id,
          sessionDetails,
        }),
      });

      const { clientSecret } = await response.json();

      // Load Stripe
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Confirm the payment
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // In a real implementation, you would use Stripe Elements
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2024,
            cvc: '123',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Session Booked!',
        description: 'Your mentoring session has been scheduled successfully.',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process payment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof bookingSchema>) => {
    if (step === 'details') {
      setStep('payment');
    } else {
      await handlePayment(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>Book a Session with {mentor.name}</DialogTitle>
              <DialogDescription>
                {step === 'details' ? (
                  `Schedule a mentoring session at ৳${mentor.hourlyRate}/hour`
                ) : (
                  'Complete payment to confirm your session'
                )}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                {step === 'details' ? (
                  <>
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Session Date</FormLabel>
                          <div className={cn("grid gap-2")}>
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                              </span>
                            </div>
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || date < new Date().setHours(0, 0, 0, 0)
                              }
                              className="rounded-md border shadow"
                              initialFocus
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Slot</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time slot">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{field.value || 'Choose time'}</span>
                                  </div>
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="09:00">9:00 AM</SelectItem>
                              <SelectItem value="10:00">10:00 AM</SelectItem>
                              <SelectItem value="11:00">11:00 AM</SelectItem>
                              <SelectItem value="14:00">2:00 PM</SelectItem>
                              <SelectItem value="15:00">3:00 PM</SelectItem>
                              <SelectItem value="16:00">4:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{field.value} minutes</span>
                                  </div>
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="30">30 minutes - ৳{calculateTotal('30')}</SelectItem>
                              <SelectItem value="60">1 hour - ৳{calculateTotal('60')}</SelectItem>
                              <SelectItem value="90">1.5 hours - ৳{calculateTotal('90')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message to Mentor</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell your mentor about your goals and what you'd like to discuss..."
                              className="min-h-[100px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4 space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Session Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Date</span>
                          <span>{format(form.getValues('date'), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Time</span>
                          <span>{form.getValues('time')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Duration</span>
                          <span>{form.getValues('duration')} minutes</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="font-medium">Total Amount</span>
                          <span className="font-medium">৳{calculateTotal(form.getValues('duration'))}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment Details
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        For demo purposes, payment will be processed using a test card.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (step === 'payment') {
                        setStep('details');
                      } else {
                        onClose();
                      }
                    }}
                  >
                    {step === 'payment' ? 'Back' : 'Cancel'}
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? 'Processing...'
                      : step === 'details'
                      ? 'Continue to Payment'
                      : 'Pay & Confirm'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}