import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Search, Beaker } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hop Substitutions | The Cracked Grain',
  description: 'Comprehensive hop substitution chart for homebrewing. Find suitable hop alternatives for 80+ hop varieties when your recipe calls for hops you can\'t find.',
};

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
  { hop: "Zythos (Blend)", subs: ["Amarillo", "Cascade", "Simcoe", "Citra"] }
];

export default function HopSubstitutionsPage() {
  // Group by first letter for easier navigation
  const grouped = hopSubstitutions.reduce((acc, hop) => {
    const letter = hop.hop[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(hop);
    return acc;
  }, {} as Record<string, typeof hopSubstitutions>);

  const letters = Object.keys(grouped).sort();

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
              Hop Substitutions
            </h1>
          </div>

          <p className="text-xl text-gray-300 max-w-3xl">
            Can't find the hop you need? This comprehensive guide covers 80+ hop varieties with suitable replacements for brewing.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-zinc-800/50 border border-amber-600/30 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
            <Search className="h-5 w-5" />
            Quick Navigation
          </h2>
          <div className="flex flex-wrap gap-2">
            {letters.map(letter => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="bg-zinc-700 hover:bg-amber-600 text-white px-4 py-2 rounded transition-colors text-sm font-medium"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>

        {/* Substitution Tips */}
        <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-400 mb-3">Substitution Tips</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Bittering hops:</strong> Match alpha acid levels and adjust quantity using IBU calculations</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Aroma/Flavor hops:</strong> Substitute 1:1 by weight, focus on similar flavor profiles</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Origin codes:</strong> AUS=Australia, CZE=Czech, DEU=Germany, GBR=Great Britain, NZL=New Zealand, SVN=Slovenia</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Availability:</strong> Your local homebrew shop may carry only certain hop varieties. These charts help you find alternatives.</span>
            </li>
          </ul>
        </div>

          {/* Hop List */}
          {letters.map(letter => (
            <div key={letter} id={`letter-${letter}`} className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 sticky top-20 bg-zinc-900 py-2">{letter}</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium w-1/3">Hop Variety</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Possible Substitutes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped[letter].map((hop, idx) => (
                      <tr key={idx} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                        <td className="py-3 px-4 text-white font-medium">{hop.hop}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {hop.subs.map((sub, subIdx) => (
                              <span key={subIdx} className="bg-zinc-700 text-amber-400 px-2 py-0.5 rounded text-sm">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <div className="bg-zinc-800 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Common Substitution Groups</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-amber-500 font-medium mb-2">American C-Hops (Citrus/Pine)</h4>
                <p className="text-gray-300 text-sm">Cascade ↔ Centennial ↔ Chinook ↔ Columbus</p>
              </div>
              <div>
                <h4 className="text-amber-500 font-medium mb-2">Tropical/Fruity New World</h4>
                <p className="text-gray-300 text-sm">Citra ↔ Mosaic ↔ Galaxy ↔ Simcoe ↔ Amarillo</p>
              </div>
              <div>
                <h4 className="text-amber-500 font-medium mb-2">Noble/German</h4>
                <p className="text-gray-300 text-sm">Hallertau ↔ Tettnang ↔ Saaz ↔ Spalt</p>
              </div>
              <div>
                <h4 className="text-amber-500 font-medium mb-2">English</h4>
                <p className="text-gray-300 text-sm">East Kent Golding ↔ Fuggle ↔ Willamette ↔ Styrian Golding</p>
              </div>
              <div>
                <h4 className="text-amber-500 font-medium mb-2">Clean Bittering</h4>
                <p className="text-gray-300 text-sm">Magnum ↔ Warrior ↔ Nugget ↔ Columbus ↔ Galena</p>
              </div>
              <div>
                <h4 className="text-amber-500 font-medium mb-2">New Zealand</h4>
                <p className="text-gray-300 text-sm">Nelson Sauvin ↔ Motueka ↔ Riwaka ↔ Wai-iti</p>
              </div>
            </div>
          </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-gradient-to-r from-amber-900/30 to-amber-800/30 border border-amber-600/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-amber-400 mb-3">
            Need Hops for Your Next Brew?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Shop our selection of fresh hops from around the world. American, German, English, New Zealand, and more.
          </p>
          <Link
            href="/shop?category=hops"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Shop Hops
          </Link>
        </div>
      </div>
    </div>
  );
}
