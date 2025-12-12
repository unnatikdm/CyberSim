
import React from 'react';
import { Defense } from '../types';
import { Shield, Lock, Database, Server, Cloud, Router, Box, Hexagon, Triangle, Circle, Disc, Diamond, Zap } from 'lucide-react';

interface DefenseCardProps {
  defense: Defense;
  canAfford: boolean;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const getIcon = (shape: string) => {
  const props = { className: "w-5 h-5" };
  switch (shape) {
    case 'cloud': return <Cloud {...props} />;
    case 'server': return <Server {...props} />;
    case 'cylinder': return <Database {...props} />;
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

export const DefenseCard: React.FC<DefenseCardProps> = ({ defense, canAfford, isSelected, onClick }) => {
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('defenseId', defense.id);
    e.dataTransfer.effectAllowed = 'copy';
    onClick(defense.id);
  };

  return (
    <div
      onClick={() => onClick(defense.id)}
      draggable
      onDragStart={handleDragStart}
      className={`
        group relative flex flex-col p-3 rounded-lg border transition-all duration-200 
        cursor-grab active:cursor-grabbing w-full overflow-visible
        ${isSelected 
            ? 'bg-cyber-blue/10 border-cyber-blue shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
            : 'bg-gray-900/50 border-gray-800 hover:bg-gray-800 hover:border-gray-600'
        }
        ${!canAfford ? 'opacity-50 grayscale' : ''}
      `}
    >
      {/* Selection Marker */}
      {isSelected && (
          <div className="absolute -left-[1px] top-0 bottom-0 w-1 bg-cyber-blue rounded-l shadow-[0_0_10px_#00f0ff]"></div>
      )}

      {/* Main Content */}
      <div className="flex justify-between items-center w-full mb-1 relative z-10">
        <div className={`transition-colors ${isSelected ? 'text-cyber-blue' : 'text-gray-400 group-hover:text-white'}`}>
          {getIcon(defense.shape)}
        </div>
        <span className={`font-mono font-bold ${canAfford ? 'text-cyber-green' : 'text-red-500'}`}>
          ${defense.cost}
        </span>
      </div>
      
      <h3 className={`font-bold text-sm mb-1 relative z-10 ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
        {defense.name}
      </h3>
      
      <p className="text-[10px] text-gray-500 mb-2 leading-tight relative z-10">
        {defense.description}
      </p>

      {/* Basic Tags (Always Visible) */}
      <div className="flex flex-wrap gap-1 relative z-10">
        {defense.blocks.slice(0, 3).map(b => (
          <span key={b} className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-gray-700 text-gray-400">
            {b}
          </span>
        ))}
        {defense.blocks.length > 3 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-gray-700 text-gray-400">
                +{defense.blocks.length - 3}
            </span>
        )}
      </div>

      {/* HOVER SPECIFICATION OVERLAY */}
      <div className="absolute inset-0 bg-[#0a0a0a] border border-cyber-blue opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 rounded-lg flex flex-col p-3 shadow-[0_0_30px_rgba(0,0,0,0.9)] pointer-events-none">
          <div className="flex justify-between items-center mb-2 border-b border-cyber-blue/30 pb-1">
             <span className="text-[9px] font-bold text-cyber-blue uppercase tracking-widest">Tech Specs</span>
             <Zap className="w-3 h-3 text-cyber-yellow" />
          </div>
          
          <div className="space-y-1.5">
             <div className="flex justify-between items-center">
                <span className="text-[9px] text-gray-500 font-mono">THROUGHPUT</span>
                <span className="text-[10px] text-white font-mono">{defense.specs.throughput}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[9px] text-gray-500 font-mono">LATENCY</span>
                <span className="text-[10px] text-white font-mono">{defense.specs.latency}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[9px] text-gray-500 font-mono">UPTIME</span>
                <span className="text-[10px] text-cyber-green font-mono">{defense.specs.uptime}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[9px] text-gray-500 font-mono">PROTOCOL</span>
                <span className="text-[10px] text-cyber-yellow font-mono">{defense.specs.protocol}</span>
             </div>
          </div>
          
          <div className="mt-auto pt-2 border-t border-gray-800">
             <span className="text-[8px] text-gray-400 block text-center uppercase tracking-wider">
                Click to Inspect
             </span>
          </div>
      </div>
    </div>
  );
};
