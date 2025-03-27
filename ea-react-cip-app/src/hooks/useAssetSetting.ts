// src/hooks/useAssetSetting.ts
import { useData } from "../contexts/useDataContext";
import { AssetSettings } from "../types/public-types";

export const useAssetSetting = (assetName: string) => {
  const { getCurrentWRZState, updateCurrentWRZState } = useData();

  const { assetSettings } = getCurrentWRZState();

  const currentSettings: AssetSettings = assetSettings[assetName] || {
    doPercentage: 100,
    startYear: 2020,
  };

  const updateDOPercentage = (newPercentage: number) => {
    updateCurrentWRZState({
      assetSettings: {
        ...assetSettings,
        [assetName]: {
          ...currentSettings,
          doPercentage: newPercentage,
        },
      },
    });
  };

  const updateStartYear = (newYear: number) => {
    updateCurrentWRZState({
      assetSettings: {
        ...assetSettings,
        [assetName]: {
          ...currentSettings,
          startYear: newYear,
        },
      },
    });
  };

  return { currentSettings, updateDOPercentage, updateStartYear };
};
