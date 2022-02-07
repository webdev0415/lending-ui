import React from 'react';
import NFTImage from '../../../../components/NFTImage/NFTImage';
import './NFTGallery.scss';

const NFTGallery = props => {
  const {isLoading, selectedNftIndex, setSelectedNftIndex, AllNFT} = props;
  return(
    <div className='nft-gallery'>
      {!isLoading.dashboard &&
        AllNFT?.map((NFT, i) => (
          <NFTImage
            key={i}
            imageSrc={NFT?.image}
            onClick={() => setSelectedNftIndex(i)}
            showIsSelectedMark={i === selectedNftIndex ? true : false}
            nft={NFT}
          />
        ))
      }
    </div>
  )
}

export default NFTGallery;