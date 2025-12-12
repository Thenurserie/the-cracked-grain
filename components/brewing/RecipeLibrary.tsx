'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RecipeLibrary() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Recipe Library</CardTitle>
          <p className="text-sm text-muted-foreground">
            Recipe storage coming soon
          </p>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            We're setting up a new recipe storage system. Check back soon!
          </p>
          <Link href="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
