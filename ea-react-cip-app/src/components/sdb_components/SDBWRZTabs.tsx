import React from "react";
import { useData } from "../../contexts/useDataContext";

const WRZTabs: React.FC = () => {
  const { wrzList, activeWRZ, setActiveWRZ } = useData();

  if (wrzList.length <= 1) return null;

  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
      {wrzList.map((wrz) => (
        <button
          key={wrz}
          onClick={() => setActiveWRZ(wrz)}
          style={{
            padding: "6px 12px",
            borderRadius: "4px",
            background: wrz === activeWRZ ? "#2e6ef7" : "#e0e0e0",
            color: wrz === activeWRZ ? "#fff" : "#000",
            border: "none",
            cursor: "pointer",
          }}
        >
          {wrz}
        </button>
      ))}
    </div>
  );
};

export default WRZTabs;
