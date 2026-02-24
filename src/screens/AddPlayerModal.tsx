import { v4 as uuidv4 } from "uuid";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Modal, TextField,
  Fab, Card, Chip
} from "@mui/material";

import { useState } from "react";
import { Player, PreferredSide } from "../domain/player";
import { useLanguage } from "../../i18n/useLanguage";
import { translations } from '../../i18n/translations';

interface AddPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  onAddPlayer: (player: Player) => void;
}

const sideOptions: {
  value: PreferredSide;
  emoji: string;
  color: string;
  tKey: keyof typeof translations.es;
}[] = [
  { value: PreferredSide.Backhand, emoji: '⬅️', color: '#667eea', tKey: 'backhand' },
  { value: PreferredSide.Drive,    emoji: '➡️', color: '#764ba2', tKey: 'drive'    },
  { value: PreferredSide.Both,     emoji: '↔️', color: '#f093fb', tKey: 'both'     },
];

const AddPlayerModal = ({ visible, onClose, onAddPlayer }: AddPlayerModalProps) => {
  const { t } = useLanguage();
  const [preferredSide, setPreferredSide] = useState<PreferredSide>(PreferredSide.Backhand);
  const [playerName, setPlayerName] = useState<string>("");

  const handleAddPlayer = () => {
    onAddPlayer(new Player(uuidv4(), playerName, preferredSide));
    setPlayerName("");
    setPreferredSide(PreferredSide.Backhand);
  };

  return (
    <Modal open={visible} onClose={onClose} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card sx={{ padding: '32px 28px', width: 360, borderRadius: '20px !important', outline: 'none' }}>

        <h2 style={{ textAlign: "center", color: '#1a1a2e', marginBottom: 24, fontSize: 20 }}>
          ➕ {t("addPlayer")}
        </h2>

        <TextField
          fullWidth
          label={t("name")}
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && playerName.trim()) handleAddPlayer(); }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&.Mui-focused fieldset': { borderColor: '#667eea' }
            },
            '& label.Mui-focused': { color: '#667eea' }
          }}
        />

        <div style={{ marginTop: 20, marginBottom: 8 }}>
          <p style={{ fontSize: 13, color: '#888', margin: '0 0 10px 2px', fontWeight: 500 }}>
            {t("side")}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {sideOptions.map(opt => (
              <Chip
                key={opt.value}
                label={`${opt.emoji} ${t(opt.tKey)}`}
                onClick={() => setPreferredSide(opt.value)}
                sx={{
                  flex: 1,
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: 'pointer',
                  border: `2px solid ${preferredSide === opt.value ? opt.color : 'transparent'}`,
                  background: preferredSide === opt.value ? `${opt.color}15` : '#f5f5f5',
                  color: preferredSide === opt.value ? opt.color : '#666',
                  transition: 'all 0.2s',
                  '&:hover': { background: `${opt.color}20` }
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Fab size="small" onClick={onClose} sx={{ background: '#f5f5f5 !important', boxShadow: 'none !important' }}>
            <ClearIcon sx={{ color: '#999' }} />
          </Fab>
          <Fab
            size="small"
            disabled={!playerName.trim()}
            onClick={handleAddPlayer}
            sx={{
              background: 'linear-gradient(135deg, #667eea, #764ba2) !important',
              boxShadow: '0 4px 16px rgba(102,126,234,0.4) !important',
              '&.Mui-disabled': { background: '#e0e0e0 !important' }
            }}
          >
            <CheckIcon sx={{ color: 'white' }} />
          </Fab>
        </div>
      </Card>
    </Modal>
  );
};

export default AddPlayerModal;