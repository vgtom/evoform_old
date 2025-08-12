import { Template } from "wasp/entities";
import { GetPublicTemplates } from "wasp/server/operations";

type PaginationArgs = {
  page: number;
  limit: number;
  search?: string; // Search term for name, description, or tags
  category?: string; // Filter by category
  minRating?: number; // Filter by minimum rating
  isPremium?: boolean; // Filter by premium status
};

type PaginatedResponse = {
  items: Template[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
};

const getPublicTemplates: GetPublicTemplates<PaginationArgs, PaginatedResponse> = async (args, context) => {
  const { page, limit, search, category, minRating, isPremium } = args;
  const skip = (page - 1) * limit;

  // Build the where clause dynamically
  const where: any = { isPublic: true };

  // Search filter: case-insensitive search on name, description, or tags
  if (search) {
    const searchTerm = search.trim();
    where.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
      { tags: { has: searchTerm } },
    ];
  }

  // Category filter
  if (category) {
    where.category = { equals: category, mode: 'insensitive' };
  }

  // Minimum rating filter
  if (minRating !== undefined) {
    where.rating = { gte: minRating };
  }

  // Premium status filter
  if (isPremium !== undefined) {
    where.isPremium = isPremium;
  }

  // Fetch templates and total count in parallel
  const [templates, totalItems] = await Promise.all([
    context.entities.Template.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    }),
    context.entities.Template.count({ where }),
  ]);

  return {
    items: templates,
    totalItems,
    currentPage: page,
    totalPages: Math.ceil(totalItems / limit),
    limit,
  };
};

export default getPublicTemplates;