import { useState } from 'react';
import BodyText from '../../../../components/BodyText/BodyText';
import Button from '../../../../components/Button/Button';
import DetailSet from '../../../../components/DetailSet/DetailSet';
import TitleText from '../../../../components/TitleText/TitleText';
import TokenInputBox from '../../../../components/TokenInputBox/TokenInputBox';
import './GovernancePageModalContent.scss';

const GovernancePageModalContent = props => {
  const { title, description, detailSets, buttons } = props;
  const [ inputValue, setInputValue ] = useState('');

  return(
    <>
      <div className="head">
        <TitleText>{title}</TitleText>
        <div className='line' />
      </div>
      <BodyText>{description}</BodyText>
      <div className="details-container">
        {
          detailSets.map((detail, i) => (
            <DetailSet
              name={detail.name}
              value={detail.value}
            />            
          ))
        }
      </div>
      <TokenInputBox
        hideTokenSelect={true}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
      <div className="btns-container">
        {
          buttons.map((button, i) => (
            <Button
              className={`${!button.primary ? "inactive" : ''}`}
              title={button.title}
              onClick={button.onClick}
            />
          ))
        }
      </div>
    </>
  )
}

export default GovernancePageModalContent;