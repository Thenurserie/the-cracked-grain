export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://thecrackedgrain.com',
    name: 'The Cracked Grain',
    description:
      'Premium homebrew supplies store in Bryant, Arkansas. Quality brewing ingredients, equipment, and supplies for craft beer enthusiasts.',
    url: 'https://thecrackedgrain.com',
    telephone: '',
    email: 'info@thecrackedgrain.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bryant',
      addressRegion: 'AR',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      addressLocality: 'Bryant',
      addressRegion: 'AR',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    sameAs: [],
    priceRange: '$$',
    image: 'https://thecrackedgrain.com/og-image.jpg',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://thecrackedgrain.com/#website',
    url: 'https://thecrackedgrain.com',
    name: 'The Cracked Grain',
    description:
      'Premium homebrew supplies for craft beer enthusiasts. Quality ingredients and equipment for every brew.',
    publisher: {
      '@id': 'https://thecrackedgrain.com/#organization',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
