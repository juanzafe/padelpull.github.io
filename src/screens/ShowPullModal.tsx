import { Button, Card, Fab, Modal, Divider, Chip } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from "react";
import { PadelPull } from "../domain/pull";
import { Player } from "../domain/player";
import { Match } from "../domain/match";
import { useLanguage } from "../../i18n/useLanguage";

interface ShowPullModalProps {
  visible: boolean;
  players: Player[];
  onClose: () => void;
  onCopyMatches: (matches: Match[], reservePlayers: Player[]) => void;
}

const ShowPullModal = ({ visible, players, onClose, onCopyMatches }: ShowPullModalProps) => {
  const { t } = useLanguage();

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
      <Card sx={{ width: 400, maxHeight: '85vh', borderRadius: '20px !important', outline: 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
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

        {/* Content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px' }}>
          {matches.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', padding: '32px 0' }}>{t("notEnoughPlayers")}</p>
          ) : (
            matches.map((match, index) => (
              <div key={index} style={{
                background: '#f8f8ff',
                border: '1px solid #e8e8f8',
                borderRadius: 12,
                padding: '12px 16px',
                marginBottom: 10
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Chip
                    label={`#${index + 1}`}
                    size="small"
                    sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', fontWeight: 700, fontSize: 11 }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <span style={{ fontWeight: 600, color: '#1a1a2e', flex: 1 }}>
                    {match.local.backhandPlayer.name} / {match.local.drivePlayer.name}
                  </span>
                  <span style={{ color: '#999', fontWeight: 700, fontSize: 12 }}>VS</span>
                  <span style={{ fontWeight: 600, color: '#1a1a2e', flex: 1, textAlign: 'right' }}>
                    {match.visitor.backhandPlayer.name} / {match.visitor.drivePlayer.name}
                  </span>
                </div>
              </div>
            ))
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

        {/* Footer */}
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
      </Card>
    </Modal>
  );
};

export default ShowPullModal;