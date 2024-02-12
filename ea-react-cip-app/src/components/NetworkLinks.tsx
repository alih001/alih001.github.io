// Dashboard.tsx
import React from 'react';
import '../styles/networkLinks.css';
import { MapInteractionCSS } from 'react-map-interaction'
import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable'
import Arrow from './Arrow'
import { useData } from '../contexts/useDataContext';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { CustomNode, DashboardProps, mapStateValue} from '../types/public-types'

const NetworkLinks: React.FC<DashboardProps> = ({ nodes, onAddNode, updateNodes }) => {

  const { mapState, setMapState } = useData();
  const { mode, setMode } = useData();
  const { arrows, setArrows } = useData();
  const { tempStart, setTempStart } = useData();

  const handleDragStart: DraggableEventHandler = (e, _data) => {
    if (mode === 'pan') {
      e.stopPropagation();
    }
  };

  const handleNodeClick = (node: CustomNode) => {
    if (!tempStart) {
      setTempStart(String(node.id));
    } else {
      setArrows([...arrows, { startId: tempStart, endId: node.id }]);
      setTempStart(null);
    }
  };
  
  const findNodeById = (id: string) => nodes.find(node => node.id === id);


  const renderNodes = () => nodes.map(node => (
    <Draggable
      key={node.id}
      onStart={(e, data) => mode === 'move' ? handleDragStart(e, data) : undefined}
      onStop={(e, data) => mode === 'move' ? handleDragStop(node.id, e, data) : undefined}
      position={{ x: node.x, y: node.y }}
      disabled={mode !== 'move'}
    >
      <div className="node" onClick={() => handleNodeClick(node)}>
        {node.name}
      </div>
    </Draggable>
  ));

  const renderArrow = () => arrows.map((arrow, index) => {
    const startNode = findNodeById(arrow.startId);
    const endNode = findNodeById(arrow.endId);
    if (startNode && endNode) {
      return (
        <Arrow 
          key={index} 
          startPoint={{ x: startNode.x, y: startNode.y }} 
          endPoint={{ x: endNode.x, y: endNode.y }} 
        />
      );
    }
    return null;
  });
  
  const renderContent = () => (
    <>

      <MapInteractionCSS
        value={mapState}
        onChange={(value: mapStateValue) => setMapState(value)}
        minScale={mode === 'pan' ? 0.5 : 1}
        maxScale={mode === 'pan' ? 5 : 1}
        disablePan={mode !== 'pan'}
        disableZoom={mode !== 'pan'}
      >
        {renderNodes()}
      </MapInteractionCSS>
    </>
  );

  const handleContentDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode === 'edit') {
      const rect = e.currentTarget.getBoundingClientRect();
      const nodeSize = 100;
      const halfNodeSize = nodeSize / 2;


      console.log(mapState)
      // Adjusting the click position so that the node's center aligns with the cursor
      const x = (e.clientX - rect.left - mapState.translation.x) / mapState.scale - halfNodeSize;
      const y = (e.clientY - rect.top - mapState.translation.y) / mapState.scale - halfNodeSize;

      onAddNode(x, y);
    }
  };

  const handleDragStop = (nodeId: string, _e: DraggableEvent, data: DraggableData) => {
    updateNodes(prevNodes => prevNodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, x: data.x, y: data.y };
      }
      return node;
    }));
  };

  const getMenuItemClass = (menuMode: string) => {
    return mode === menuMode ? 'activeLink' : 'normalLink';
  };
  

  return (
    <div className="network-dashboard">
    <Sidebar style={{ height: "100vh" }}>
        <Menu>
          <MenuItem 
            onClick={() => setMode('edit')}
            className={getMenuItemClass('edit')}
          >
            <span>Draw</span>
          </MenuItem>
          <MenuItem 
            onClick={() => setMode('move')}
            className={getMenuItemClass('move')}
          >
            <span>Move</span>
          </MenuItem>
          <MenuItem 
            onClick={() => setMode('pan')}
            className={getMenuItemClass('pan')}
          >
            <span>Pan</span>
          </MenuItem>
        </Menu>
      </Sidebar>
      <div className="content" onDoubleClick={handleContentDoubleClick}>
        {renderArrow()}
        {renderContent()}
      </div>
    </div>
  );
};

export default NetworkLinks;