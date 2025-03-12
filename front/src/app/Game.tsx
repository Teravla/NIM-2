"use client";

import React, { useEffect, useState } from "react";
import { Client, Room } from "colyseus.js";
import { NimState } from "../../../Colyseus/src/rooms/schema/NimState";

const client = new Client("ws://localhost:2567");

interface GameProps {
    roomInfo: { state: "create" | "joinPublicParty" | "joinPrivateParty"; roomId: string | null };
}

const Game: React.FC<GameProps> = ({ roomInfo }) => {
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [room, setRoom] = useState<Room<NimState> | null>(null);

    useEffect(() => {
        const fetchOrCreatePlayerId = async () => {
            let storedId = localStorage.getItem("playerId");

            if (!storedId) {
                try {
                    const response = await fetch("/api/player");
                    console.log(response);
                    const data = await response.json();

                    if (data.id) {
                        localStorage.setItem("playerId", data.id);
                        setPlayerId(data.id);
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération du joueur :", error);
                }
            } else {
                setPlayerId(storedId);
            }
        };

        fetchOrCreatePlayerId();
    }, []);

    useEffect(() => {
        const joinRoom = async () => {
            if (!playerId) return;

            try {
                let joinedRoom: Room<NimState> | null = null;

                if (roomInfo.state === "create") {
                    joinedRoom = await client.create<NimState>("nim_room");
                } else if (roomInfo.state === "joinPublicParty") {
                    joinedRoom = await client.joinOrCreate<NimState>("nim_room");
                } else if (roomInfo.state === "joinPrivateParty" && roomInfo.roomId) {
                    joinedRoom = await client.joinById<NimState>(roomInfo.roomId);
                }

                if (joinedRoom) {
                    setRoom(joinedRoom);
                }
            } catch (error) {
                console.error("Erreur lors de la connexion à la salle :", error);
            }
        };

        joinRoom();
    }, [playerId]);

    return (
        <div>
            <h1>Jeu de Nim</h1>
            {playerId && <p>Votre UUID : {playerId}</p>}
            {room && <p>Connecté à la salle : {room.roomId}</p>}
        </div>
    );
};

export default Game;
