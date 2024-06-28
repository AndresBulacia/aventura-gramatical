import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import '../../styles/Home.css';
import videoFondo from "../../assets/videos/fondo_hp.mp4"
import musicaFondo from "../../assets/sounds/musica_fondo.mp3"
import Sound_button from "../../assets/sounds/Sound_button.mp3";
import OptionsModal from "../modals/OptionsModal";
import RankingModal from "../modals/RankingModal";
import GameCompletedModal from "../modals/GameCompletedModal";

const Home = () => {
        const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
        const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
        const [isSoundEnabled, setIsSoundEnabled] = useState(true);
        const [hasUserInteracted, setIsHasUserInteracted] = useState(false);
        const [isGameCompletedModal, setIsGameCompletedModal] = useState(false);
        
        const navigate = useNavigate();

        const buttonClickSound = new Audio(Sound_button);

        //Funcion sonido boton
        const playSound = (audio) => {
            audio.play();
        }

        //FUNCION PARA ABRIR Y CERRAR LAS VENTANAS MODAL RANKING Y OPCIONES
        const openOptionsModal = () =>{
            playSound(buttonClickSound);
            setIsOptionsModalOpen(true);
        } 
        const closeOptionsModal = () =>{
            playSound(buttonClickSound);
            setIsOptionsModalOpen(false);
        } 
        const openRankingModal = () => {
            playSound(buttonClickSound);
            setIsRankingModalOpen(true);
        } 
        const closeRankingModal = () => {
            playSound(buttonClickSound);
            setIsRankingModalOpen(false);
        }
        const closeGameCompletedModal = () => {
            playSound(buttonClickSound);
            setIsGameCompletedModal(false);
        }
        //FUNCION PARA ALTERNAR EL ESTADO DEL SONIDO
        const toggleSound = () => {
            playSound(buttonClickSound);
            const newSoundEnabled = !isSoundEnabled;
            setIsSoundEnabled(newSoundEnabled);
            localStorage.setItem('isSoundEnabled', newSoundEnabled);
        }
        
        //EFFECT PARA AÑADIR 'active' DESPUES DE 2SEG
        useEffect(() => {
            const container = document.getElementById('home');
            const timeoutId = setTimeout(() => {
                container.classList.add('active');
            }, 1000);
            return () => clearTimeout(timeoutId);
        }, []);

        //EFFECT PARA CONTROLAR EL ESTADO DEL SONIDO EN LA PAGINA
        useEffect(() => {
            const savedSoundPreference = localStorage.getItem('isSoundEnabled');
            if (savedSoundPreference !== null) {
                setIsSoundEnabled(savedSoundPreference === 'true');
            }
        }, []);


        //EFFECT PARA REPRODUCIR O PAUSAR EL AUDIO
        useEffect(() => {
            const audioElement = document.getElementById('background-audio');
            if (hasUserInteracted && isSoundEnabled) {
                audioElement.play();
            }else {
                audioElement.pause();
            }
        }, [isSoundEnabled, hasUserInteracted]);

        const handleUserInteraction = () => {
            setIsHasUserInteracted(true);
        }

        const handlePlayClick = () => {
            playSound(buttonClickSound);
            const isGameCompleted = localStorage.getItem('GameCompleted','true');
            if (isGameCompleted) {
                setIsGameCompletedModal(true)
            }else{
                navigate('/game');
            }
        }

    return (
        <div>
            <div id="home" className="container" onClick={handleUserInteraction}>
                <h1 className="gradient-text title-home">Aventura Gramatical</h1>
                <div className="buttons">
                    <button onClick={handlePlayClick}>Jugar</button>
                    <button onClick={openRankingModal}>Ranking</button>
                    <button onClick={openOptionsModal}>Opciones</button>
                </div>

                <OptionsModal isOpen={isOptionsModalOpen} onRequestClose={closeOptionsModal} isSoundEnable={isSoundEnabled} toggleSound={toggleSound} />
                <RankingModal isOpen={isRankingModalOpen} onRequestClose={closeRankingModal} />
                <GameCompletedModal isOpen={isGameCompletedModal} onRequestClose={closeGameCompletedModal} />
            </div>
                <audio autoPlay loop id="background-audio">
                    <source src={musicaFondo}/>
                </audio>
                <video autoPlay muted loop id="background-video">
                    <source src={videoFondo} type="video/mp4"/>
                </video>
                <div className="video-overlay"></div>
        </div>
    );
};

export default Home;