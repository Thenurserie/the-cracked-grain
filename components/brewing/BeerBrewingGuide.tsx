'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, Book, Clock, Award, AlertCircle, Lightbulb, ChevronDown, ChevronRight } from 'lucide-react';
import { BEER_GUIDE_SECTIONS, type BeerGuideSection } from '@/data/guides/beer-brewing';

export function BeerBrewingGuide() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button
      setShowBackToTop(window.scrollY > 500);

      // Calculate read progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadProgress(Math.min(Math.round(scrollPercentage), 100));

      // Update active section based on scroll position
      const sections = BEER_GUIDE_SECTIONS.map(s => s.id);
      for (const sectionId of sections) {
        const element = document.getElementById(`section-${sectionId}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-background/50 backdrop-blur z-50">
        <div
          className="h-full bg-gradient-to-r from-amber to-gold transition-all duration-300"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <Book className="h-16 w-16 text-gold" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
          The Complete Beer Brewing Guide
        </h1>
        <p className="text-lg text-cream/80 mb-6 max-w-3xl mx-auto">
          From your first batch to master brewer. Everything you need to know to make exceptional beer at home.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Badge className="bg-green-500/20 text-green-500 border-green-500/40">
            <Award className="h-3 w-3 mr-1" />
            Beginner Friendly
          </Badge>
          <Badge className="bg-amber/20 text-gold border-amber/40">
            <Clock className="h-3 w-3 mr-1" />
            60 min read
          </Badge>
        </div>
      </div>

      {/* Table of Contents */}
      <Card className="bg-card border-amber/20 mb-8 sticky top-20 z-40">
        <CardHeader>
          <CardTitle className="text-gold flex items-center gap-2">
            <Book className="h-5 w-5" />
            Table of Contents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {BEER_GUIDE_SECTIONS.map((section) => (
              <Button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                variant="ghost"
                className={`justify-start text-left h-auto py-2 px-3 ${
                  activeSection === section.id
                    ? 'bg-amber/20 text-gold hover:bg-amber/30'
                    : 'text-cream hover:text-gold hover:bg-amber/10'
                }`}
              >
                <span className="text-xs mr-2 opacity-70">{section.title.split('.')[0]}</span>
                <span className="flex-1 text-sm">{section.title.split('. ')[1]}</span>
                {activeSection === section.id && (
                  <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Introduction */}
      <Card className="bg-gradient-to-br from-amber/10 to-gold/10 border-gold mb-8">
        <CardContent className="py-6">
          <p className="text-cream/90 leading-relaxed">
            Welcome to the wonderful world of homebrewing! This comprehensive guide will take you from absolute
            beginner to confident brewer, covering everything you need to know to make great beer at home.
            Whether you're brewing your first batch or looking to refine your technique, this guide has you covered.
          </p>
        </CardContent>
      </Card>

      {/* Guide Sections */}
      <div className="space-y-8">
        {BEER_GUIDE_SECTIONS.map((section, index) => (
          <Card
            key={section.id}
            id={`section-${section.id}`}
            className={`bg-card border-amber/20 transition-all duration-300 ${
              activeSection === section.id ? 'ring-2 ring-gold shadow-lg shadow-gold/20' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-2xl text-gold flex items-center gap-2">
                  <span className="text-amber/60 text-lg">{index + 1}.</span>
                  {section.title.split('. ')[1] || section.title}
                </CardTitle>
                {section.subsections && section.subsections.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection(section.id)}
                    className="text-cream/70 hover:text-gold"
                  >
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Content */}
              <div className="prose prose-invert max-w-none">
                {section.content.split('\n\n').map((paragraph, idx) => {
                  // Check if paragraph starts with ** (bold heading)
                  if (paragraph.startsWith('**') && paragraph.includes('**:')) {
                    const [heading, ...rest] = paragraph.split('**:');
                    const headingText = heading.replace(/\*\*/g, '');
                    return (
                      <div key={idx} className="mb-4">
                        <h4 className="text-lg font-semibold text-gold mb-2">{headingText}</h4>
                        <p className="text-cream/90 leading-relaxed">{rest.join('').trim()}</p>
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="text-cream/90 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Subsections */}
              {section.subsections && section.subsections.length > 0 && (
                <div className={`space-y-6 ${expandedSections.has(section.id) ? 'block' : 'hidden'}`}>
                  {section.subsections.map((subsection, subIdx) => (
                    <div key={subIdx} className="border-l-2 border-amber/30 pl-6 py-2">
                      <h3 className="text-xl font-semibold text-cream mb-3 flex items-center gap-2">
                        <span className="text-amber/60">▸</span>
                        {subsection.title}
                      </h3>
                      <div className="prose prose-invert max-w-none">
                        {subsection.content.split('\n\n').map((paragraph, pIdx) => {
                          // Handle bold headings within subsections
                          if (paragraph.startsWith('**') && paragraph.includes('**:')) {
                            const [heading, ...rest] = paragraph.split('**:');
                            const headingText = heading.replace(/\*\*/g, '');
                            return (
                              <div key={pIdx} className="mb-4">
                                <h5 className="text-base font-semibold text-amber mb-2">{headingText}</h5>
                                <p className="text-cream/80 leading-relaxed text-sm">{rest.join('').trim()}</p>
                              </div>
                            );
                          }
                          return (
                            <p key={pIdx} className="text-cream/80 leading-relaxed mb-3 text-sm">
                              {paragraph}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tips */}
              {section.tips && section.tips.length > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-400 mb-2">Pro Tips</h4>
                      <ul className="space-y-2">
                        {section.tips.map((tip, idx) => (
                          <li key={idx} className="text-sm text-cream/80 leading-relaxed">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Warnings */}
              {section.warnings && section.warnings.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-400 mb-2">Important Warnings</h4>
                      <ul className="space-y-2">
                        {section.warnings.map((warning, idx) => (
                          <li key={idx} className="text-sm text-cream/80 leading-relaxed">
                            ⚠ {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Back to Top Link */}
              {index > 0 && (
                <div className="pt-4 border-t border-amber/20">
                  <Button
                    onClick={scrollToTop}
                    variant="ghost"
                    size="sm"
                    className="text-gold hover:text-amber hover:bg-amber/10"
                  >
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Back to Top
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 bg-amber hover:bg-gold shadow-lg shadow-amber/50 z-40"
          size="icon"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}

      {/* Conclusion */}
      <Card className="bg-gradient-to-br from-amber/10 to-gold/10 border-gold mt-12">
        <CardContent className="py-8 text-center">
          <h2 className="text-2xl font-bold text-gold mb-4">Ready to Start Brewing?</h2>
          <p className="text-cream/90 mb-6 max-w-2xl mx-auto">
            You now have everything you need to make great beer at home. Remember: every professional brewer started
            exactly where you are now. Be patient with yourself, learn from each batch, and most importantly – have fun!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-amber hover:bg-gold" onClick={() => scrollToTop()}>
              Read Again
            </Button>
            <Button variant="outline" className="border-amber/30 text-cream hover:bg-amber/10" asChild>
              <a href="/shop?category=kits">
                Shop Starter Kits
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
