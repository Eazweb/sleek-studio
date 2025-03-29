import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { slugify } from "@/lib/utils";
import { uploadImage } from "@/lib/cloudinary";

const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  salePrice: z.number().optional(),
  inventory: z.number().int().nonnegative(),
  category: z.string(),
  tags: z.array(z.string()).or(z.string()).optional(),
  sizes: z.array(z.string()).or(z.string()).optional(),
  noBgImage: z.string().url().optional(),
  modelImage: z.string().url().optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  homePageFeatured: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "all";
    
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
    
    // Fetch products
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
    
    // Get total count
    const totalCount = await db.product.count({ where });
    
    return NextResponse.json({
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse and validate the request body
    const body = await request.json();
    const validationResult = productSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Process image uploads if they're base64 strings
    const images = [];
    
    if (data.noBgImage && data.noBgImage.startsWith('data:')) {
      const uploadResult = await uploadImage(data.noBgImage);
      data.noBgImage = uploadResult.url;
      images.push(uploadResult.url);
    } else if (data.noBgImage) {
      images.push(data.noBgImage);
    }
    
    if (data.modelImage && data.modelImage.startsWith('data:')) {
      const uploadResult = await uploadImage(data.modelImage);
      data.modelImage = uploadResult.url;
      images.push(uploadResult.url);
    } else if (data.modelImage) {
      images.push(data.modelImage);
    }
    
    // Add additional images if any
    if (data.images && Array.isArray(data.images)) {
      for (const image of data.images) {
        if (image.startsWith('data:')) {
          const uploadResult = await uploadImage(image);
          images.push(uploadResult.url);
        } else {
          images.push(image);
        }
      }
    }
    
    // Handle tags and sizes
    const tags = Array.isArray(data.tags) 
      ? data.tags 
      : data.tags?.split(',').map((tag: string) => tag.trim()) || [];
      
    const sizes = Array.isArray(data.sizes) 
      ? data.sizes 
      : data.sizes?.split(',').map((size: string) => size.trim()) || [];
    
    // Generate slug
    let slug = slugify(data.name);
    
    // Check if slug already exists
    const existingProduct = await db.product.findUnique({
      where: { slug },
    });
    
    // If slug exists, append a random number
    if (existingProduct) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }
    
    // Create the product
    const product = await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice || null,
        inventory: data.inventory,
        noBgImage: data.noBgImage || "",
        modelImage: data.modelImage || "",
        images: images,
        category: data.category,
        tags: tags,
        sizes: sizes,
        isActive: data.isActive,
        homePageFeatured: data.homePageFeatured,
        slug: slug,
      },
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
} 