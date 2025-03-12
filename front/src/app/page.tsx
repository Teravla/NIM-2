"use client";

import { useEffect, useState } from "react";
import Game from "@/app/Game";
import Reception from "@/app/Reception";

export default function Home() {
    const [roomInfo, setRoomInfo] = useState<{ state: "create" | "joinPublicParty" | "joinPrivateParty"; roomId: string | null } | null>(null);

    useEffect(() => {
        // Récupérer les informations de salle du localStorage
        const storedRoomInfo = localStorage.getItem("roomInfo");
        if (storedRoomInfo) {
            setRoomInfo(JSON.parse(storedRoomInfo));
        }
    }, []);

    return (
        <div>
            {roomInfo ? (
                <Game roomInfo={roomInfo} /> // Assurez-vous que roomId n'est pas null
            ) : (
                <Reception onRoomJoin={setRoomInfo} />
            )}
        </div>
    );
}
