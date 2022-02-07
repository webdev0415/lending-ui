import BodyText from '../../../../components/BodyText/BodyText';
import Button from '../../../../components/Button/Button';
import TitleText from '../../../../components/TitleText/TitleText';
import CollectionStatusSet from '../CollectionStatusSet/CollectionStatusSet';
import './CollectionsVoteTable.scss';
import WaveTriangleImage from '../../../../images/waveTriangle.png';


const CollectionsVoteTable = props => {
  const { collections, setSelectedCollectionIndex } = props;

  return (
  <div className="collections-vote-table-container">
    <table>
      <thead>
        <tr>
          <th><BodyText>Rank</BodyText></th>
          <th><BodyText>Asset</BodyText></th>
          <th><BodyText>Status</BodyText></th>
          <th><BodyText>Your votes</BodyText></th>
        </tr>
      </thead>
      <tbody>
        {
          collections.map((collection, i) => {
            return(
              <tr>
                <td><BodyText className="rank">{i + 1}</BodyText></td>
                <td>
                  <div className="asset-details">
                    <img src={collection.image} alt={collection.name} />
                    <TitleText>{collection.name}</TitleText>                        
                  </div>
                </td>
                <img className="wave-triangle" src={WaveTriangleImage} alt="Wave triangle" />
                <td>
                  <CollectionStatusSet
                    index={i}
                    requiredNumOfVotes={1324453}
                    numOfVotes={collection.numberOfVotes}
                  />
                </td>
                <td>
                  <div className="your-votes-set">
                    <TitleText><span>Your votes: </span>2245</TitleText>
                    <Button onClick={ () => setSelectedCollectionIndex(i) } title="Manage votes" />                        
                  </div>

                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  </div>
  )
}

export default CollectionsVoteTable;