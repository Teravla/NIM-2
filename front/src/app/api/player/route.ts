import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "../prismaClient";


export async function GET() {
    try {
        console.log("Connexion à Prisma...");

        let player = await prisma.user.findFirst(); // Assurez-vous que le modèle "user" existe dans le schéma
        console.log("Joueur trouvé ?", player);

        if (!player) {
            console.log("Aucun joueur trouvé, création d'un nouveau...");

            const newId = uuidv4();
            player = await prisma.user.create({
                data: { id: newId },
            });

            console.log("Joueur créé :", player);
        }

        return NextResponse.json({ id: player.id });
    } catch (error) {
        console.error("Erreur Prisma :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
