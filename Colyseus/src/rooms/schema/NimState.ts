import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
    @type("string") id: string;
    @type("boolean") isTurn: boolean;
}

export class NimState extends Schema {
    @type(["number"]) piles: number[] = [3, 4, 5]; // Tas d'allumettes
    @type("string") currentPlayer: string = ""; // ID du joueur en cours
    @type({ map: Player }) players = new MapSchema<Player>();
}
