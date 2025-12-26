import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Search, Beaker } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Yeast Substitutions | The Cracked Grain',
  description: 'Cross-brand yeast substitution chart for homebrewing. Find equivalent yeast strains across Fermentis, White Labs, Wyeast, Lallemand, Omega, and Imperial.',
};

// Comprehensive yeast substitution data with cross-brand equivalents
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

// Style-specific yeast recommendations
const styleGuide = [
  { style: "American IPA/Pale Ale", recommended: "US-05, WLP001, 1056, BRY-97", notes: "Clean canvas for hops" },
  { style: "Hazy/New England IPA", recommended: "WLP095, 1318, New England, OYL-052", notes: "Biotransformation for juicy hops" },
  { style: "English Bitter/ESB", recommended: "S-04, WLP002, 1968, London ESB", notes: "Malty, lightly fruity character" },
  { style: "Hefeweizen", recommended: "WB-06, WLP300, 3068, Munich Wheat", notes: "Banana and clove phenolics" },
  { style: "Belgian Tripel/Golden Strong", recommended: "BE-256, WLP500, 3787", notes: "High alcohol tolerance, fruity" },
  { style: "Saison", recommended: "BE-134, WLP565, 3724, Belle Saison", notes: "Dry, peppery, high attenuation" },
  { style: "German Pilsner", recommended: "W-34/70, WLP830, 2124, Diamond", notes: "Clean, crisp lager character" },
  { style: "American Lager", recommended: "W-34/70, WLP810, 2112", notes: "Neutral, clean fermentation" },
  { style: "Stout/Porter", recommended: "S-04, WLP002, 1056, 1968", notes: "Supports roast character" },
  { style: "Fruit Beer", recommended: "US-05, Belle Saison, Voss Kveik", notes: "Clean or complementary esters" }
];

export default function YeastSubstitutionsPage() {
  const categories = Array.from(new Set(yeastSubstitutions.map(g => g.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/brew-guides"
            className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brew Guides
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Beaker className="h-8 w-8 text-amber-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-amber-500">
              Yeast Substitutions
            </h1>
          </div>

          <p className="text-xl text-gray-300 max-w-3xl">
            Cross-brand yeast equivalents for homebrewing. Find alternative strains across Fermentis, White Labs, Wyeast, Lallemand, Omega, and Imperial.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-zinc-800/50 border border-amber-600/30 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
            <Search className="h-5 w-5" />
            Quick Navigation
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-zinc-700 hover:bg-amber-600 text-white px-4 py-2 rounded transition-colors text-sm font-medium"
              >
                {category}
              </a>
            ))}
            <a
              href="#style-guide"
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition-colors text-sm font-medium"
            >
              Style Guide
            </a>
          </div>
        </div>

        {/* Substitution Tips */}
        <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-400 mb-3">Substitution Tips</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Dry vs Liquid:</strong> Dry yeasts are more forgiving and shelf-stable. Liquid yeasts offer more variety and may need starters for high-gravity beers.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Fermentation Temp:</strong> Temperature affects yeast character dramatically. Follow recommended ranges.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Pitch Rates:</strong> Dry yeast packets contain more cells than liquid vials. Use a pitch rate calculator for big beers.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Availability:</strong> Your local homebrew shop may carry only certain brands. These charts help you find equivalents.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Character:</strong> &ldquo;Equivalent&rdquo; doesn&apos;t mean identical. Small differences exist between brands.</span>
            </li>
          </ul>
        </div>

        {/* Yeast Substitution Tables by Category */}
        {yeastSubstitutions.map(group => (
          <div
            key={group.category}
            id={group.category.toLowerCase().replace(/\s+/g, '-')}
            className="mb-12 scroll-mt-4"
          >
            <h2 className="text-3xl font-bold text-amber-500 mb-6 border-b border-amber-600/30 pb-2">
              {group.category}
            </h2>

            {group.strains.map((strain, idx) => (
              <div
                key={idx}
                className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 mb-6 hover:border-amber-600/50 transition-colors"
              >
                <h3 className="text-xl font-semibold text-amber-400 mb-3">
                  {strain.name}
                </h3>

                <p className="text-gray-300 mb-4 leading-relaxed">
                  {strain.profile}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-zinc-900/50 rounded p-3">
                    <span className="text-gray-400 text-sm">Fermentation Temp:</span>
                    <span className="text-white font-semibold ml-2">{strain.temp}</span>
                  </div>
                  <div className="bg-zinc-900/50 rounded p-3">
                    <span className="text-gray-400 text-sm">Attenuation:</span>
                    <span className="text-white font-semibold ml-2">{strain.attenuation}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-700">
                        <th className="text-left py-2 px-3 text-gray-400 font-medium">Fermentis</th>
                        <th className="text-left py-2 px-3 text-gray-400 font-medium">White Labs</th>
                        <th className="text-left py-2 px-3 text-gray-400 font-medium">Wyeast</th>
                        <th className="text-left py-2 px-3 text-gray-400 font-medium">Lallemand</th>
                        <th className="text-left py-2 px-3 text-gray-400 font-medium">Omega</th>
                        <th className="text-left py-2 px-3 text-gray-400 font-medium">Imperial</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-3 text-white font-mono">
                          {strain.fermentis !== "-" ? strain.fermentis : <span className="text-gray-600">-</span>}
                        </td>
                        <td className="py-2 px-3 text-white font-mono">
                          {strain.whitelabs !== "-" ? strain.whitelabs : <span className="text-gray-600">-</span>}
                        </td>
                        <td className="py-2 px-3 text-white font-mono">
                          {strain.wyeast !== "-" ? strain.wyeast : <span className="text-gray-600">-</span>}
                        </td>
                        <td className="py-2 px-3 text-white font-mono">
                          {strain.lallemand !== "-" ? strain.lallemand : <span className="text-gray-600">-</span>}
                        </td>
                        <td className="py-2 px-3 text-white font-mono">
                          {strain.omega !== "-" ? strain.omega : <span className="text-gray-600">-</span>}
                        </td>
                        <td className="py-2 px-3 text-white font-mono">
                          {strain.imperial !== "-" ? strain.imperial : <span className="text-gray-600">-</span>}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Style-Specific Quick Reference */}
        <div id="style-guide" className="scroll-mt-4">
          <h2 className="text-3xl font-bold text-amber-500 mb-6 border-b border-amber-600/30 pb-2">
            Style-Specific Quick Reference
          </h2>

          <p className="text-gray-300 mb-6">
            Not sure which yeast to use for your beer style? Here are common recommendations:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {styleGuide.map((item, idx) => (
              <div
                key={idx}
                className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-5 hover:border-amber-600/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-amber-400 mb-2">
                  {item.style}
                </h3>
                <p className="text-white font-mono text-sm mb-2">
                  {item.recommended}
                </p>
                <p className="text-gray-400 text-sm italic">
                  {item.notes}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-gradient-to-r from-amber-900/30 to-amber-800/30 border border-amber-600/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-amber-400 mb-3">
            Need Yeast for Your Next Brew?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Shop our selection of dry and liquid yeast from Fermentis, White Labs, Wyeast, Lallemand, and more.
          </p>
          <Link
            href="/shop?category=yeast"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Shop Yeast
          </Link>
        </div>
      </div>
    </div>
  );
}
