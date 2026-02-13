import React from 'react'
import { useState,useEffect } from 'react';

const cfg = (typeof window !== 'undefined' && window.gameConfig) ? window.gameConfig : {};

const ScoresPage = ({navigateTo, backgroundImage, players, setPlayers,bgmAudio}) => {
    const [buttonScale, setButtonScale] = useState({home:1, again:1});

    const pageStyle = { 
        backgroundImage: `url(${backgroundImage})`,
        width:'1920px',
        height:'1080px',
        loading:'eager'
    };

    useEffect(()=>{
      if(bgmAudio) bgmAudio.pause()
      const audioPlayer=new Audio(cfg.sounds.gameSuccess || './sounds/gameSuccess.mp3')
      audioPlayer.play().catch((e)=>console.log('Audio Failed',e))
    },[])

    const renderWonPlayer=()=>{
        const wonPlayer=players.find(player=>player.step>=23)

        return (
            wonPlayer&&
            <img className={`won-player-${wonPlayer.id}`} src={`./images/object/Basketball_monopoly_finch_0${wonPlayer.id}.png`} alt="Won Player"/>
        )
    }

    const handleHomeButtonClick=async()=>{
        setButtonScale(prev => ({...prev, home:0.9}));
        await new Promise(resolve => setTimeout(resolve, 100));
        setButtonScale(prev => ({...prev, home:1}));
        await new Promise(resolve => setTimeout(resolve, 300));
        handleAfterClickingHomeButton();
    }

    const handleAgainButtonClick=async()=>{
        setButtonScale(prev => ({...prev, again:0.9}));
        await new Promise(resolve => setTimeout(resolve, 100));
        setButtonScale(prev => ({...prev, again:1}));
        await new Promise(resolve => setTimeout(resolve, 300));
        handleAfterClickingAgainButton();
    }

    const handleAfterClickingHomeButton=async()=>{
        setPlayers(cfg.players || [])
        navigateTo("start")
    }
    
    const handleAfterClickingAgainButton=()=>{
        setPlayers(cfg.players || [])
        navigateTo("monopoly")
    }



    return (
        <div className="page-container" style={pageStyle}>
            <span className="congratulation-text">You won!</span>
            {renderWonPlayer()}
            <div className="button-container">
                <button className="image-button" 
                onMouseEnter={() => setButtonScale(prev => ({...prev, home:1.1}))}
                onMouseLeave={() => setButtonScale(prev => ({...prev, home:1}))}
                style={{transform: `scale(${buttonScale.home})`}}
                onClick={handleHomeButtonClick}>
                        <img src={"./images/object/Basketball_monopoly_home_button.png"} alt="Back to Home"/>
                </button>
                <button className="image-button" 
                onMouseEnter={() => setButtonScale(prev => ({...prev, again:1.1}))}
                onMouseLeave={() => setButtonScale(prev => ({...prev, again:1}))}
                style={{transform: `scale(${buttonScale.again})`}}
                onClick={handleAgainButtonClick}>
                    <img src={"./images/object/Basketball_monopoly_again_button.png"} alt="Reset Scores"/>
                </button>
            </div>
        </div>
    )
}

export default ScoresPage;