import React, {useEffect,useState} from "react";
import Modal from 'react-modal';
import axios from "axios";
import '../../styles/RankingModal.css'

const RankingModal = ({isOpen, onRequestClose}) => {
    const [scores, setScores] = useState ([]);
    const [filteredScores, setFilteredScores] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        if (isOpen) {
            axios.get('http://localhost:3001/get-scores')
            .then(response => {
                setScores(response.data);
            })
            .catch(error => console.error('error', error));
        }
    }, [isOpen]);

    useEffect(() => {
        let newFilteredScores = scores;
        if (filter !== 'All') {
            newFilteredScores = scores.filter(score => score.team === filter);
        }
        setFilteredScores(newFilteredScores.slice(0,10));
    },[filter, scores]);

    const handleFilterChange = (team) =>{
        setFilter(team);
    }
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Ranking"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <h2>Ranking</h2>
                <div className="filter-buttons">
                    <button onClick={() => handleFilterChange('1ero')}>1°</button>
                    <button onClick={() => handleFilterChange('2do')}>2°</button>
                    <button onClick={() => handleFilterChange('3ro')}>3°</button>
                </div>
            <table>
                <thead>
                    <tr>
                        <th>Posición</th>
                        <th>Nombre</th>
                        <th>Puntos</th>
                        <th>Equipo</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredScores.map((score, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{score.playerName}</td>
                            <td>{score.score}</td>
                            <td>{score.team}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="close-modal"onClick={onRequestClose}>Cerrar</button>
        </Modal>
    )    
}

export default RankingModal;