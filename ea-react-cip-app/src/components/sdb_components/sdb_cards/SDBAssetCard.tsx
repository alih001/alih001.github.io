// src/components/sdb_components/sdb_cards/SDBAssetCard.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { useData } from "../../../contexts/useDataContext";
import { useAssetSetting } from "../../../hooks/useAssetSetting";

interface AssetCardProps {
  assetName: string;
}

const CardContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: #ffffff;
`;

const Section = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Slider = styled.input`
  width: 100%;
`;

const ExpandButton = styled.button`
  margin-top: 1rem;
  background: none;
  border: none;
  color: #2e6ef7;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
`;

const DetailsContainer = styled.div`
  margin-top: 1rem;
  background-color: #f5faff;
  border-top: 1px solid #ccc;
  padding: 1rem;
  border-radius: 4px;
`;

const DetailsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;

  td {
    padding: 4px 8px;
    border-bottom: 1px solid #eee;
  }

  td:first-child {
    font-weight: bold;
    width: 60%;
  }
`;

const AssetCard: React.FC<AssetCardProps> = ({ assetName }) => {
  const { assetDetailsMap } = useData();
  const { currentSettings, updateDOPercentage, updateStartYear } =
    useAssetSetting(assetName);
  const [expanded, setExpanded] = useState(false);

  const details = assetDetailsMap[assetName];

  return (
    <CardContainer>
      <h3>{assetName}</h3>

      <Section>
        <Label>Deployable Output (%)</Label>
        <Slider
          type="range"
          min={0}
          max={100}
          step={1}
          value={currentSettings.doPercentage}
          onChange={(e) => updateDOPercentage(Number(e.target.value))}
        />
        <div>{currentSettings.doPercentage}%</div>
      </Section>

      <Section>
        <Label>Start Year</Label>
        <input
          type="number"
          value={currentSettings.startYear}
          onChange={(e) => updateStartYear(Number(e.target.value))}
        />
      </Section>

      <ExpandButton onClick={() => setExpanded(!expanded)}>
        {expanded ? "Hide Details" : "View Details"}
      </ExpandButton>

      {expanded && details && (
        <DetailsContainer>
          <p>
            <strong>Description:</strong> {details.description || "N/A"}
          </p>
          <p>
            <strong>WRZ Code:</strong> {details.wrzCode || "N/A"}
          </p>
          <DetailsTable>
            <tbody>
              <tr>
                <td>Process Loss Factor</td>
                <td>{details.processLoss ?? "N/A"}</td>
              </tr>
              <tr>
                <td>Outage Allowance Factor</td>
                <td>{details.outageAllowance ?? "N/A"}</td>
              </tr>
              <tr>
                <td>Abstraction Licence (Ml/d)</td>
                <td>{details.licenceMlPerDay ?? "N/A"}</td>
              </tr>
              <tr>
                <td>Leakage Estimate (Ml/d)</td>
                <td>{details.leakageMlPerDay ?? "N/A"}</td>
              </tr>
            </tbody>
          </DetailsTable>
        </DetailsContainer>
      )}
    </CardContainer>
  );
};

export default AssetCard;
