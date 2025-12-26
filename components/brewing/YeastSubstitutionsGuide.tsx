'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Droplet, Search, ChevronDown, ChevronUp, Book } from 'lucide-react';

const yeastSubstitutions = [
  {
    category: "American Ale",
    strains: [
      {
        name: "Clean American Ale",
        fermentis: "US-05",
        whitelabs: "WLP001",
        wyeast: "1056",
        lallemand: "BRY-97",
        omega: "OYL-004",
        imperial: "A07",
        profile: "Clean, neutral fermentation. Ideal for American IPAs, Pale Ales, and any style where hops or malt should shine.",
        temp: "60-72°F",
        attenuation: "73-77%"
      },
      {
        name: "West Coast Ale",
        fermentis: "US-05",
        whitelabs: "WLP001",
        wyeast: "1056",
        lallemand: "BRY-97",
        omega: "OYL-004",
        imperial: "A07",
        profile: "Slightly fruity at higher temps. Classic West Coast IPA yeast.",
        temp: "60-72°F",
        attenuation: "73-77%"
      },
      {
        name: "California Ale V",
        fermentis: "-",
        whitelabs: "WLP051",
        wyeast: "1272",
        lallemand: "-",
        omega: "OYL-011",
        imperial: "A31",
        profile: "More fruity than US-05. Great for hop-forward beers with character.",
        temp: "66-70°F",
        attenuation: "73-80%"
      },
      {
        name: "Conan / Vermont Ale",
        fermentis: "-",
        whitelabs: "WLP095",
        wyeast: "1318",
        lallemand: "New England",
        omega: "OYL-052",
        imperial: "A04",
        profile: "Hazy IPA favorite. Produces peach, apricot, and citrus esters.",
        temp: "65-75°F",
        attenuation: "73-80%"
      }
    ]
  },
  {
    category: "English Ale",
    strains: [
      {
        name: "London Ale",
        fermentis: "S-04",
        whitelabs: "WLP002",
        wyeast: "1968",
        lallemand: "London ESB",
        omega: "OYL-006",
        imperial: "A09",
        profile: "Malty, slightly fruity. Classic English ale character.",
        temp: "64-72°F",
        attenuation: "73-77%"
      },
      {
        name: "British Ale",
        fermentis: "S-04",
        whitelabs: "WLP005",
        wyeast: "1098",
        lallemand: "Nottingham",
        omega: "OYL-007",
        imperial: "A09",
        profile: "Clean with subtle fruitiness. Great for bitters and milds.",
        temp: "64-72°F",
        attenuation: "73-75%"
      },
      {
        name: "London ESB",
        fermentis: "S-04",
        whitelabs: "WLP002",
        wyeast: "1968",
        lallemand: "London ESB",
        omega: "OYL-006",
        imperial: "A09",
        profile: "Rich, malty character with moderate ester production.",
        temp: "64-72°F",
        attenuation: "73-77%"
      }
    ]
  },
  {
    category: "Belgian Ale",
    strains: [
      {
        name: "Belgian Abbey",
        fermentis: "T-58",
        whitelabs: "WLP530",
        wyeast: "1214",
        lallemand: "Abbaye",
        omega: "OYL-024",
        imperial: "B44",
        profile: "Spicy, peppery phenolics with fruity esters. Great for Abbey ales.",
        temp: "64-78°F",
        attenuation: "75-80%"
      },
      {
        name: "Belgian Trappist",
        fermentis: "BE-256",
        whitelabs: "WLP500",
        wyeast: "3787",
        lallemand: "Abbaye",
        omega: "OYL-028",
        imperial: "B45",
        profile: "Complex fruity and spicy character. High alcohol tolerance.",
        temp: "64-78°F",
        attenuation: "75-85%"
      },
      {
        name: "Belgian Wit",
        fermentis: "WB-06",
        whitelabs: "WLP400",
        wyeast: "3944",
        lallemand: "Wit",
        omega: "OYL-029",
        imperial: "B44",
        profile: "Produces classic wit beer spice and citrus notes.",
        temp: "62-75°F",
        attenuation: "72-76%"
      },
      {
        name: "Belgian Saison",
        fermentis: "BE-134",
        whitelabs: "WLP565",
        wyeast: "3724",
        lallemand: "Belle Saison",
        omega: "OYL-026",
        imperial: "B56",
        profile: "Dry, peppery, highly attenuative. Classic farmhouse character.",
        temp: "68-85°F",
        attenuation: "78-85%"
      }
    ]
  },
  {
    category: "German Ale",
    strains: [
      {
        name: "Hefeweizen",
        fermentis: "WB-06",
        whitelabs: "WLP300",
        wyeast: "3068",
        lallemand: "Munich Wheat",
        omega: "OYL-021",
        imperial: "G03",
        profile: "Banana and clove character. Low flocculation for hazy beer.",
        temp: "64-75°F",
        attenuation: "73-77%"
      },
      {
        name: "German Wheat",
        fermentis: "WB-06",
        whitelabs: "WLP380",
        wyeast: "3333",
        lallemand: "Munich Wheat",
        omega: "OYL-021",
        imperial: "G03",
        profile: "Balanced banana and clove, cleaner than 3068.",
        temp: "64-75°F",
        attenuation: "73-77%"
      },
      {
        name: "Kölsch",
        fermentis: "K-97",
        whitelabs: "WLP029",
        wyeast: "2565",
        lallemand: "Köln",
        omega: "OYL-007",
        imperial: "G01",
        profile: "Clean, crisp, subtle fruitiness. Classic Kölsch character.",
        temp: "56-70°F",
        attenuation: "73-77%"
      }
    ]
  },
  {
    category: "Lager",
    strains: [
      {
        name: "German Lager",
        fermentis: "W-34/70",
        whitelabs: "WLP830",
        wyeast: "2124",
        lallemand: "Diamond",
        omega: "OYL-114",
        imperial: "L17",
        profile: "Clean, malty lager. Very versatile across all lager styles.",
        temp: "48-58°F",
        attenuation: "73-77%"
      },
      {
        name: "Bohemian Lager",
        fermentis: "W-34/70",
        whitelabs: "WLP802",
        wyeast: "2278",
        lallemand: "Diamond",
        omega: "OYL-101",
        imperial: "L28",
        profile: "Rich, malty character. Great for Czech Pilsners and Bocks.",
        temp: "48-58°F",
        attenuation: "70-75%"
      },
      {
        name: "California Lager",
        fermentis: "W-34/70",
        whitelabs: "WLP810",
        wyeast: "2112",
        lallemand: "-",
        omega: "OYL-114",
        imperial: "L17",
        profile: "Clean, neutral lager yeast. Works at warmer temps.",
        temp: "58-68°F",
        attenuation: "67-71%"
      }
    ]
  },
  {
    category: "Specialty",
    strains: [
      {
        name: "Kveik",
        fermentis: "-",
        whitelabs: "WLP4045",
        wyeast: "-",
        lallemand: "Voss Kveik",
        omega: "OYL-061",
        imperial: "L09",
        profile: "Super-fast, high-temp Norwegian farmhouse yeast. Orange citrus notes.",
        temp: "68-95°F",
        attenuation: "75-82%"
      },
      {
        name: "Brett Brux",
        fermentis: "-",
        whitelabs: "WLP650",
        wyeast: "5112",
        lallemand: "Brett B",
        omega: "OYL-202",
        imperial: "-",
        profile: "Produces funky, earthy, tropical fruit character over time.",
        temp: "60-75°F",
        attenuation: "85-100%"
      }
    ]
  }
];

