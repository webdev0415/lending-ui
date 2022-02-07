import BodyText from '../../../../components/BodyText/BodyText';
import HoneyJar from '../HoneyJar/HoneyJar';
import './CollectionStatusSet.scss';

const CollectionStatusSet = props => {
  const { requiredNumOfVotes, numOfVotes, index } = props;
  return(
    <div className="collection-status-set">
      <div className="progress-details-container">
        <div className="progress-bar">
          <div style={{width: `${numOfVotes/requiredNumOfVotes * 100}%`}} className='range' />
        </div>
        <BodyText>{`( ${numOfVotes} of ${requiredNumOfVotes} )`}</BodyText>
      </div>
      <HoneyJar clipPathId={`clip-path-${index}`} progressFraction={parseFloat(numOfVotes/requiredNumOfVotes).toFixed(4)} />
    </div>
  )
}


export default CollectionStatusSet;