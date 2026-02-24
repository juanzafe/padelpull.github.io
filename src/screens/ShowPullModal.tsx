import { Button, Card, Fab, Modal, Divider, Chip } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useState } from "react";
import { PadelPull } from "../domain/pull";
import { Player, PreferredSide } from "../domain/player";
import { Match } from "../domain/match";
import { useLanguage } from "../../i18n/useLanguage";
import PadelCourt from "../components/PadelCourt";

interface ShowPullModalProps {
  visible: boolean;
  players: Player[];
  onClose: () => void;
  onCopyMatches: (matches: Match[], reservePlayers: Player[]) => void;
}

const getImbalance = (players: Player[]): string | null => {
  const backhands = players.filter(p => p.preferredSide === PreferredSide.Backhand).length;
  const drives = players.filter(p => p.preferredSide === PreferredSide.Drive).length;
  const both = players.filter(p => p.preferredSide === PreferredSide.Both).length;

  const effectiveDrives = drives + both;
  const effectiveBackhands = backhands + both;

  if (backhands > effectiveDrives) return "drive";
  if (drives > effectiveBackhands) return "backhand";
  return null;
};

const ShowPullModal = ({ visible, players, onClose, onCopyMatches }: ShowPullModalProps) => {
  const { t } = useLanguage();
  const [forceGenerate, setForceGenerate] = useState(false);

  const imbalance = getImbalance(players);
  const showWarning = imbalance !== null && !forceGenerate;

  const [matches] = useState<Match[]>(() => {
    const pull = new PadelPull(players);
    return pull.generateMatches();
  });

  const reservePlayers = players.filter(player =>
    !matches.some(match =>
      match.local.backhandPlayer.id === player.id ||
      match.local.drivePlayer.id === player.id ||
      match.visitor.backhandPlayer.id === player.id ||
      match.visitor.drivePlayer.id === player.id
    )
  );

  if (!visible) return null;

  return (
    <Modal open={visible} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ 
  width: '95vw',
  maxWidth: 900,
  maxHeight: '90vh', 
  borderRadius: '20px !important', 
  outline: 'none', 
  overflow: 'hidden', 
  display: 'flex', 
  flexDirection: 'column' 
}}>

        <div style={{
          padding: '20px 24px 16px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ color: 'white', fontSize: 18 }}>🎾 {t("matches")}</h2>
          <Fab size="small" onClick={onClose} sx={{ background: 'rgba(255,255,255,0.2) !important', boxShadow: 'none !important' }}>
            <ClearIcon sx={{ color: 'white', fontSize: 18 }} />
          </Fab>
        </div>

        {showWarning && (
          <div style={{
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <WarningAmberIcon sx={{ fontSize: 48, color: '#f59e0b' }} />
            <p style={{ margin: 0, fontWeight: 600, fontSize: 16, color: '#1a1a2e' }}>
              {imbalance === 'drive'
                ? t("missingDrive")
                : t("missingBackhand")
              }
            </p>
            <p style={{ margin: 0, fontSize: 13, color: '#888' }}>
              {t("imbalanceWarning")}
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{ borderRadius: 2, textTransform: 'none', borderColor: '#e0e0e0', color: '#666' }}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                onClick={() => setForceGenerate(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  boxShadow: '0 4px 16px rgba(102,126,234,0.35)'
                }}
              >
                {t("generateAnyway")}
              </Button>
            </div>
          </div>
        )}

        
        {!showWarning && (
          <>
            <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px' }}>
              {matches.length === 0 ? (
  <p style={{ textAlign: 'center', color: '#888', padding: '32px 0' }}>
    {t("notEnoughPlayers")}
  </p>
) : (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16
  }}>
    {matches.map((match, index) => (
      <PadelCourt key={index} match={match} index={index} />
    ))}
  </div>
)}

              {reservePlayers.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#888', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t("reserves")}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {reservePlayers.map(player => (
                      <Chip key={player.id} label={player.name} size="small" sx={{ background: '#f0f0f8', color: '#666', fontWeight: 500 }} />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0' }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<ContentCopyIcon />}
                onClick={() => onCopyMatches(matches, reservePlayers)}
                sx={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 16px rgba(102,126,234,0.35)',
                  '&:hover': { boxShadow: '0 6px 20px rgba(102,126,234,0.5)' }
                }}
              >
                {t("copyMatches")}
              </Button>
            </div>
          </>
        )}
      </Card>
    </Modal>
  );
};

export default ShowPullModal;