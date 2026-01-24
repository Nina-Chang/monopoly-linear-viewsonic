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
        </div>
    )
}

export default MonopolyPage;