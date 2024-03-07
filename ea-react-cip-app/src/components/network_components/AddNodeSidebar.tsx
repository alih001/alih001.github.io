import React, { DragEvent } from 'react';


const NodeSidebar: React.FC = () => {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">
        Use this panel to drag nodes into the left panel to create custom maps.
      </div>
      <div 
        className="customNodeBody" 
        onDragStart={(event) => onDragStart(event, 'custom')} 
        draggable
        style={{
          backgroundColor: 'red',
        }}
      >
        Drag Node
      </div>
    </aside>
  );
};

export default NodeSidebar;
