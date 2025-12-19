'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getDirectusAssetUrl } from '@/lib/directus';

interface ProductImageProps {
  imageUrl: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  transforms?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'inside' | 'outside';
    quality?: number;
  };
}

export function ProductImage({
  imageUrl,
  alt,
  fill,
  width,
  height,
  className = '',
  priority,
  loading,
  sizes,
  transforms
}: ProductImageProps) {
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get image URL with transforms, or fallback to placeholder
  const src = error || !imageUrl
    ? '/images/placeholder-product.svg'
    : getDirectusAssetUrl(imageUrl, transforms);

  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={`${className} ${!imageLoaded && !error ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        loading={loading}
        sizes={sizes}
        onError={() => setError(true)}
        onLoad={() => setImageLoaded(true)}
      />
      {!imageLoaded && !error && (
        <div className="absolute inset-0 bg-[#2a2a2a] animate-pulse" />
      )}
    </div>
  );
}
