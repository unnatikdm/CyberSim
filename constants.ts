
import { Defense, Attack, Mission } from './types';

export const INITIAL_BUDGET = 100;

export const DEFENSES: Defense[] = [
  // --- INFRASTRUCTURE (WEB 2.0) ---
  {
    id: 'internet',
    name: 'Internet',
    cost: 0,
    description: 'Public Traffic Source',
    blocks: [],
    layer: 0,
    shape: 'cloud',
    specs: { throughput: '∞ Tbps', latency: 'Var', uptime: '99.9%', protocol: 'TCP/UDP' }
  },
  {
    id: 'elb',
    name: 'Load Balancer',
    cost: 5,
    description: 'Distributes traffic. Basic DDoS mitigation.',
    blocks: ['ddos', 'botnet'],
    layer: 1,
    shape: 'router',
    specs: { throughput: '10 Gbps', latency: '<1ms', uptime: '99.99%', protocol: 'HTTP/2' }
  },
  {
    id: 'gateway',
    name: 'API Gateway',
    cost: 6,
    description: 'Entry point for microservices. Rate limiting.',
    blocks: ['ddos', 'api_abuse'],
    layer: 1,
    shape: 'box',
    specs: { throughput: '50k RPS', latency: '2ms', uptime: '99.95%', protocol: 'REST/GraphQL' }
  },
  {
    id: 'microservice',
    name: 'Microservice',
    cost: 8,
    description: 'Application Logic container.',
    blocks: [],
    layer: 3,
    shape: 'server',
    specs: { throughput: 'Var', latency: '10ms', uptime: '99.9%', protocol: 'gRPC' }
  },
  {
    id: 'database',
    name: 'Database',
    cost: 10,
    description: 'Core Data Storage (SQL/NoSQL).',
    blocks: [],
    layer: 4,
    shape: 'cylinder',
    specs: { throughput: '100k IOPS', latency: '0.5ms', uptime: '99.99%', protocol: 'SQL' }
  },

  // --- INFRASTRUCTURE (WEB 3.0 / ADVANCED) ---
  {
    id: 'blockchain_node',
    name: 'Blockchain Node',
    cost: 15,
    description: 'Decentralized ledger node. Immutable records.',
    blocks: ['tampering', 'censorship'],
    layer: 4,
    shape: 'sphere',
    specs: { throughput: '5k TPS', latency: '12s', uptime: '100%', protocol: 'P2P/ETH' }
  },
  {
    id: 'ipfs_cluster',
    name: 'IPFS Cluster',
    cost: 8,
    description: 'Decentralized storage network.',
    blocks: ['censorship', 'ddos'],
    layer: 4,
    shape: 'server',
    specs: { throughput: 'P2P', latency: 'Var', uptime: '99.9%', protocol: 'IPFS' }
  },

  // --- SECURITY TOOLS (STANDARD) ---
  {
    id: 'waf',
    name: 'WAF',
    cost: 6,
    description: 'Web Application Firewall. Blocks web-based attacks.',
    blocks: ['sqli', 'xss', 'cred_stuffing', 'botnet'],
    layer: 1,
    shape: 'hexagon',
    specs: { throughput: '5 Gbps', latency: '1ms', uptime: '99.99%', protocol: 'HTTP/S' }
  },
  {
    id: 'ids',
    name: 'IDS',
    cost: 7,
    description: 'Intrusion Detection System. Network monitoring.',
    blocks: ['intrusion', 'mitm'],
    layer: 2,
    shape: 'box',
    specs: { throughput: 'Passive', latency: '0ms', uptime: '99.9%', protocol: 'PCAP' }
  },
  {
    id: 'ips',
    name: 'IPS',
    cost: 8,
    description: 'Intrusion Prevention System. Deep packet inspection.',
    blocks: ['sqli', 'malware', 'intrusion', 'zeroday', 'mitm'],
    layer: 2,
    shape: 'box',
    specs: { throughput: '2 Gbps', latency: '3ms', uptime: '99.9%', protocol: 'Inline' }
  },
  {
    id: 'edr',
    name: 'EDR',
    cost: 12,
    description: 'Endpoint Detection & Response. Advanced host protection.',
    blocks: ['ransomware', 'malware', 'zeroday', 'insider'],
    layer: 3,
    shape: 'box',
    specs: { throughput: 'Agent', latency: 'R-Time', uptime: '99.9%', protocol: 'Host' }
  },
  {
    id: 'siem',
    name: 'SIEM',
    cost: 10,
    description: 'Security Information & Event Management. Log analysis.',
    blocks: ['phishing', 'datatheft', 'insider', 'cred_stuffing'],
    layer: 3,
    shape: 'server',
    specs: { throughput: '50k EPS', latency: 'Near-RT', uptime: '99.95%', protocol: 'Syslog' }
  },
  {
    id: 'encryption',
    name: 'Encryption',
    cost: 9,
    description: 'AES-256 Data Encryption.',
    blocks: ['datatheft', 'mitm', 'insider'],
    layer: 4,
    shape: 'shield',
    specs: { throughput: 'AES-256', latency: 'Overhead', uptime: '100%', protocol: 'TLS 1.3' }
  },
  {
    id: 'backup',
    name: 'Immutable Backup',
    cost: 5,
    description: 'Regular data backups with object lock.',
    blocks: ['ransomware'],
    layer: 5,
    shape: 'cylinder',
    specs: { throughput: '10TB/hr', latency: 'N/A', uptime: '99.999%', protocol: 'S3' }
  },

  // --- SECURITY TOOLS (ADVANCED / FUTURISTIC) ---
  {
    id: 'smart_contract_auditor',
    name: 'Smart Contract Auditor',
    cost: 14,
    description: 'Real-time EVM bytecode analysis.',
    blocks: ['reentrancy', 'flash_loan', 'rug_pull'],
    layer: 2,
    shape: 'diamond',
    specs: { throughput: 'Gas Limit', latency: 'Tx Time', uptime: '99.9%', protocol: 'EVM' }
  },
  {
    id: 'quantum_shield',
    name: 'Quantum Key Dist.',
    cost: 25,
    description: 'QKD Network. Physically unbreakable encryption.',
    blocks: ['quantum_decryption', 'mitm', 'datatheft', 'insider'],
    layer: 1,
    shape: 'sphere',
    specs: { throughput: 'Qubits', latency: '0ms', uptime: '99.9%', protocol: 'BB84' }
  },
  {
    id: 'ai_sentinel',
    name: 'AI Sentinel Core',
    cost: 20,
    description: 'Self-healing neural network defense.',
    blocks: ['zeroday', 'mutation_malware', 'social_eng', 'phishing'],
    layer: 3,
    shape: 'pyramid',
    specs: { throughput: '10 PetaFLOPS', latency: '10ms', uptime: '99.9%', protocol: 'Neural' }
  },
  {
    id: 'honeypot_grid',
    name: 'Honeypot Grid',
    cost: 7,
    description: 'Decoy network to trap and analyze attackers.',
    blocks: ['intrusion', 'botnet', 'scanning'],
    layer: 1,
    shape: 'box',
    specs: { throughput: 'Sinkhole', latency: 'N/A', uptime: '99.5%', protocol: 'Any' }
  },
  {
    id: 'zero_trust_proxy',
    name: 'Zero Trust Proxy',
    cost: 12,
    description: 'Identity-aware proxy. Never trust, always verify.',
    blocks: ['insider', 'credential_theft', 'lat_movement'],
    layer: 1,
    shape: 'shield',
    specs: { throughput: '1 Gbps', latency: '20ms', uptime: '99.99%', protocol: 'OIDC/SAML' }
  }
];

