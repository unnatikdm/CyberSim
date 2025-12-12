
import { GoogleGenAI, Chat, GenerativeModel } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are the CYBER DEFENSE SIMULATOR GAME engine.

GAME MECHANICS:
- Defenses & Capabilities:
  1. WAF ($6) - blocks DDoS, SQLi, XSS, Botnet, Credential Stuffing
  2. IPS ($8) - blocks SQLi, Malware, Intrusion, Zero-Day, MitM
  3. EDR ($12) - blocks Ransomware, Malware, Zero-Day, Insider, Lateral Movement
  4. SIEM ($10) - detects Phishing, Data Theft, Insider, Credential Stuffing
  5. IDS ($7) - detects Scanning, Bruteforce, Intrusion, MitM
  6. Encryption ($9) - blocks Data Theft, MitM, Insider
  7. Backup ($5) - blocks Ransomware
  8. Load Balancer ($5) - blocks DDoS, Botnet
  9. API Gateway ($6) - blocks DDoS, API Abuse
  10. Smart Contract Auditor ($14) - blocks Reentrancy, Flash Loan, Rug Pulls
  11. Blockchain Node ($15) - blocks Tampering, Censorship, 51% Attacks
  12. AI Sentinel ($20) - blocks Zero-Day, Mutation Malware, Phishing, Social Eng.
  13. Quantum Key Dist ($25) - blocks Quantum Decryption, MitM, Data Theft (Unbreakable)
  14. Zero Trust Proxy ($12) - blocks Insider, Credential Theft, Lateral Movement
  15. Honeypot Grid ($7) - blocks Intrusion, Botnet, Scanning (Traps them)
  16. IPFS Cluster ($8) - blocks Censorship, DDoS (Decentralized)

SCORING:
- System Integrity starts at 100%.
- Damage reduces integrity 1:1.

RESPONSE FORMAT (STRICT FORMAT REQUIRED):
For each simulation step, you MUST use exactly this structure. No markdown.

1. START WITH HEADER
   !!! MISSION REPORT !!!

2. MISSION STATUS (Crucial)
   Use format: STATUS :: [MISSION COMPLETE] or [MISSION FAILED]
   Followed by a one line reason based on the hidden criteria provided in the prompt.
   Example: STATUS :: [MISSION FAILED] :: You forgot Encryption, critical for banking data.

3. LIST 10-15 ATTACKS (CRITICAL: MUST LIST AT LEAST 10)
   Use double colon (::) as delimiter.
   Format: [STATUS] :: ATTACK NAME :: OUTCOME_DETAILS
   
   Examples:
   [BLOCKED] :: DDoS Attack (Volumetric) :: Auto-mitigated by Load Balancer
   [BREACH] :: Zero-Day Ransomware :: Encrypted Main DB (-25 Damage)
   [BLOCKED] :: Reentrancy Attack :: Smart Contract Auditor detected recursion
   [BREACH] :: Quantum Decryption :: RSA keys broken by Q-Computer (-50 Damage)

4. END WITH STATS (One per line)
   STATS :: INTEGRITY :: 85
   STATS :: DAMAGE :: 15
   STATS :: RESULT :: SURVIVED (This is about survival, distinct from Mission Objective)

5. ADVICE (One line)
   ADVICE :: Install EDR to prevent future ransomware outbreaks.

DO NOT deviate from this format. GENERATE MANY ATTACKS.
`;

let chatSession: Chat | null = null;

export const initGameChat = async (): Promise<string> => {
  if (!apiKey) return "Error: API Key is missing.";

  try {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    
    // We don't send a message to start, we just return the initial prompt from the system persona
    const response = await chatSession.sendMessage({ message: "Initialize simulation interface." });
    return response.text || "SYSTEM READY.";
  } catch (error) {
    console.error("Failed to init chat:", error);
    return "Error connecting to AI Simulation Grid.";
  }
};

export const sendGameCommand = async (command: string): Promise<string> => {
  if (!chatSession) {
    await initGameChat();
  }
  
  if (!chatSession) return "System Error: Chat session not initialized.";

  try {
    const response = await chatSession.sendMessage({ message: command });
    return response.text || "No response from simulation core.";
  } catch (error) {
    console.error("Command failed:", error);
    return "Error: Simulation link severed.";
  }
};
