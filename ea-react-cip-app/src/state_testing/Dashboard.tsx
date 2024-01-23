// Dashboard.tsx
import React, { useState } from 'react';
import './tableStyles.css';
import Sidebar from './Sidebar';
import { MapInteractionCSS } from 'react-map-interaction'
import Draggable from 'react-draggable'

type Node = {
  id: string;
  name: string;
  x: number;
  y: number;
};

type DashboardProps = {
  nodes: Node[];
  onAddNode: (x: number, y: number) => void;
  onClose: () => void;
  updateNodes: (nodes: Node[]) => void;};


const Dashboard: React.FC<DashboardProps> = ({ nodes, onAddNode, onClose, updateNodes }) => {
  const [activeOption, setActiveOption] = useState('nodes');
  const [mapState, setMapState] = useState({ scale: 1, translation: { x: 0, y: 0 } });
  const [mode, setMode] = useState('edit');

  const handleDragStart = (e) => {
    if (mode === 'pan') {
      e.stopPropagation();
    }
  };

  const renderNodes = () => nodes.map(node => (
    <Draggable
      key={node.id}
      onStart={handleDragStart}
      onStop={(e, data) => handleDragStop(node.id, e, data)}
      position={{ x: node.x, y: node.y }}
    >
      <div className="node">
        {node.name}
      </div>
    </Draggable>
  ));

  const renderContent = () => {
    return (
      <>
      <button onClick={() => setMode('edit')}>Edit Mode</button>
      <button onClick={() => setMode('pan')}>Pan Mode</button>
      <MapInteractionCSS
        value={mapState}
        onChange={(value) => setMapState(value)}
        minScale={mode === 'pan' ? 0.5 : 1}
        maxScale={mode === 'pan' ? 5 : 1}
        disablePan={mode !== 'pan'}
        disableZoom={mode !== 'pan'}
      >
        {renderNodes()}
      </MapInteractionCSS>
      </>
    );
  };

  const handleContentDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeOption === 'nodes' && mode === 'edit') {
      const rect = e.currentTarget.getBoundingClientRect();
      const nodeSize = 100;
      const halfNodeSize = nodeSize / 2;


      // Adjusting the click position so that the node's center aligns with the cursor
      const x = (e.clientX - rect.left - mapState.translation.x) / mapState.scale - halfNodeSize;
      const y = (e.clientY - rect.top - mapState.translation.y) / mapState.scale - halfNodeSize;

      onAddNode(x, y);
    }
  };

  const handleDragStop = (nodeId, e, data) => {
    updateNodes(prevNodes => prevNodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, x: data.x, y: data.y };
      }
      return node;
    }));
  };
  
  return (
    <div className="dashboard">
      <Sidebar activeOption={activeOption} setActiveOption={setActiveOption} onClose={onClose} />
      <div className="content" onDoubleClick={handleContentDoubleClick}>

        {activeOption === 'nodes' && renderContent()}
        {activeOption === 'text' && <p>Option 2</p>}
      </div>
    </div>
  );
};

export default Dashboard;