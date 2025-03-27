/**
 * Returns a dynamic color based on the index and total number of items.
 * For example, if totalAssets is 10, then asset 0 will get one hue, asset 1 another, etc.
 */
export function getColourForAsset(index: number, totalAssets: number): string {
  const hue = (index * 360) / totalAssets; // spread hues evenly around the circle
  const saturation = 60; // adjust saturation as needed
  const lightness = 50; // adjust lightness as needed
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
