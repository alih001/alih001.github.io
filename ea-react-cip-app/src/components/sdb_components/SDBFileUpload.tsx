import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import {
  DemandRow,
  FilterCriteria,
  CustomAssetRow,
  AssetColumns,
} from "../../types/public-types";
import FilterControls from "./FilterControls";
import DemandSupplyChart from "../../charts/SDBCharts/SupplyDemandChart";
import ScenarioManager from "./ScenarioManager";
import AssetSelector from "./SDBAssetSelector";
import CostChart from "../../charts/SDBCharts/CostChart";
import { useData } from "../../contexts/useDataContext";

const ExcelFileUpload: React.FC = () => {
  const { demandData, setDemandData } = useData();
  const { supplyData, setSupplyData } = useData();
  const { customAssets, setCustomAssets } = useData();
  const { selectedAssets, setSelectedAssets } = useData();
  const { filterCriteria, setFilterCriteria } = useData();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const buffer = evt.target?.result;
      if (!(buffer instanceof ArrayBuffer)) return;

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      // --- Process Demand Sheet ---
      const demandSheet = workbook.getWorksheet("Demand");
      if (demandSheet) {
        const tempDemand: DemandRow[] = [];
        const headerRow = demandSheet.getRow(1);
        const yearHeaders: { col: number; year: string }[] = [];
        headerRow.eachCell((cell, colNumber) => {
          if (colNumber >= 7) {
            let headerValue: string = "";
            if (typeof cell.value === "string") {
              headerValue = cell.value;
            } else if (typeof cell.value === "number") {
              headerValue = cell.value.toString();
            }
            yearHeaders.push({ col: colNumber, year: headerValue });
          }
        });
        demandSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return;
          const zone = row.getCell("B").value as string;
          const planningScenario = row.getCell("C").value as string;
          const growthForecast = row.getCell("D").value as string;
          const yearlyDemand: Record<string, number> = {};
          yearHeaders.forEach(({ col, year }) => {
            const cell = row.getCell(col);
            let value = 0;
            if (typeof cell.value === "number") {
              value = cell.value;
            } else if (typeof cell.value === "string") {
              value = Number(cell.value) || 0;
            }
            yearlyDemand[year] = value;
          });
          tempDemand.push({
            zone,
            planningScenario,
            growthForecast,
            yearlyDemand,
          });
        });
        setDemandData(tempDemand);
      }

      // --- Process Supply Sheet ---
      const sheet = workbook.getWorksheet("Supply");
      if (sheet) {
        const groups: {
          [key: string]: {
            wrz: string;
            scenario: string;
            yearlySupply: Record<string, number>;
            droughtAdjustments: {
              "1/500": Record<string, number>;
              "1/200": Record<string, number>;
              "1/100": Record<string, number>;
            };
          };
        } = {};

        sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return;
          const yearCell = row.getCell("A").value;
          const wrzCell = row.getCell("B").value;
          const scenarioCell = row.getCell("C").value;
          const wafuCell = row.getCell("D").value;
          const drought1500Cell = row.getCell("E").value;
          const drought1200Cell = row.getCell("F").value;
          const drought100Cell = row.getCell("G").value;

          const yearStr =
            typeof yearCell === "number"
              ? yearCell.toString()
              : (yearCell as string);
          const wrz = typeof wrzCell === "string" ? wrzCell : "";
          const scenario = typeof scenarioCell === "string" ? scenarioCell : "";
          const wafu =
            typeof wafuCell === "number" ? wafuCell : Number(wafuCell);
          const drought1500 =
            typeof drought1500Cell === "number"
              ? drought1500Cell
              : Number(drought1500Cell);
          const drought1200 =
            typeof drought1200Cell === "number"
              ? drought1200Cell
              : Number(drought1200Cell);
          const drought100 =
            typeof drought100Cell === "number"
              ? drought100Cell
              : Number(drought100Cell);

          const key = `${wrz}_${scenario}`;
          if (!groups[key]) {
            groups[key] = {
              wrz,
              scenario,
              yearlySupply: {},
              droughtAdjustments: {
                "1/500": {},
                "1/200": {},
                "1/100": {},
              },
            };
          }
          groups[key].yearlySupply[yearStr] = wafu;
          groups[key].droughtAdjustments["1/500"][yearStr] = drought1500;
          groups[key].droughtAdjustments["1/200"][yearStr] = drought1200;
          groups[key].droughtAdjustments["1/100"][yearStr] = drought100;
        });
        const groupedSupplyData = Object.values(groups);
        setSupplyData(groupedSupplyData);
      }

      // --- Process CustomAssets Sheet ---
      const customAssetsSheet = workbook.getWorksheet("CustomAssets");
      if (customAssetsSheet) {
        // For each asset, store the columns for DO and Cost.

        const assetMap: { [assetName: string]: AssetColumns } = {};

        // Assume the first row is the header row
        const headerRow = customAssetsSheet.getRow(1);
        headerRow.eachCell((cell, colNumber) => {
          // Skip column 1 if it's "Year"
          if (colNumber === 1) return;

          const headerValue = cell.value;
          if (typeof headerValue === "string") {
            if (headerValue.includes("_DO")) {
              // e.g. "Asset1_DO" => assetName = "Asset1"
              const assetName = headerValue.replace("_DO", "");
              if (!assetMap[assetName]) assetMap[assetName] = {};
              assetMap[assetName].doCol = colNumber;
            } else if (headerValue.includes("_Cost")) {
              // e.g. "Asset1_Cost" => assetName = "Asset1"
              const assetName = headerValue.replace("_Cost", "");
              if (!assetMap[assetName]) assetMap[assetName] = {};
              assetMap[assetName].costCol = colNumber;
            }
          }
        });

        const tempAssets: CustomAssetRow[] = [];

        // Start from row 2 to skip the header
        customAssetsSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return;

          // Column 1 is the Year
          const yearCell = row.getCell(1).value;
          const year =
            typeof yearCell === "number" ? yearCell : Number(yearCell) || 0;

          // Build an object to store DO and Cost for each asset in this row
          const assetData: {
            [assetName: string]: { do: number; cost: number };
          } = {};

          // For each asset in the header map
          for (const assetName of Object.keys(assetMap)) {
            const { doCol, costCol } = assetMap[assetName];
            const doVal = doCol ? row.getCell(doCol).value : 0;
            const costVal = costCol ? row.getCell(costCol).value : 0;

            const doNumber =
              typeof doVal === "number" ? doVal : Number(doVal) || 0;
            const costNumber =
              typeof costVal === "number" ? costVal : Number(costVal) || 0;

            assetData[assetName] = {
              do: doNumber,
              cost: costNumber,
            };
          }

          tempAssets.push({
            year,
            assets: assetData,
          });
        });

        setCustomAssets(tempAssets);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Compute available options from demand data.
  const zones = Array.from(new Set(demandData.map((d) => d.zone)));
  const planningScenarios = Array.from(
    new Set(demandData.map((d) => d.planningScenario))
  );
  const growthForecasts = Array.from(
    new Set(demandData.map((d) => d.growthForecast))
  );

  // Automatically set default filter criteria once data is loaded.
  React.useEffect(() => {
    if (demandData.length > 0 && filterCriteria.wrz === "") {
      const newZones = Array.from(new Set(demandData.map((d) => d.zone)));
      const newPlanningScenarios = Array.from(
        new Set(demandData.map((d) => d.planningScenario))
      );
      const newGrowthForecasts = Array.from(
        new Set(demandData.map((d) => d.growthForecast))
      );
      setFilterCriteria((prev) => ({
        ...prev,
        wrz: newZones[0] || "",
        planningScenario: newPlanningScenarios[0] || "",
        growthForecast: newGrowthForecasts[0] || "",
      }));
    }
  }, [demandData, filterCriteria.wrz]);

  // Filter demand data based on selected options.
  const filteredDemandData = demandData.filter((d) => {
    return (
      d.zone === filterCriteria.wrz &&
      d.planningScenario === filterCriteria.planningScenario &&
      d.growthForecast === filterCriteria.growthForecast
    );
  });

  // Filter supply data by WRZ and Planning Scenario (supply is grouped).
  const filteredSupplyData = supplyData.filter((s: any) => {
    return (
      s.wrz === filterCriteria.wrz &&
      s.scenario === filterCriteria.planningScenario
    );
  });

  // Pick the first matching entry for charting.
  const demandForChart = filteredDemandData[0] || null;
  const supplyForChart = filteredSupplyData[0] || null;

  // Function to handle loading a scenario:
  const handleLoadScenario = (criteria: FilterCriteria) => {
    setFilterCriteria(criteria);
  };

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

  return (
    <div>
      <h2>Upload Excel File</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      <h2>Filtering Controls</h2>
      <FilterControls
        criteria={filterCriteria}
        setCriteria={setFilterCriteria}
        zones={zones}
        planningScenarios={planningScenarios}
        growthForecasts={growthForecasts}
      />

      <div>
        <DemandSupplyChart
          demandData={demandForChart}
          supplyData={supplyForChart}
          drought={filterCriteria.drought}
        />
      </div>

      <ScenarioManager
        activeFilterCriteria={filterCriteria}
        onLoadScenario={handleLoadScenario}
      />

      <AssetSelector
        allAssets={["Asset1", "Asset2"]} // or dynamically generated
        selectedAssets={selectedAssets}
        onToggleAsset={handleToggleAsset}
      />

      <CostChart customAssets={customAssets} selectedAssets={selectedAssets} />

      {/* Temporary Debugging Previews */}
      {/* <div>
        <h3>Demand Data Preview</h3>
        <pre>{JSON.stringify(demandData, null, 2)}</pre>
      </div>
      <div>
        <h3>Supply Data Preview</h3>
        <pre>{JSON.stringify(supplyData, null, 2)}</pre>
      </div> */}
      <div>
        <h3>Custom Assets Preview</h3>
        <pre>{JSON.stringify(customAssets, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ExcelFileUpload;
