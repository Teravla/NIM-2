import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";

export class NimRoom extends Room<MyRoomState> {
    maxClients = 2; // 2 joueurs max

    onCreate() {
        this.setState(new MyRoomState()); // Initialisez l'état de la salle
        console.log("🕹️ Salle de jeu Nim créée !");

        this.onMessage("take", (client, amount: number) => {
            if (this.state.currentPlayer !== client.sessionId) return;

            if (amount < 1 || amount > 3 || this.state.heap < amount) return;

            this.state.heap -= amount;
            this.state.currentPlayer = this.clients.find(c => c.sessionId !== client.sessionId)?.sessionId || "";

            if (this.state.heap <= 0) {
                this.broadcast("gameOver", { winner: client.sessionId });
                this.disconnect();
            } else {
                this.broadcast("update", this.state);
            }
        });
    }

    onJoin(client: Client) {
        console.log(`👤 Joueur ${client.sessionId} rejoint la partie.`);
        if (!this.state.currentPlayer) {
            this.state.currentPlayer = client.sessionId;
        }
    }
}
