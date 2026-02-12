
import { useState } from 'react';

const cfg = (typeof window !== 'undefined' && window.gameConfig) ? window.gameConfig : {};

const StartPage = ({ onStartGame, backgroundImage }) => {
  const [scale, setScale] = useState(1)

  const pageStyle = { 
    backgroundImage: `url(${backgroundImage})`,
    width:'1920px',
    height:'1080px',
    loading:'eager'
  };

  const handleClick=async()=>{
    setScale(0.9);
    await new Promise(resolve => setTimeout(resolve, 100)); // wait for 100ms
    setScale(1);
    await new Promise(resolve => setTimeout(resolve, 300)); // wait for 100ms
    onStartGame();
  }


  return (
    <div className="page-container" style={pageStyle}>
      <h1 className='start-page-title'>{cfg.strings?.startTitle || 'Monopoly'}</h1>
      <button className="image-button start-button-center" 
        onMouseEnter={()=>{setScale(1.1)}}
        onMouseLeave={()=>{setScale(1)}}
        onClick={handleClick} style={{transform:`translate(-50%, -50%) scale(${scale})`}}>
        <img src={"./images/object/Basketball_monopoly_start_button.png"}/>
        <span className="start-button-text">Start</span>
      </button>
    </div>
  );
};

export default StartPage;
