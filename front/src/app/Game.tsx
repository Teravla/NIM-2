// src/app/Game.tsx
"use client"; // Ajoute cette ligne pour marquer le composant comme client

import React, { useEffect, useRef } from "react";
import { Client, Room } from "colyseus.js"; // Assure-toi d'utiliser colyseus.js
import { MyRoomState } from "../../../Colyseus/src/rooms/schema/MyRoomState"; // Assure-toi que ce chemin est correct

const client = new Client("ws://localhost:2567"); // Connexion au serveur Colyseus

const Game: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        console.log("Game component mounted");
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        
        // Fonction pour dessiner le jeu
        function drawGame(heap: number) {
            if (!ctx) {
                console.error("CTX context is null");
                return;
            }
            if (!canvas) {
                console.error("Canvas context is null");
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("Jeu de Nim", 20, 30);

            for (let i = 0; i < heap; i++) {
                ctx.fillRect(50 + i * 30, 100, 10, 50); // Dessiner les allumettes
            }
        }

        // Rejoindre la salle Nim
        const joinNimRoom = async () => {
            const room: Room<MyRoomState> = await client.joinOrCreate("nim_room");
            console.log("✅ Connecté à la salle :", room); // 'id' doit être accessible ici
            
            room.onMessage("update", (state: MyRoomState) => {
                console.log("État mis à jour :", state);
                drawGame(state.heap); // Mettre à jour le canvas avec le nouvel état
            });
        };

        joinNimRoom().catch((error) => {
            console.error("Erreur lors de la connexion à la salle :", error);
        });

        // Simulation d'un état de jeu (à remplacer par Colyseus)
        let heap = 15;
        drawGame(heap);

        return () => {};
    }, []);

    return <canvas ref={canvasRef} width={600} height={400} style={{ border: "1px solid black" }} />;
};

export default Game;
