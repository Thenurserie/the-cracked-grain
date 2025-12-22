'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, Book, Clock, Award, AlertCircle, Lightbulb, ChevronDown, ChevronRight } from 'lucide-react';
import { wineMakingGuide } from '@/data/guides/wine-making';

export function WineMakingGuide() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [showTOC, setShowTOC] = useState(false);

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
      const sections = wineMakingGuide.sections.map(s => s.id);
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
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-background/50 backdrop-blur z-50">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <Book className="h-16 w-16 text-purple-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
          {wineMakingGuide.title}
        </h1>
        <p className="text-lg text-cream/80 mb-6 max-w-3xl mx-auto">
          {wineMakingGuide.description}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Badge className="bg-green-500/20 text-green-500 border-green-500/40">
            <Award className="h-3 w-3 mr-1" />
            Beginner Friendly
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
            <Clock className="h-3 w-3 mr-1" />
            45 min read
          </Badge>
        </div>
      </div>

      {/* Table of Contents - Collapsible */}
      <Card className="bg-card border-purple-500/20 mb-8">
        <CardHeader className="cursor-pointer" onClick={() => setShowTOC(!showTOC)}>
          <CardTitle className="text-purple-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Table of Contents
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-400/80 hover:bg-purple-500/10"
            >
              {showTOC ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </CardTitle>
        </CardHeader>
        {showTOC && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {wineMakingGuide.sections.map((section, index) => (
                <Button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  variant="ghost"
                  className={`justify-start text-left h-auto py-2 px-3 ${
                    activeSection === section.id
                      ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                      : 'text-cream hover:text-purple-400 hover:bg-purple-500/10'
                  }`}
                >
                  <span className="text-xs mr-2 opacity-70">{index + 1}</span>
                  <span className="flex-1 text-sm">{section.title}</span>
                  {activeSection === section.id && (
                    <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Introduction */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400 mb-8">
        <CardContent className="py-6">
          <p className="text-cream/90 leading-relaxed">
            Welcome to the art of winemaking! This comprehensive guide will take you from absolute
            beginner to confident winemaker, covering everything you need to know to make exceptional wine at home.
            Patience is key—wine takes time, but the results are worth the wait.
          </p>
        </CardContent>
      </Card>

      {/* Guide Sections */}
      <div className="space-y-8">
        {wineMakingGuide.sections.map((section, index) => (
          <Card
            key={section.id}
            id={`section-${section.id}`}
            className={`bg-card border-purple-500/20 transition-all duration-300 ${
              activeSection === section.id ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-400/20' : ''
            }`}
          >
            <CardHeader>
              <CardTitle className="text-2xl text-purple-400 flex items-center gap-2">
                <span className="text-purple-500/60 text-lg">{index + 1}.</span>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Content */}
              <div className="prose prose-invert max-w-none">
                {section.content.split('\n\n').map((paragraph, idx) => {
                  // Skip empty paragraphs
                  if (!paragraph.trim()) return null;

                  // Check if paragraph starts with ** (bold heading)
                  if (paragraph.startsWith('**') && paragraph.includes('**:')) {
                    const [heading, ...rest] = paragraph.split('**:');
                    const headingText = heading.replace(/\*\*/g, '');
                    return (
                      <div key={idx} className="mb-4">
                        <h4 className="text-lg font-semibold text-purple-400 mb-2">{headingText}</h4>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-lg bg-purple-500 hover:bg-purple-600 z-50"
          size="icon"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
