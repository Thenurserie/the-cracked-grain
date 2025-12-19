/**
 * Get the Directus asset URL with optional transforms
 * @param imageId - The UUID of the image in Directus
 * @param options - Transform options (width, height, quality, fit)
 * @returns The full URL to the Directus asset with transforms
 */
export function getDirectusAssetUrl(
  imageId: string | null | undefined,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    fit?: 'cover' | 'contain' | 'inside' | 'outside';
  }
): string {
  if (!imageId) {
    return '/images/placeholder-product.svg';
  }

  // If it's already a full URL, return it as-is
  if (imageId.startsWith('http://') || imageId.startsWith('https://')) {
    return imageId;
  }

  // Construct the Directus asset URL
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://admin.thecrackedgrain.com';
  let url = `${directusUrl}/assets/${imageId}`;

  // Add Directus transform parameters
  if (options) {
    const params = new URLSearchParams();
    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.quality) params.append('quality', options.quality.toString());
    if (options.fit) params.append('fit', options.fit);

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
}
