import React, { DragEvent } from "react";
import styled from "styled-components";

const SidebarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 1rem;
`;

const TextWrapper = styled.div`
  margin-bottom: 1rem;
`;

const NodeSidebar: React.FC = () => {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <SidebarWrapper>
        <TextWrapper className="description">
          Use this panel to drag nodes into the left panel to create custom
          maps.
        </TextWrapper>
        <div
          className="customNodeBody"
          onDragStart={(event) => onDragStart(event, "custom")}
          draggable
          style={{
            backgroundColor: "red",
          }}
        >
          Drag Node
        </div>
      </SidebarWrapper>
    </aside>
  );
};

export default NodeSidebar;
