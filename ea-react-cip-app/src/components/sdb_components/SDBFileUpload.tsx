// src/components/sdb_components/FileUploader.tsx
import React from "react";
import ExcelJS from "exceljs";
import {
  DemandRow,
  SupplyRow,
  CustomAssetRow,
  AssetColumns,
} from "../../types/public-types";
import { useData } from "../../contexts/useDataContext";

const ExcelFileUpload: React.FC = () => {
  const { setDemandData, setSupplyData, setCustomAssets } = useData();

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
        interface AssetColumns {
          doCol?: number;
          costCol?: number;
        }
        const assetMap: { [assetName: string]: AssetColumns } = {};
        const headerRow = customAssetsSheet.getRow(1);
        headerRow.eachCell((cell, colNumber) => {
          if (colNumber === 1) return;
          const headerValue = cell.value;
          if (typeof headerValue === "string") {
            if (headerValue.includes("_DO")) {
              const assetName = headerValue.replace("_DO", "");
              if (!assetMap[assetName]) assetMap[assetName] = {};
              assetMap[assetName].doCol = colNumber;
            } else if (headerValue.includes("_Cost")) {
              const assetName = headerValue.replace("_Cost", "");
              if (!assetMap[assetName]) assetMap[assetName] = {};
              assetMap[assetName].costCol = colNumber;
            }
          }
        });
        const tempAssets: CustomAssetRow[] = [];
        customAssetsSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return;
          const yearCell = row.getCell(1).value;
          const year =
            typeof yearCell === "number" ? yearCell : Number(yearCell) || 0;
          const assetData: {
            [assetName: string]: { do: number; cost: number };
          } = {};
          for (const assetName of Object.keys(assetMap)) {
            const { doCol, costCol } = assetMap[assetName];
            const doVal = doCol ? row.getCell(doCol).value : 0;
            const costVal = costCol ? row.getCell(costCol).value : 0;
            const doNumber =
              typeof doVal === "number" ? doVal : Number(doVal) || 0;
            const costNumber =
              typeof costVal === "number" ? costVal : Number(costVal) || 0;
            assetData[assetName] = { do: doNumber, cost: costNumber };
          }
          tempAssets.push({ year, assets: assetData });
        });
        setCustomAssets(tempAssets);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    </div>
  );
};

export default ExcelFileUpload;
