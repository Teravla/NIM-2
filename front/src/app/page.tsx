// src/app/page.tsx
import React from 'react';
import Game from './Game'; // Assurez-vous que le chemin d'importation est correct

const Home: React.FC = () => {
    return (
        <div>
            <Game /> {/* Rend le composant Game ici */}
        </div>
    );
};

export default Home;
