import React from "react";
import Modal from "react-modal";
import '../../styles/OptionsModal.css'

const optionModal = ({isOpen, onRequestClose, isSoundEnable, toggleSound}) => {
    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Opciones"
        className="modal"
        overlayClassName="modal-overlay"
        >
            <h2>Opciones</h2>
            <label className="options-label">
                <input 
                type="checkbox"
                checked={isSoundEnable}
                onChange={toggleSound}
                />
                Musica
            </label>
            <button onClick={onRequestClose}>Cerrar</button>
        </Modal>
    )
}

export default optionModal;