import React from 'react'

const MonopolyPage = ({navigateTo, backgroundImage}) => {
    const pageStyle = { 
        backgroundImage: `url(${backgroundImage})`,
        width:'1920px',
        height:'1080px',
        loading:'eager'
    };
    return (
        <div className="page-container" style={pageStyle}>
            <button onClick={()=>{navigateTo("scores")}}>
                navigateTo
            </button>
            <span className="step-1">
                <img src="./images/object/Basketball_monopoly_GO.png" alt="" />
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