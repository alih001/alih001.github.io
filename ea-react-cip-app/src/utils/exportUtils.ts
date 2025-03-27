import ExcelJS from "exceljs";

export const handleExportToExcel = async ({
  wrzList,
  wrzData,
  assetDetailsMap,
  filterCriteria,
  demandForChart,
  supplyForChart,
  customAssets,
}: {
  wrzList: string[];
  wrzData: any;
  assetDetailsMap: Record<string, any>;
  filterCriteria: any;
  demandForChart: any;
  supplyForChart: any;
  customAssets: any[];
}) => {
  const workbook = new ExcelJS.Workbook();

  // -------------------------
  // 1. Scenario Summary Sheet
  // -------------------------
  const summarySheet = workbook.addWorksheet("ScenarioSummary");

  summarySheet.addRow([
    "WRZ",
    "Asset Name",
    "DO %",
    "Start Year",
    "Description",
    "Planning Scenario",
    "Growth Forecast",
    "Drought",
  ]);

  wrzList.forEach((wrz) => {
    const { selectedAssets, assetSettings } = wrzData[wrz];

    Array.from(selectedAssets).forEach((assetName: string) => {
      const settings = assetSettings[assetName] || {
        doPercentage: 100,
        startYear: 2025,
      };
      const meta = assetDetailsMap?.[assetName] ?? {};

      summarySheet.addRow([
        wrz,
        assetName,
        settings.doPercentage,
        settings.startYear,
        meta.description || "",
        filterCriteria.planningScenario,
        filterCriteria.growthForecast,
        filterCriteria.drought,
      ]);
    });
  });

  // -------------------------
  // 2. Demand Data Sheet
  // -------------------------
  const demandSheet = workbook.addWorksheet("DemandData");
  demandSheet.addRow(["Year", "Demand (Ml/d)"]);

  if (demandForChart && demandForChart.yearlyDemand) {
    Object.entries(demandForChart.yearlyDemand).forEach(([year, value]) => {
      const parsed = typeof value === "number" ? value : Number(value);
      demandSheet.addRow([year, isNaN(parsed) ? "" : parsed]);
    });
  }

  // -------------------------
  // 3. Supply Data Sheet
  // -------------------------
  const supplySheet = workbook.addWorksheet("SupplyData");
  supplySheet.addRow(["Year", "Base Supply (WAFU)", "1/500", "1/200", "1/100"]);

  if (supplyForChart?.yearlySupply) {
    Object.entries(supplyForChart.yearlySupply).forEach(([year, wafu]) => {
      const y = year.toString();
      const droughts = supplyForChart.droughtAdjustments || {};
      const d500 = droughts["1/500"]?.[y] ?? "";
      const d200 = droughts["1/200"]?.[y] ?? "";
      const d100 = droughts["1/100"]?.[y] ?? "";

      supplySheet.addRow([
        y,
        typeof wafu === "number" ? wafu : Number(wafu) || "",
        d500,
        d200,
        d100,
      ]);
    });
  }

  // -------------------------
  // 4. Cost Summary Sheet
  // -------------------------
  const costSheet = workbook.addWorksheet("CostSummary");

  costSheet.addRow(["WRZ", "Asset Name", "Year", "Adjusted Cost (£)"]);

  wrzList.forEach((wrz) => {
    const { selectedAssets, assetSettings } = wrzData[wrz];

    Array.from(selectedAssets).forEach((assetName: string) => {
      const settings = assetSettings[assetName] || { startYear: 2025 };

      // First: find the true base start year for the asset in the dataset
      const assetBaseStartYear = Math.min(
        ...customAssets
          .filter((row) => row.assets[assetName])
          .map((row) => row.year)
      );

      customAssets.forEach((row) => {
        const relativeOffset = row.year - assetBaseStartYear;
        const adjustedYear = settings.startYear + relativeOffset;

        const asset = row.assets[assetName];
        if (asset?.cost) {
          costSheet.addRow([wrz, assetName, adjustedYear, asset.cost]);
        }
      });
    });
  });

  // -------------------------
  // Style headers + autofit
  // -------------------------
  [summarySheet, demandSheet, supplySheet, costSheet].forEach((sheet) => {
    sheet.getRow(1).font = { bold: true };

    sheet.columns.forEach((col) => {
      let maxLength = 12;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const val = cell.value?.toString() || "";
        maxLength = Math.max(maxLength, val.length + 2);
      });
      col.width = maxLength;
    });
  });

  // -------------------------
  // Trigger file download
  // -------------------------
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `ScenarioExport_${Date.now()}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
