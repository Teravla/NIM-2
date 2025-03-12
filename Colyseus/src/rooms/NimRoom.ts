import { Room, Client } from "colyseus";
import { NimState, Player } from "./schema/NimState";

export class NimRoom extends Room<NimState> {
    maxClients = 2;

    onCreate() {
        this.state = new NimState();
        console.log("🕹️ Salle de jeu Nim créée !");

        this.onMessage("move", (client, { pileIndex, amount }) => {
            if (this.state.currentPlayer !== client.sessionId) return;
            if (amount < 1 || this.state.piles[pileIndex] < amount) return;

            this.state.piles[pileIndex] -= amount;

            if (this.state.piles.every(p => p === 0)) {
                this.broadcast("gameOver", { winner: client.sessionId });
                this.disconnect();
            } else {
                this.switchTurn();
                this.broadcast("update", this.state);
            }
        });
    }

    onJoin(client: Client) {
        console.log(`👤 Joueur ${client.sessionId} rejoint la partie.`);
        
        const newPlayer = new Player();
        newPlayer.id = client.sessionId;
        newPlayer.isTurn = this.state.players.size === 0; // Le premier joueur commence
        
        this.state.players.set(client.sessionId, newPlayer);

        if (this.state.players.size === 2) {
            this.state.currentPlayer = client.sessionId;
            this.broadcast("update", this.state);
        }
    }

    switchTurn() {
        const playersArray = Array.from(this.state.players.values());
        this.state.currentPlayer = playersArray.find(p => p.id !== this.state.currentPlayer)?.id || "";
    }
}
