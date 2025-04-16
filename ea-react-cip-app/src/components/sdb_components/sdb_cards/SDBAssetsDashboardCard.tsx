// src/components/sdb_components/sdb_cards/AssetDisplayCard.tsx
import React, { useState } from "react";
import styled from "styled-components";

// Define the type for the asset details
interface AssetData {
  description?: string;
  wrzCode?: string;
  outageAllowance?: number;
  licenceMlPerDay?: number;
  leakageMlPerDay?: number;
  processLoss?: number;
}

interface AssetDisplayCardProps {
  assetName: string;
  assetData: AssetData;
}

const CardContainer = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
`;

const CardHeader = styled.h3`
  margin: 0;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: #2e6ef7;
  cursor: pointer;
  font-size: 0.9rem;
  align-self: flex-start;
`;

const DetailsContainer = styled.div`
  background-color: #f5faff;
  border-top: 1px solid #ccc;
  padding: 1rem;
  border-radius: 4px;
`;

const DescriptionText = styled.p`
  font-size: 0.85rem;
  color: #333;
  margin: 0.5rem 0;
  padding: 0.5rem;
`;

const DetailsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
  font-size: 0.85rem;

  td,
  th {
    border: 1px solid #000;
    padding: 0.5rem;
    vertical-align: top;
  }

  td:first-child {
    font-weight: 600;
    width: 35%;
  }
`;

const AssetDisplayCard: React.FC<AssetDisplayCardProps> = ({
  assetName,
  assetData,
}) => {
  // Optional expand functionality so users can toggle details
  const [expanded, setExpanded] = useState(false);

  return (
    <CardContainer>
      <CardHeader title={assetName}>{assetName}</CardHeader>
      <ExpandButton onClick={() => setExpanded((prev) => !prev)}>
        {expanded ? "Hide Details" : "View Details"}
      </ExpandButton>
      {expanded && (
        <DetailsContainer>
          <DescriptionText>
            <strong>Description:</strong>{" "}
            {assetData.description ? assetData.description : "N/A"}
          </DescriptionText>
          <DetailsTable>
            <tbody>
              <tr>
                <td>WRZ Code</td>
                <td>{assetData.wrzCode || "N/A"}</td>
              </tr>
              <tr>
                <td>Process Loss Factor</td>
                <td>
                  {typeof assetData.processLoss !== "undefined"
                    ? assetData.processLoss
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Outage Allowance Factor</td>
                <td>
                  {typeof assetData.outageAllowance !== "undefined"
                    ? assetData.outageAllowance
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Abstraction Licence (Ml/d)</td>
                <td>
                  {typeof assetData.licenceMlPerDay !== "undefined"
                    ? assetData.licenceMlPerDay
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Leakage Estimate (Ml/d)</td>
                <td>
                  {typeof assetData.leakageMlPerDay !== "undefined"
                    ? assetData.leakageMlPerDay
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </DetailsTable>
        </DetailsContainer>
      )}
    </CardContainer>
  );
};

export default AssetDisplayCard;
