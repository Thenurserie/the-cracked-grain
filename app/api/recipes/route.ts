import { NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://admin.thecrackedgrain.com';

export async function GET() {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/recipes?sort=-featured&limit=-1`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`Directus error: ${response.status}`);
      throw new Error(`Directus error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data.data || []);
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    return NextResponse.json([], { status: 500 });
  }
}
