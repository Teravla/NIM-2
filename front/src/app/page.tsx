"use client";

import { useState } from "react";
import Game from "./Game";
import Reception from "./Reception";

export default function Home() {
    const [roomId, setRoomId] = useState<string | null>(null);

    return (
        <div>
            {roomId ? (
                <Game roomId={roomId} />
            ) : (
                <Reception onJoin={(id) => setRoomId(id)} />
            )}
        </div>
    );
}
