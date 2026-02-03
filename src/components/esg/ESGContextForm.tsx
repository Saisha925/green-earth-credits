import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Building2 } from "lucide-react";
import { INDUSTRIES, REPORTING_FRAMEWORKS, COUNTRIES } from "@/lib/esgScoring";
import { ReportContext } from "@/pages/ESGReport";

const formSchema = z.object({
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  reportingYear: z.coerce.number().min(2000).max(2100),
  industry: z.string().min(1, "Please select an industry"),
  country: z.string().min(1, "Please select a country"),
  reportingFramework: z.string().min(1, "Please select a framework"),
});

interface ESGContextFormProps {
  initialData: ReportContext;
  onSubmit: (data: ReportContext) => void;
}

export const ESGContextForm = ({ initialData, onSubmit }: ESGContextFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Report Context</h2>
            <p className="text-sm text-muted-foreground">
              Provide information about your organization and reporting period
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization / Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reportingYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reporting Year</FormLabel>
                  <FormControl>
                    <Input type="number" min={2000} max={2100} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country / Geography</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reportingFramework"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reporting Framework</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reporting framework" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REPORTING_FRAMEWORKS.map((framework) => (
                        <SelectItem key={framework} value={framework}>
                          {framework}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full gradient-primary text-primary-foreground btn-glow">
              Continue to ESG Data
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
