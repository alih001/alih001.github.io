import React, { useState } from 'react';
import Dashboard from '../state_testing/Dashboard';

type Node = {
    id: string;
    name: string;
    x: number;
    y: number;
  };

const NetworkDashboard = () => {

    const [nodes, setNodes] = useState<Node[]>([]);

    const handleAddNode = (x: number, y: number) => {
        setNodes(prevNodes => [
          ...prevNodes, 
          { id: `node-${prevNodes.length + 1}`, name: `Node ${prevNodes.length + 1}`, x, y }
        ]);
      };
      
    return (
	<div>
		<h1>Dashboard</h1>
        <Dashboard
        nodes={nodes}
        onAddNode={handleAddNode}
        // onClose={() => setIsDashboardOpen(false)}
        updateNodes={setNodes}
      />
	</div>
);
}

export default NetworkDashboard;