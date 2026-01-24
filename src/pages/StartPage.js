
const cfg = (typeof window !== 'undefined' && window.gameConfig) ? window.gameConfig : {};

const StartPage = ({ onStartGame, backgroundImage }) => {
  const pageStyle = { 
    backgroundImage: `url(${backgroundImage})`,
    width:'1920px',
    height:'1080px',
    loading:'eager'
  };

  return (
    <div className="page-container" style={pageStyle}>
      <h1 className='start-page-title'>{cfg.strings?.startTitle || 'Monopoly'}</h1>
      <button className="image-button start-button-center" onClick={onStartGame}>
        <img src={"./images/object/Basketball_monopoly_start_button.png"}/>
        <span className="start-button-text">Start</span>
      </button>
    </div>
  );
};

export default StartPage;
