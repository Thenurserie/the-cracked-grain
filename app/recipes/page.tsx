import { Card, CardContent } from '@/components/ui/card';
import { Beaker } from 'lucide-react';

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-amber/10 to-background border-b border-amber/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
              Brewing Recipes
            </h1>
            <p className="text-lg md:text-xl text-cream/80">
              Coming Soon
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-amber/20">
            <CardContent className="py-12 text-center">
              <Beaker className="h-16 w-16 text-gold/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-cream mb-2">
                Recipe Library Coming Soon
              </h3>
              <p className="text-cream/70 max-w-md mx-auto">
                We're building a comprehensive recipe library with full brewing instructions. Check back soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
