import { useState } from 'react';
import './AgentThinking.css';

const AGENT_META = {
  evidence:       { label: 'Agent 1: Evidence Extraction', icon: '🔍', color: '#3b82f6' },
  classification: { label: 'Agent 2: Fraud Classification', icon: '🏷️', color: '#8b5cf6' },
  risk:           { label: 'Agent 3: Risk Assessment',     icon: '⚠️', color: '#ef4444' },
  advisory:       { label: 'Agent 4: Citizen Advisory',   icon: '🛡️', color: '#22c55e' },
};

export default function AgentThinking({ agents }) {
  const [openAgent, setOpenAgent] = useState(null);
  if (!agents || Object.keys(agents).length === 0) return null;

  return (
    <div className="at-container">
      <div className="at-header">
        <span className="at-icon">🤖</span>
        <h4 className="at-title">Multi-Agent AI Pipeline</h4>
        <span className="at-badge">Claude claude-sonnet-4-5</span>
      </div>
      <p className="at-subtitle">4 specialized AI agents analyzed this content in sequence</p>
      <div className="at-agents">
        {Object.entries(AGENT_META).map(([key, meta], i) => {
          const agentData = agents[key];
          const isOpen    = openAgent === key;
          return (
            <div key={key} className={`at-agent ${isOpen ? 'at-agent-open' : ''}`}>
              <button
                className="at-agent-header"
                onClick={() => setOpen(key, isOpen, setOpenAgent)}
                style={{ '--agent-color': meta.color }}
              >
                <span className="at-step">{i + 1}</span>
                <span className="at-agent-icon">{meta.icon}</span>
                <span className="at-agent-label">{meta.label}</span>
                <span className="at-status at-status-done">✓ Complete</span>
                <span className="at-chevron">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && agentData && (
                <div className="at-agent-body">
                  <pre className="at-json">{JSON.stringify(agentData, null, 2)}</pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function setOpen(key, isOpen, setOpenAgent) {
  setOpenAgent(isOpen ? null : key);
}
