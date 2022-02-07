import React from "react";
import NFTImage from "../NFTImage/NFTImage";

import "./collateral-nfts-container.scss";

type TNFT = {
  image: string;
  id: string;
  evaluation: number;
};

interface CollateralNFTsContainerProps {
  NFTs: TNFT[];
  handleImageClick: (id: string) => void;
}

const CollateralNFTsContainer = (props: CollateralNFTsContainerProps) => {
  return (
    <div className="collateral-nfts-container">
      {props.NFTs.map((item: TNFT) => (
        <NFTImage
          key={item.id}
          onClick={() => props.handleImageClick(item.id)}
          imageSrc={item.image}
          evaluationInSOL={item.evaluation}
        />
      ))}
    </div>
  );
};

export default CollateralNFTsContainer;
