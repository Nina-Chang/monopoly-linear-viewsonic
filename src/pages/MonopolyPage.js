import React, { useState, useCallback, useEffect } from 'react'

const cfg = (typeof window !== 'undefined' && window.gameConfig) ? window.gameConfig : {};


const MonopolyPage = ({navigateTo, backgroundImage,currentProblemIndex,setCurrentProblemIndex,players,setPlayers,bgmAudio}) => {
    const [scaleForDice, setScaleForDice] = useState(1)
    const initialButtonState={A:-1,B:-1,C:-1} // 0:false 1:true -1:not yet to choose
    const [isCorrect, setIsCorrect] = useState(initialButtonState) // 0:false 1:true -1:not yet to choose
    const initialButtonScale={A:1,B:1,C:1}
    const [buttonScale, setButtonScale] = useState(initialButtonScale);
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [sectionVisible, setSectionVisible] = useState({dice:true,question:false,chest:false,chance:false})
    const [cardIndex, setCardIndex] = useState({chest:0,chance:0});
    const [diceNumber, setDiceNumber] = useState(3); // 預設顯示 3 點
    const [isRolling, setIsRolling] = useState(false);
    const [theEndStep, setTheEndStep] = useState(false)
    const currentPlayer=players.find(p=>p.current===true)

    const pageStyle = { 
        backgroundImage: `url(${backgroundImage})`,
        width:'1920px',
        height:'1080px',
        loading:'eager'
    };

    useEffect(()=>{
        if(bgmAudio && bgmAudio.paused){
            bgmAudio.currentTime = 0; // 從頭開始播放
            bgmAudio.volume=0.1
            bgmAudio.play().catch((error)=>{console.log("Audio failed",error)});
        }
    },[])

    useEffect(()=>{
        if (!currentPlayer) return;
        if (currentPlayer.current===true && currentPlayer.pauseRound > 0) {
            // 扣除暫停回合，並直接切換到下一位
            const timer = setTimeout(() => {
                setPlayers(prevPlayers => {
                    const total = prevPlayers.length;
                    const nextId = (currentPlayer.id % total) + 1;
                    
                    return prevPlayers.map(p => {
                        if (p.id === currentPlayer.id) {
                            return { ...p, pauseRound: p.pauseRound - 1, current: false };
                        }
                        if (p.id === nextId) {
                            return { ...p, current: true };
                        }
                        return p;
                    });
                });
            }, 500); // 延遲 0.5 秒再跳轉，讓玩家看清楚發生什麼事

            return () => clearTimeout(timer); // 清除 timer 避免記憶體洩漏
            
        }
    },[currentPlayer?.id])

    const playSound=useCallback((soundPath)=>{
        const audio=new Audio(soundPath)
        audio.play().catch((error)=>{
            console.log("Audio failed",error)
        })
    },[])

    const handleDiceClick=async(playerCurStep)=>{
        if (isRolling) return; // 防止連點
        setIsRolling(true);
        playSound(cfg?.sounds?.dice || "./sounds/dice.mp3")
        setScaleForDice(0.9);
        await new Promise(resolve => setTimeout(resolve, 100)); // wait for 100ms
        setScaleForDice(1);    
        // 模擬骰子隨機跳動的過程 (跳動 10 次)
        let rollCount = 0;
        const rollInterval = setInterval(() => {
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
        setTimeout(()=>{
            const playerId=players.find(p=>p.current===true).id
            const curStep=playerCurStep===null?null:playerCurStep
            handleMoveThePlayer(playerId,curStep,finalResult)
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

    const handleNextPlayerTurn=()=>{
        setPlayers(prevPlayers => {
            const currentId = currentPlayer.id;
            const nextId = players.length===1?1:(currentId % prevPlayers.length) + 1; // 循環到下一位玩家
            return (
                prevPlayers.map(p =>
                    {
                        if(currentId===nextId)// 只有一位玩家
                            return {...p,current:true}
                        if(p.id===currentId)
                            return {...p,current:false}
                        else if(p.id===nextId)
                            return {...p,current:true}
                        else
                            return p
                    }
                )
            );
        });
    }


    const reset=()=>{
        if(theEndStep===true){
            setCurrentProblemIndex(0)
            navigateTo("scores")
        }
        setIsCorrect(initialButtonState);
        setButtonDisabled(false)
        // 換下一位玩家
        handleNextPlayerTurn()
    }



    // 渲染站在某一步的玩家棋子
    const renderPieces = (stepNum) => {
        // 找出所有在這一步的玩家
        const playersOnThisStep = players.filter(p => p.step === stepNum);

        if (playersOnThisStep.length === 0) return null
    
        return (
            <div className={stepNum===1?'':stepNum===8||stepNum===11?`player-pieces-container-with-img-${stepNum}`:'player-pieces-container'}>
                {playersOnThisStep.map((p) => (
                    <div key={p.id} className={`player-pieces piece-${p.positionInStep} ${p.current ? 'is-current' : ''}`}>
                        <img src={cfg?.images?.finchPlayers?.[p.id-1]|| `./images/object/Basketball_monopoly_piece_0${p.id}.png`} alt={`player-${p.id}`} />
                    </div>
                ))}
            </div>
        );
    };

    // 移動玩家到下一步
    const handleMoveThePlayer = (playerId,playerCurStep, nextStepOrTotal) => {
        let finalStep;
        
        const currentPlayer = players.find(p => p.id === playerId);
        if (!currentPlayer) return;

        if (Math.abs(nextStepOrTotal) > 30) {
            finalStep = 1; // 回到原點
        } else {
            const curStep = playerCurStep===null ?currentPlayer.step:playerCurStep;
            finalStep = curStep + nextStepOrTotal;
        }

        if (finalStep >= 23) finalStep = 23;
        if (finalStep <= 1) finalStep = 1;

        // 更新玩家位置
        setPlayers(prevPlayers => {
            const playersOnThisStep = prevPlayers.filter(p => p.step === finalStep && p.id !== playerId);
            // 找出這些玩家中，最大的 positionInStep 是多少
            const maxPosition = playersOnThisStep.length > 0 
            ? Math.max(...playersOnThisStep.map(p => p.positionInStep || 0)) 
            : 0;
            return prevPlayers.map(p => 
                p.id === playerId 
                ? { ...p, step: finalStep, positionInStep: maxPosition+1>prevPlayers.length?1:maxPosition+1 } 
                : p
            );
        });

        setTimeout(() => {
            if (finalStep >= 23) {
                setSectionVisible({ dice: false, question: true, chest: false, chance: false });
                setTheEndStep(true);
            } 
            else if (finalStep === 8) {
                handleOpenChest().then(() => {
                    // 換下一位玩家
                    handleNextPlayerTurn()
                }).catch(()=>{})
            } 
            else if (finalStep === 11) {
                handleOpenChance()
            } 
            else if(finalStep === 1){
                // 換下一位玩家
                handleNextPlayerTurn()
                setSectionVisible({ dice: true, question: false, chest: false, chance: false });
            }
            else {
                // 只有一般格子才顯示問題
                setSectionVisible({ dice: false, question: true, chest: false, chance: false });
            }
            setIsRolling(false);
            setDiceNumber(3); 
        }, 1000);
    };

    const getRandomCard=(type)=>{
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

    const handleOpenChest=()=>{// 打開命運卡
        return new Promise((resolve,reject)=>{
            const cardId=getRandomCard("chest");
            setCardIndex(prev=>({...prev,chest:cardId}))
            setSectionVisible({dice:false,question:false,chest:true,chance:false})
            setTimeout(()=>{
                if(cardId===1){// 後退一步
                    const playerId=players.find(p=>p.current===true).id
                    handleMoveThePlayer(playerId,8,-1)
                    reject()
                }
                else if(cardId===2){// 回到原點
                    const playerId=players.find(p=>p.current===true).id
                    handleMoveThePlayer(playerId,8,-100)
                }
                else if(cardId===3){// 暫停一回
                    setPlayers(prevPlayers => 
                        prevPlayers.map(p => 
                            p.current === true ? {...p, pauseRound: 1} : p)
                    )
                    setSectionVisible({dice:true,question:false,chest:false,chance:false})
                }
                else{// 和最近的玩家換位置
                    setPlayers(prevPlayers => {
                        // 找到當前玩家
                        const currentPlayer = prevPlayers.find(p => p.current);
                        if (!currentPlayer) return prevPlayers;
    
                        // 尋找最近的玩家 (排除自己)
                        let closestPlayer = null;
                        let minDistance = Infinity;
    
                        prevPlayers.forEach(p => {
                            if (p.id !== currentPlayer.id) {
                                const distance = Math.abs(p.step - currentPlayer.step);
                                // 如果距離更小，或者距離一樣但我們想選特定的(例如後面的玩家)，就更新
                                if (distance < minDistance|| (distance === minDistance && p.step > currentPlayer.step)) {
                                    minDistance = distance;
                                    closestPlayer = p;
                                }
                            }
                        });
    
                        // 如果場上沒別人，就不換
                        if (!closestPlayer) return prevPlayers;
    
                        // 執行交換 (回傳新的陣列)
                        return prevPlayers.map(p => {
                            const playersOnThisStep = prevPlayers.filter(p => p.step === closestPlayer.step && p.id !== currentPlayer.id);
                            // 找出這些玩家中，最大的 positionInStep 是多少
                            const maxPosition = playersOnThisStep.length > 0 
                            ? Math.max(...playersOnThisStep.map(p => p.positionInStep || 0)) 
                            : 0;
                            if (p.id === currentPlayer.id) {
                                // 當前玩家拿到目標的位置
                                return { ...p, step: closestPlayer.step,positionInStep:maxPosition+1>prevPlayers.length?1:maxPosition+1 };
                            }
                            if (p.id === closestPlayer.id) {
                                // 目標玩家拿到當前玩家的位置
                                return { ...p, step: currentPlayer.step,positionInStep:currentPlayer.positionInStep };
                            }
                            return p;
                        });
                    });
                    setSectionVisible({ dice: false, question: true, chest: false, chance: false });
                    reject()
                }
                resolve()
            },1000)

        })
    }

    const handleOpenChance=()=>{// 打開機會卡
        const cardId=getRandomCard("chance");
        setCardIndex(prev=>({...prev,chance:cardId}))
        setSectionVisible({dice:false,question:false,chest:false,chance:true})
        setTimeout(()=>{
            if(cardId===1){// 再骰一次
                setSectionVisible({dice:true,question:false,chest:false,chance:false})
                handleDiceClick(11)
            }
            else if(cardId===2){// 前進一步
                const playerId=players.find(p=>p.current===true).id
                handleMoveThePlayer(playerId,11,1)
            }
            else if(cardId===3){// 前進二步
                const playerId=players.find(p=>p.current===true).id
                handleMoveThePlayer(playerId,11,2)
            }
            else{// 和最近的玩家同一格
                setPlayers(prevPlayers => {
                    // 找到當前玩家
                    const currentPlayer = prevPlayers.find(p => p.current);
                    if (!currentPlayer) return prevPlayers;

                    // 尋找最近的玩家 (排除自己)
                    let closestPlayer = null;
                    let minDistance = Infinity;

                    prevPlayers.forEach(p => {
                        if (p.id !== currentPlayer.id) {
                            const distance = Math.abs(p.step - currentPlayer.step);
                            
                            // 邏輯：找到距離最小的人
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestPlayer = p;
                            }
                        }
                    });

                    // 如果找不到其他人（例如只有一個玩家），就原地不動
                    if (!closestPlayer) return prevPlayers;



                    // 更新當前玩家的位置
                    return prevPlayers.map(p => {
                        const playersOnThisStep = prevPlayers.filter(p => p.step === closestPlayer.step && p.id !== currentPlayer.id);
                        // 找出這些玩家中，最大的 positionInStep 是多少
                        const maxPosition = playersOnThisStep.length > 0 
                        ? Math.max(...playersOnThisStep.map(p => p.positionInStep || 0)) 
                        : 0;
                        if (p.id === currentPlayer.id) {
                            // 將自己的 step 設為跟最近的人一樣
                            return { ...p, step: closestPlayer.step,positionInStep:maxPosition+1>prevPlayers.length?1:maxPosition+1 };
                        }
                        return p;
                    });
                });
                setSectionVisible({ dice: false, question: true, chest: false, chance: false });
            }
        },1000)
    }

    return (
        <div className="page-container" style={pageStyle}>
            <div className={`card-section ${sectionVisible.chest===false ? 'sectionHidden' : ''}`}>
                <img src={`./images/object/Basketball_monopoly_community_chest_card_0${cardIndex.chest}.png`} alt={`chest_card_0${cardIndex.chest}`} />
            </div>
            <div className={`card-section ${sectionVisible.chance===false ? 'sectionHidden' : ''}`}>
                <img src={`./images/object/Basketball_monopoly_chance_card_0${cardIndex.chance}.png`} alt={`chance_card_0${cardIndex.chance}`} />
            </div>
            <div className={`dice-section ${sectionVisible.dice===false ? 'sectionHidden' : ''}`}
                onMouseEnter={()=>{setScaleForDice(1.1)}}
                onMouseLeave={()=>{setScaleForDice(1)}}
                onClick={()=>{handleDiceClick(null)}}
                style={{transform:`scale(${scaleForDice})`}}>
                <img src="./images/object/Basketball_monopoly_dice_background.png" alt="" />
    
                <div className="dice-face" style={{cursor:isRolling?"not-allowed":"pointer"}}>
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
        </div>
    )
}

export default MonopolyPage;