"use client";

import React, { useEffect, useRef } from "react";
import { Client, Room } from "colyseus.js";
import { MyRoomState } from "../../../Colyseus/src/rooms/schema/MyRoomState";

const client = new Client("ws://localhost:2567");

interface GameProps {
    roomId: string;
}

const Game: React.FC<GameProps> = ({ roomId }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const roomRef = useRef<Room<MyRoomState> | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const drawGame = (heap: number) => {
            if (!ctx) {
                console.error("CTX context is null");
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("Jeu de Nim", 20, 30);

            for (let i = 0; i < heap; i++) {
                ctx.fillRect(50 + i * 30, 100, 10, 50);
            }
        };

        return () => {
            roomRef.current?.leave();
        };
    }, [roomId]);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: "100vw", height: "100vh", border: "1px solid black" }}
        />
    );
};

export default Game;
