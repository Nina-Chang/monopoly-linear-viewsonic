import React, { useState, useCallback } from 'react'

const cfg = (typeof window !== 'undefined' && window.gameConfig) ? window.gameConfig : {};


const MonopolyPage = ({navigateTo, backgroundImage}) => {
    const [scaleForDice, setScaleForDice] = useState(1)

    const pageStyle = { 
        backgroundImage: `url(${backgroundImage})`,
        width:'1920px',
        height:'1080px',
        loading:'eager'
    };

    const playSound=useCallback((soundPath)=>{
        const audio=new Audio(soundPath)
        audio.volume=0.1
        audio.play().catch((error)=>{
            console.log("Audio failed",error)
        })
    },[])

    const handleClick=async()=>{
        playSound(cfg?.sounds?.dice || "./sounds/dice.mp3")
        setScaleForDice(0.9);
        await new Promise(resolve => setTimeout(resolve, 100)); // wait for 100ms
        setScaleForDice(1);     
    }

    return (
        <div className="page-container" style={pageStyle}>
            {/* <button onClick={()=>{navigateTo("scores")}}>
                navigateTo
            </button> */}
            <div className='space-for-items'
                onMouseEnter={()=>{setScaleForDice(1.1)}}
                onMouseLeave={()=>{setScaleForDice(1)}}
                onClick={handleClick}
                style={{transform:`scale(${scaleForDice})`}}>
                <img src="./images/object/Basketball_monopoly_dice_background.png" alt="" />
                <span className='dice'></span>
                <span className='dice-black'>●</span>
            </div>
            <span className="step-1">
                <img src="./images/object/Basketball_monopoly_GO.png" alt="" />
                <div className='player-pieces piece-1'>
                    <img src={cfg?.images?.finchPlayers?.[1] || "./images/object/Basketball_monopoly_piece_02.png"} alt="" />
                </div>
                <div className='player-pieces piece-2'>
                    <img src={cfg?.images?.finchPlayers?.[0] || "./images/object/Basketball_monopoly_piece_01.png"} alt="" />
                </div>
                <div className='player-pieces piece-3'>
                    <img src={cfg?.images?.finchPlayers?.[4] || "./images/object/Basketball_monopoly_piece_05.png"} alt="" />
                </div>
                <div className='player-pieces piece-4'>
                    <img src={cfg?.images?.finchPlayers?.[2] || "./images/object/Basketball_monopoly_piece_03.png"} alt="" />
                </div>
                <div className='player-pieces piece-5'>
                    <img src={cfg?.images?.finchPlayers?.[3] || "./images/object/Basketball_monopoly_piece_04.png"} alt="" />
                </div>
            </span>
            <span className="step-2">
                Question
            </span>
            <span className="step-3">
                Question
            </span>
            <span className="step-4">
                Question
            </span>
            <span className="step-5">
                Question
            </span>
            <span className="step-6">
                Question
            </span>
            <span className="step-7">
                Question
            </span>
            <span className="step-8">
                <img src="./images/object/Basketball_monopoly_question_mark.png" alt="" />
            </span>
            <span className="step-9">
                Question
            </span>
            <span className="step-10">
                Question
            </span>
            <span className="step-11">
                <img src="./images/object/Basketball_monopoly_treasure_chest.png" alt="" />
            </span>
            <span className="step-12">
                Question
            </span>
            <span className="step-13">
                Question
            </span>
            <span className="step-14">
                Question
            </span>
            <span className="step-15">
                Question
            </span>
            <span className="step-16">
                Question
            </span>
            <span className="step-17">
                Question
            </span>
            <span className="step-18">
                Question
            </span>
            <span className="step-19">
                Question
            </span>
            <span className="step-20">
                Question
            </span>
            <span className="step-21">
                Question
            </span>
            <span className="step-22">
                Question
            </span>
            <span className="step-23">
                Question
            </span>
        </div>
    )
}

export default MonopolyPage;