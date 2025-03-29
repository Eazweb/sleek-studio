"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

// Types
type ProductsParams = {
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "popular";
  skip?: number;
};

// Admin types
type AdminProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: "active" | "inactive" | "all";
};

/**
 * Get all products with filtering and pagination
 */
export async function getProducts({
  limit = 10,
  category,
  featured,
  search,
  sort,
  skip = 0,
}: ProductsParams = {}) {
  try {
    // Build the where clause
    const where: any = {
      isActive: true,
    };

    // Add category filter if provided
    if (category) {
      where.category = category;
    }

    // Add featured filter if provided
    if (featured !== undefined) {
      where.homePageFeatured = featured;
    }

    // Add search filter if provided
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    // Determine orderBy based on sort
    let orderBy: any = { createdAt: 'desc' };
    
    if (sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'popular') {
      orderBy = { timesSold: 'desc' };
    }

    // Fetch products with pagination
    const products = await db.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await db.product.count({ where });

    return {
      products,
      totalCount,
      hasMore: skip + products.length < totalCount,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

/**
 * Get featured products for homepage
 */
export async function getFeaturedProducts(limit = 8) {
  return getProducts({
    featured: true,
    limit,
    sort: "newest",
  });
}

/**
 * Get a product by slug
 */
export async function getProductBySlug(slug: string) {
  try {
    const product = await db.product.findUnique({
      where: {
        slug,
        isActive: true,
      },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw new Error("Failed to fetch product");
  }
}

/**
 * Get similar products based on category and tags
 */
export async function getSimilarProducts(productId: string, limit = 4) {
  try {
    // First, get the current product to access its category and tags
    const currentProduct = await db.product.findUnique({
      where: { id: productId },
      select: {
        category: true,
        tags: true,
      },
    });

    if (!currentProduct) {
      throw new Error("Product not found");
    }

    // Find products with the same category or tags
    const similarProducts = await db.product.findMany({
      where: {
        id: { not: productId }, // Exclude the current product
        isActive: true,
        OR: [
          { category: currentProduct.category },
          { tags: { hasSome: currentProduct.tags } },
        ],
      },
      orderBy: { timesSold: "desc" }, // Sort by popularity
      take: limit,
    });

    return similarProducts;
  } catch (error) {
    console.error("Error fetching similar products:", error);
    throw new Error("Failed to fetch similar products");
  }
}

/**
 * Get a product by ID (for admin)
 */
export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        orderItems: {
          include: {
            order: true,
          },
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw new Error("Failed to fetch product");
  }
}

/**
 * Get products for admin with filtering and pagination
 */
export async function getAdminProducts({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  status = "all",
}: AdminProductsParams = {}) {
  try {
    const skip = (page - 1) * limit;

    // Build the where clause
    const where: any = {};

    if (status !== "all") {
      where.isActive = status === "active";
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch products with pagination
    const products = await db.product.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            orderItems: true,
            reviews: true,
          },
        },
      },
    });

    // Get total count for pagination
    const totalCount = await db.product.count({ where });

    return {
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching admin products:", error);
    throw new Error("Failed to fetch products");
  }
}

/**
 * Create a new product
 */
export async function createProduct(data: any) {
  try {
    // Generate a slug based on the product name
    const slug = slugify(data.name);

    // Check if the slug already exists
    const existingProduct = await db.product.findUnique({
      where: { slug },
    });

    // If slug exists, append a random number to make it unique
    let uniqueSlug = slug;
    if (existingProduct) {
      uniqueSlug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // Create new product
    const product = await db.product.create({
      data: {
        ...data,
        slug: uniqueSlug,
        // Convert string arrays appropriately
        tags: Array.isArray(data.tags) ? data.tags : data.tags?.split(',').map((tag: string) => tag.trim()) || [],
        sizes: Array.isArray(data.sizes) ? data.sizes : data.sizes?.split(',').map((size: string) => size.trim()) || [],
        images: Array.isArray(data.images) ? data.images : [data.noBgImage, data.modelImage],
      },
    });

    revalidatePath("/admin/products");
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, data: any) {
  try {
    // Check if the name has changed, if so, update the slug
    let updateData = { ...data };
    
    const existingProduct = await db.product.findUnique({
      where: { id },
      select: { name: true },
    });

    if (existingProduct && existingProduct.name !== data.name) {
      const newSlug = slugify(data.name);
      
      // Check if the new slug already exists (except for this product)
      const slugExists = await db.product.findFirst({
        where: {
          slug: newSlug,
          id: { not: id },
        },
      });

      // If slug exists, append a random number to make it unique
      updateData.slug = slugExists 
        ? `${newSlug}-${Math.floor(Math.random() * 1000)}`
        : newSlug;
    }

    // Handle arrays correctly
    if (data.tags) {
      updateData.tags = Array.isArray(data.tags) ? data.tags : data.tags.split(',').map((tag: string) => tag.trim());
    }
    
    if (data.sizes) {
      updateData.sizes = Array.isArray(data.sizes) ? data.sizes : data.sizes.split(',').map((size: string) => size.trim());
    }
    
    if (data.images) {
      updateData.images = Array.isArray(data.images) ? data.images : [data.noBgImage, data.modelImage];
    }

    // Update product
    const product = await db.product.update({
      where: { id },
      data: updateData,
    });

    revalidatePath(`/admin/products/${id}`);
    revalidatePath(`/admin/products`);
    return product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

/**
 * Toggle product status (active/inactive)
 */
export async function toggleProductStatus(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Toggle the status
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        isActive: !product.isActive,
      },
    });

    revalidatePath(`/admin/products`);
    return updatedProduct;
  } catch (error) {
    console.error("Error toggling product status:", error);
    throw new Error("Failed to update product status");
  }
}

/**
 * Toggle product featured status
 */
export async function toggleProductFeatured(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      select: { homePageFeatured: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Toggle the featured status
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        homePageFeatured: !product.homePageFeatured,
      },
    });

    revalidatePath(`/admin/products`);
    return updatedProduct;
  } catch (error) {
    console.error("Error toggling product featured status:", error);
    throw new Error("Failed to update product featured status");
  }
} 