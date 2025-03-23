// useAssetSetting.ts
import { useData } from "../contexts/useDataContext";
import { AssetSettings } from "../types/public-types";

export const useAssetSetting = (assetName: string) => {
  const { assetSettings, setAssetSettings } = useData();

  // Get current settings or use defaults
  const currentSettings: AssetSettings = assetSettings[assetName] || {
    doPercentage: 100,
    startYear: 2020,
  };

  // Function to update DO percentage
  const updateDOPercentage = (newPercentage: number) => {
    setAssetSettings((prev) => ({
      ...prev,
      [assetName]: { ...currentSettings, doPercentage: newPercentage },
    }));
  };

  // Function to update start year
  const updateStartYear = (newYear: number) => {
    setAssetSettings((prev) => ({
      ...prev,
      [assetName]: { ...currentSettings, startYear: newYear },
    }));
  };

  return { currentSettings, updateDOPercentage, updateStartYear };
};
