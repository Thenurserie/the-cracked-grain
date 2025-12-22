'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { wineMakingGuide } from '@/data/guides/wine-making';

export function WineMakingGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{wineMakingGuide.title}</CardTitle>
        <p className="text-muted-foreground">{wineMakingGuide.description}</p>
      </CardHeader>
      <CardContent>
        {/* Table of Contents */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-3">Table of Contents</h3>
          <ol className="space-y-1 text-sm">
            {wineMakingGuide.sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Guide Sections */}
        <Accordion type="single" collapsible className="w-full">
          {wineMakingGuide.sections.map((section, index) => (
            <AccordionItem key={section.id} value={section.id} id={section.id}>
              <AccordionTrigger className="text-lg font-semibold">
                {index + 1}. {section.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                  {section.content}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
