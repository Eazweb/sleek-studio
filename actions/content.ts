"use server";

import { db } from "@/lib/db";

/**
 * Get page content for a specific category (home, men, women, children)
 */
export async function getPageContent(category: string) {
  try {
    const content = await db.pageContent.findMany({
      where: {
        category: category as any,
        isActive: true,
      },
      orderBy: {
        priority: "desc", // Higher priority first
      },
    });

    return content;
  } catch (error) {
    console.error(`Error fetching ${category} page content:`, error);
    throw new Error(`Failed to fetch ${category} page content`);
  }
}

/**
 * Get home page content
 */
export async function getHomePageContent() {
  return getPageContent("HOME");
}

/**
 * Get men's page content
 */
export async function getMensPageContent() {
  return getPageContent("MEN");
}

/**
 * Get women's page content
 */
export async function getWomensPageContent() {
  return getPageContent("WOMEN");
}

/**
 * Get children's page content
 */
export async function getChildrensPageContent() {
  return getPageContent("CHILDREN");
} 