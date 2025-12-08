import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Shield, Terminal, Cpu, Command, Activity, Play, AlertCircle, CheckCircle, Lock, Target, ChevronRight, Briefcase, RotateCcw, ArrowRight } from 'lucide-react';
import { DEFENSES, INITIAL_BUDGET, MISSIONS } from './constants';
import { DefenseCard } from './components/DefenseCard';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { initGameChat, sendGameCommand } from './services/geminiService';
import { CanvasNode, Mission } from './types';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface SimulationState {
  blockedDefenses: string[];
  damageTaken: boolean;
  isSimulating: boolean;
}

// -- Utility Component for styled AI messages --
const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="space-y-1 w-full font-mono">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // HEADER
        if (trimmed.includes('!!! MISSION REPORT !!!')) {
          return (
             <div key={idx} className="flex items-center justify-center py-6">
                <div className="h-px bg-gray-800 w-12"></div>
                <span className="px-3 text-cyber-blue font-bold text-xs tracking-[0.3em] whitespace-nowrap glow-text">SIMULATION SEQUENCE COMPLETE</span>
                <div className="h-px bg-gray-800 w-12"></div>
             </div>
          );
        }

        // MISSION STATUS
        if (trimmed.startsWith('STATUS ::')) {
            const parts = trimmed.split('::');
            const status = parts[1]?.trim();
            const reason = parts[2]?.trim();
            const isSuccess = status === '[MISSION COMPLETE]';

            return (
                <div key={idx} className={`mb-4 p-3 rounded border-l-4 ${isSuccess ? 'bg-green-950/30 border-cyber-green' : 'bg-red-950/30 border-cyber-red'}`}>
                    <div className={`text-lg font-bold tracking-widest ${isSuccess ? 'text-cyber-green' : 'text-cyber-red'}`}>
                        {status.replace('[', '').replace(']', '')}
                    </div>
                    <div className="text-xs text-gray-300 font-mono mt-1">{reason}</div>
                </div>
            );
        }

        // STATS LINE
        if (trimmed.startsWith('STATS ::')) {
            const parts = trimmed.split('::');
            const label = parts[1]?.trim();
            const value = parts[2]?.trim();
            
            return (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-900/30">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</span>
                  <span className={`font-bold text-sm ${label === 'INTEGRITY' ? 'text-white' : label === 'DAMAGE' ? 'text-cyber-red' : 'text-cyber-blue'}`}>
                      {value}
                  </span>
              </div>
            );
        }

        // ATTACK RESULTS (List Style)
        if (trimmed.startsWith('[BLOCKED]') || trimmed.startsWith('[BREACH]')) {
            const parts = trimmed.split('::');
            const statusTag = parts[0]?.trim(); // [BLOCKED] or [BREACH]
            const attackName = parts[1]?.trim() || 'UNKNOWN';
            const details = parts[2]?.trim() || '';
            
            const isBlocked = statusTag === '[BLOCKED]';

            return (
                <div key={idx} className={`
                    flex items-center justify-between p-2 mb-1 rounded border-l-2 transition-all hover:bg-white/5
                    ${isBlocked 
                        ? 'bg-green-950/10 border-cyber-green/50 text-cyber-green' 
                        : 'bg-red-950/10 border-cyber-red/50 text-cyber-red'}
                `}>
                    <div className="flex items-center gap-3">
                       {isBlocked ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                       <span className="font-bold text-xs uppercase tracking-wider min-w-[120px]">
                         {attackName}
                       </span>
                    </div>
                    
                    <div className="flex items-center gap-2 overflow-hidden">
                       <div className="h-px bg-current opacity-20 w-8 hidden sm:block"></div>
                       <span className={`text-[10px] uppercase font-mono truncate max-w-[150px] sm:max-w-none ${isBlocked ? 'text-gray-400' : 'text-red-400'}`}>
                          {details}
                       </span>
                    </div>
                </div>
            );
        }

        // ADVICE
        if (trimmed.startsWith('ADVICE ::')) {
            return (
                <div key={idx} className="mt-4 p-3 bg-gray-900 rounded border border-gray-800 text-center">
                    <span className="text-cyber-blue text-[9px] font-bold uppercase tracking-widest block mb-1">RECOMMENDATION</span>
                    <p className="text-gray-400 text-xs font-mono">{trimmed.replace('ADVICE ::', '')}</p>
                </div>
            );
        }

        return null;
      })}
    </div>
  );
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [simulationState, setSimulationState] = useState<SimulationState>({
    blockedDefenses: [],
    damageTaken: false,
    isSimulating: false
  });
  const [integrity, setIntegrity] = useState(100);
  
  // Mission State
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const currentMission = MISSIONS[currentMissionIndex];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial Internet Node
    const internetDef = DEFENSES.find(d => d.id === 'internet');
    if (internetDef) {
       setNodes([{ ...internetDef, instanceId: 'node-internet', position: { x: 50, y: 150 }, connections: [] }]);
    }
    const startSession = async () => {
      setIsLoading(true);
      const initialResponse = await initGameChat();
      setMessages([{ role: 'ai', content: initialResponse }]);
      setIsLoading(false);
    };
    startSession();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === 'ai') {
      const content = lastMsg.content;
      
      const blockedDefenses: string[] = [];
      const lines = content.split('\n');
      
      lines.forEach(line => {
         if (line.includes('[BLOCKED]')) {
             const parts = line.split('::');
             const details = parts[2] || '';
             DEFENSES.forEach(def => {
                 if (details.toLowerCase().includes(def.name.toLowerCase()) || details.toLowerCase().includes(def.id)) {
                     blockedDefenses.push(def.name);
                 }
             });
         }
      });

      const hasDamage = content.includes('[BREACH]');
      
      const integrityMatch = content.match(/STATS :: INTEGRITY :: (\d+)/);
      if (integrityMatch) setIntegrity(parseInt(integrityMatch[1], 10));

      setSimulationState({
        blockedDefenses: blockedDefenses,
        damageTaken: hasDamage,
        isSimulating: false
      });
    }
  }, [messages]);

  // -- Canvas Logic --

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const defenseId = e.dataTransfer.getData('defenseId');
    const defense = DEFENSES.find(d => d.id === defenseId);
    
    if (defense) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newNode: CanvasNode = {
        ...defense,
        instanceId: `node-${Date.now()}`,
        position: { x, y },
        connections: []
      };
      setNodes(prev => [...prev, newNode]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const updateNodePosition = (id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.instanceId === id ? { ...n, position: { x, y } } : n));
  };

  const connectNodes = (sourceId: string, targetId: string) => {
    setNodes(prev => prev.map(n => {
       if (n.instanceId === sourceId && !n.connections.includes(targetId)) {
         return { ...n, connections: [...n.connections, targetId] };
       }
       return n;
    }));
  };

  const deleteNode = (id: string) => {
    setNodes(prev => prev
      .filter(n => n.instanceId !== id)
      .map(n => ({ ...n, connections: n.connections.filter(c => c !== id) }))
    );
  };

  const resetCanvas = () => {
    const internetDef = DEFENSES.find(d => d.id === 'internet');
    if (internetDef) {
       setNodes([{ ...internetDef, instanceId: 'node-internet', position: { x: 50, y: 150 }, connections: [] }]);
    } else {
        setNodes([]);
    }
    setMessages([]);
    setIntegrity(100);
    setSimulationState({ blockedDefenses: [], damageTaken: false, isSimulating: false });
  };

  const nextMission = () => {
      setCurrentMissionIndex(prev => (prev + 1) % MISSIONS.length);
      resetCanvas();
  };

  const prevMission = () => {
      setCurrentMissionIndex(prev => (prev - 1 + MISSIONS.length) % MISSIONS.length);
      resetCanvas();
  };

  const handleRetry = () => {
      setMessages([]); // Clear logs for a retry
      setIntegrity(100);
      setSimulationState({
        blockedDefenses: [],
        damageTaken: false,
        isSimulating: false
      });
  };

  // -- Game Logic --

  const currentSpent = useMemo(() => nodes.reduce((acc, n) => acc + n.cost, 0), [nodes]);
  const budgetRemaining = currentMission.budget - currentSpent;
  const isOverBudget = budgetRemaining < 0;
  
  // Derived State for UI flow
  const isSimulationFinished = !isLoading && messages.length > 0 && messages[messages.length - 1].role === 'ai';

  const handleRunSimulation = async () => {
    if (isLoading) return;
    
    // Convert Graph to text description for AI
    const inventory = nodes.map(n => n.name).join(', ');
    const connections = nodes.map(n => {
       const targets = n.connections.map(tid => nodes.find(tn => tn.instanceId === tid)?.name).join(', ');
       return targets ? `${n.name} connects to [${targets}]` : null;
    }).filter(Boolean).join('. ');

    const missionContext = `
      MISSION: ${currentMission.title}
      CLIENT: ${currentMission.client}
      OBJECTIVE: ${currentMission.description}
      BUDGET LIMIT: $${currentMission.budget}
      HIDDEN SUCCESS CRITERIA: ${currentMission.hiddenCriteria}
    `;

    const command = `
      ${missionContext}
      Architecture Inventory: ${inventory}. 
      Topology: ${connections}. 
      Budget Used: ${currentSpent}.
      Run simulation and evaluate Mission Pass/Fail.
    `;
    
    setMessages(prev => [...prev, { role: 'user', content: "INITIALIZING SIMULATION PROTOCOLS..." }]);
    setIsLoading(true);
    setSimulationState(prev => ({ ...prev, isSimulating: true }));

    const response = await sendGameCommand(command);
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-cyber-blue/30 selection:text-white flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-800 shadow-2xl z-50 flex-shrink-0">
        <div className="w-full px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-cyber-blue/10 rounded flex items-center justify-center border border-cyber-blue/30">
               <Shield className="text-cyber-blue w-5 h-5" />
            </div>
            <div className="flex flex-col">
               <span className="font-bold text-lg tracking-widest text-white font-mono leading-none">CYBER.ARCHITECT</span>
               <span className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-mono">Defense Simulation Grid</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
             <div className="flex items-center space-x-2 px-3 py-1 bg-gray-900 rounded border border-gray-800">
                <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-cyber-yellow animate-ping' : 'bg-cyber-green'}`}></div>
                <span className="text-[10px] font-mono font-bold text-gray-400">{isLoading ? 'SIMULATION ACTIVE' : 'SYSTEM IDLE'}</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="flex-grow w-full px-4 py-4 grid grid-cols-1 md:grid-cols-12 gap-4 h-[calc(100vh-3.5rem)]">
        
        {/* LEFT COLUMN: Mission & Inventory (2 Cols) */}
        <div className="md:col-span-2 flex flex-col gap-4 h-full min-h-0">
            
            {/* MISSION CARD (Top Left Pop) */}
            <div className="bg-gray-950 border border-cyber-blue/30 rounded-lg overflow-hidden flex flex-col shadow-[0_0_15px_rgba(0,240,255,0.1)] relative flex-shrink-0">
               <div className="absolute top-0 right-0 p-2 opacity-20">
                  <Target className="w-12 h-12 text-cyber-blue" />
               </div>
               <div className="p-3 border-b border-gray-800 bg-gray-900/80 flex justify-between items-center">
                  <span className="text-[9px] font-bold text-cyber-blue uppercase tracking-widest flex items-center gap-2">
                     <Briefcase className="w-3 h-3" /> Mission Brief
                  </span>
                  <div className="flex gap-1">
                      <button onClick={prevMission} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors">
                         <ChevronRight className="w-3 h-3 rotate-180" />
                      </button>
                      <button onClick={nextMission} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors">
                         <ChevronRight className="w-3 h-3" />
                      </button>
                  </div>
               </div>
               <div className="p-3">
                  <h2 className="text-white font-mono font-bold text-sm leading-tight mb-1">{currentMission.title}</h2>
                  <p className="text-[10px] text-cyber-blue mb-2 uppercase tracking-wider">{currentMission.client}</p>
                  <p className="text-[11px] text-gray-400 leading-snug mb-3">
                     {currentMission.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-[10px] font-mono border-t border-gray-800 pt-2">
                     <span className="text-gray-500 uppercase">Difficulty</span>
                     <span className={`font-bold ${currentMission.difficulty === 'INSANE' ? 'text-cyber-red' : currentMission.difficulty === 'ELITE' ? 'text-cyber-yellow' : 'text-gray-300'}`}>
                        {currentMission.difficulty}
                     </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono mt-1">
                     <span className="text-gray-500 uppercase">Max Budget</span>
                     <span className="text-white font-bold">${currentMission.budget}</span>
                  </div>
               </div>
            </div>

            {/* ASSET LIBRARY */}
            <div className="flex-1 flex flex-col bg-gray-950 border border-gray-800 rounded-lg overflow-hidden shadow-lg min-h-0">
                <div className="p-3 border-b border-gray-800 bg-gray-900 flex justify-between items-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Cpu className="w-3 h-3 text-cyber-blue" /> Asset Library
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 bg-black/50">
                    {DEFENSES.filter(d => d.id !== 'internet').map(defense => (
                    <DefenseCard
                        key={defense.id}
                        defense={defense}
                        canAfford={budgetRemaining >= defense.cost}
                    />
                    ))}
                </div>
            </div>
        </div>

        {/* CENTER COLUMN: Architecture Canvas (7 Cols) */}
        <div className="md:col-span-7 flex flex-col gap-2 h-full relative min-h-0">
          <div 
            className="flex-grow bg-[#050505] border border-gray-800 rounded-lg relative overflow-hidden flex flex-col shadow-2xl group"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
             {/* Canvas Grid Background */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
             />

             <div className="absolute top-3 right-3 z-10 flex gap-2">
                <span className="text-[9px] font-mono bg-black/80 px-2 py-1 border border-gray-700 text-gray-400 rounded backdrop-blur-md">
                   CANVAS_VIEW: ORTHOGONAL
                </span>
             </div>
             
             <ArchitectureDiagram 
                nodes={nodes}
                onMoveNode={updateNodePosition}
                onConnect={connectNodes}
                onDeleteNode={deleteNode}
                simulationState={simulationState}
             />
          </div>
        </div>

        {/* RIGHT COLUMN: Operations & Logs (3 Cols) */}
        <div className="md:col-span-3 flex flex-col gap-3 h-full min-h-0">
           
           {/* Operations Panel */}
           <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 shadow-lg flex flex-col gap-4 flex-shrink-0">
              
              {/* Status Header */}
              <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                     <Activity className="w-3 h-3 text-cyber-blue" /> System Status
                  </span>
                  <div className="text-right">
                     <span className={`text-2xl font-mono font-bold leading-none block ${integrity < 50 ? 'text-cyber-red' : integrity < 100 ? 'text-cyber-yellow' : 'text-cyber-green'}`}>
                        {integrity}%
                     </span>
                     <span className="text-[9px] text-gray-600 uppercase">Integrity</span>
                  </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ${integrity < 50 ? 'bg-cyber-red' : 'bg-cyber-green shadow-[0_0_10px_#00ff41]'}`} 
                    style={{ width: `${integrity}%` }}
                  />
              </div>

              {/* Budget Display */}
              <div className="flex justify-between items-center border-t border-gray-900 pt-3">
                 <div className="flex flex-col">
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider">Budget</span>
                    <span className={`text-lg font-mono font-bold ${isOverBudget ? 'text-cyber-red' : 'text-white'}`}>
                       ${currentSpent} <span className="text-gray-600 text-sm">/ ${currentMission.budget}</span>
                    </span>
                 </div>
                 <div className={`px-2 py-1 rounded text-[10px] font-bold border ${isOverBudget ? 'bg-red-950/50 border-red-900 text-red-500' : 'bg-gray-900 border-gray-800 text-gray-400'}`}>
                    {isOverBudget ? 'OVERRUN' : 'WITHIN LIMIT'}
                 </div>
              </div>

              {/* ACTION BUTTON AREA */}
              {isSimulationFinished ? (
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-900/50">
                  {integrity === 100 ? (
                    <button
                      onClick={nextMission}
                      className="w-full py-4 bg-cyber-green text-black font-bold font-mono rounded flex items-center justify-center gap-2 hover:bg-cyber-green/90 shadow-[0_0_15px_rgba(0,255,65,0.4)] transition-all"
                    >
                      <div className="flex flex-col items-center leading-none">
                         <span className="text-[10px] uppercase tracking-widest mb-1 opacity-70">Mission Success</span>
                         <div className="flex items-center gap-2 text-sm font-black">
                            NEXT MISSION <ArrowRight className="w-4 h-4" />
                         </div>
                      </div>
                    </button>
                  ) : (
                    <div className="p-3 border border-red-900/50 bg-red-950/20 rounded text-center mb-1">
                         <span className="text-cyber-red text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                             <AlertCircle className="w-3 h-3" /> System Compromised
                         </span>
                    </div>
                  )}
                  
                  <button
                    onClick={handleRetry}
                    className="w-full py-3 bg-gray-900 border border-gray-700 text-gray-300 font-mono font-bold text-xs rounded flex items-center justify-center gap-2 hover:bg-gray-800 hover:text-white transition-all uppercase tracking-wider group"
                  >
                    <RotateCcw className="w-3 h-3 group-hover:-rotate-90 transition-transform" />
                    {integrity === 100 ? 'Replay Mission' : 'Try Again'}
                  </button>
                </div>
              ) : (
                <button
                    onClick={handleRunSimulation}
                    disabled={isLoading || isOverBudget}
                    className={`
                    w-full py-4 rounded relative overflow-hidden group transition-all duration-200
                    ${isLoading || isOverBudget
                        ? 'bg-gray-900 border border-gray-800 text-gray-600 cursor-not-allowed' 
                        : 'bg-cyber-blue hover:bg-cyber-blue/90 text-black border border-transparent shadow-[0_0_20px_rgba(0,240,255,0.4)]'}
                    `}
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                    <div className="flex flex-col items-center justify-center relative z-10">
                    <span className="font-bold font-mono text-sm tracking-[0.15em] uppercase flex items-center gap-2">
                        {isLoading ? <span className="animate-spin">⟳</span> : <Play className="w-4 h-4 fill-current" />}
                        {isLoading ? 'PROCESSING...' : 'RUN SIMULATION'}
                    </span>
                    </div>
                </button>
              )}
           </div>

           {/* Console / Logs */}
           <div className="flex-1 bg-[#0a0a0a] border border-gray-800 rounded-lg overflow-hidden flex flex-col shadow-lg relative min-h-0">
              <div className="p-2 border-b border-gray-900 bg-gray-950 flex justify-between items-center flex-shrink-0">
                 <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                   <Terminal className="w-3 h-3" /> Mission Log
                 </span>
                 <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/50"></div>
                 </div>
              </div>
              
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-black/90">
                 {messages.length <= 1 && (
                     <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-50 space-y-3">
                        <Command className="w-12 h-12 stroke-1" />
                        <p className="text-[10px] uppercase tracking-widest text-center">
                          Awaiting Neural Link<br/>
                          Drag & Drop Components<br/>
                          Connect Nodes<br/>
                          Initiate Sequence
                        </p>
                     </div>
                 )}
                 
                 {messages.map((msg, idx) => {
                    if (msg.role === 'user') {
                        return (
                           <div key={idx} className="mb-6 flex justify-end">
                               <div className="bg-gray-800/50 border border-gray-700 rounded px-3 py-2 opacity-50">
                                  <p className="text-[9px] text-cyber-blue font-bold tracking-wider mb-1">SYSTEM CMD</p>
                                  <p className="text-[10px] text-gray-400 font-mono">EXECUTE_SIMULATION_PROTOCOL</p>
                               </div>
                           </div>
                        )
                    }
                    return <FormattedMessage key={idx} content={msg.content} />
                 })}
                 
                 {isLoading && (
                     <div className="animate-pulse flex space-x-2 items-center justify-center py-4">
                        <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full animation-delay-200"></div>
                        <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full animation-delay-400"></div>
                     </div>
                 )}
              </div>
           </div>

        </div>

      </main>
    </div>
  );
};

export default App;