import { Player } from "../domain/player";

export class PlayerStore {
  private static readonly STORAGE_KEY = 'players';

  public savePlayer(player: Player): void {
    const players = this.getAllPlayers();
    players.push(player);
    this.savePlayersToStorage(players);
  }

  public getAllPlayers(): Player[] {
    const data = localStorage.getItem(PlayerStore.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  public deletePlayer(id: string): void {
    const players = this.getAllPlayers().filter(player => player.id !== id);
    this.savePlayersToStorage(players);
  }

  public clearAll(): void {
    localStorage.removeItem(PlayerStore.STORAGE_KEY);
  }

  private savePlayersToStorage(players: Player[]): void {
    localStorage.setItem(PlayerStore.STORAGE_KEY, JSON.stringify(players));
  }
}