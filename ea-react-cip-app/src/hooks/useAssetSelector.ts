// src/hooks/useAssetSelector.ts
import { useData } from "../contexts/useDataContext";

export const useAssetSelector = () => {
  const { selectedAssets, setSelectedAssets } = useData();

  const handleToggleAsset = (assetName: string) => {
    setSelectedAssets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(assetName)) {
        newSet.delete(assetName);
      } else {
        newSet.add(assetName);
      }
      return newSet;
    });
  };

  return {
    selectedAssets,
    handleToggleAsset,
  };
};