export const ATTACKS: Attack[] = [
  // Classic
  { id: 'ddos', name: 'DDoS Attack', damage: 15, blockedBy: ['waf', 'elb', 'gateway', 'ipfs_cluster'] },
  { id: 'sqli', name: 'SQL Injection', damage: 12, blockedBy: ['waf', 'ips', 'ai_sentinel'] },
  { id: 'xss', name: 'XSS Exploit', damage: 8, blockedBy: ['waf', 'ai_sentinel'] },
  { id: 'malware', name: 'Malware Outbreak', damage: 20, blockedBy: ['ips', 'edr', 'ai_sentinel'] },
  { id: 'ransomware', name: 'Ransomware', damage: 25, blockedBy: ['edr', 'backup', 'ai_sentinel'] },
  { id: 'phishing', name: 'Phishing Campaign', damage: 10, blockedBy: ['siem', 'ai_sentinel'] },
  { id: 'intrusion', name: 'Network Intrusion', damage: 18, blockedBy: ['ips', 'ids', 'honeypot_grid', 'ai_sentinel'] },
  { id: 'datatheft', name: 'Data Theft', damage: 22, blockedBy: ['encryption', 'siem', 'quantum_shield', 'zero_trust_proxy'] },
  
  // Advanced
  { id: 'zeroday', name: 'Zero-Day Exploit', damage: 30, blockedBy: ['edr', 'ips', 'ai_sentinel'] },
  { id: 'insider', name: 'Insider Threat', damage: 25, blockedBy: ['siem', 'edr', 'encryption', 'zero_trust_proxy', 'quantum_shield'] },
  { id: 'api_abuse', name: 'API Abuse', damage: 15, blockedBy: ['gateway', 'waf'] },
  { id: 'mitm', name: 'Man-in-the-Middle', damage: 20, blockedBy: ['encryption', 'ips', 'quantum_shield'] },
  { id: 'cred_stuffing', name: 'Credential Stuffing', damage: 12, blockedBy: ['waf', 'siem', 'zero_trust_proxy'] },
  { id: 'botnet', name: 'Botnet Assault', damage: 18, blockedBy: ['waf', 'elb', 'honeypot_grid'] },
  
  // Web 3.0 / Future
  { id: 'reentrancy', name: 'Reentrancy Attack', damage: 40, blockedBy: ['smart_contract_auditor'] },
  { id: 'flash_loan', name: 'Flash Loan Exploit', damage: 35, blockedBy: ['smart_contract_auditor'] },
  { id: 'quantum_decryption', name: 'Quantum Decryption', damage: 50, blockedBy: ['quantum_shield'] },
  { id: '51_percent', name: '51% Attack', damage: 45, blockedBy: ['blockchain_node'] },
  { id: 'tampering', name: 'Ledger Tampering', damage: 30, blockedBy: ['blockchain_node'] },
  { id: 'mutation_malware', name: 'Polymorphic Virus', damage: 28, blockedBy: ['ai_sentinel'] },
  { id: 'lat_movement', name: 'Lateral Movement', damage: 20, blockedBy: ['zero_trust_proxy', 'edr'] }
];

