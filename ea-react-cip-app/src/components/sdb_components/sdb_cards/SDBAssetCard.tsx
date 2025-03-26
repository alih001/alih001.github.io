import React, { useState } from "react";
import styled from "styled-components";
import { useData } from "../../../contexts/useDataContext";
import { useAssetSetting } from "../../../hooks/useAssetSetting";

interface AssetCardProps {
  assetName: string;
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

const CardHeader = styled.h3<{ expanded?: boolean }>`
  margin: 0;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: #333;
  white-space: ${({ expanded }) => (expanded ? "normal" : "nowrap")};
  overflow: ${({ expanded }) => (expanded ? "visible" : "hidden")};
  text-overflow: ${({ expanded }) => (expanded ? "clip" : "ellipsis")};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: #555;
`;

const Slider = styled.input`
  width: 100%;
  cursor: pointer;
`;

const NumberInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
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
  border: 0px solid #000;
  border-radius: 4px;
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

const AssetCard: React.FC<AssetCardProps> = ({ assetName }) => {
  const { assetDetailsMap } = useData();
  const { currentSettings, updateDOPercentage, updateStartYear } =
    useAssetSetting(assetName);
  const [expanded, setExpanded] = useState(false);
  const details = assetDetailsMap[assetName];

  return (
    <CardContainer>
      <CardHeader expanded={expanded} title={assetName}>
        {assetName}
      </CardHeader>
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
        <NumberInput
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
          <DescriptionText>
            <strong>Description:</strong> {details.description || "N/A"}
          </DescriptionText>
          <DetailsTable>
            <tbody>
              <tr>
                <td>WRZ Code</td>
                <td>{details.wrzCode || "N/A"}</td>
              </tr>
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
