import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Beaker } from 'lucide-react';

export default function RecipeDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-amber/10 to-background border-b border-amber/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Link href="/recipes">
              <Button variant="ghost" className="text-cream hover:text-gold hover:bg-amber/10 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Recipes
              </Button>
            </Link>

            <Card className="bg-card border-amber/20">
              <CardContent className="py-12 text-center">
                <Beaker className="h-16 w-16 text-gold/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-cream mb-2">
                  Recipe Coming Soon
                </h3>
                <p className="text-cream/70 max-w-md mx-auto">
                  We're adding comprehensive brewing instructions. Check back soon!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
