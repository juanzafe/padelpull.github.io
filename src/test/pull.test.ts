import { describe, it, expect } from "vitest";
import { PadelPull } from "../domain/pull";
import { Player, PreferredSide } from "../domain/player";

const makePlayer = (name: string, side: PreferredSide) => new Player(name, name, side);

describe("PadelPull", () => {
  describe("generateMatches", () => {
    it("genera 1 partido con 4 jugadores", () => {
      const pull = new PadelPull([
        makePlayer("A", PreferredSide.Backhand),
        makePlayer("B", PreferredSide.Drive),
        makePlayer("C", PreferredSide.Backhand),
        makePlayer("D", PreferredSide.Drive),
      ]);
      const matches = pull.generateMatches();
      expect(matches).toHaveLength(1);
    });

    it("genera 2 partidos con 8 jugadores", () => {
      const pull = new PadelPull([
        makePlayer("A", PreferredSide.Backhand),
        makePlayer("B", PreferredSide.Drive),
        makePlayer("C", PreferredSide.Backhand),
        makePlayer("D", PreferredSide.Drive),
        makePlayer("E", PreferredSide.Backhand),
        makePlayer("F", PreferredSide.Drive),
        makePlayer("G", PreferredSide.Backhand),
        makePlayer("H", PreferredSide.Drive),
      ]);
      const matches = pull.generateMatches();
      expect(matches).toHaveLength(2);
    });

    it("no genera partidos con menos de 4 jugadores", () => {
      const pull = new PadelPull([
        makePlayer("A", PreferredSide.Backhand),
        makePlayer("B", PreferredSide.Drive),
        makePlayer("C", PreferredSide.Backhand),
      ]);
      const matches = pull.generateMatches();
      expect(matches).toHaveLength(0);
    });

    it("no repite jugadores en distintos partidos", () => {
      const players = [
        makePlayer("A", PreferredSide.Backhand),
        makePlayer("B", PreferredSide.Drive),
        makePlayer("C", PreferredSide.Backhand),
        makePlayer("D", PreferredSide.Drive),
        makePlayer("E", PreferredSide.Backhand),
        makePlayer("F", PreferredSide.Drive),
        makePlayer("G", PreferredSide.Backhand),
        makePlayer("H", PreferredSide.Drive),
      ];
      const pull = new PadelPull(players);
      const matches = pull.generateMatches();

      const usedIds = matches.flatMap((m) => [
        m.local.backhandPlayer.id,
        m.local.drivePlayer.id,
        m.visitor.backhandPlayer.id,
        m.visitor.drivePlayer.id,
      ]);

      const uniqueIds = new Set(usedIds);
      expect(uniqueIds.size).toBe(usedIds.length);
    });

    it("funciona con jugadores de lado Both", () => {
      const pull = new PadelPull([
        makePlayer("A", PreferredSide.Both),
        makePlayer("B", PreferredSide.Both),
        makePlayer("C", PreferredSide.Both),
        makePlayer("D", PreferredSide.Both),
      ]);
      const matches = pull.generateMatches();
      expect(matches).toHaveLength(1);
    });

    it("funciona con mezcla de Backhand y Both", () => {
      const pull = new PadelPull([
        makePlayer("A", PreferredSide.Backhand),
        makePlayer("B", PreferredSide.Backhand),
        makePlayer("C", PreferredSide.Both),
        makePlayer("D", PreferredSide.Both),
      ]);
      const matches = pull.generateMatches();
      expect(matches).toHaveLength(1);
    });

    it("cada equipo tiene exactamente 2 jugadores", () => {
      const pull = new PadelPull([
        makePlayer("A", PreferredSide.Backhand),
        makePlayer("B", PreferredSide.Drive),
        makePlayer("C", PreferredSide.Backhand),
        makePlayer("D", PreferredSide.Drive),
      ]);
      const matches = pull.generateMatches();
      matches.forEach((match) => {
        expect(match.local.backhandPlayer).toBeDefined();
        expect(match.local.drivePlayer).toBeDefined();
        expect(match.visitor.backhandPlayer).toBeDefined();
        expect(match.visitor.drivePlayer).toBeDefined();
      });
    });
  });
});
