import Modal from "react-modal";
import "../../styles/GameCompletedModal.css";

const GameCompletedModal = ({ isOpen, onRequestClose}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <p className="message-game-completed">Ya has completado todos los niveles!</p>
      <button onClick={onRequestClose}>Cerrar</button>
    </Modal>
  );
};

export default GameCompletedModal;
