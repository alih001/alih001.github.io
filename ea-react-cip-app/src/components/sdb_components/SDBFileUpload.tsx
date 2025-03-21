import React, { useState } from "react";
import ExcelJS from "exceljs";
import { DemandRow } from "../../types/public-types";
import FilterControls, { FilterCriteria } from "./FilterControls";
import DemandSupplyChart from "../../charts/SDBCharts/SupplyDemandChart";

const ExcelFileUpload: React.FC = () => {
  const [demandData, setDemandData] = useState<DemandRow[]>([]);
  const [supplyData, setSupplyData] = useState<any[]>([]);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    wrz: "",
    planningScenario: "",
    growthForecast: "",
  });

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

        // Get header row (assumed to be row 1) and determine year columns (from column G onward)
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

        // Process each demand row (starting from row 2)
        demandSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header

          const zone = row.getCell("B").value as string;
          const planningScenario = row.getCell("C").value as string;
          const growthForecast = row.getCell("D").value as string;

          const yearlyDemand: Record<string, number> = {};
          yearHeaders.forEach(({ col, year }) => {
            const cell = row.getCell(col);
            let value: number = 0;
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
        // Group rows by a combination of WRZ and scenario
        const groups: {
          [key: string]: {
            wrz: string;
            scenario: string;
            yearlySupply: Record<string, number>;
          };
        } = {};

        // Assuming first row is header
        sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header

          // Column A: Year, B: WRZ, C: Scenario, D: WAFU
          const yearCell = row.getCell("A").value;
          const wrzCell = row.getCell("B").value;
          const scenarioCell = row.getCell("C").value;
          const wafuCell = row.getCell("D").value;

          const yearStr =
            typeof yearCell === "number"
              ? yearCell.toString()
              : (yearCell as string);
          const wrz = typeof wrzCell === "string" ? wrzCell : "";
          const scenario = typeof scenarioCell === "string" ? scenarioCell : "";
          const wafu =
            typeof wafuCell === "number" ? wafuCell : Number(wafuCell);

          const key = `${wrz}_${scenario}`;
          if (!groups[key]) {
            groups[key] = {
              wrz,
              scenario,
              yearlySupply: {},
            };
          }
          groups[key].yearlySupply[yearStr] = wafu;
        });

        const groupedSupplyData = Object.values(groups);
        setSupplyData(groupedSupplyData);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Create filter options based on loaded demand data
  const zones = Array.from(new Set(demandData.map((d) => d.zone)));
  const planningScenarios = Array.from(
    new Set(demandData.map((d) => d.planningScenario))
  );
  const growthForecasts = Array.from(
    new Set(demandData.map((d) => d.growthForecast))
  );

  // Filter demand data based on selected options
  const filteredDemandData = demandData.filter((d) => {
    return (
      (!filterCriteria.wrz || d.zone === filterCriteria.wrz) &&
      (!filterCriteria.planningScenario ||
        d.planningScenario === filterCriteria.planningScenario) &&
      (!filterCriteria.growthForecast ||
        d.growthForecast === filterCriteria.growthForecast)
    );
  });

  // For supply, filter by WRZ and Planning Scenario (supply is grouped)
  const filteredSupplyData = supplyData.filter((s: any) => {
    return (
      (!filterCriteria.wrz || s.wrz === filterCriteria.wrz) &&
      (!filterCriteria.planningScenario ||
        s.scenario === filterCriteria.planningScenario)
    );
  });

  // Pick the first matching entry for charting
  const demandForChart = filteredDemandData[0] || null;
  const supplyForChart = filteredSupplyData[0] || null;

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
        />
      </div>
      <div>
        <h3>Filtered Demand Data Preview</h3>
        <pre>{JSON.stringify(filteredDemandData, null, 2)}</pre>
      </div>
      <div>
        <h3>Filtered Supply Data Preview</h3>
        <pre>{JSON.stringify(filteredSupplyData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ExcelFileUpload;
