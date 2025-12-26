import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://admin.thecrackedgrain.com';
const DIRECTUS_TOKEN = process.env.DIRECTUS_API_TOKEN;

export async function POST(request: Request) {
  try {
    // Check authentication
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to submit a recipe' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.style) {
      return NextResponse.json({ error: 'Recipe name and style are required' }, { status: 400 });
    }

    if (!data.agreedToTerms) {
      return NextResponse.json({ error: 'You must agree to the terms' }, { status: 400 });
    }

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();

    // Create community recipe in Directus
    const recipeData = {
      slug,
      name: data.name,
      type: data.type || 'Beer',
      style: data.style,
      description: data.description || '',
      batch_size: data.batchSize || '5 gallons',
      difficulty: data.difficulty || 'Intermediate',
      methods: [{
        type: 'All-Grain',
        fermentables: data.fermentables?.filter((f: any) => f.name) || [],
        instructions: data.instructions ? data.instructions.split('\n') : []
      }],
      hops: data.hops?.filter((h: any) => h.name) || [],
      yeast: data.yeast?.name ? [data.yeast] : [],
      tips: {
        dos: data.tips ? [data.tips] : [],
        donts: []
      },
      // Community recipe fields
      submitted_by_user_id: user.id,
      submitted_by_username: user.username || user.email?.split('@')[0] || 'Anonymous',
      submitter_agreed_to_terms: true,
      submitter_agreed_at: new Date().toISOString(),
      status: 'pending', // Requires admin approval
      is_community_recipe: true
    };

    // Save to Directus
    const response = await fetch(`${DIRECTUS_URL}/items/community_recipes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipeData)
    });

    if (!response.ok) {
      console.error('Directus error:', await response.text());
      throw new Error('Failed to save recipe');
    }

    return NextResponse.json({ success: true, message: 'Recipe submitted for review!' });

  } catch (error) {
    console.error('Error submitting recipe:', error);
    return NextResponse.json({ error: 'Failed to submit recipe' }, { status: 500 });
  }
}
