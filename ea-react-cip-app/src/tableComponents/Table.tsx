// Table.tsx
import React, { useState, useEffect } from "react";
import { AssetTableSection } from "./assetTableComponents/assetTableSection";
import { CostTableSection } from "./costTableComponents/costTableSection";
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import parameter_json from '../data/headerInfo.json'
import CustomizedSwitches from '../components/switch'

export const Table: React.FC = () => {
  const [assetTableData, setAssetTableData] = useState([]);
  const [costTableData, setCostTableData] = useState([]);

  const [isSwitchOn, setIsSwitchOn] = useState(false);  // State for the switch

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    parseExcel(file);
  };

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const assetSheetName = workbook.SheetNames[0];
      const assetWorksheet = workbook.Sheets[assetSheetName];
      const assetJson = XLSX.utils.sheet_to_json(assetWorksheet);
      setAssetTableData(assetJson);

      const costSheetName = workbook.SheetNames[1];
      const costWorksheet = workbook.Sheets[costSheetName];
      const costJson = XLSX.utils.sheet_to_json(costWorksheet);
      setCostTableData(costJson);

      console.log(costJson)

    };
    reader.readAsBinaryString(file);
  };
  
  const handleSwitchChange = (event) => {
    setIsSwitchOn(event.target.checked);
  };

  const visualAssetKeys = parameter_json.visualInfo
  const hiddenAssetKeys = ['Gate Type', 'Scour'];

  const visualCostKeys = ["Weir Name", "Programme Cost"]
  const hiddenCostKeys = ["Cost Type"
                          ];


  // Group data by 'Weir Name'
  const groupedData = costTableData.reduce((acc, item) => {
    acc[item['Weir Name']] = acc[item['Weir Name']] || [];
    acc[item['Weir Name']].push(item);
    return acc;
  }, {});
  
  // Load state from local storage when component mounts
  useEffect(() => {
    const savedAssetTableData = localStorage.getItem('assetTableData');
    const savedCostTableData = localStorage.getItem('costTableData');

    if (savedAssetTableData) {
      setAssetTableData(JSON.parse(savedAssetTableData));
    }
    if (savedCostTableData) {
      setCostTableData(JSON.parse(savedCostTableData));
    }
  }, []);
  
  // Save state to local storage when it changes
  useEffect(() => {
    localStorage.setItem('assetTableData', JSON.stringify(assetTableData));
  }, [assetTableData]);

  useEffect(() => {
    localStorage.setItem('costTableData', JSON.stringify(costTableData));
  }, [costTableData]);

  const [dropdownSelections, setDropdownSelections] = useState({});

  // Function to update dropdown selections
  const handleDropdownChange = (index, value) => {
    setDropdownSelections(prev => ({ ...prev, [index]: value }));
  };

  // Pass this function and the selections down to AssetTableSection

  return (
    <>
      <CustomizedSwitches onChange={handleSwitchChange} checked={isSwitchOn} />
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

{isSwitchOn ? (
  <table className="asset_table table-striped table-bordered table-hover">
    <thead className="thead-dark">
      <tr>
        <th></th>
        <th>Weir Name</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(groupedData).map(([weirName, details], index) => (
        <CostTableSection
          weirName={weirName}
          costDetails={details}
          index={index}
          key={index}
        />
      ))}
    </tbody>
  </table>
) : (
        assetTableData.length > 0 && (
          <table className="asset_table table-striped table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th></th>
                <th>Weir</th>
                <th>Cat I Score</th>
                <th>Cat II Score</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {assetTableData.map((assetTableDetails, index) => {
            // Filter out visual details
                const visualDetails = visualAssetKeys.reduce((details, key) => {
                  if (Object.prototype.hasOwnProperty.call(assetTableDetails, key)) {
                    details[key] = assetTableDetails[key];
                  }
                  return details;
                }, {});

                // Filter out hidden details
                const hiddenDetails = hiddenAssetKeys.reduce((details, key) => {
                  if (Object.prototype.hasOwnProperty.call(assetTableDetails, key)) {
                    details[key] = assetTableDetails[key];
                  }
                  return details;
                }, {});

                return (
                  <AssetTableSection
                  visualDetails={visualDetails}
                  hiddenDetails={hiddenDetails}
                  index={index}
                  key={index}
                  dropdownSelections={dropdownSelections}
                  onDropdownChange={handleDropdownChange}
                />
                );
              })}
        </tbody>
        </table>
        )
      )}
    </>
  );
}