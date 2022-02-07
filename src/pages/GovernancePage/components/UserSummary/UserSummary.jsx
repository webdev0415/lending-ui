import './UserSummary.scss';
import WaveTriangleImage from '../../../../images/waveTriangle.png';
import Button from '../../../../components/Button/Button';
import DetailSet from '../../../../components/DetailSet/DetailSet';
import HoneyCoinLogo from '../../../../images/honeyCoinLogo.png';
import BodyText from '../../../../components/BodyText/BodyText';
import TitleText from '../../../../components/TitleText/TitleText';

const UserSummary = props => {
  const { setShowManageHoneyModal } = props;
  return(
    <div className="user-summary">
      <img className="wave-triangle" src={WaveTriangleImage} alt="Wave triangle" />
      <div className="honey-details">
        <div className="total-honey-container">
          <img src={HoneyCoinLogo} alt="honey coin logo" />
          <div className="balance-container">
            <BodyText>Your total HONEY</BodyText>
            <TitleText>N/A</TitleText>
          </div>
        </div>
        <div className="details-container">
          <DetailSet name="Total locked:" value="125,987" />
          <DetailSet name="Total balance:" value="125,987" />
          <DetailSet name="veHONEY reward:" value="125,987" />
        </div>
      </div>
      <div className="separator" />
      <div className="buttons-container">
        <Button title="Get HONEY" />
        <Button onClick={ () => setShowManageHoneyModal(true) } title="Manage HONEY locked" />
        <Button title="Claim veHONEY" />
      </div>
    </div>
  )
}

export default UserSummary;