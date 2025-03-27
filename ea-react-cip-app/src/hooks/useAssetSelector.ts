// src/hooks/useAssetSelector.ts
import { useData } from "../contexts/useDataContext";

export const useAssetSelector = () => {
  const { getCurrentWRZState, updateCurrentWRZState } = useData();

  const { selectedAssets } = getCurrentWRZState();

  const handleToggleAsset = (assetName: string) => {
    const newSet = new Set(selectedAssets);
    if (newSet.has(assetName)) {
      newSet.delete(assetName);
    } else {
      newSet.add(assetName);
    }

    updateCurrentWRZState({ selectedAssets: newSet });
  };

  return {
    selectedAssets,
    handleToggleAsset,
  };
};
