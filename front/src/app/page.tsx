"use client";

import { useState } from "react";
import Game from "./Game";
import Reception from "./Reception";

export default function Home() {
    const [roomInfo, setRoomInfo] = useState<{ state: "create" | "joinPublicParty" | "joinPrivateParty"; roomId: string | null } | null>(null);

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
