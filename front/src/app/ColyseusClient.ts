import { Client, Room } from "colyseus.js"; // Assure-toi d'utiliser colyseus.js
import { MyRoomState } from "../../../Colyseus/src/rooms/schema/MyRoomState";

const client = new Client("ws://localhost:2567");

export async function joinNimRoom(updateGameState: (heap: number) => void) {
    const room: Room<MyRoomState> = await client.joinOrCreate("nim");
    console.log("✅ Connecté à la salle :", room); // 'id' doit être accessible ici

    room.onMessage("update", (state: MyRoomState) => {
        console.log("État mis à jour :", state);
        updateGameState(state.heap);
    });

    return room;
}
