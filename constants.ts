
import { Defense, Attack, Mission } from './types';

export const INITIAL_BUDGET = 100; // Increased budget for larger architectures

export const DEFENSES: Defense[] = [
  // --- INFRASTRUCTURE ---
  {
    id: 'internet',
    name: 'Internet',
    cost: 0,
    description: 'Public Traffic Source',
    blocks: [],
    layer: 0,
    shape: 'cloud'
  },
  {
    id: 'elb',
    name: 'Load Balancer',
    cost: 5,
    description: 'Distributes traffic. Basic DDoS mitigation.',
    blocks: ['ddos', 'botnet'], // Weak block, but functional
    layer: 1,
    shape: 'router'
  },
  {
    id: 'gateway',
    name: 'API Gateway',
    cost: 6,
    description: 'Entry point for microservices. Rate limiting.',
    blocks: ['ddos', 'api_abuse'],
    layer: 1,
    shape: 'box'
  },
  {
    id: 'microservice',
    name: 'Microservice',
    cost: 8,
    description: 'Application Logic container.',
    blocks: [],
    layer: 3,
    shape: 'server'
  },
  {
    id: 'database',
    name: 'Database',
    cost: 10,
    description: 'Core Data Storage (SQL/NoSQL).',
    blocks: [],
    layer: 4,
    shape: 'cylinder'
  },

  // --- SECURITY TOOLS ---
  {
    id: 'waf',
    name: 'WAF',
    cost: 6,
    description: 'Web Application Firewall. Blocks web-based attacks.',
    blocks: ['sqli', 'xss', 'cred_stuffing', 'botnet'],
    layer: 1,
    shape: 'hexagon'
  },
  {
    id: 'ids',
    name: 'IDS',
    cost: 7,
    description: 'Intrusion Detection System. Network monitoring.',
    blocks: ['intrusion', 'mitm'],
    layer: 2,
    shape: 'box'
  },
  {
    id: 'ips',
    name: 'IPS',
    cost: 8,
    description: 'Intrusion Prevention System. Deep packet inspection.',
    blocks: ['sqli', 'malware', 'intrusion', 'zeroday', 'mitm'],
    layer: 2,
    shape: 'box'
  },
  {
    id: 'edr',
    name: 'EDR',
    cost: 12,
    description: 'Endpoint Detection & Response. Advanced host protection.',
    blocks: ['ransomware', 'malware', 'zeroday', 'insider'],
    layer: 3,
    shape: 'box'
  },
  {
    id: 'siem',
    name: 'SIEM',
    cost: 10,
    description: 'Security Information & Event Management. Log analysis.',
    blocks: ['phishing', 'datatheft', 'insider', 'cred_stuffing'],
    layer: 3,
    shape: 'server'
  },
  {
    id: 'encryption',
    name: 'Encryption',
    cost: 9,
    description: 'Encrypts sensitive data at rest and in transit.',
    blocks: ['datatheft', 'mitm', 'insider'],
    layer: 4,
    shape: 'shield'
  },
  {
    id: 'backup',
    name: 'Backup',
    cost: 5,
    description: 'Regular data backups and restoration capabilities.',
    blocks: ['ransomware'],
    layer: 5,
    shape: 'cylinder'
  }
];

