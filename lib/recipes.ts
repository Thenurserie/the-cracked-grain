import { prisma } from './db';

export async function getRecipes(params?: {
  userId?: string;
  isPublic?: boolean;
  style?: string;
  limit?: number;
  offset?: number;
}) {
  const { userId, isPublic, style, limit = 50, offset = 0 } = params || {};

  const where: any = {};

  if (userId) {
    where.OR = [{ userId }, { isPublic: true }];
  } else if (isPublic !== undefined) {
    where.isPublic = isPublic;
  }

  if (style) {
    where.style = style;
  }

  return await prisma.recipe.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

export async function getRecipe(id: string, userId?: string) {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) {
    return null;
  }

  if (!recipe.isPublic && recipe.userId !== userId) {
    return null;
  }

  return recipe;
}

export async function createRecipe(data: {
  userId: string;
  name: string;
  description?: string;
  style?: string;
  batchSize?: number;
  boilTime?: number;
  originalGravity?: number;
  finalGravity?: number;
  abv?: number;
  ibu?: number;
  srm?: number;
  ingredients?: any;
  mashSchedule?: any;
  instructions?: string;
  notes?: string;
  isPublic?: boolean;
}) {
  return await prisma.recipe.create({
    data: {
      ...data,
      batchSize: data.batchSize || 5.0,
      boilTime: data.boilTime || 60,
      isPublic: data.isPublic || false,
      ingredients: data.ingredients || { grains: [], hops: [], yeast: [], other: [] },
      mashSchedule: data.mashSchedule || [],
    },
  });
}

export async function updateRecipe(
  id: string,
  userId: string,
  data: Partial<{
    name: string;
    description: string;
    style: string;
    batchSize: number;
    boilTime: number;
    originalGravity: number;
    finalGravity: number;
    abv: number;
    ibu: number;
    srm: number;
    ingredients: any;
    mashSchedule: any;
    instructions: string;
    notes: string;
    isPublic: boolean;
  }>
) {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe || recipe.userId !== userId) {
    throw new Error('Recipe not found or unauthorized');
  }

  return await prisma.recipe.update({
    where: { id },
    data,
  });
}

export async function deleteRecipe(id: string, userId: string) {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe || recipe.userId !== userId) {
    throw new Error('Recipe not found or unauthorized');
  }

  return await prisma.recipe.delete({
    where: { id },
  });
}

export async function getUserRecipes(userId: string) {
  return await prisma.recipe.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getPublicRecipes(limit = 50) {
  return await prisma.recipe.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
