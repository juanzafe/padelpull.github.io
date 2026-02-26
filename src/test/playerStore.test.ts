import { describe, it, expect, beforeEach } from "vitest";
import { PlayerStore } from "../storage/PlayersStore";
import { Player, PreferredSide } from "../domain/player";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

describe("PlayerStore", () => {
  let store: PlayerStore;

  beforeEach(() => {
    localStorage.clear();
    store = new PlayerStore();
  });

  it("guarda y recupera un jugador", () => {
    const player = new Player("1", "Pedro", PreferredSide.Drive);
    store.savePlayer(player);
    const players = store.getAllPlayers();
    expect(players).toHaveLength(1);
    expect(players[0].name).toBe("Pedro");
  });

  it("elimina un jugador por id", () => {
    const player = new Player("1", "Pedro", PreferredSide.Drive);
    store.savePlayer(player);
    store.deletePlayer("1");
    expect(store.getAllPlayers()).toHaveLength(0);
  });

  it("devuelve array vacío si no hay jugadores", () => {
    expect(store.getAllPlayers()).toHaveLength(0);
  });

  it("guarda múltiples jugadores", () => {
    store.savePlayer(new Player("1", "Pedro", PreferredSide.Drive));
    store.savePlayer(new Player("2", "Juan", PreferredSide.Backhand));
    expect(store.getAllPlayers()).toHaveLength(2);
  });

  it("no elimina otros jugadores al borrar uno", () => {
    store.savePlayer(new Player("1", "Pedro", PreferredSide.Drive));
    store.savePlayer(new Player("2", "Juan", PreferredSide.Backhand));
    store.deletePlayer("1");
    const players = store.getAllPlayers();
    expect(players).toHaveLength(1);
    expect(players[0].name).toBe("Juan");
  });
});
