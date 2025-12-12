
import React, { useRef, useState } from 'react';
import { CanvasNode } from '../types';
import { Database as DbIcon, Shield, Lock, Server, Cloud, Router, Box, Hexagon, Triangle, Circle, Disc, Diamond } from 'lucide-react';
import { SimulationState } from '../App';

interface ArchitectureDiagramProps {
  nodes: CanvasNode[];
  onMoveNode: (id: string, x: number, y: number) => void;
  onConnect: (sourceId: string, targetId: string) => void;
  onDeleteNode: (id: string) => void;
  simulationState?: SimulationState;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ 
  nodes, 
  onMoveNode, 
  onConnect,
  onDeleteNode,
  simulationState 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [dragState, setDragState] = useState<{ id: string, startX: number, startY: number, initialNodeX: number, initialNodeY: number } | null>(null);
  const [drawLineState, setDrawLineState] = useState<{ sourceId: string, currentX: number, currentY: number } | null>(null);

  // --- Helpers for Rendering ---
  const getNodeColor = (node: CanvasNode) => {
    if (node.id === 'internet') return '#00f0ff';
    if (simulationState?.damageTaken && node.name === 'Database') return '#ff003c'; // Core damaged
    
    // Check if this node blocked an attack
    const isBlocker = simulationState?.blockedDefenses.some(name => 
       node.name.toLowerCase().includes(name.toLowerCase()) || 
       name.toLowerCase().includes(node.id)
    );

    if (isBlocker) return '#00ff41'; // Green success
    return '#e5e7eb'; // Default white/gray
  };

  const getNodeIcon = (shape: string, color: string) => {
    const props = { className: "w-6 h-6", color };
    switch (shape) {
      case 'cloud': return <Cloud {...props} />;
      case 'server': return <Server {...props} />;
      case 'cylinder': return <DbIcon {...props} />;
      case 'hexagon': return <Hexagon {...props} />;
      case 'shield': return <Lock {...props} />;
      case 'router': return <Router {...props} />;
      case 'pyramid': return <Triangle {...props} />;
      case 'sphere': return <Circle {...props} />;
      case 'diamond': return <Diamond {...props} />;
      case 'disc': return <Disc {...props} />;
      case 'box': default: return <Box {...props} />;
    }
  };

  // --- Orthogonal Path Logic ---
  const getOrthogonalPath = (x1: number, y1: number, x2: number, y2: number) => {
    // Calculate a midpoint for the "step"
    const midX = (x1 + x2) / 2;
    // Path: Start -> Horizontal to Mid -> Vertical to Y2 -> Horizontal to End
    return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
  };

