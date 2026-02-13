import './App.css';
import { useState, useRef, useEffect } from 'react';
import StartPage from './pages/StartPage';
import InstructionsPage from './pages/InstructionsPage';
import MonopolyPage from './pages/MonopolyPage';
import ScoresPage from './pages/ScoresPage';

const cfg = (typeof window !== 'undefined' && window.gameConfig) ? window.gameConfig : {};

const backgroundImages = {
  start: cfg.images?.bgStart || './images/background/Basketball_monopoly_01_FHD.png',
  instructions: cfg.images?.bgInstructions || './images/background/Basketball_monopoly_02_FHD.png',
  monopoly: cfg.images?.bgMonopoly || './images/background/Basketball_monopoly_03_FHD.png',
  scores: cfg.images?.bgScores || './images/background/Basketball_monopoly_04_FHD.png',
};

function App() {
  const [page, setPage] = useState('start');
  const [players, setPlayers] = useState(cfg.players || []);
  const [scale, setScale] = useState(1);
  const [currentProblemIndex,setCurrentProblemIndex]=useState(0)
  const audioRef=useRef(null)

  const navigateTo = (pageName) => setPage(pageName);

  const gameStyle = { 
    transform: `scale(${scale})`,
  };

  const handleStartGame=()=>{
    if(audioRef.current && audioRef.current.paused){
      audioRef.current.volume=0.1
      audioRef.current.currentTime = 0; // 從頭開始播放
      audioRef.current.play().catch((error)=>{
        console.log("Audio failed",error)
      })
    }
    navigateTo('instructions')
  }

  useEffect(() => {
    // 視窗縮放
    const handleResize = () => {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      setScale(Math.min(scaleX, scaleY));
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  return (
    <div className="game-viewport">
      <div style={gameStyle}>
        {page === 'start' && (<StartPage navigateTo={navigateTo} onStartGame={handleStartGame} backgroundImage={backgroundImages.start}/>)}
        {page === 'instructions' && (<InstructionsPage navigateTo={navigateTo} onStartGame={handleStartGame} backgroundImage={backgroundImages.instructions}/>)}
        {page === 'monopoly' && (<MonopolyPage navigateTo={navigateTo} backgroundImage={backgroundImages.monopoly} currentProblemIndex={currentProblemIndex} setCurrentProblemIndex={setCurrentProblemIndex} players={players} setPlayers={setPlayers} bgmAudio={audioRef.current}/>)}
        {page === 'scores' && (<ScoresPage navigateTo={navigateTo} backgroundImage={backgroundImages.scores} players={players} setPlayers={setPlayers} bgmAudio={audioRef.current}/>)}
      </div>

      <audio ref={audioRef} src={cfg.sounds?.bgm || './sounds/corporate-soft.mp3'} loop preload='auto'/>
    </div>
  );
}

export default App;
