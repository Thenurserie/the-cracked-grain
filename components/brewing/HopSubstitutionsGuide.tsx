'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wheat, Search, ChevronDown, ChevronUp, Book } from 'lucide-react';

const hopSubstitutions = [
  { hop: "Admiral (GBR)", subs: ["Target (GBR)", "Northdown (GBR)", "Challenger (GBR)"] },
  { hop: "Ahtanum", subs: ["Amarillo", "Cascade", "Centennial", "Willamette"] },
  { hop: "Amarillo", subs: ["Cascade", "Centennial", "Chinook", "Simcoe", "Summit"] },
  { hop: "Apollo", subs: ["Magnum", "Columbus", "Nugget", "Warrior"] },
  { hop: "Azacca", subs: ["Amarillo", "Citra", "El Dorado", "Mosaic"] },
  { hop: "Bramling Cross (GBR)", subs: ["East Kent Golding", "Progress (GBR)", "Northern Brewer"] },
  { hop: "Bravo", subs: ["Columbus", "Chinook", "Centennial", "Nugget"] },
  { hop: "Brewer's Gold", subs: ["Chinook", "Galena", "Nugget", "Bullion"] },
  { hop: "Bullion", subs: ["Brewer's Gold", "Northern Brewer", "Galena", "Columbus"] },
  { hop: "Calypso", subs: ["Galena", "Cascade", "Huell Melon", "Belma"] },
  { hop: "Cascade", subs: ["Amarillo", "Centennial", "Ahtanum", "Summit"] },
  { hop: "Cashmere", subs: ["Cascade", "Mosaic", "Citra"] },
  { hop: "Centennial", subs: ["Cascade", "Chinook", "Columbus", "Amarillo"] },
  { hop: "Challenger (GBR)", subs: ["Northern Brewer", "Perle (DEU)", "Target (GBR)"] },
  { hop: "Chinook", subs: ["Nugget", "Columbus", "Northern Brewer", "Galena", "Simcoe"] },
  { hop: "Citra", subs: ["Galaxy (AUS)", "Mosaic", "Simcoe", "Centennial", "Amarillo"] },
  { hop: "Cluster", subs: ["Galena", "Chinook", "Nugget"] },
  { hop: "Columbus (CTZ)", subs: ["Chinook", "Galena", "Millennium", "Nugget", "Tomahawk", "Zeus"] },
  { hop: "Comet", subs: ["Galena", "Citra", "Summit"] },
  { hop: "Crystal", subs: ["Hallertau", "Liberty", "Mt. Hood", "Hersbrucker (DEU)"] },
  { hop: "East Kent Golding (GBR)", subs: ["Golding", "Fuggle", "Progress (GBR)", "Willamette"] },
  { hop: "Ekuanot (Equinox)", subs: ["Chinook", "Summit", "Galena", "Cluster", "Citra"] },
  { hop: "El Dorado", subs: ["Citra", "Mosaic", "Nelson Sauvin", "Azacca"] },
  { hop: "Ella (AUS)", subs: ["Perle", "Galaxy", "Palisade"] },
  { hop: "Eroica", subs: ["Brewer's Gold", "Chinook", "Galena", "Nugget"] },
  { hop: "Falconer's Flight", subs: ["Citra", "Simcoe", "Amarillo", "Cascade", "Summit"] },
  { hop: "First Gold (GBR)", subs: ["Crystal", "East Kent Golding", "Willamette"] },
  { hop: "Fuggle", subs: ["Willamette", "Styrian Golding (SVN)", "East Kent Golding", "Tettnang"] },
  { hop: "Fuggle (GBR)", subs: ["Fuggle", "Willamette", "Styrian Golding (SVN)"] },
  { hop: "Galaxy (AUS)", subs: ["Citra", "Simcoe", "Amarillo", "Nelson Sauvin"] },
  { hop: "Galena", subs: ["Brewer's Gold", "Columbus", "Nugget", "Chinook"] },
  { hop: "Glacier", subs: ["Fuggle", "Styrian Golding", "Willamette", "Palisade"] },
  { hop: "Golding", subs: ["East Kent Golding", "Fuggle", "Willamette", "Styrian Golding"] },
  { hop: "Green Bullet (NZL)", subs: ["Fuggle", "Willamette", "Liberty", "Dr. Rudi"] },
  { hop: "Hallertau (US)", subs: ["Liberty", "Mt. Hood", "Hallertau Mittelfruh (DEU)", "Crystal"] },
  { hop: "Hallertau Blanc", subs: ["Nelson Sauvin", "Huell Melon", "Mandarina Bavaria"] },
  { hop: "Hallertau Mittelfruh (DEU)", subs: ["Liberty", "Vanguard", "Hallertau Tradition (DEU)", "Crystal"] },
  { hop: "Hersbrucker (DEU)", subs: ["Mt. Hood", "Hallertau", "Liberty", "Spalt"] },
  { hop: "Horizon", subs: ["Magnum", "Nugget", "Columbus"] },
  { hop: "Huell Melon", subs: ["Mandarina Bavaria", "Cascade", "Belma"] },
  { hop: "Idaho 7", subs: ["Azacca", "El Dorado", "Citra", "Amarillo", "Chinook"] },
  { hop: "Jarrylo", subs: ["Motueka", "Nelson Sauvin", "Mosaic"] },
  { hop: "Lemondrop", subs: ["Cascade", "Motueka", "Mandarina Bavaria", "Centennial"] },
  { hop: "Liberty", subs: ["Hallertau", "Mt. Hood", "Crystal", "Tradition (DEU)"] },
  { hop: "Loral", subs: ["Glacier", "Mosaic", "Nugget"] },
  { hop: "Magnum", subs: ["Columbus", "Horizon", "Nugget", "Warrior"] },
  { hop: "Mandarina Bavaria", subs: ["Cascade", "Huell Melon", "Lemondrop"] },
  { hop: "Millennium", subs: ["Columbus", "Nugget", "Summit", "Warrior"] },
  { hop: "Mosaic", subs: ["Citra", "Simcoe", "Amarillo", "Galaxy"] },
  { hop: "Motueka (NZL)", subs: ["Saaz", "Sterling", "Nelson Sauvin"] },
  { hop: "Mt. Hood", subs: ["Hallertau", "Hersbrucker (DEU)", "Liberty", "Crystal"] },
  { hop: "Mt. Rainier", subs: ["Brewer's Gold", "Fuggle", "Hallertau"] },
  { hop: "Nelson Sauvin (NZL)", subs: ["Hallertau Blanc", "Galaxy", "Motueka", "Riwaka"] },
  { hop: "Newport", subs: ["Brewer's Gold", "Fuggle", "Galena", "Magnum", "Nugget"] },
  { hop: "Northdown (GBR)", subs: ["Northern Brewer", "Challenger (GBR)", "Target (GBR)"] },
  { hop: "Northern Brewer", subs: ["Chinook", "Galena", "Perle", "Columbus"] },
  { hop: "Nugget", subs: ["Galena", "Magnum", "Columbus", "Warrior"] },
  { hop: "Opal", subs: ["Tettnang", "East Kent Golding", "Styrian Golding"] },
  { hop: "Pacific Gem (NZL)", subs: ["Galena", "Cluster", "Magnum"] },
  { hop: "Pacific Jade (NZL)", subs: ["Hallertau", "Saaz", "Cluster"] },
  { hop: "Pacifica (NZL)", subs: ["Hallertau", "Saaz"] },
  { hop: "Palisade", subs: ["Willamette", "Glacier", "Ella"] },
  { hop: "Perle", subs: ["Northern Brewer", "Perle (DEU)", "Cluster", "Galena"] },
  { hop: "Phoenix (GBR)", subs: ["Northdown (GBR)", "Challenger (GBR)"] },
  { hop: "Pilgrim (GBR)", subs: ["Target (GBR)", "Challenger (GBR)", "Pioneer"] },
  { hop: "Pioneer (GBR)", subs: ["East Kent Golding", "Herald", "Pilgrim"] },
  { hop: "Progress (GBR)", subs: ["Fuggle", "East Kent Golding", "Golding"] },
  { hop: "Rakau (NZL)", subs: ["Amarillo", "Summit", "Cascade"] },
  { hop: "Riwaka (NZL)", subs: ["Saaz", "Citra", "Motueka", "Nelson Sauvin"] },
  { hop: "Saaz (CZE)", subs: ["Saaz (US)", "Sterling", "Tettnang", "Lublin (POL)"] },
  { hop: "Saaz (US)", subs: ["Saaz (CZE)", "Sterling", "Tettnang"] },
  { hop: "Sabro", subs: ["Mosaic", "Citra", "Simcoe"] },
  { hop: "Santiam", subs: ["Spalt (DEU)", "Tettnang (DEU)", "Saaz"] },
  { hop: "Saphir (DEU)", subs: ["Hallertau Mittelfruh", "Hallertau"] },
  { hop: "Simcoe", subs: ["Summit", "Magnum", "Amarillo", "Mosaic", "Citra", "Columbus"] },
  { hop: "Sorachi Ace", subs: ["Southern Cross", "Lemon Drop"] },
  { hop: "Southern Cross", subs: ["Sorachi Ace"] },
  { hop: "Spalt (DEU)", subs: ["Saaz", "Tettnang", "Santiam"] },
  { hop: "Sterling", subs: ["Saaz", "Saaz (CZE)", "Mt. Hood"] },
  { hop: "Strata", subs: ["Galaxy", "Mosaic", "Simcoe"] },
  { hop: "Strisselspalt (FRA)", subs: ["Crystal", "Hersbrucker", "Mt. Hood", "Liberty"] },
  { hop: "Styrian Golding (SVN)", subs: ["Fuggle", "Fuggle (GBR)", "Willamette", "Bobek"] },
  { hop: "Summit", subs: ["Columbus", "Millennium", "Simcoe", "Warrior", "Amarillo"] },
  { hop: "Target (GBR)", subs: ["Fuggle", "Willamette", "Admiral", "Challenger"] },
  { hop: "Taurus (DEU)", subs: ["Magnum", "Citra", "Tradition (DEU)"] },
  { hop: "Tettnang (US)", subs: ["Tettnang (DEU)", "Fuggle", "Santiam", "Spalt"] },
  { hop: "Tettnang (DEU)", subs: ["Saaz", "Hersbrucker", "Spalt (DEU)", "Santiam"] },
  { hop: "Topaz (AUS)", subs: ["Galaxy", "Citra", "Cascade", "Amarillo"] },
  { hop: "Tradition (DEU)", subs: ["Liberty", "Hallertau Mittelfruh (DEU)"] },
  { hop: "Ultra", subs: ["Hallertau", "Crystal", "Liberty", "Mt. Hood"] },
  { hop: "Vanguard", subs: ["Hallertau", "Hersbrucker (DEU)", "Mt. Hood", "Liberty"] },
  { hop: "Vic Secret (AUS)", subs: ["Galaxy", "Citra", "Simcoe", "Mosaic"] },
  { hop: "Wai-iti (NZL)", subs: ["Riwaka", "Motueka", "Nelson Sauvin"] },
  { hop: "Warrior", subs: ["Columbus", "Magnum", "Nugget", "Summit"] },
  { hop: "Willamette", subs: ["Fuggle", "Glacier", "Tettnang", "Styrian Golding", "East Kent Golding"] },
  { hop: "Zeus", subs: ["Columbus", "Tomahawk", "Nugget", "Chinook"] }
];

