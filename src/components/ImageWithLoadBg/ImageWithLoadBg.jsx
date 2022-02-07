import React, { useState } from 'react'
import './ImageWithLoadBg.scss';

const ImageWithLoadBg = props => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const { src, aspectRatio, alt, bgColor } = props;

    return (
        <div
            style={{
                paddingTop: `${(1 / aspectRatio) * 100}%`,
                backgroundColor: imageLoaded
                 ? 'transparent'
                 : ( bgColor ? bgColor : '#2D2E36' )
            }}
            className="image-with-Bg"
        >
            <div className="image">
                <img onLoad={() => setImageLoaded(true)} src={src} alt={alt} />
            </div>
        </div>
    )
}

export default ImageWithLoadBg;