import { Schema, type } from "@colyseus/schema";

export class MyRoomState extends Schema {
    @type("number") heap = 15; // 15 allumettes au départ
    @type("string") currentPlayer = ""; // Le joueur qui joue
}
