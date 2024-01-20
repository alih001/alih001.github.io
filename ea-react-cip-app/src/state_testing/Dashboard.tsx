// Dashboard.tsx
import React, { useState } from 'react';
import './tableStyles.css';
import Sidebar from './Sidebar';

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

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeOption === 'nodes') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onAddNode(x, y);
    }
  };

  return (
    <div className="dashboard">
        <Sidebar activeOption={activeOption} setActiveOption={setActiveOption} onClose={onClose} />
        {/* ... other sidebar content ... */}
      <div className="content" onClick={handleContentClick}>
        {activeOption === 'text' && <p>Option 2</p>}
        {activeOption === 'nodes' && nodes.map(node => (
          <div key={node.id} className="node" style={{ left: node.x, top: node.y }}>
            {node.name}
          </div>
        ))}
      </div>
      {/* <button className="close-dashboard" onClick={onClose}>Close Dashboard</button> */}
    </div>
  );
};

export default Dashboard;
