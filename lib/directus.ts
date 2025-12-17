/**
 * Get the Directus asset URL for an image
 * @param imageId - The UUID of the image in Directus
 * @returns The full URL to the Directus asset
 */
export function getDirectusAssetUrl(imageId: string | null | undefined): string {
  if (!imageId) {
    return '/images/placeholder-product.jpg';
  }

  // If it's already a full URL, return it as-is
  if (imageId.startsWith('http://') || imageId.startsWith('https://')) {
    return imageId;
  }

  // Construct the Directus asset URL
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://admin.thecrackedgrain.com';
  return `${directusUrl}/assets/${imageId}`;
}
