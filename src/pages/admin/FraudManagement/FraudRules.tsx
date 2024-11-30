import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Plus, Settings2 } from 'lucide-react';

const ruleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  threshold: z.string().min(1, 'Threshold is required'),
  enabled: z.boolean(),
});

const defaultRules = [
  {
    id: '1',
    name: 'Multiple Refund Requests',
    description: 'Flag users who request refunds frequently within a short period',
    threshold: '3',
    enabled: true
  },
  {
    id: '2',
    name: 'Session Completion Rate',
    description: 'Monitor users with low session completion rates',
    threshold: '70',
    enabled: true
  },
  {
    id: '3',
    name: 'Payment Pattern Analysis',
    description: 'Detect unusual payment patterns or suspicious transactions',
    threshold: '85',
    enabled: true
  }
];

export default function FraudRules() {
  const [rules, setRules] = useState(defaultRules);
  const { toast } = useToast();
  const [editingRule, setEditingRule] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      name: '',
      description: '',
      threshold: '',
      enabled: true,
    },
  });

  const onSubmit = async (data: z.infer<typeof ruleSchema>) => {
    try {
      if (editingRule) {
        setRules(rules.map(rule => 
          rule.id === editingRule 
            ? { ...rule, ...data }
            : rule
        ));
        toast({
          title: 'Rule Updated',
          description: 'The fraud detection rule has been updated successfully.',
        });
      } else {
        setRules([...rules, { id: Date.now().toString(), ...data }]);
        toast({
          title: 'Rule Added',
          description: 'New fraud detection rule has been added successfully.',
        });
      }
      form.reset();
      setEditingRule(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save rule. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditRule = (rule: typeof defaultRules[0]) => {
    setEditingRule(rule.id);
    form.reset({
      name: rule.name,
      description: rule.description,
      threshold: rule.threshold,
      enabled: rule.enabled,
    });
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map(rule =>
      rule.id === ruleId
        ? { ...rule, enabled: !rule.enabled }
        : rule
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fraud Detection Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rule Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Multiple Refund Detection" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Describe the rule's purpose..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Threshold</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Trigger value for the rule
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enabled</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {editingRule ? 'Update Rule' : 'Add Rule'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{rule.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {rule.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Threshold: {rule.threshold}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => handleToggleRule(rule.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditRule(rule)}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}