export function YeastSubstitutionsGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTOC, setShowTOC] = useState(false);

  const categories = yeastSubstitutions.map(g => g.category);

  // Filter strains based on search
  const filteredCategories = searchTerm
    ? yeastSubstitutions.map(cat => ({
        ...cat,
        strains: cat.strains.filter(strain =>
          strain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Object.values(strain).some(val =>
            typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      })).filter(cat => cat.strains.length > 0)
    : yeastSubstitutions;

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`category-${category.toLowerCase().replace(/\s+/g, '-')}`);
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
          <Droplet className="h-16 w-16 text-gold" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
          Yeast Substitution Chart
        </h1>
        <p className="text-lg text-cream/80 mb-6 max-w-3xl mx-auto">
          Cross-brand yeast equivalents for homebrewing. Find alternative strains across Fermentis, White Labs, Wyeast, Lallemand, Omega, and Imperial.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/40">
            6 Major Brands
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/40">
            All Beer Styles
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
              placeholder="Search for a yeast strain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-amber/20 rounded-lg text-cream placeholder-cream/50 focus:border-gold focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table of Contents - Category Jump */}
      {!searchTerm && (
        <Card className="bg-card border-amber/20 mb-8">
          <CardHeader className="cursor-pointer" onClick={() => setShowTOC(!showTOC)}>
            <CardTitle className="text-gold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Quick Jump by Category
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    onClick={() => scrollToCategory(category)}
                    variant="ghost"
                    className="text-cream hover:text-gold hover:bg-amber/10 justify-start"
                  >
                    {category}
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
          <p><strong className="text-cream">Dry vs Liquid:</strong> Dry yeasts are more forgiving and shelf-stable. Liquid yeasts offer more variety and may need starters for high-gravity beers.</p>
          <p><strong className="text-cream">Fermentation Temp:</strong> Temperature affects yeast character dramatically. Follow recommended ranges.</p>
          <p><strong className="text-cream">Pitch Rates:</strong> Dry yeast packets contain more cells than liquid vials. Use a pitch rate calculator for big beers.</p>
          <p><strong className="text-cream">Availability:</strong> Your local homebrew shop may carry only certain brands. These charts help you find equivalents.</p>
          <p><strong className="text-cream">Character:</strong> &ldquo;Equivalent&rdquo; doesn't mean identical. Small differences exist between brands.</p>
        </CardContent>
      </Card>

      {/* Yeast Strains by Category */}
      {filteredCategories.map(group => (
        <div
          key={group.category}
          id={`category-${group.category.toLowerCase().replace(/\s+/g, '-')}`}
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-bold text-gold mb-6">
            {group.category}
          </h2>

          {group.strains.map((strain, idx) => (
            <Card key={idx} className="bg-card border-amber/20 mb-6">
              <CardHeader>
                <CardTitle className="text-amber">{strain.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-cream/80 leading-relaxed">{strain.profile}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background rounded p-3">
                    <span className="text-cream/60 text-sm">Fermentation Temp:</span>
                    <span className="text-cream font-semibold ml-2">{strain.temp}</span>
                  </div>
                  <div className="bg-background rounded p-3">
                    <span className="text-cream/60 text-sm">Attenuation:</span>
                    <span className="text-cream font-semibold ml-2">{strain.attenuation}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber/20">
                        <th className="text-left py-2 px-3 text-gold/70 font-medium">Fermentis</th>
                        <th className="text-left py-2 px-3 text-gold/70 font-medium">White Labs</th>
                        <th className="text-left py-2 px-3 text-gold/70 font-medium">Wyeast</th>
                        <th className="text-left py-2 px-3 text-gold/70 font-medium">Lallemand</th>
                        <th className="text-left py-2 px-3 text-gold/70 font-medium">Omega</th>
                        <th className="text-left py-2 px-3 text-gold/70 font-medium">Imperial</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-3 text-cream font-mono">
                          {strain.fermentis !== "-" ? strain.fermentis : <span className="text-cream/30">-</span>}
                        </td>
                        <td className="py-2 px-3 text-cream font-mono">
                          {strain.whitelabs !== "-" ? strain.whitelabs : <span className="text-cream/30">-</span>}
                        </td>
                        <td className="py-2 px-3 text-cream font-mono">
                          {strain.wyeast !== "-" ? strain.wyeast : <span className="text-cream/30">-</span>}
                        </td>
                        <td className="py-2 px-3 text-cream font-mono">
                          {strain.lallemand !== "-" ? strain.lallemand : <span className="text-cream/30">-</span>}
                        </td>
                        <td className="py-2 px-3 text-cream font-mono">
                          {strain.omega !== "-" ? strain.omega : <span className="text-cream/30">-</span>}
                        </td>
                        <td className="py-2 px-3 text-cream font-mono">
                          {strain.imperial !== "-" ? strain.imperial : <span className="text-cream/30">-</span>}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
