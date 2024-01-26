import React, { useState } from 'react';
import NetworkLinks from '../components/NetworkLinks';
import { useData } from '../contexts/DataContext';

const SystemsThinking = () => {

    const { nodes, setNodes } = useData();

    const handleAddNode = (x: number, y: number) => {
        setNodes(prevNodes => [
          ...prevNodes, 
          { id: `node-${prevNodes.length + 1}`, name: `Node ${prevNodes.length + 1}`, x, y }
        ]);
      };
      
    return (
	<div>
		<h1>Dashboard</h1>
        <NetworkLinks
            nodes={nodes}
            onAddNode={handleAddNode}
            updateNodes={setNodes}
        />
	</div>
);
}

export default SystemsThinking;