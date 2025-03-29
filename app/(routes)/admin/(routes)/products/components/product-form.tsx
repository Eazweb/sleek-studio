"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Image from "next/image";
import { FileUpload } from "@/components/ui/file-upload";
import { Plus, X } from "lucide-react";
import { slugify } from "@/lib/utils";

const categories = [
  "Men",
  "Women",
  "Children",
  "Accessories",
  "Footwear",
  "Sportswear",
  "Casual",
  "Formal",
  "Outerwear",
];

const productFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters" }).optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  salePrice: z.coerce.number().nonnegative({ message: "Sale price must be zero or positive" }).optional(),
  inventory: z.coerce.number().int().nonnegative({ message: "Inventory must be zero or positive" }),
  noBgImage: z.string().optional(),
  modelImage: z.string().optional(),
  additionalImages: z.array(z.string()).default([]),
  category: z.string({ required_error: "Please select a category" }),
  tags: z.string().optional(),
  sizes: z.string().optional(),
  isActive: z.boolean().default(true),
  homePageFeatured: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  initialData?: any;
}

export const ProductForm = ({ initialData }: ProductFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      slug: initialData.slug || "",
      tags: initialData.tags?.join(", ") || "",
      sizes: initialData.sizes?.join(", ") || "",
      // Extract additional images (excluding the first two which are noBgImage and modelImage)
      additionalImages: initialData.images?.slice(2) || [],
    } : {
      name: "",
      slug: "",
      description: "",
      price: 0,
      inventory: 0,
      noBgImage: "",
      modelImage: "",
      additionalImages: [],
      category: "",
      tags: "",
      sizes: "",
      isActive: true,
      homePageFeatured: false,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      // Convert comma-separated strings to arrays
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      const sizesArray = data.sizes ? data.sizes.split(',').map(size => size.trim()).filter(Boolean) : [];

      // Prepare the complete data to send to the API
      const formData = {
        ...data,
        // Replace string fields with proper arrays
        tags: tagsArray,
        sizes: sizesArray,
        // Combine all images into a single array for API
        images: [
          data.noBgImage, 
          data.modelImage, 
          ...data.additionalImages
        ].filter(Boolean),
      };

      if (initialData) {
        // Update product with API
        const response = await fetch(`/api/products/${initialData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to update product");
        }

        toast.success("Product updated successfully");
      } else {
        // Create product with API
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to create product");
        }

        toast.success("Product created successfully");
        router.push("/admin/products");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleNoBgImageUpload = useCallback(
    (result: { url: string }) => {
      form.setValue("noBgImage", result.url, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form]
  );

  const handleModelImageUpload = useCallback(
    (result: { url: string }) => {
      form.setValue("modelImage", result.url, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form]
  );

  const handleAdditionalImageUpload = useCallback(
    (result: { url: string }, index: number) => {
      const currentImages = form.getValues("additionalImages") || [];
      const newImages = [...currentImages];
      newImages[index] = result.url;
      
      form.setValue("additionalImages", newImages, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form]
  );

  const addImageSlot = useCallback(() => {
    const currentImages = form.getValues("additionalImages") || [];
    if (currentImages.length < 3) { // Max 3 additional images (total 5 with noBgImage and modelImage)
      form.setValue("additionalImages", [...currentImages, ""], {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      toast.error("Maximum 5 images allowed (2 main + 3 additional)");
    }
  }, [form]);

  const removeAdditionalImage = useCallback((index: number) => {
    const currentImages = form.getValues("additionalImages") || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    
    form.setValue("additionalImages", newImages, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [form]);

  // Auto-generate slug when name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    
    // Only auto-generate slug if it's empty or if we're creating a new product
    if (!initialData || !form.getValues("slug")) {
      const generatedSlug = slugify(name);
      form.setValue("slug", generatedSlug, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Heading
          title={initialData ? "Edit Product" : "Create Product"}
          description={initialData ? "Update product details" : "Add a new product to your store"}
        />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Product name" 
                        {...field} 
                        onChange={handleNameChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="product-slug" {...field} />
                    </FormControl>
                    <FormDescription>
                      Used for the product URL. Auto-generated from name, but can be customized.
                    </FormDescription>
                    <FormMessage />
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
                      <Textarea
                        placeholder="Product description"
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="Optional" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty for no sale
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="inventory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="Comma separated tags" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>
                      Separate tags with commas (e.g., "summer, casual, new")
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Sizes</FormLabel>
                    <FormControl>
                      <Input placeholder="Comma separated sizes" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>
                      Separate sizes with commas (e.g., "S, M, L, XL")
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="noBgImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No Background Image (Main Image)</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={handleNoBgImageUpload}
                        endpoint="productImage"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload product image with transparent background
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Image (Secondary Image)</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={handleModelImageUpload}
                        endpoint="productImage"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload product image with model
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel>Additional Images (Max 3)</FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addImageSlot}
                    disabled={form.watch("additionalImages")?.length >= 3}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {form.watch("additionalImages")?.map((image, index) => (
                    <div key={index} className="relative">
                      <FileUpload
                        value={image}
                        onChange={(result) => handleAdditionalImageUpload(result, index)}
                        endpoint="productImage"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-0 right-0"
                        onClick={() => removeAdditionalImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <FormDescription>
                  Add up to 3 additional product images (5 total including main images)
                </FormDescription>
              </div>
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        This product will be visible in the store
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="homePageFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured on Home Page</FormLabel>
                      <FormDescription>
                        This product will be displayed on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/products")}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}; 