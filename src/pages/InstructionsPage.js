
const cfg = (typeof window !== 'undefined' && window.gameConfig) ? window.gameConfig : {};

const InstructionsPage = ({ navigateTo, backgroundImage }) => {
  const pageStyle = { 
    backgroundImage: `url(${backgroundImage})`,
    width:'1920px',
    height:'1080px',
    loading:'eager'
  };

  return (
    <div className="page-container" style={pageStyle}>
      <span className="sticker-text">How to play</span>
      <div className="instructions-text">
        <p>1. Roll the dice and move your game piece.</p>
        <p>2. Teams may land on spaces with questions, Fate cards, or Chance cards.</p>
        <p>3. The first team to finish wins!</p>
      </div>
      <button className="image-button continue-button loop-animation" onClick={() => navigateTo('monopoly')}>
        <img src={cfg.images?.btnNext || 'images/object/Basketball_monopoly_next_button.png'} alt="Continue" />
      </button>
    </div>
  );
};

export default InstructionsPage;
