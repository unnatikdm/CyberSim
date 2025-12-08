
import React from 'react';
import { Defense } from '../types';
import { Shield, ShieldAlert, ShieldCheck, Lock, Activity, Database, Server, Cloud, Router, Box } from 'lucide-react';

interface DefenseCardProps {
  defense: Defense;
  canAfford: boolean;
}

const getIcon = (shape: string) => {
  const props = { className: "w-5 h-5" };
  switch (shape) {
    case 'cloud': return <Cloud {...props} />;
    case 'server': return <Server {...props} />;
    case 'cylinder': return <Database {...props} />;
    case 'hexagon': return <Shield {...props} />;
    case 'shield': return <Lock {...props} />;
    case 'router': return <Router {...props} />;
    case 'box': default: return <Box {...props} />;
  }
};

export const DefenseCard: React.FC<DefenseCardProps> = ({ defense, canAfford }) => {
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('defenseId', defense.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`
        group flex flex-col p-3 rounded-lg border border-gray-800 bg-gray-900/50 
        hover:bg-gray-800 hover:border-cyber-blue/50 transition-all duration-200 
        cursor-grab active:cursor-grabbing w-full relative overflow-hidden
        ${!canAfford ? 'opacity-50 grayscale' : ''}
      `}
    >
      <div className="flex justify-between items-center w-full mb-1">
        <div className="text-cyber-blue group-hover:text-white transition-colors">
          {getIcon(defense.shape)}
        </div>
        <span className="font-mono font-bold text-cyber-blue">
          ${defense.cost}
        </span>
      </div>
      
      <h3 className="font-bold text-sm text-gray-200 group-hover:text-white mb-1">
        {defense.name}
      </h3>
      
      <p className="text-[10px] text-gray-500 mb-2 leading-tight">
        {defense.description}
      </p>

      <div className="flex flex-wrap gap-1">
        {defense.blocks.map(b => (
          <span key={b} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 group-hover:bg-gray-700">
            {b}
          </span>
        ))}
      </div>
    </div>
  );
};
