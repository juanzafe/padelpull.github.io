import { Match } from "../domain/match";
import React from "react";

interface PadelCourtProps {
  match: Match;
  index: number;
}

const PadelCourt = ({ match, index }: PadelCourtProps) => {
  const { local, visitor } = match;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8
      }}>
        <div style={{
          width: 24,
          height: 24,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          color: 'white',
          flexShrink: 0
        }}>
          {index + 1}
        </div>
        <div style={{ height: 1, flex: 1, background: '#e8e8f8' }} />
      </div>

      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '2 / 1',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
      }}>
        <svg
          viewBox="0 0 400 200"
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0, display: 'block' }}
        >
          <rect width="400" height="200" fill="#1e5c28" />

          <rect x="30" y="15" width="340" height="170" fill="#2d8a3e" />

          <rect x="30" y="15" width="340" height="170" fill="none" stroke="white" strokeWidth="2.5" />

          <line x1="200" y1="15" x2="200" y2="185" stroke="white" strokeWidth="3" />
          <rect x="198" y="15" width="4" height="170" fill="rgba(0,0,0,0.3)" />
          <line x1="200" y1="15" x2="200" y2="185" stroke="white" strokeWidth="2.5" />
          <circle cx="200" cy="15" r="5" fill="white" />
          <circle cx="200" cy="185" r="5" fill="white" />
          <line x1="72" y1="15" x2="72" y2="185" stroke="white" strokeWidth="1.5" />
          <line x1="328" y1="15" x2="328" y2="185" stroke="white" strokeWidth="1.5" />
          <line x1="72" y1="100" x2="328" y2="100" stroke="white" strokeWidth="1.5" strokeDasharray="5,4" />
        </svg>
        <PlayerTag name={local.backhandPlayer.name} position="top-left"    side="⬅️" />
        <PlayerTag name={local.drivePlayer.name}    position="bottom-left"  side="➡️" />

        <PlayerTag name={visitor.drivePlayer.name}    position="top-right"    side="➡️" />
        <PlayerTag name={visitor.backhandPlayer.name} position="bottom-right" side="⬅️" />
      </div>
    </div>
  );
};


type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface PlayerTagProps {
  name: string;
  position: Position;
  side: string;
}

const positionStyles: Record<Position, React.CSSProperties> = {
  'top-left':     { top: 10,    left: 10,   alignItems: 'flex-start' },
  'top-right':    { top: 10,    right: 10,  alignItems: 'flex-end'   },
  'bottom-left':  { bottom: 10, left: 10,   alignItems: 'flex-start' },
  'bottom-right': { bottom: 10, right: 10,  alignItems: 'flex-end'   },
};

const PlayerTag = ({ name, position, side }: PlayerTagProps) => (
  <div style={{
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    ...positionStyles[position]
  }}>
    <div style={{
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(4px)',
      borderRadius: 8,
      padding: '5px 10px',
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }}>
      <span style={{ fontSize: 13 }}>{side}</span>
      <span style={{
        color: 'white',
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: '0.01em',
        maxWidth: 90,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {name}
      </span>
    </div>
  </div>
);

export default PadelCourt;