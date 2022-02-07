import { useState, useContext, useEffect } from 'react';
import TitleText from '../../components/TitleText/TitleText';
import './BorrowPage.scss';
import BorrowForm from './components/BorrowForm/BorrowForm';
import ModalContainer from '../../components/ModalContainer/ModalContainer';
import { AllNFTsContext } from '../../App'
import NFTGallery from './components/NFTGallery/NFTGallery';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';


const CollateralPortfolioPage = props => {
  const [selectedNftIndex, setSelectedNftIndex] = useState(null);
  const { AllNFT } = useContext(AllNFTsContext);
  const { isLoading } = props;
  const {pathname} = useLocation();

  return (
    <div className="borrow-page">
      <div className="head">
      <div className="borrow-nav-btns">
            <Link to="/borrow/deposit">
              <Button className={pathname === "/borrow/deposit" ? "selected" : ""} title="Deposit" />
            </Link>
            <Link to="/borrow/portfolio">
              <Button className={pathname === "/borrow/portfolio" ? "selected" : ""} title="Portfolio" />
            </Link>
          </div>
        <TitleText>Select your collateral NFT</TitleText>
      </div>
      <div className="main-content">
        <NFTGallery
          isLoading={isLoading}
          selectedNftIndex={selectedNftIndex}
          setSelectedNftIndex={setSelectedNftIndex}
          AllNFT={AllNFT}
        />
        <BorrowForm
          className="big-screen-borrow-form"
          selectedNFT={AllNFT.find((a, i) => i === selectedNftIndex)}
        />
        <ModalContainer
          isVisible={selectedNftIndex !== null}
          onClose={() => setSelectedNftIndex(null)}
          className="small-screen-modal"
        >
          <BorrowForm
            className='modal-borrow-form'
            selectedNFT={AllNFT.find((a, i) => i === selectedNftIndex)}
          />
        </ModalContainer>
      </div>
    </div>
  )
}

export default CollateralPortfolioPage;