export function HopSubstitutionsGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTOC, setShowTOC] = useState(false);

  // Group hops by first letter
  const grouped = hopSubstitutions.reduce((acc, item) => {
    const firstLetter = item.hop[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(item);
    return acc;
  }, {} as Record<string, typeof hopSubstitutions>);

  const letters = Object.keys(grouped).sort();

  // Filter hops based on search
  const filteredHops = searchTerm
    ? hopSubstitutions.filter(item =>
        item.hop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subs.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : hopSubstitutions;

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <Wheat className="h-16 w-16 text-gold" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
          Hop Substitution Chart
        </h1>
        <p className="text-lg text-cream/80 mb-6 max-w-3xl mx-auto">
          Can't find the hop you need? This comprehensive chart covers 80+ hop varieties with suitable substitutes for your brewing recipes.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/40">
            80+ Hop Varieties
          </Badge>
          <Badge className="bg-green-500/20 text-green-500 border-green-500/40">
            Global Origins
          </Badge>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-card border-amber/20 mb-8">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cream/50" />
            <input
              type="text"
              placeholder="Search for a hop variety..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-amber/20 rounded-lg text-cream placeholder-cream/50 focus:border-gold focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table of Contents - Alphabetical Jump */}
      {!searchTerm && (
        <Card className="bg-card border-amber/20 mb-8">
          <CardHeader className="cursor-pointer" onClick={() => setShowTOC(!showTOC)}>
            <CardTitle className="text-gold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Quick Jump (A-Z)
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gold hover:text-gold/80 hover:bg-amber/10"
              >
                {showTOC ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CardTitle>
          </CardHeader>
          {showTOC && (
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {letters.map(letter => (
                  <Button
                    key={letter}
                    onClick={() => scrollToLetter(letter)}
                    variant="ghost"
                    className="text-cream hover:text-gold hover:bg-amber/10 font-mono"
                  >
                    {letter}
                  </Button>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Substitution Tips */}
      <Card className="bg-card border-amber/20 mb-8">
        <CardHeader>
          <CardTitle className="text-gold">Substitution Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-cream/80">
          <p><strong className="text-cream">Bittering hops:</strong> Match alpha acid levels and adjust quantity using IBU calculations</p>
          <p><strong className="text-cream">Aroma/Flavor hops:</strong> Substitute 1:1 by weight, focus on similar flavor profiles</p>
          <p><strong className="text-cream">Origin codes:</strong> AUS=Australia, CZE=Czech, DEU=Germany, GBR=Great Britain, NZL=New Zealand, SVN=Slovenia, POL=Poland, FRA=France</p>
          <p><strong className="text-cream">Availability:</strong> Your local homebrew shop may carry only certain hop varieties. These charts help you find alternatives.</p>
        </CardContent>
      </Card>

      {/* Hop List */}
      {searchTerm ? (
        // Search Results
        <Card className="bg-card border-amber/20">
          <CardHeader>
            <CardTitle className="text-gold">Search Results ({filteredHops.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-amber/20">
                    <th className="text-left py-3 px-4 text-gold font-semibold">Hop Variety</th>
                    <th className="text-left py-3 px-4 text-gold font-semibold">Suitable Substitutes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHops.map((item, idx) => (
                    <tr key={idx} className="border-b border-amber/10 hover:bg-amber/5">
                      <td className="py-3 px-4 text-cream font-medium">{item.hop}</td>
                      <td className="py-3 px-4 text-cream/70">{item.subs.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Alphabetical List
        letters.map(letter => (
          <div key={letter} id={`letter-${letter}`} className="mb-8 scroll-mt-20">
            <h2 className="text-3xl font-bold text-gold mb-4 sticky top-20 bg-background py-2">
              {letter}
            </h2>
            <Card className="bg-card border-amber/20">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-amber/20">
                        <th className="text-left py-3 px-4 text-gold/70 font-semibold text-sm">Hop Variety</th>
                        <th className="text-left py-3 px-4 text-gold/70 font-semibold text-sm">Suitable Substitutes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grouped[letter].map((item, idx) => (
                        <tr key={idx} className="border-b border-amber/10 last:border-0 hover:bg-amber/5">
                          <td className="py-3 px-4 text-cream font-medium">{item.hop}</td>
                          <td className="py-3 px-4 text-cream/70">{item.subs.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ))
      )}
    </div>
  );
}
