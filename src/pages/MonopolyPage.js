import React, { useState, useCallback } from 'react'

const cfg = (typeof window !== 'undefined' && window.gameConfig) ? window.gameConfig : {};


const MonopolyPage = ({navigateTo, backgroundImage,currentProblemIndex,setCurrentProblemIndex,players,setPlayers}) => {
    const [scaleForDice, setScaleForDice] = useState(1)
    const initialButtonState={A:-1,B:-1,C:-1} // 0:false 1:true -1:not yet to choose
    const [isCorrect, setIsCorrect] = useState(initialButtonState) // 0:false 1:true -1:not yet to choose
    const initialButtonScale={A:1,B:1,C:1}
    const [buttonScale, setButtonScale] = useState(initialButtonScale);
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [sectionVisible, setSectionVisible] = useState({dice:true,question:false,chest:false,chance:false})
    const [cardIndex, setCardIndex] = useState({chest:1,chance:1});
    const [diceNumber, setDiceNumber] = useState(3); // 預設顯示 3 點
    const [isRolling, setIsRolling] = useState(false);

    const pageStyle = { 
        backgroundImage: `url(${backgroundImage})`,
        width:'1920px',
        height:'1080px',
        loading:'eager'
    };

    const playSound=useCallback((soundPath)=>{
        const audio=new Audio(soundPath)
        audio.play().catch((error)=>{
            console.log("Audio failed",error)
        })
    },[])

    const handleDiceClick=async()=>{
        if (isRolling) return; // 防止連點
        setIsRolling(true);
        playSound(cfg?.sounds?.dice || "./sounds/dice.mp3")
        setScaleForDice(0.9);
        await new Promise(resolve => setTimeout(resolve, 100)); // wait for 100ms
        setScaleForDice(1);    
        // 模擬骰子隨機跳動的過程 (跳動 10 次)
        let rollCount = 0;
        const rollInterval = setInterval(() => {
            // 隨機跳 1-6 隨機
            const tempNums = Array.from({ length: 6 }, (_, i) => i + 1); // [1,2,3,4,5,6]
            const randomTemp = tempNums[Math.floor(Math.random() * tempNums.length)];
            setDiceNumber(randomTemp);
            rollCount++;

            if (rollCount > 10) {
                clearInterval(rollInterval);
            }
        }, 80); // 每 80ms 跳一次

        // 等待跳動動畫結束，決定最終數字
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const finalResult = Math.floor(Math.random() * 6) + 1; // 最終 1-6
        setDiceNumber(finalResult);
        setIsRolling(false);
        setTimeout(()=>{
            const currentPlayer=players.find(p=>p.current===true)
            // 顯示題目
            handleMoveThePlayer(currentPlayer.id,finalResult)
        },500)
    }
    
    const AnswerBackground = ({ status }) => {
        let imgSrc = '';

        if (status === -1) {// 還沒選
            imgSrc = `./images/object/Basketball_monopoly_answer_button.png`;
        } else if (status === 1) {// 答對
            imgSrc = `./images/object/Basketball_monopoly_right_answer_button.png`;
        } else if (status === 0) {// 答錯
            imgSrc = `./images/object/Basketball_monopoly_wrong_answer_button.png`;
        }

        return (
            <img src={imgSrc} alt={`Basketball_monopoly_answer_${status}`}  loading="lazy" decoding="async"/>
        );
    };

    // 選項按鈕點擊處理
    const handleButtonClick = async (btn, optionTxt) => {
        if (buttonDisabled) return;// 防止重複點擊
        setButtonDisabled(true);
        setButtonScale({...initialButtonScale, [btn]:0.9});
        await new Promise(resolve => setTimeout(resolve, 100));
        handleAnswer(btn, optionTxt);
    };

    const handleAnswer=(button,optionText)=>{
        if(cfg?.questions?.questions?.[currentProblemIndex]?.answer===optionText){
            // 更改按鈕狀態
            setIsCorrect(prevState => ({ ...prevState, [button]: 1 }));
            setButtonScale(initialButtonScale);
            // 音效
            playSound(cfg?.sounds?.correct || "./sounds/correct.mp3")
            setTimeout(()=>{
                setCurrentProblemIndex(currentProblemIndex+1)
                // 卡牌消失
                setSectionVisible({dice:true,question:false,chest:false,chance:false})
                reset()
            },1000)
        }
        else{
            // 更改按鈕狀態
            setIsCorrect(prevState => ({ ...prevState, [button]: 0 }));
            setButtonScale(initialButtonScale);
            // 音效
            playSound(cfg?.sounds?.wrong || "./sounds/wrong.mp3")
            setTimeout(()=>{
                setCurrentProblemIndex(currentProblemIndex+1)
                // 卡牌消失
                setSectionVisible({dice:true,question:false,chest:false,chance:false})
                reset()
            },1000)
        }
    }

    const reset=()=>{
        setIsCorrect(initialButtonState);
        setButtonDisabled(false)
    }

    // 渲染站在某一步的玩家棋子
    const renderPieces = (stepNum) => {
        // 找出所有在這一步的玩家
        const playersOnThisStep = players.filter(p => p.step === stepNum);

        if (playersOnThisStep.length === 0) return null
    
        return (
            <div className={stepNum!==1&&'player-pieces-container'}>
                {playersOnThisStep.map((p) => (
                    <div key={p.id} className={`player-pieces piece-${p.positionInStep} ${p.current ? 'is-current' : ''}`}>
                        <img src={cfg?.images?.finchPlayers?.[p.id] || p.img} alt={`player-${p.id}`} />
                    </div>
                ))}
            </div>
        );
    };

    // 移動玩家到下一步
    const handleMoveThePlayer = async (playerId, nextStep) => {
        const playerCurrentStep = players.find(p => p.id === playerId)?.step || 1;
        
        // 找出玩家將要移動到的下一步上已經有幾個玩家了，決定棋子位置
        const playersOnThisStep = players.filter(p => p.step === playerCurrentStep+nextStep);

        setPlayers(prevPlayers => 
            prevPlayers.map(p => 
                p.id === playerId 
                ? { ...p, step: playerCurrentStep+nextStep>=23 ? 23 : playerCurrentStep+nextStep, positionInStep: playersOnThisStep.length+1,current:false } 
                :  p
            )
        );
        // setPlayers(prevPlayers => 
        //     prevPlayers.map(p => 
        //         p.id === playerId 
        //         ? { ...p, step: playerCurrentStep+nextStep>=23 ? 23 : playerCurrentStep+nextStep, positionInStep: playersOnThisStep.length+1,current:false } 
        //         : p.id === (playerId%prevPlayers.length)+1 ? {...p,current:true} : p
        //     )
        // );

        setTimeout(()=>{
            if(playerCurrentStep+nextStep>=23){
                navigateTo("scores")
            }
            else if(playerCurrentStep+nextStep===8){
                handleOpenChest()
            }
            else if(playerCurrentStep+nextStep===11){
                handleOpenChance()
            }
            else{
                setSectionVisible({dice:false,question:true,chest:false,chance:false})
            }
        },1000)

    };

    const getChestRandomCard=(type)=>{
        const random=Math.floor(Math.random()*100)+1;
        if(type==="chest"){
            if(random<=30){
                return 1;
            }else if(random<=60){
                return 2;
            }else if(random<=90){
                return 3;
            }else{
                return 4;
            }           
            // 1–30 (30%): 卡片 1
            // 31–60 (30%): 卡片 2
            // 61–90 (30%): 卡片 3
            // 91–100 (10%): 卡片 4
        }
        else{
            if (random <= 10) {
                return 1; // 1~10 (10%)
            } else if (random <= 50) {
                return 2; // 11~50 (40%)
            } else if (random <= 75) {
                return 3; // 51~75 (25%)
            } else {
                return 4; // 76~100 (25%)
            }
            // 1–10 (10%): 卡片 1
            // 11–50 (40%): 卡片 2
            // 51–75 (25%): 卡片 3
            // 76–100 (25%): 卡片 4
        }
    }

    const handleOpenChest=()=>{
        const cardId=getChestRandomCard("chest");
        setCardIndex(prev=>({...prev,chest:cardId}))
        setSectionVisible({dice:false,question:false,chest:true,chance:false})
        setTimeout(()=>{
            setSectionVisible({dice:true,question:false,chest:false,chance:false})
        },1000)
    }

    const handleOpenChance=()=>{
        const cardId=getChestRandomCard("chance");
        setCardIndex(prev=>({...prev,chance:cardId}))
        setSectionVisible({dice:false,question:false,chest:false,chance:true})
        setTimeout(()=>{
            setSectionVisible({dice:true,question:false,chest:false,chance:false})
        },1000)

    }

    return (
        <div className="page-container" style={pageStyle}>
            <button onClick={()=>{navigateTo("scores")}}>
                navigateTo
            </button>
            <div className={`card-section ${sectionVisible.chest===false ? 'sectionHidden' : ''}`}>
                <img src={`./images/object/Basketball_monopoly_community_chest_card_0${cardIndex.chest}.png`} alt={`chest_card_0${cardIndex.chest}`} />
            </div>
            <div className={`card-section ${sectionVisible.chance===false ? 'sectionHidden' : ''}`}>
                <img src={`./images/object/Basketball_monopoly_chance_card_0${cardIndex.chance}.png`} alt={`chance_card_0${cardIndex.chance}`} />
            </div>
            <div className={`dice-section ${sectionVisible.dice===false ? 'sectionHidden' : ''}`}
                onMouseEnter={()=>{setScaleForDice(1.1)}}
                onMouseLeave={()=>{setScaleForDice(1)}}
                onClick={handleDiceClick}
                style={{transform:`scale(${scaleForDice})`}}>
                <img src="./images/object/Basketball_monopoly_dice_background.png" alt="" />
    
                <div className="dice-face">
                    <div className={`dice-dots dice-value-${diceNumber}`}>
                        {/* 根據點數產生對應數量的點點 */}
                        {Array.from({ length: diceNumber }).map((_, i) => (
                            <span key={i} className="dot"></span>
                        ))}
                    </div>
                </div>
            </div>
            <div className={`question-section ${sectionVisible.question===false ? 'sectionHidden' : ''}`}>
                <span className='question-text'>Question</span>
                <span className='question-content-text'>{cfg?.questions?.questions?.[currentProblemIndex]?.question || "Default Question"}</span>
                <img src="./images/object/Basketball_monopoly_question_frame.png" alt="" />
                <div className="answer-section">
                    <button className="answer-image-button"
                    disabled={buttonDisabled} 
                    style={{transform: `scale(${buttonScale.A || 1})`}}
                    onClick={()=>{handleButtonClick('A',cfg.questions.questions[currentProblemIndex]?.options[0])}}>
                        <div className="answer-text">{cfg.questions.questions[currentProblemIndex]?.options[0] || `A`}</div>
                        <AnswerBackground status={isCorrect.A}/>
                    </button>
                    <button className="answer-image-button"
                    disabled={buttonDisabled} 
                    style={{transform: `scale(${buttonScale.B || 1})`}}
                    onClick={()=>handleButtonClick('B',`${cfg.questions.questions[currentProblemIndex]?.options[1]}`)}>
                        <div className="answer-text">{cfg.questions.questions[currentProblemIndex]?.options[1] || `B`}</div>
                        <AnswerBackground status={isCorrect.B}/>
                    </button>
                    <button className="answer-image-button"
                    disabled={buttonDisabled} 
                    style={{transform: `scale(${buttonScale.C || 1})`}}
                    onClick={()=>handleButtonClick('C',`${cfg.questions.questions[currentProblemIndex]?.options[2]}`)}>
                        <div className="answer-text">{cfg.questions.questions[currentProblemIndex]?.options[2] || `C`}</div>
                        <AnswerBackground status={isCorrect.C}/>
                    </button>
                </div>
            </div>
            <div>
                {Array.from({ length: 23 }, (_, i) => i + 1).map((stepNum) => (
                    <div key={stepNum} className={`step-box step-${stepNum}`}>
                        {/* 特殊格標記 */}
                        {stepNum === 1 && <img src="./images/object/Basketball_monopoly_GO.png" className="grid-icon" />}
                        {stepNum === 8 && <img src="./images/object/Basketball_monopoly_question_mark.png" className="grid-icon" />}
                        {stepNum === 11 && <img src="./images/object/Basketball_monopoly_treasure_chest.png" className="grid-icon" />}

                        {
                            stepNum !== 1 && stepNum !== 8 && stepNum !== 11 && (
                                <span>Question</span>
                            )
                        }
                        
                        {/* 渲染站在這格的所有棋子 */}
                        {renderPieces(stepNum)}
                    </div>
                ))}
            </div>
            {/* <span className="step-1">
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
            </span> */}
        </div>
    )
}

export default MonopolyPage;