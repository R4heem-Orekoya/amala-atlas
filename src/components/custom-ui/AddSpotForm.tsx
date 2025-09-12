"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "../../../convex/_generated/api";
import { ScrollArea } from "../ui/scroll-area";
import { ImageDropzone } from "./ImageDropzone";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  category: z.string({ message: "Please select a category." }),
  description: z.string().optional(),
  tags: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required."),
  rating: z.number().min(0).max(5).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddSpotForm() {
   const generateUploadUrl = useMutation(api.spots.generateImageUploadUrl);
  const addSpotWithImages = useMutation(api.spots.addSpotWithImages);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      tags: "",
    },
  });

 async function onSubmit(data: FormValues) {
   const tagsArray = data.tags ? data.tags.split(",").map((t) => t.trim()) : [];

   toast.promise(
     (async () => {
       const uploadUrls = await Promise.all(
         data.images.map(() => generateUploadUrl())
       );

       const responses = await Promise.all(
         data.images.map((file, idx) => {
           return fetch(uploadUrls[idx], {
             method: "POST",
             headers: { "Content-Type": file.type },
             body: file,
           }).then((res) => res.json());
         })
       );

       const storageIds = responses.map((r) => r.storageId);

       await addSpotWithImages({
         name: data.name,
         address: data.address,
         category: data.category,
         description: data.description,
         tags: tagsArray,
         latitude: data.latitude,
         longitude: data.longitude,
         rating: data.rating,
         imageStorageIds: storageIds,
       });

       form.reset();
     })(),
     {
       loading: "Adding your Amala spot...",
       success: "Amala spot added successfully 🎉",
       error: "Failed to add spot. Please try again.",
     }
   );
 }

  return (
    <div className="mx-auto flex-1 flex flex-col min-h-full mt-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Amala Spot</h1>
        <p className="text-muted-foreground mt-2">
          Share your favorite Amala spot with the community
        </p>
      </div>
      <ScrollArea className="overflow-y-auto flex-1 flex flex-col pr-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Images */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Photos</FormLabel>
                  <FormControl>
                    <ImageDropzone
                      field={field}
                      value={field.value || []}
                      onChange={(files) => {
                        field.onChange(files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spot Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Mama T's Amala Joint"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The name of the restaurant or food spot.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="123 Main Street, City"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Full address of the location.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g., 6.5244"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : e.target.valueAsNumber
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g., 3.3792"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : e.target.valueAsNumber
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="street-food">Street Food</SelectItem>
                        <SelectItem value="cafe">Cafe</SelectItem>
                        <SelectItem value="food-joint">Food Joint</SelectItem>
                        <SelectItem value="bukateria">Bukateria</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        placeholder="e.g., 4.5"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : e.target.valueAsNumber
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about this spot - what makes it special?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Share details about the ambiance, specialties, or
                    recommendations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., authentic, affordable, family-friendly"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated tags to help others find this spot.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4 pt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Spot
              </Button>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
}
