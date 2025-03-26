// DataImportButton.tsx
import React from "react";
import styled from "styled-components";
import { FaUpload } from "react-icons/fa";
import ExcelJS from "exceljs";
import { useData } from "../../contexts/useDataContext";

const HiddenInput = styled.input`
  display: none;
`;

const StyledButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  background-color: #007bff;
  color: #fff;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  gap: 0.5rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const DataImportButton: React.FC = () => {
  const {
    setDemandData,
    setSupplyData,
    setCustomAssets,
    setWRZList,
    setActiveWRZ,
    setWRZData,
    setAssetToWRZMap,
    setAssetDetailsMap,
    setWRZSummary,
  } = useData();

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
        const tempDemand = [];
        const headerRow = demandSheet.getRow(1);
        const yearHeaders = [];
        headerRow.eachCell((cell, colNumber) => {
          if (colNumber >= 7) {
            let headerValue = "";
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
          const yearlyDemand = {};
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

        const zones = Array.from(new Set(tempDemand.map((row) => row.zone)));
        setWRZList(zones);
        setActiveWRZ(zones[0]);

        const initialWRZData = {};
        zones.forEach((zone) => {
          initialWRZData[zone] = {
            selectedAssets: new Set(),
            assetSettings: {},
            scenarios: [],
          };
        });
        setWRZData(initialWRZData);

        setDemandData(tempDemand);
      }

      // --- Process Supply Sheet ---
      const sheet = workbook.getWorksheet("Supply");
      if (sheet) {
        const groups = {};

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

      // --- Process WRZ Summary sheet ---
      const wrzSummarySheet = workbook.getWorksheet("WRZSummary");
      if (wrzSummarySheet) {
        // We'll create a map: wrzSummaryMap[wrzName] = {
        //   leakage, waterTakenLegal, waterTakenIllegal
        // }
        const tempMap: Record<
          string,
          { leakage: number; legalUnbilled: number; illegalUnbilled: number }
        > = {};

        wrzSummarySheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return; // skip header row
          const wrzName = row.getCell(1).value?.toString() || "";
          const leakage = Number(row.getCell(2).value) || 0;
          const waterTakenLegal = Number(row.getCell(3).value) || 0;
          const waterTakenIllegal = Number(row.getCell(4).value) || 0;

          tempMap[wrzName] = {
            leakage,
            legalUnbilled: waterTakenLegal,
            illegalUnbilled: waterTakenIllegal,
          };
        });

        // store in context
        setWRZSummary(tempMap);
      }

      // --- Process Asset Mapping Sheet ---
      const mappingSheet = workbook.getWorksheet("AssetMapping");
      if (mappingSheet) {
        const map = {};

        mappingSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return; // skip header

          const wrz = row.getCell(1).value?.toString().trim() || "";
          const asset = row.getCell(2).value?.toString().trim() || "";

          if (wrz && asset) {
            if (!map[wrz]) map[wrz] = [];
            map[wrz].push(asset);
          }
        });

        setAssetToWRZMap(map);
      }

      // --- Process Asset Details Sheet ---
      const detailsSheet = workbook.getWorksheet("AssetDetails");
      if (detailsSheet) {
        const map = {};

        detailsSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return; // skip header
          const assetName = row.getCell(1).value?.toString().trim() || "";
          if (!assetName) return;

          map[assetName] = {
            description: row.getCell(2).value?.toString() || "",
            wrzCode: row.getCell(3).value?.toString() || "",
            processLoss: Number(row.getCell(4).value) || undefined,
            outageAllowance: Number(row.getCell(5).value) || undefined,
            licenceMlPerDay: Number(row.getCell(6).value) || undefined,
            leakageMlPerDay: Number(row.getCell(7).value) || undefined,
          };
        });
        setAssetDetailsMap(map);
      }

      // --- Process CustomAssets Sheet ---
      const customAssetsSheet = workbook.getWorksheet("CustomAssets");
      if (customAssetsSheet) {
        const assetMap = {};
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
        const tempAssets = [];
        customAssetsSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return;
          const yearCell = row.getCell(1).value;
          const year =
            typeof yearCell === "number" ? yearCell : Number(yearCell) || 0;
          const assetData = {};
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
    <>
      <HiddenInput
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        id="data-import"
      />
      <StyledButton htmlFor="data-import">
        <FaUpload />
        Data Import
      </StyledButton>
    </>
  );
};

export default DataImportButton;
