import { Match, Team } from "./match";
import { Player, PreferredSide } from "./player";

export class PadelPull {
  private players: Player[];

  constructor(players: Player[] = []) {
    this.players = [...players];
  }

  generateMatches(): Match[] {
    const pullMatches: Match[] = [];
    const numberOfMatches = Math.floor(this.players.length / 4);

    for (let i = 0; i < numberOfMatches; i++) {
      const team1 = this.generateTeam();
      const team2 = this.generateTeam();
      if (team1 && team2) {
        pullMatches.push(new Match(team1, team2));
      }
    }

    return pullMatches;
  }

  private generateTeam(): Team | undefined {
    if (this.players.length < 2) return undefined;

    let player1: Player | undefined;
    let player2: Player | undefined;

    const byPreference = (side: PreferredSide) => this.getPlayers(side);

    // Buscar pareja compatible priorizando lado preferido
    const backhand = byPreference(PreferredSide.Backhand);
    const drive = byPreference(PreferredSide.Drive);
    const both = byPreference(PreferredSide.Both);

    if (backhand.length > 0 && drive.length > 0) {
      player1 = this.pickRandom(backhand)!;
      this.remove(player1);
      player2 = this.pickRandom(this.getPlayers(PreferredSide.Drive))!;
      this.remove(player2);
    } else if (backhand.length > 0 && both.length > 0) {
      player1 = this.pickRandom(backhand)!;
      this.remove(player1);
      player2 = this.pickRandom(this.getPlayers(PreferredSide.Both))!;
      this.remove(player2);
    } else if (drive.length > 0 && both.length > 0) {
      player1 = this.pickRandom(drive)!;
      this.remove(player1);
      player2 = this.pickRandom(this.getPlayers(PreferredSide.Both))!;
      this.remove(player2);
    } else {
      // Fallback: cualquier dos jugadores (ej: 2 Both, 2 Backhand solos, etc.)
      player1 = this.pickRandom(this.players)!;
      this.remove(player1);
      player2 = this.pickRandom(this.players)!;
      this.remove(player2);
    }

    if (!player1 || !player2) return undefined;

    // Asignar posición en el equipo
    const isPlayer1Drive = player1.preferredSide === PreferredSide.Drive;
    const backhandPlayer = isPlayer1Drive ? player2 : player1;
    const drivePlayer = isPlayer1Drive ? player1 : player2;

    return new Team(backhandPlayer, drivePlayer);
  }

  private remove(player: Player): void {
    this.players = this.players.filter(p => p.id !== player.id);
  }

  private getPlayers(side: PreferredSide): Player[] {
    return this.players.filter(p => p.preferredSide === side);
  }

  private pickRandom<T>(arr: T[]): T | undefined {
    if (arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
  }
}