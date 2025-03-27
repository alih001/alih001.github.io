import React from "react";
import styled from "styled-components";
import { handleExportToExcel } from "../../utils/exportUtils";
import { useData } from "../../contexts/useDataContext";
import { useChartData } from "../../hooks/useChartData";

const ExportButtonStyled = styled.button`
  background: #007bff;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s ease;

  &:hover {
    background: #0056b3;
  }
`;

const ExportButton: React.FC = () => {
  const { wrzList, wrzData, assetDetailsMap, filterCriteria, customAssets } =
    useData();

  const { demandForChart, supplyForChart } = useChartData();

  const handleClick = () => {
    handleExportToExcel({
      wrzList,
      wrzData,
      assetDetailsMap,
      filterCriteria,
      demandForChart,
      supplyForChart,
      customAssets,
    });
  };

  return (
    <ExportButtonStyled onClick={handleClick}>
      Export Scenario to Excel
    </ExportButtonStyled>
  );
};

export default ExportButton;
