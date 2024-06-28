import React from 'react';
import "../../styles/LevelCompletedModal.css";
import LoadingDots from '../common/LoadingDots';

const LevelCompletedModal = ({ show, onClose, message, isLevelCompleted }) => {
    if (!show) return null;

    const isGameCompleted = message.includes("Has completado todos los niveles permitidos para tu equipo!") || message.includes("¡Has completado todos los niveles!");

    return (
        <div className="modal-overlay-levelcompleted">
            <div className="modal-levelcompleted">
                <p>{message}</p>
                {isGameCompleted ? (
                    <button onClick={onClose}>Finalizar Juego</button>
                ): isLevelCompleted ? (
                    <p>Cargando siguiente nivel<LoadingDots/></p>
                ) : (
                    <button onClick={onClose}>Siguiente Nivel</button>
                )}
            </div>
        </div>
    );
};

export default LevelCompletedModal;
