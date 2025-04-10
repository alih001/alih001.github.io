// src/utils/calculateTotalSupply.ts
export const calculateTotalSupply = (
    baseSupplyData: { [year: string]: number },
    droughtAdjustments: { [scenario: string]: { [year: string]: number } } | undefined,
    activeSimulation: any,
    drought: string,
    customAssets: any[],
    assetSettings: { [assetName: string]: any },
    selectedAssets: Set<string>
  ): { [year: number]: number } => {
    const years = Object.keys(baseSupplyData).map(Number).sort((a, b) => a - b);
    const selectedAssetsArray = Array.from(selectedAssets).sort();
    const totalSupply: { [year: number]: number } = {};
  
    years.forEach((year) => {
      const yearStr = year.toString();
      const baseSupply = baseSupplyData[yearStr] || 0;
      const effectiveDrought = activeSimulation?.config?.droughtOverride ?? drought;
      const droughtAdjustment =
        effectiveDrought !== "None" &&
        droughtAdjustments &&
        droughtAdjustments[effectiveDrought]?.[yearStr]
          ? droughtAdjustments[effectiveDrought][yearStr]
          : 0;
      const baseEffective = Math.max(0, baseSupply - droughtAdjustment);
      let total = baseEffective;
  
      selectedAssetsArray.forEach((assetName) => {
        const assetRows = customAssets.filter(
          (row) => row.assets[assetName] !== undefined
        );
        const baseStartYear =
          assetRows.length > 0
            ? Math.min(...assetRows.map((row) => row.year))
            : 2020;
        const settings = assetSettings[assetName] || {
          doPercentage: 100,
          startYear: baseStartYear,
        };
        const doPercentage = settings.doPercentage;
        const shift = settings.startYear - baseStartYear;
        const effectiveYear = year - shift;
        let effectiveAssetDO = 0;
        if (effectiveYear >= baseStartYear) {
          effectiveAssetDO =
            customAssets.find((row) => row.year === effectiveYear)?.assets?.[assetName]
              ?.do || 0;
        }
        effectiveAssetDO = effectiveAssetDO * (doPercentage / 100);
        const yearsSinceStart = Math.max(0, year - settings.startYear);
        const decayRate = Math.min(activeSimulation?.config.assetDeterioration ?? 0, 20);
        const decayedDO =
          effectiveAssetDO * Math.pow(1 - decayRate / 100, yearsSinceStart);
        total += decayedDO;
      });
      totalSupply[year] = total;
    });
    return totalSupply;
  };
  