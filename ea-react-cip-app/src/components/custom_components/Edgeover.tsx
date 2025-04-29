import React from "react";

interface EdgePopoverProps {
  anchorPosition: { x: number; y: number };
  currentStrength?: "low" | "medium" | "high";
  onChangeStrength: (strength: "low" | "medium" | "high") => void;
  onClose: () => void;
}

const EdgePopover: React.FC<EdgePopoverProps> = ({
  anchorPosition,
  currentStrength,
  onChangeStrength,
  onClose,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: anchorPosition.x,
        top: anchorPosition.y,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px",
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
      // Optionally, close the popover when the mouse leaves its area:
      onMouseLeave={onClose}
    >
      <div style={{ marginBottom: "4px", fontWeight: "bold" }}>
        Change Edge Strength:
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        {(["low", "medium", "high"] as const).map((level) => (
          <button
            key={level}
            onClick={() => {
              onChangeStrength(level);
              onClose();
            }}
            style={{
              padding: "4px 12px",
              backgroundColor:
                currentStrength === level ? "#007bff" : "#f0f0f0",
              color: currentStrength === level ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EdgePopover;
