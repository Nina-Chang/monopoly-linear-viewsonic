import React from 'react'
import { useState } from 'react';

const cfg = (typeof window !== 'undefined' && window.gameConfig) ? window.gameConfig : {};

const ScoresPage = ({navigateTo, backgroundImage, players, setPlayers}) => {
    // const [wonPlayerIndex, setWonPlayerIndex] = useState(1)
    const pageStyle = { 
        backgroundImage: `url(${backgroundImage})`,
        width:'1920px',
        height:'1080px',
        loading:'eager'
    };

    const renderWonPlayer=()=>{
        const wonPlayer=players.find(player=>player.step>=23)

        return (
            wonPlayer&&
            <img className={`won-player-${wonPlayer.id}`} src={`./images/object/Basketball_monopoly_finch_0${wonPlayer.id}.png`}/>
        )
    }

    const handleHomeButtonClick=()=>{
        setPlayers(cfg.players || [])
        navigateTo("start")
    }
    
    const handleAgainButtonClick=()=>{
        setPlayers(cfg.players || [])
        navigateTo("monopoly")
    }



    return (
        <div className="page-container" style={pageStyle}>
            <span className="congratulation-text">You won!</span>
            {renderWonPlayer()}
            <div className="button-container">
                <img onClick={handleHomeButtonClick} src={"./images/object/Basketball_monopoly_home_button.png"}/>
                <img onClick={handleAgainButtonClick} src={"./images/object/Basketball_monopoly_again_button.png"}/>
            </div>
        </div>
    )
}

export default ScoresPage;