export const MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Startup Launch',
    client: 'Pied Piper',
    description: 'Launch a basic web app. Protect against script kiddies.',
    budget: 35,
    difficulty: 'ROOKIE',
    hiddenCriteria: 'Must have at least one WAF or Load Balancer. Survive 3 basic attacks.'
  },
  {
    id: 'm2',
    title: 'E-Commerce Black Friday',
    client: 'Shopify-Clone',
    description: 'Handle massive traffic and protect customer credit card data.',
    budget: 50,
    difficulty: 'ROOKIE',
    hiddenCriteria: 'Crucial: WAF for XSS/SQLi and Encryption for Data Theft. Load Balancer recommended.'
  },
  {
    id: 'm3',
    title: 'DeFi Protocol Launch',
    client: 'UniSwap-ish',
    description: 'Deploying Smart Contracts holding $10M TVL. Audit is optional but recommended?',
    budget: 55,
    difficulty: 'PRO',
    hiddenCriteria: 'Mandatory: Smart Contract Auditor. Without it, Reentrancy kills you.'
  },
  {
    id: 'm4',
    title: 'FinTech Vault',
    client: 'Gringotts Digital',
    description: 'Zero tolerance for data theft or intrusion. Highly regulated.',
    budget: 70,
    difficulty: 'PRO',
    hiddenCriteria: 'Mandatory: Encryption, IPS, and SIEM. Zero Trust recommended.'
  },
  {
    id: 'm5',
    title: 'Government AI Lab',
    client: 'DARPA',
    description: 'Developing sentient AI. Prevent theft and containment breach.',
    budget: 90,
    difficulty: 'ELITE',
    hiddenCriteria: 'AI Sentinel + EDR required. High budget allows Quantum Shielding.'
  },
  {
    id: 'm6',
    title: 'Web3 DAO Voting',
    client: 'ConstitutionDAO',
    description: 'Ensure votes are immutable and censor-resistant.',
    budget: 60,
    difficulty: 'PRO',
    hiddenCriteria: 'Blockchain Node or IPFS Cluster required to prevent Tampering.'
  },
  {
    id: 'm7',
    title: 'Quantum Research',
    client: 'Q-Bits Inc',
    description: 'Protecting the Q-bit state data from foreign decryption.',
    budget: 80,
    difficulty: 'INSANE',
    hiddenCriteria: 'Quantum Shield is the ONLY defense against Quantum Decryption.'
  },
  {
    id: 'm8',
    title: 'Hospital Core',
    client: 'St. Mungo\'s',
    description: 'Ransomware is the #1 threat. Patient life support systems cannot fail.',
    budget: 60,
    difficulty: 'PRO',
    hiddenCriteria: 'Mandatory: Backup and EDR. Ransomware must be blocked.'
  },
  {
    id: 'm9',
    title: 'Crypto Exchange',
    client: 'CoinBase-ish',
    description: 'High value target. Phishing and Theft attempts are daily.',
    budget: 85,
    difficulty: 'ELITE',
    hiddenCriteria: 'Needs SIEM, Encryption, Zero Trust Proxy. High risk of Insider threat.'
  },
  {
    id: 'm10',
    title: 'Global Mesh Network',
    client: 'StarLink-ish',
    description: 'Resilient global communication. Cannot go down.',
    budget: 75,
    difficulty: 'ELITE',
    hiddenCriteria: 'IPFS Cluster + Load Balancers. High availability.'
  },
  {
    id: 'm11',
    title: 'Nuclear Plant',
    client: 'Sector 7G',
    description: 'Air-gapped logic simulation. Prevent Malware and Intrusion at all costs.',
    budget: 95,
    difficulty: 'INSANE',
    hiddenCriteria: 'IPS, IDS, EDR, AI Sentinel mandatory. Zero damage allowed.'
  }
];

export const GRADES = {
  A: { minScore: 90, color: 'text-cyber-green' },
  B: { minScore: 80, color: 'text-blue-400' },
  C: { minScore: 60, color: 'text-yellow-400' },
  D: { minScore: 40, color: 'text-orange-500' },
  F: { minScore: 0, color: 'text-cyber-red' },
};
