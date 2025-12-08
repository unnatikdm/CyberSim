
export interface Defense {
  id: string;
  name: string;
  cost: number;
  description: string;
  blocks: string[]; // List of attack IDs it blocks
  layer: number; // Suggested layer (for auto-sort, optional now)
  shape: 'box' | 'cylinder' | 'hexagon' | 'shield' | 'server' | 'cloud' | 'router'; 
  defaultConnections?: string[]; // For auto-connecting
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface CanvasNode extends Defense {
  instanceId: string; // Unique ID for this specific instance on canvas
  position: NodePosition;
  connections: string[]; // IDs of other CanvasNodes this is connected to
}

export interface Attack {
  id: string;
  name: string;
  damage: number;
  blockedBy: string[]; // List of defense IDs that block this
}

export interface SimulationResult {
  attack: Attack;
  blocked: boolean;
  blockedBy?: string; // Name of defense that blocked it
}

export interface GameState {
  budget: number;
  selectedDefenses: string[]; // IDs
  phase: 'shop' | 'simulating' | 'results';
  results: SimulationResult[];
  totalDamage: number;
  finalScore: number;
  grade: string;
}

export interface AnalysisResponse {
  recommendation: string;
  gradeLogic: string;
}

export interface Mission {
  id: string;
  title: string;
  client: string;
  description: string;
  budget: number;
  difficulty: 'ROOKIE' | 'PRO' | 'ELITE' | 'INSANE';
  hiddenCriteria: string; // Instructions for AI judge only
}
