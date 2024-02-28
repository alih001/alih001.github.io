// Dashboard.tsx
import React, {useState, useEffect, useRef} from 'react';
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

  const [editNode, setEditNode] = useState({
    id: "",
    isEditing: false,
    tempName: "",
    });

  const editNodeRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editNodeRef.current && !editNodeRef.current.contains(event.target)) {
        setEditNode({ ...editNode, isEditing: false });
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Assuming editNodeRef doesn’t change, this effect only needs to mount and unmount.
  
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

  const handleNodeEdits = (node: CustomNode, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setEditNode({
      id: node.id,
      isEditing: true,
      tempName: node.name,
    });
  };

  const renderNodes = () => nodes.map(node => (
    <Draggable
      key={node.id}
      onStart={(e, data) => mode === 'move' ? handleDragStart(e, data) : undefined}
      onStop={(e, data) => mode === 'move' ? handleDragStop(node.id, e, data) : undefined}
      position={{ x: node.x, y: node.y }}
      disabled={mode !== 'move'}
    >
      <div 
        className="node" 
        onClick={() => handleNodeClick(node)}
        onContextMenu={(e) => handleNodeEdits(node, e)}
      >
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

  const renderDescription = () => (
    <div>
      This section will provide a brief overview 
      on what's possible in this dashboard
    </div>
  );

  const renderEditNodes = () => (
    <div onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        defaultValue={editNode.tempName}
        onBlur={(e) => updateNodeName(editNode.id, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateNodeName(editNode.id, e.target.value);
          }
        }}
        autoFocus
      />
      hehey oyyoyo
    </div>
  );
  
  const updateNodeName = (nodeId: string, newName: string) => {
    updateNodes(prevNodes => prevNodes.map(node =>
      node.id === nodeId ? { ...node, name: newName } : node
    ));
    setEditNode({ id: "", isEditing: true, tempName: "" });
  };
  
  const renderDynamicSection = () => {
    if (editNode.isEditing) {
      return renderEditNodes();
    }
    return renderDescription();
  };

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
      <div className='networkDescription' ref={editNodeRef}>
        {renderDynamicSection()}
      </div>
    </div>
  );
};

export default NetworkLinks;