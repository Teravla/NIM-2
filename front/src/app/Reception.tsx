"use client";

import { useState, useEffect } from "react";
import { Client } from "colyseus.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import "../styles/Reception.css";
import { cn } from "@/lib/utils";

const client = new Client("ws://localhost:2567");

interface ReceptionProps {
    onJoin: (roomId: string) => void;
}

const Reception: React.FC<ReceptionProps> = ({ onJoin }) => {
    const [roomIdInput, setRoomIdInput] = useState("");
    const [method, setMethod] = useState("create");
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme-preference") as "light" | "dark" | null;
        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme-preference", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const handleRoomAction = async () => {
        try {
            let room;
            switch (method) {
                case "create":
                    room = await client.create("nim_room");
                    break;
                case "joinPublicParty":
                    room = await client.join("nim_room");
                    break;
                case "joinPrivateParty":
                    room = await client.joinById(roomIdInput);
                    break;
                default:
                    room = await client.joinOrCreate("nim_room");
                    break;
            }
            console.log(`✅ Connecté à la salle (${method}) :`, room.roomId);
            onJoin(room.roomId);
        } catch (error) {
            console.error(`❌ Erreur lors de ${method} :`, error);
        }
    };

    return (
        <div
            className={cn("flex justify-center items-center h-screen", theme === "dark" ? "text-white" : "text-gray-900")}
            style={{ backgroundColor: theme === "dark" ? "#2f4858" : "#fffafa" }}
        >
            <button
                className="theme-toggle absolute top-4 right-4"
                id="theme-toggle"
                title="Toggles light & dark"
                aria-label="auto"
                onClick={toggleTheme}
            >
                <svg className="sun-and-moon" aria-hidden="true" width="40" height="40" viewBox="0 0 24 24">
                    <mask className="moon" id="moon-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <circle cx="24" cy="10" r="6" fill="black" />
                    </mask>
                    <circle className="sun" cx="12" cy="12" r="5" mask="url(#moon-mask)" fill="currentColor" />
                    <g className="sun-beams" stroke="currentColor">
                        <line x1="12" y1="1" x2="12" y2="5" /> {/*N*/}
                        <line x1="12" y1="19" x2="12" y2="23" /> {/*S*/}
                        <line x1="4" y1="4" x2="7" y2="7" /> {/*NW*/}
                        <line x1="17" y1="17" x2="20" y2="20" /> {/*SE*/}
                        <line x1="1" y1="12" x2="5" y2="12" /> {/*W*/}
                        <line x1="19" y1="12" x2="23" y2="12" /> {/*E*/}
                        <line x1="4.22" y1="19.78" x2="7" y2="17" /> 
                        <line x1="17" y1="7" x2="19.78" y2="4.22" />
                    </g>
                </svg>
            </button>

            {/* Carte centrale */}
            <Card
                className="w-full max-w-md p-8 shadow-lg border rounded-xl transition-all duration-300"
                style={{
                    backgroundColor: theme === "dark" ? "#5e6678" : "#dbd1d5",
                    borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                    padding: "2rem",
                }}
            >
                <CardHeader>
                    <CardTitle className="text-center text-xl font-bold">Welcome</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    {/* Boutons radio pour choisir la méthode */}
                    <div className="flex flex-col space-y-2">
                        {["create", "joinPublicParty", "joinPrivateParty"].map((option) => (
                            <label key={option} className="flex items-center gap-x-3 space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value={option}
                                    checked={method === option}
                                    onChange={() => setMethod(option)}
                                    className="hidden"
                                />
                                <div
                                    className={cn(
                                        "w-5 h-5 border-2 rounded-full flex items-center justify-center",
                                        method === option ? "border-green-500" : "border-gray-500"
                                    )}
                                >
                                    {method === option && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                                </div>
                                <span>
                                    {option.replace(/([A-Z])/g, " $1").trim().replace(/^./, (str) => str.toUpperCase())}
                                </span>

                            </label>
                        ))}
                    </div>

                    {/* Champ ID de salle si nécessaire */}
                    {method === "joinById" && (
                        <Input
                            type="text"
                            value={roomIdInput}
                            onChange={(e) => setRoomIdInput(e.target.value)}
                            placeholder="ID de la salle"
                            className="w-full"
                        />
                    )}

                <Button
                    onClick={handleRoomAction}
                    className="w-full transition-all duration-200"
                    style={{ backgroundColor: "#7fd1ae", color: "#ffffff" }} // Couleur du bouton
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#5eb5a6")} // Couleur au survol
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#7fd1ae")} // Retour à la couleur initiale
                >
                    {method === "joinPrivateParty" ? "Rejoindre avec ID" : method === "create" ? "Créer une salle" : "Rejoindre une salle"}
                </Button>

                </CardContent>
            </Card>

        </div>
    );
};

export default Reception;
