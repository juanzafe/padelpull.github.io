import "./index.css";
import { useState } from "react"
import PadelPull from "./screens/PadelPull"
import FullScreen from "./utils/FullScreen"
import { PlayerStore } from "./storage/PlayersStore";
import { Player } from "./domain/player";
import AddPlayerModal from "./screens/AddPlayerModal";
import ShowPullModal from "./screens/ShowPullModal";
import { MatchesClipboard } from "./clipboard/MatchesClipboard";
import { useLanguage } from "../i18n/useLanguage";

const storage = new PlayerStore();

function App() {
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showPullModal, setShowPullModal] = useState(false);
  const [pullModalKey, setPullModalKey] = useState(0);
  const [players, setPlayers] = useState(storage.getAllPlayers());

  const onAddPlayerClick = () => setShowAddPlayerModal(true);

  const onDeletePlayer = (player: Player) => {
    storage.deletePlayer(player.id);
    setPlayers(storage.getAllPlayers());
  };

  const onCloseAddPlayerModal = () => setShowAddPlayerModal(false);

  const onAddPlayer = (player: Player) => {
    storage.savePlayer(player);
    setPlayers(storage.getAllPlayers());
  };

  const onShowPullModalClick = () => {
    setPullModalKey(prev => prev + 1);
    setShowPullModal(true);
  };

  return (
    <FullScreen>
      <PadelPull
        players={players}
        onAddPlayerClick={onAddPlayerClick}
        onShowPullModalClick={onShowPullModalClick}
        onDeletePlayerClick={onDeletePlayer}
      />
      <AddPlayerModal
        onAddPlayer={onAddPlayer}
        visible={showAddPlayerModal}
        onClose={onCloseAddPlayerModal}
      />
      <ShowPullModal
        key={pullModalKey}
        players={players}
        visible={showPullModal}
        onClose={() => setShowPullModal(false)}
        onCopyMatches={(matches, reservePlayers) => {
          new MatchesClipboard(matches, reservePlayers).copyToClipboard();
        }}
      />
      <Authors />
    </FullScreen>
  );
}

const Authors = () => {
  const { t } = useLanguage();

  return (
    <p style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      margin: 0,
      padding: '8px 16px',
      textAlign: 'center',
      color: '#aaa',
      fontSize: 11,
      fontWeight: 500,
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(8px)',
      borderTop: '1px solid #f0f0f0',
      letterSpacing: '0.02em'
    }}>
      {t("authors")}{' '}
      <a href="https://x.com/pedro_g_s" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600 }}>
        Pedro Gómez
      </a>
      {' '}& Juan Zamudio
    </p>
  );
};

export default App;