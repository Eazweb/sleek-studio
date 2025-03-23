"use server";

import { db } from "@/lib/db";

// Types
type ProductsParams = {
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "popular";
  skip?: number;
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