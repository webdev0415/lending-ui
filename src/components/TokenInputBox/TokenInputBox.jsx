import React, { useState } from 'react';
import Button from '../Button/Button';
import './TokenInputBox.scss';
import SOLIcon from '../../images/solanaIcon.png';
import USDCIcon from '../../images/USDCIcon.png'
import BodyText from '../BodyText/BodyText';

const assets = [
  {
    name: "SOL",
    value: "Solana",
    icon: SOLIcon
  },
  {
    name: "USDC",
    value: "USDC",
    icon: USDCIcon
  }
]

const TokenInputBox = props =>{
  const {
    inputValue,
    setInputValue,
    selectedAsset,
    setSelectedAsset,
    maxValue,
    hideTokenSelect,
    showRangeSlide
  } = props;

  const onInputChange = event =>{
    const value = parseFloat(Number(event.target.value), 10);
    
    if(value){
      setInputValue(value.toString());
    }else{
      setInputValue('');
    }
  }

  return(
    <>
      <div className = "token-input-box">
        <div className = "max-btn-container">
          <Button onClick = {()=>setInputValue(maxValue)} title = "MAX"/>
        </div>
        <div className = "input-container">
          <input onChange = {onInputChange} placeholder='0.00'  type = "number" min="0" value = {inputValue}/>
        </div> 
        {
          !hideTokenSelect &&
          <div className = "asset-details">
            <img 
              src = {assets.find(asset => asset.value === selectedAsset).icon} 
              className = "icon"
              alt = {`${selectedAsset} icon`}
            />
            <select onChange = {(event)=>setSelectedAsset(event.target.value)}>
              {
                assets.map(asset =>(
                  <option key = {asset.name} value = {asset.value}>{asset.name}</option>
                ))
              }          
            </select>
          </div>
        }
      </div>
      {
        showRangeSlide &&
        <div className="range-slide-container">
          <div className="range-slide">
            <span className="slider">
              <span className="sliderNub" />
            </span>
          </div>
          <div className="size-percents">
            {
              new Array(5).fill(5).map((a, i) => (
                <BodyText>{i * 25}%</BodyText>
              ))
            }
          </div>
        </div>        
      }
    </>
  )
}

export default TokenInputBox;