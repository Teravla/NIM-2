"use client";

import React, { useEffect, useRef } from "react";
import { Client, Room } from "colyseus.js";
import { NimState } from "../../../Colyseus/src/rooms/schema/NimState";
import { v4 as uuidv4 } from 'uuid'; // Assurez-vous d'avoir installé uuid

// Création d'un client Colyseus
const client = new Client("ws://localhost:2567");

interface GameProps {
    roomInfo: { state: "create" | "joinPublicParty" | "joinPrivateParty"; roomId: string | null };
}

const Game: React.FC<GameProps> = ({ roomInfo }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const roomRef = useRef<Room<NimState> | null>(null);
    const playerIdRef = useRef<string | null>(null);

    useEffect(() => {
        // Générer ou récupérer l'UUID du joueur
        const getPlayerId = () => {
            const storedId = localStorage.getItem("playerId");
            if (storedId) {
                return storedId; // Utiliser l'UUID existant
            } else {
                const newId = uuidv4(); // Générer un nouvel UUID
                localStorage.setItem("playerId", newId);
                return newId;
            }
        };

        playerIdRef.current = getPlayerId();

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("CTX context is null");
            return;
        }

        // Fonction pour connecter le joueur à la salle
        const connectToRoom = async (roomInfo: { state: string; roomId: string | null }) => {
            try {
                if (roomInfo.state === "create") {
                    roomRef.current = await client.create("nim_room");
                    console.log("Salle créée avec succès :", roomRef.current.roomId);
                } else if (roomInfo.state === "joinPublicParty") {
                    roomRef.current = await client.join("nim_room");
                    console.log("Rejoint une partie publique :", roomRef.current.roomId);
                } else if (roomInfo.state === "joinPrivateParty" && roomInfo.roomId) {
                    roomRef.current = await client.joinById(roomInfo.roomId);
                    console.log("Rejoint une partie privée :", roomRef.current.roomId);
                } else {
                    console.error("État de salle non reconnu ou ID de salle manquant");
                    return;
                }

                // Écouter les mises à jour de l'état de la salle
                roomRef.current.onStateChange((state) => {
                    drawGame(state.piles); // Mettre à jour l'affichage avec l'état actuel
                });

                roomRef.current.onMessage("gameOver", (data) => {
                    console.log(`🎮 Partie terminée ! Vainqueur : ${data.winner}`);
                    // Gérer la fin de la partie ici (afficher un message, réinitialiser le jeu, etc.)
                });
            } catch (error) {
                console.error("Erreur lors de la connexion à la salle :", error);
            }
        };

        // Fonction pour dessiner le jeu
        const drawGame = (piles: number[]) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("Jeu de Nim", 20, 30);

            piles.forEach((heap, index) => {
                for (let i = 0; i < heap; i++) {
                    ctx.fillRect(50 + index * 30, 100 - i * 10, 10, 10); // Ajuster la position et la taille des rectangles
                }
            });
        };

        connectToRoom(roomInfo);

        // Enregistrer les informations de salle dans le localStorage lors de la déconnexion
        const saveRoomInfo = () => {
            if (roomRef.current) {
                const currentRoomInfo = {
                    state: roomInfo.state,
                    roomId: roomRef.current.roomId,
                };
                localStorage.setItem("roomInfo", JSON.stringify(currentRoomInfo));
            }
        };

        window.addEventListener("beforeunload", saveRoomInfo);

        return () => {
            saveRoomInfo();
            roomRef.current?.leave();
            window.removeEventListener("beforeunload", saveRoomInfo);
        };
    }, [roomInfo]); // Dépendance sur roomInfo

    return (
        <canvas
            ref={canvasRef}
            style={{ width: "100vw", height: "100vh", border: "1px solid black" }}
        />
    );
};

export default Game;