  // --- Event Handlers ---

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (e.shiftKey) {
      // Start drawing a line
      setDrawLineState({ 
        sourceId: nodeId, 
        currentX: x, 
        currentY: y 
      });
    } else if (e.altKey) {
       onDeleteNode(nodeId);
    } else {
      // Start dragging node
      const node = nodes.find(n => n.instanceId === nodeId);
      if (node) {
        setDragState({ 
            id: nodeId, 
            startX: e.clientX, 
            startY: e.clientY,
            initialNodeX: node.position.x,
            initialNodeY: node.position.y
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (dragState) {
      // Calculate delta
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      onMoveNode(dragState.id, dragState.initialNodeX + dx, dragState.initialNodeY + dy);
    } 
    
    if (drawLineState) {
      // Drawing a line
      setDrawLineState(prev => prev ? { ...prev, currentX: x, currentY: y } : null);
    }
  };

  const handleMouseUp = (e: React.MouseEvent, targetNodeId?: string) => {
    // If we are drawing a line and released over a target node
    if (drawLineState && targetNodeId && drawLineState.sourceId !== targetNodeId) {
      e.stopPropagation(); // Prevent bubbling
      onConnect(drawLineState.sourceId, targetNodeId);
    }
    setDragState(null);
    setDrawLineState(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-gray-950 rounded-xl border border-gray-800 relative overflow-hidden shadow-2xl"
      onMouseMove={handleMouseMove}
      onMouseUp={(e) => handleMouseUp(e)}
      onDragOver={handleDragOver}
    >
      {/* Instructions Overlay */}
      <div className="absolute top-2 left-2 z-10 pointer-events-none">
        <div className="bg-black/80 p-2 rounded border border-gray-800 text-[10px] text-gray-500 font-mono backdrop-blur-sm">
          <p className="flex items-center gap-2"><span className="text-cyber-blue">●</span> DRAG items from sidebar</p>
          <p className="flex items-center gap-2"><span className="text-cyber-yellow">●</span> SHIFT + DRAG to connect</p>
          <p className="flex items-center gap-2"><span className="text-cyber-red">●</span> ALT + CLICK to delete</p>
        </div>
      </div>

      <svg 
        ref={svgRef}
        width="100%" 
        height="100%" 
        className="absolute inset-0 cursor-crosshair"
      >
        <defs>
          <marker id="arrowhead-default" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
          </marker>
          <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#00f0ff" />
          </marker>
          <marker id="arrowhead-danger" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ff003c" />
          </marker>
        </defs>

        {/* Existing Connections */}
        {nodes.map(node => 
          node.connections.map(targetId => {
            const target = nodes.find(n => n.instanceId === targetId);
            if (!target) return null;
            
            const isBreachPath = simulationState?.damageTaken && node.name !== 'Internet'; // Simple visual logic
            const color = isBreachPath ? '#ef4444' : '#4b5563';
            const markerId = isBreachPath ? 'url(#arrowhead-danger)' : 'url(#arrowhead-default)';
            const pathData = getOrthogonalPath(node.position.x, node.position.y, target.position.x, target.position.y);

            return (
              <g key={`${node.instanceId}-${targetId}`}>
                <path 
                  d={pathData}
                  stroke={color} 
                  strokeWidth="2" 
                  fill="none"
                  markerEnd={markerId}
                  className="transition-all duration-300"
                />
                {/* Data Flow Animation */}
                <circle r="2" fill={isBreachPath ? '#ff003c' : '#00f0ff'}>
                   <animateMotion 
                     dur="2s"
                     repeatCount="indefinite"
                     path={pathData}
                     keyPoints="0;1"
                     keyTimes="0;1"
                     calcMode="linear"
                   />
                </circle>
              </g>
            );
          })
        )}

        {/* Active Drawing Line */}
        {drawLineState && (() => {
           const source = nodes.find(n => n.instanceId === drawLineState.sourceId);
           if (!source) return null;
           const pathData = getOrthogonalPath(source.position.x, source.position.y, drawLineState.currentX, drawLineState.currentY);
           
           return (
             <path 
               d={pathData} 
               stroke="#00f0ff" 
               strokeWidth="2" 
               strokeDasharray="5,5" 
               fill="none"
               className="animate-pulse opacity-70"
               markerEnd="url(#arrowhead-active)"
             />
           );
        })()}

        {/* Nodes */}
        {nodes.map((node) => {
          const color = getNodeColor(node);
          const isDragging = dragState?.id === node.instanceId;
          const isSource = drawLineState?.sourceId === node.instanceId;

          return (
            <g 
              key={node.instanceId} 
              transform={`translate(${node.position.x}, ${node.position.y})`}
              onMouseDown={(e) => handleMouseDown(e, node.instanceId)}
              onMouseUp={(e) => handleMouseUp(e, node.instanceId)}
              className="cursor-move group"
              style={{ pointerEvents: 'all' }}
            >
              {/* Glow Effect on Hover/Drag */}
              <circle 
                r={isDragging || isSource ? 30 : 24} 
                fill={color} 
                className="opacity-0 group-hover:opacity-20 transition-all duration-300"
                filter="blur(8px)"
              />

              {/* Node Background */}
              <circle 
                r="24" 
                fill="#0a0a0a" 
                stroke={isSource ? '#00f0ff' : color} 
                strokeWidth={isDragging || isSource ? 3 : 1.5} 
                className="transition-all duration-200"
              />
              
              {/* Icon Container */}
              <foreignObject x="-12" y="-12" width="24" height="24" className="pointer-events-none">
                <div className="flex items-center justify-center w-full h-full text-white">
                   {getNodeIcon(node.shape, isSource ? '#00f0ff' : color)}
                </div>
              </foreignObject>

              {/* Label */}
              <text 
                y="38" 
                textAnchor="middle" 
                fill={isSource ? '#00f0ff' : "#6b7280"} 
                fontSize="10" 
                fontFamily="monospace" 
                fontWeight="bold"
                className="pointer-events-none select-none uppercase tracking-wider group-hover:fill-white transition-colors"
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
