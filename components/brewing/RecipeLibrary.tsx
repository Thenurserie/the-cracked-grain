'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { exportBeerXML } from '@/lib/brewing-calcs';

interface Recipe {
  id: string;
  name: string;
  style: string;
  batch_size: number;
  og: number;
  fg: number;
  abv: number;
  ibu: number;
  srm: number;
  created_at: string;
  user_id: string | null;
  is_public: boolean;
  description?: string;
}

export default function RecipeLibrary() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);

    let query = supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (user) {
      query = query.or(`user_id.eq.${user.id},is_public.eq.true`);
    } else {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query;

    if (error) {
      toast.error('Failed to load recipes');
      console.error(error);
    } else {
      setRecipes(data || []);
    }

    setLoading(false);
  };

  const deleteRecipe = async (id: string) => {
    const { error } = await supabase.from('recipes').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete recipe');
    } else {
      toast.success('Recipe deleted');
      loadRecipes();
    }
  };

  const downloadRecipe = async (recipe: Recipe) => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', recipe.id)
      .single();

    if (error || !data) {
      toast.error('Failed to download recipe');
      return;
    }

    const recipeData = {
      name: data.name,
      style: data.style,
      batchSize: data.batch_size,
      boilTime: data.boil_time,
      efficiency: data.efficiency,
      fermentables: JSON.parse(data.fermentables || '[]'),
      hops: JSON.parse(data.hops || '[]'),
      yeast: JSON.parse(data.yeast || '{}'),
      og: data.og,
      fg: data.fg,
      abv: data.abv,
      ibu: data.ibu,
      srm: data.srm,
      notes: data.notes
    };

    const xml = exportBeerXML(recipeData);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.name}.xml`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Recipe downloaded!');
  };

  if (loading) {
    return <div className="text-center py-8">Loading recipes...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Recipe Library</CardTitle>
          <p className="text-sm text-muted-foreground">
            Browse professional recipe templates and your saved recipes
          </p>
        </CardHeader>
        <CardContent>
          {recipes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recipes available. Create your first recipe in the Recipe Builder!
            </div>
          ) : (
            <div className="space-y-3">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{recipe.name}</h3>
                      {!recipe.user_id && recipe.is_public && (
                        <Badge variant="secondary">Public Template</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{recipe.style}</p>
                    {recipe.description && (
                      <p className="text-sm text-muted-foreground mt-1">{recipe.description}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>OG: {recipe.og?.toFixed(3)}</span>
                      <span>FG: {recipe.fg?.toFixed(3)}</span>
                      <span>ABV: {recipe.abv?.toFixed(1)}%</span>
                      <span>IBU: {recipe.ibu?.toFixed(0)}</span>
                      <span>SRM: {recipe.srm?.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadRecipe(recipe)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {recipe.user_id === currentUserId && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteRecipe(recipe.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
