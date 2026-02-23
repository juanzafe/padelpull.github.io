import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';

import {
  Fab,
  IconButton,
  List,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Paper
} from "@mui/material";

import { Player, PreferredSide } from '../domain/player';
import { useLanguage } from "../../i18n/useLanguage";
import { Language } from "../../i18n/translations";

export interface PadelPullProps {
  players: Player[];
  onAddPlayerClick: () => void;
  onShowPullModalClick: () => void;
  onDeletePlayerClick: (player: Player) => void;
}

const PadelPull = ({
  players,
  onAddPlayerClick,
  onShowPullModalClick,
  onDeletePlayerClick
}: PadelPullProps) => {
  const { t, language, changeLanguage } = useLanguage();

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px', paddingBottom: 100 }}>
      <LanguageSelector language={language} changeLanguage={changeLanguage} />

      {/* Header */}
      <div style={{ textAlign: 'center', paddingTop: 56, paddingBottom: 32 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          marginBottom: 16,
          boxShadow: '0 8px 24px rgba(102,126,234,0.35)'
        }}>
          <SportsTennisIcon sx={{ color: 'white', fontSize: 28 }} />
        </div>
        <h1 style={{ fontSize: 28, color: '#1a1a2e' }}>{t("title")}</h1>
        {players.length > 0 && (
          <Chip
            label={`${players.length} jugadores`}
            size="small"
            sx={{
              marginTop: 1,
              background: 'rgba(102,126,234,0.12)',
              color: '#667eea',
              fontWeight: 600,
              fontSize: 12
            }}
          />
        )}
      </div>

      {players.length === 0 ? (
        <Paper elevation={0} sx={{
          textAlign: 'center',
          padding: '48px 24px',
          borderRadius: 4,
          background: 'white',
          border: '2px dashed #e0e0f0'
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎾</div>
          <p style={{ color: '#888', margin: 0, fontSize: 15, lineHeight: 1.6 }}>
            {t("empty")}
          </p>
        </Paper>
      ) : (
        <PlayersList players={players} onDeletePlayerClick={onDeletePlayerClick} />
      )}

      <GeneratePullButton onClick={onShowPullModalClick} />
      <AddPlayerButton onClick={onAddPlayerClick} />
    </div>
  );
};

/* ── Language Selector ── */

interface LanguageSelectorProps {
  language: Language;
  changeLanguage: (lang: Language) => void;
}

const LanguageSelector = ({ language, changeLanguage }: LanguageSelectorProps) => (
  <ToggleButtonGroup
    size="small"
    value={language}
    exclusive
    onChange={(_, value: Language | null) => { if (value) changeLanguage(value); }}
    sx={{ position: "fixed", top: 16, right: 16, zIndex: 10 }}
  >
    {(['es', 'en'] as Language[]).map(lang => (
      <ToggleButton
        key={lang}
        value={lang}
        sx={{
          fontSize: 11,
          fontWeight: 700,
          px: 1.5,
          border: '1px solid #e0e0f0 !important',
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, #667eea, #764ba2) !important',
            color: 'white !important',
          }
        }}
      >
        {lang.toUpperCase()}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);

/* ── Players List ── */

interface PlayersListProps {
  players: Player[];
  onDeletePlayerClick: (player: Player) => void;
}

const PlayersList = ({ players, onDeletePlayerClick }: PlayersListProps) => (
  <List sx={{ padding: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
    {players.map((player) => (
      <PlayerItem key={player.id} player={player} onDeletePlayerClick={onDeletePlayerClick} />
    ))}
  </List>
);

/* ── Player Item ── */

interface PlayerItemProps {
  player: Player;
  onDeletePlayerClick: (player: Player) => void;
}

const sideConfig: Record<PreferredSide, { emoji: string; label: string; color: string }> = {
  [PreferredSide.Backhand]: { emoji: '⬅️', label: 'Revés', color: '#667eea' },
  [PreferredSide.Drive]:    { emoji: '➡️', label: 'Derecha', color: '#764ba2' },
  [PreferredSide.Both]:     { emoji: '↔️', label: 'Ambos', color: '#f093fb' },
};

const PlayerItem = ({ player, onDeletePlayerClick }: PlayerItemProps) => {
  const side = sideConfig[player.preferredSide];

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 12px',
        borderRadius: 3,
        background: 'white',
        border: '1px solid #f0f0f8',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 16px rgba(102,126,234,0.12)' }
      }}
    >
      <IconButton
        size="small"
        onClick={() => onDeletePlayerClick(player)}
        sx={{
          color: '#ccc',
          '&:hover': { color: '#ff6b6b', background: '#fff0f0' }
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      <ListItemText
        primary={player.name}
        sx={{ ml: 1, '& .MuiListItemText-primary': { fontWeight: 600, fontSize: 15, color: '#1a1a2e' } }}
      />

      <Chip
        label={`${side.emoji} ${side.label}`}
        size="small"
        sx={{
          fontSize: 11,
          fontWeight: 600,
          background: `${side.color}15`,
          color: side.color,
          border: `1px solid ${side.color}30`
        }}
      />
    </Paper>
  );
};

/* ── FAB Buttons ── */

interface FabButtonProps { onClick: () => void; }

const AddPlayerButton = ({ onClick }: FabButtonProps) => (
  <Fab
    onClick={onClick}
    sx={{
      position: "fixed", bottom: 24, right: 24,
      background: 'linear-gradient(135deg, #667eea, #764ba2) !important',
      boxShadow: '0 8px 24px rgba(102,126,234,0.45) !important',
      '&:hover': { transform: 'scale(1.05)' },
      transition: 'transform 0.2s'
    }}
  >
    <AddIcon sx={{ color: 'white' }} />
  </Fab>
);

const GeneratePullButton = ({ onClick }: FabButtonProps) => (
  <Fab
    onClick={onClick}
    sx={{
      position: "fixed", bottom: 24, right: 88,
      background: 'white !important',
      border: '2px solid #667eea',
      boxShadow: '0 8px 24px rgba(102,126,234,0.2) !important',
      '&:hover': { transform: 'scale(1.05)', background: '#f8f8ff !important' },
      transition: 'transform 0.2s'
    }}
  >
    <ShuffleIcon sx={{ color: '#667eea' }} />
  </Fab>
);

export default PadelPull;