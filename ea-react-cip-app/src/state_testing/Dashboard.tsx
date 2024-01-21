// Dashboard.tsx
import React, { useState } from 'react';
import './tableStyles.css';
import Sidebar from './Sidebar';
import { MapInteractionCSS } from 'react-map-interaction'

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
};

const Dashboard: React.FC<DashboardProps> = ({ nodes, onAddNode, onClose }) => {
  const [activeOption, setActiveOption] = useState('nodes');
  const [mapState, setMapState] = useState({ scale: 1, translation: { x: 0, y: 0 } });
  
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeOption === 'nodes') {
      const rect = e.currentTarget.getBoundingClientRect();
      const nodeSize = 100; // Assuming the node is a 100x100 square
      const halfNodeSize = nodeSize / 2;
  
      // Adjusting the click position so that the node's center aligns with the cursor
      const x = (e.clientX - rect.left - mapState.translation.x) / mapState.scale - halfNodeSize;
      const y = (e.clientY - rect.top - mapState.translation.y) / mapState.scale - halfNodeSize;
  
      onAddNode(x, y);
    }
  };
  
  

  return (
    <div className="dashboard">
      <Sidebar activeOption={activeOption} setActiveOption={setActiveOption} onClose={onClose} />
      <div className="content" onClick={handleContentClick}>
        <MapInteractionCSS
          value={mapState}
          onChange={(value) => setMapState(value)}
          minScale={0.5}
          maxScale={5}
        >

          {activeOption === 'nodes' && nodes.map(node => (
            <div key={node.id} className="node" style={{ left: node.x, top: node.y }}>
              {node.name}
            </div>
          ))}

          {activeOption === 'text' && <p style={{ transform: `scale(${mapState.scale})` }}>Option 2</p>}

        </MapInteractionCSS>
      </div>
    </div>
  );
};


export default Dashboard;
