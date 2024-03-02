import React from 'react';

function NodeSidebar () {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag additional nodes to the pane on the left.</div>
      <div className="customNodeBody" onDragStart={(event) => onDragStart(event, 'custom')} draggable>
        Drag Node
      </div>
    </aside>
  );
};

export default NodeSidebar