import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import data from '../data/levels.json';
import '../../styles/Game.css';
import videoFondo from "../../assets/videos/fondo_hp.mp4";
import TypeWriter from '../common/typewriter.jsx';
import axios from "axios";
import bosqueProhibidoEscena from '../../assets/videos/bosque_prohibido.mp4';
import bibliotecaEscena from '../../assets/videos/escena_biblioteca.mp4';
import salaMenesteresEscena from '../../assets/videos/sala_menesteres_escena.mp4';
import sfxSoundZoom from '../../assets/sounds/sfx_sound_zoom.mp3';
import Sound_button from "../../assets/sounds/Sound_button.mp3";
import levelcompleted_sound from "../../assets/sounds/level_completed.mp3";
import wronganswer_sound from "../../assets/sounds/wrong_answer.mp3";
import correctanswer_sound from "../../assets/sounds/correct_answer.mp3";
import LevelCompletedModal from "../modals/LevelCompletedModal";
import videoFondo_Level2 from '../../assets/videos/fondo_nivel2.mp4';
import videoFondo_Level3 from '../../assets/videos/fondo_nivel3.mp4';

const Game = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentSublevel, setCurrentSublevel] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [team, setTeam] = useState(null);
  const [task, setTask] = useState(null);
  const [selectedWords, setSelectedWords] = useState([]);
  const [ShowStartButton, setShowStartButton] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showLevelIntro, setShowLevelIntro] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [ShowLevelDescription, setShowLevelDescription] = useState(false);
  const [ShowSubLevelDescription, setShowSubLevelDescription] = useState(false);

  const navigate = useNavigate();

  const buttonClickSound = new Audio(Sound_button);
  const buttonCorrectAnswer = new Audio(correctanswer_sound);
  const buttonWrongAnswer = new Audio(wronganswer_sound);
  const buttonLevelCompleted = new Audio(levelcompleted_sound);

        //Funcion sonido boton
        const playSound = (audio) => {
            audio.play();
        }

  useEffect(() => {
    const savedSoundPreference = localStorage.getItem('isSoundEnabled');
    if (savedSoundPreference !== null) {
      setIsSoundEnabled(savedSoundPreference === 'true');
    }
  }, [isSoundEnabled]);

  const handleNameInput = (e) => {
    setPlayerName(e.target.value);
  }

  const handleNameSubmit = () => {
    localStorage.setItem('playerName', playerName);
    playSound(buttonClickSound);
    setStep(2);
  }

  useEffect(() => {
    if (team) {
      setCurrentLevel(0);
    }
  }, [team]);

  useEffect(() => {
    if (data.levels[currentLevel]?.sublevels[currentSublevel]?.tasks[currentTaskIndex]) {
      setTask(data.levels[currentLevel].sublevels[currentSublevel].tasks[currentTaskIndex]);
      setSelectedWords([]);
    }
  }, [currentLevel, currentSublevel, currentTaskIndex]);

  const saveScore = async (newScore) => {
    try {
      await axios.post('monorail.proxy.rlwy.net:13277/save-score', {
        playerName,
        score: newScore,
        team
      });
    } catch (error) {
      console.error('Error saving score', error);
    }
  };

  const handleAnswerClick = (answer) => {
    if (task.type === "sentence-construction") {
      setSelectedWords([...selectedWords, answer]);
    } else {
      let newScore = score;
      if (task.answer[Object.keys(task.answer)[0]] === answer) {
        playSound(buttonCorrectAnswer);
        setModalMessage(`Correcto! \nPuntos obtenidos: 100`);
        setShowModal(true);
        newScore += 100;
      } else {
        playSound(buttonWrongAnswer);
        setModalMessage('Respuesta incorrecta! -20 puntos');
        setShowModal(true);
        newScore -= 20;
      }
      setScore(newScore);
      saveScore(newScore);
    }
  };

  const closeModal = () => {
    if (modalMessage.includes("Has completado todos los niveles permitidos para tu equipo!") || modalMessage.includes("¡Has completado todos los niveles!")) {
        navigate('/');
    } else {
        setShowModal(false);
        setShowLevelIntro(false);
        nextTask();
    }
  };

  const handleSubmitSentence = () => {
    const constructedSentence = selectedWords.join(" ");
    if (constructedSentence) {
      let newScore = score;
      if (constructedSentence === task.answer) {
        playSound(buttonCorrectAnswer);
        setModalMessage(`Correcto! \nPuntos obtenidos: 100`);
        setShowModal(true);
        newScore += 100;
      } else {
        playSound(buttonWrongAnswer);
        setModalMessage('Respuesta incorrecta! -20 puntos');
        setShowModal(true);
        newScore -= 20;
      }
      setScore(newScore);
      saveScore(newScore);
      nextTask();
    } else {
      playSound(buttonWrongAnswer);
      setModalMessage('No has formado una oración completa.');
    }
  };

  const handleReset = () => {
    setSelectedWords([]);
  }

  const nextTask = () => {
    const sublevels = data.levels[currentLevel].sublevels;
    const tasks = sublevels[currentSublevel].tasks;

    if (currentTaskIndex < tasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
    } else if (currentSublevel < sublevels.length - 1) {
        setCurrentSublevel(currentSublevel + 1);
        setCurrentTaskIndex(0);
        setShowLevelDescription(false);
        setShowSubLevelDescription(true);
    } else if (currentLevel < data.levels.length - 1) {
        if ((team === '1ero' && currentLevel + 1 < 1) || (team === '2do' && currentLevel + 1 < 2) || team === '3ro') {
            playSound(buttonLevelCompleted);
            setModalMessage(`Has completado el nivel ${currentLevel + 1}! Tus puntos actuales son: ${score}`);
            setShowModal(true);
            setIsLevelCompleted(true);
            setTimeout(() => {
                setCurrentLevel(currentLevel + 1);
                setCurrentSublevel(0);
                setCurrentTaskIndex(0);
                setShowLevelIntro(true);
                setShowModal(false);
                setShowVideo(false);
                setIsLevelCompleted(false);
            }, 5000);
        } else {
            playSound(buttonLevelCompleted);
            setModalMessage(`Has completado todos los niveles permitidos para tu equipo! Tus puntos totales son: ${score}`);
            sendGameCompletedInfo(true);
            localStorage.setItem("GameCompleted", "true")
            setShowModal(true);
        }
    } else {
        playSound(buttonLevelCompleted);
        setModalMessage(`¡Has completado todos los niveles! Tus puntos totales son: ${score}`);
        setShowModal(true);
    }
  };
  const sendGameCompletedInfo = async (completed) => {
    try {
      const response = await axios.post('monorail.proxy.rlwy.net:13277/complete-game', {
        playerName,
        score,
        team,
        completed
      });
      console.log('Game completion info sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending game completion info:', error);
    }
  };

  const startLevel = () => {
    playSound(buttonClickSound);
    setShowLevelIntro(false);
    setShowLevelDescription(false);
    setShowSubLevelDescription(false);
  }

  const startLevelIntro = () => {
    playSound(buttonClickSound);
    setShowLevelIntro(false);
    setShowLevelDescription(true);
  }
  const startSubLevelIntro = () => {
    playSound(buttonClickSound);
    setShowSubLevelDescription(true);
    setShowLevelDescription(false);
  }


  const renderLevelIntro = () => {
    const levelTitles = ["Bosque Prohibido", "Biblioteca", "Sala Menesteres"];
    const levelVideo = [bosqueProhibidoEscena, bibliotecaEscena, salaMenesteresEscena];
    return (
      <div className="container active">
        <audio src={sfxSoundZoom} autoPlay/>
        <h1 className="zoom-in-title" onAnimationEnd={() => setShowVideo(true)}>{levelTitles[currentLevel]}</h1>
        {showVideo && (
          <>
            <video autoPlay className="escenas fade-in-video" onEnded={startLevelIntro}>
              <source src={levelVideo[currentLevel]} type="video/mp4"/>
            </video>
            <button className="start-button-escenas" onClick={startLevelIntro}>Comenzar Nivel</button>
          </>
        )}
        <video autoPlay muted loop id="background-video"><source src={videoFondo} type="video/mp4"/></video>        
        <div className="video-overlay"></div>
      </div>
    )
  }

  const renderLevelDescription = () => {
    const levelIntro = data.levels[currentLevel].intro;
    return (
      <div className="container active">
        <div className="typewriter-text">
          <TypeWriter
            text={levelIntro}
            onComplete={() => setShowStartButton(true)}
          />
        </div>
        {ShowStartButton && (
          <div className="fade-in-content">
            <button className="start-button" onClick={startSubLevelIntro}>Comenzar</button>
          </div>
        )}
        <video autoPlay muted loop id="background-video">
          <source src={videoFondo} type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>
    );
  };
  const renderSubLevelDescription = () => {
    const SublevelIntro = data.levels[currentLevel].sublevels[currentSublevel].description;
    return (
      <div className="container active">
        <div className="typewriter-text">
          <p>{SublevelIntro}</p>
        </div>
        {ShowStartButton && (
          <div className="fade-in-content">
            <button className="start-button" onClick={startLevel}>Comencemos!</button>
          </div>
        )}
        <video autoPlay muted loop id="background-video">
          <source src={videoFondo} type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>
    );
  };

  const getBackgroundVideo = () => {
    if (currentLevel === 1) {
      return videoFondo_Level2;
    } else if (currentLevel === 2) {
      return videoFondo_Level3;
    } else {
      return videoFondo;
    }
  };

  if (step === 0) {
    return (
      <div className="container active">
        <div className="typewriter-text">
          <TypeWriter
            text="¡¡Bienvenidos al mundo gramático de Harry Potter!! Un mundo mágico lleno de aventuras 
              y palabras. Como estudiantes de la famosa escuela de magia y hechicería, Harry 
              necesita dominar el arte del análisis sintáctico para ser un mago excepcional. 
              El profesor Dumbledore te asignó la importante tarea de ayudar a Harry a 
              identificar los complementos y modificadores del sujeto y el predicado en 
              diferentes oraciones mágicas. ¡Prepárate para sumergirte en el mundo de la 
              sintaxis mientras acompañas a Harry en esta emocionante aventura!!"
            onComplete={() => setShowStartButton(true)}
          />
        </div>
        {ShowStartButton && (
          <div className="player-name-input">
            <label> Pero antes de continuar ¿Cuál es tu nombre hechicero/a?</label>
            <input type="text" placeholder="Harry Potter" value={playerName} onChange={handleNameInput}/>
            <button className="start-button" onClick={handleNameSubmit}>Comenzar la aventura</button>
          </div>
        )}
        <video autoPlay muted loop id="background-video"><source src={getBackgroundVideo()} type="video/mp4"/></video>        
        <div className="video-overlay"></div>
      </div>
    );
  }

  if (step === 2 && !team) {
    return (
      <div className="container active">
        <div className="team-select-buttons fade-in-video">
          <h2 className="team-select-buttons-h2">SELECCIONA TU CURSO:</h2>
          <button onClick={() => setTeam('1ero')}>Primer Año</button>
          <button onClick={() => setTeam('2do')}>Segundo Año</button>
          <button onClick={() => setTeam('3ro')}>Tercer Año</button>
        </div>
        <video autoPlay muted loop id="background-video"><source src={getBackgroundVideo()} type="video/mp4"/></video>        
        <div className="video-overlay"></div>
      </div>
    );
  }
  if (showLevelIntro) {
    return renderLevelIntro();
  }
  if (ShowLevelDescription) {
    return renderLevelDescription();
  }
  if (ShowSubLevelDescription){
    return renderSubLevelDescription();
  }

  if (!task) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className="container active">
        {ShowLevelDescription ? (
            renderLevelDescription()
        ) : (
            <div>
                <h1 className="welcome-player">Hola, {localStorage.getItem('playerName')}!</h1>
                <div className="task-info">
                    <h2>Nivel {currentLevel + 1}, Subnivel {currentSublevel + 1}</h2>
                    <p>{data.levels[currentLevel].sublevels[currentSublevel].structure}</p>
                    <p>{task.question}</p>
                    {task.type === "sentence-construction" ? (
                      <>
                            <div className="words-container">
                                {task.words.map((word, index) => (
                                  <button className="button-game" key={index} onClick={() => handleAnswerClick(word)}>{word}</button>
                                ))}
                            </div>
                            <div className="selected-words">
                                <p>Palabras seleccionadas:</p>
                                <p>{selectedWords.join(" ")}</p>
                            </div>
                            <button className="button-game" onClick={handleReset}>Reset</button>
                            <button className="button-game" onClick={handleSubmitSentence}>Enviar Oración</button>
                        </>
                    ) : (
                      <>
                            <p>{task.sentence}</p>
                            <div className="options-container">
                                {Object.entries(task.options).map(([key, options]) => (
                                    options.map((option, index) => (
                                        <button className="button-game" key={index} onClick={() => handleAnswerClick(option)}>{option}</button>
                                      ))
                                    ))}
                            </div>
                        </>
                    )}
                </div>
                <h2 className="score-player">Puntos: {score}</h2>
                <LevelCompletedModal 
                  show={showModal} 
                  onClose={closeModal} 
                  message={modalMessage}
                  isLevelCompleted={isLevelCompleted}
                />
            </div>
        )}
        <video autoPlay muted loop id="background-video"><source src={getBackgroundVideo()} type="video/mp4"/></video>        
        <div className="video-overlay"></div>
    </div>
);
};

export default Game;