export const ATTACKS: Attack[] = [
  { id: 'ddos', name: 'DDoS Attack', damage: 15, blockedBy: ['waf', 'elb', 'gateway'] },
  { id: 'sqli', name: 'SQL Injection', damage: 12, blockedBy: ['waf', 'ips'] },
  { id: 'xss', name: 'XSS Exploit', damage: 8, blockedBy: ['waf'] },
  { id: 'malware', name: 'Malware Outbreak', damage: 20, blockedBy: ['ips', 'edr'] },
  { id: 'ransomware', name: 'Ransomware', damage: 25, blockedBy: ['edr', 'backup'] },
  { id: 'phishing', name: 'Phishing Campaign', damage: 10, blockedBy: ['siem'] },
  { id: 'intrusion', name: 'Network Intrusion', damage: 18, blockedBy: ['ips', 'ids'] },
  { id: 'datatheft', name: 'Data Theft', damage: 22, blockedBy: ['encryption', 'siem'] },
  // New Advanced Attacks
  { id: 'zeroday', name: 'Zero-Day Exploit', damage: 30, blockedBy: ['edr', 'ips'] },
  { id: 'insider', name: 'Insider Threat', damage: 25, blockedBy: ['siem', 'edr', 'encryption'] },
  { id: 'api_abuse', name: 'API Abuse', damage: 15, blockedBy: ['gateway', 'waf'] },
  { id: 'mitm', name: 'Man-in-the-Middle', damage: 20, blockedBy: ['encryption', 'ips'] },
  { id: 'cred_stuffing', name: 'Credential Stuffing', damage: 12, blockedBy: ['waf', 'siem'] },
  { id: 'botnet', name: 'Botnet Assault', damage: 18, blockedBy: ['waf', 'elb'] }
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
    title: 'FinTech Vault',
    client: 'Gringotts Digital',
    description: 'Zero tolerance for data theft or intrusion. Highly regulated.',
    budget: 65,
    difficulty: 'PRO',
    hiddenCriteria: 'Mandatory: Encryption, IPS, and SIEM. Any successful Data Theft is an instant fail.'
  },
  {
    id: 'm4',
    title: 'Hospital Core',
    client: 'St. Mungo\'s',
    description: 'Ransomware is the #1 threat. Patient life support systems cannot fail.',
    budget: 60,
    difficulty: 'PRO',
    hiddenCriteria: 'Mandatory: Backup and EDR. Ransomware must be blocked.'
  },
  {
    id: 'm5',
    title: 'Streaming Giant',
    client: 'Not-Netflix',
    description: 'Prioritize uptime. DDoS attacks are constant.',
    budget: 55,
    difficulty: 'PRO',
    hiddenCriteria: 'Must have heavy redundancy: Load Balancer + WAF + Multiple Microservices.'
  },
  {
    id: 'm6',
    title: 'Crypto Exchange',
    client: 'CoinBase-ish',
    description: 'High value target. Phishing and Theft attempts are daily.',
    budget: 75,
    difficulty: 'ELITE',
    hiddenCriteria: 'Needs SIEM for Phishing and Encryption + IPS. High budget allows for strong defense.'
  },
  {
    id: 'm7',
    title: 'Government Portal',
    client: 'Dept of Defense',
    description: 'State-sponsored actors. Advanced Persistent Threats (APTs).',
    budget: 80,
    difficulty: 'ELITE',
    hiddenCriteria: 'Requires Layered Security: IDS + IPS + WAF + Encryption. No single point of failure.'
  },
  {
    id: 'm8',
    title: 'Social Network',
    client: 'FaceBook-ish',
    description: 'Protect user privacy and prevent massive data leaks.',
    budget: 70,
    difficulty: 'ELITE',
    hiddenCriteria: 'Encryption is non-negotiable. WAF for XSS is critical.'
  },
  {
    id: 'm9',
    title: 'Legacy Bank Upgrade',
    client: 'Old Money Inc.',
    description: 'Modernize an old infrastructure without breaking the budget.',
    budget: 45,
    difficulty: 'PRO',
    hiddenCriteria: 'Budget is tight. Must prioritize Encryption and Database protection over fancy monitoring.'
  },
  {
    id: 'm10',
    title: 'Nuclear Plant',
    client: 'Sector 7G',
    description: 'Air-gapped logic simulation. Prevent Malware and Intrusion at all costs.',
    budget: 90,
    difficulty: 'INSANE',
    hiddenCriteria: 'IPS, IDS, EDR are mandatory. Zero damage allowed from Malware/Intrusion.'
  },
  {
    id: 'm11',
    title: 'University Network',
    client: 'Tech U',
    description: 'Open network, many users. Limit spread of malware.',
    budget: 40,
    difficulty: 'ROOKIE',
    hiddenCriteria: 'EDR or IPS to stop malware spread. Budget is low.'
  },
  {
    id: 'm12',
    title: 'AI Research Lab',
    client: 'OpenMind',
    description: 'Protect proprietary algorithms from corporate espionage.',
    budget: 70,
    difficulty: 'ELITE',
    hiddenCriteria: 'Data Theft protection is priority #1. Encryption + SIEM.'
  },
  {
    id: 'm13',
    title: 'Gaming Server',
    client: 'Call of Duty Ops',
    description: 'DDoS mitigation is the only thing that matters.',
    budget: 50,
    difficulty: 'PRO',
    hiddenCriteria: 'Load Balancer + WAF + Gateway. Triple redundancy against DDoS.'
  },
  {
    id: 'm14',
    title: 'Election System',
    client: 'GovVote',
    description: 'Absolute integrity required. No tampering allowed.',
    budget: 85,
    difficulty: 'INSANE',
    hiddenCriteria: 'All security layers required. Integrity must remain 100%.'
  },
  {
    id: 'm15',
    title: 'Space Station Link',
    client: 'NASA',
    description: 'High latency, high risk. Remote access protection.',
    budget: 60,
    difficulty: 'ELITE',
    hiddenCriteria: 'Encryption for the link and IPS for the endpoint.'
  }
];

export const GRADES = {
  A: { minScore: 90, color: 'text-cyber-green' },
  B: { minScore: 80, color: 'text-blue-400' },
  C: { minScore: 60, color: 'text-yellow-400' },
  D: { minScore: 40, color: 'text-orange-500' },
  F: { minScore: 0, color: 'text-cyber-red' },
};
