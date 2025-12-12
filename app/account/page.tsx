import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AccountPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Account</CardTitle>
          <CardDescription className="text-center">
            User accounts coming soon
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            We're currently setting up a new user account system. Check back soon!
          </p>
          <Link href="/">
            <Button className="w-full bg-amber hover:bg-gold text-white">
              Return to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
