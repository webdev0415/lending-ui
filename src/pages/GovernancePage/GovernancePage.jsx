
import { useRef, useState } from 'react';
import ModalContainer from '../../components/ModalContainer/ModalContainer';
import TitleText from '../../components/TitleText/TitleText';
import CollectionsVoteTable from './components/CollectionsVoteTable/CollectionsVoteTable';
import GovernancePageModalContent from './components/GovernancePageModalContent/GovernancePageModalContent';
import MarketSummary from './components/MarketSummary/MarketSummary';
import UserSummary from './components/UserSummary/UserSummary';
import './GovernancePage.scss';

const defaultCollections = [
  {
    name: 'Rogue shark',
    image: "https://cdn.magiceden.io/rs:fill:400:400:0:0/plain/https://www.arweave.net/E5p9vkFIRUuZTm9MskiM2FN8Uo3xDCKr8eIyavvPEIA?ext=png",
    numberOfVotes: 1000000,
    numberOfUserVotes: 0
  },
  {
    name: 'Galactic geckos',
    image: "https://i.imgur.com/PfaeoXm.png",
    numberOfVotes: 530212,
    numberOfUserVotes: 0
  },
  {
    name: 'Thug birdz',
    image: "https://www.arweave.net/nGvadeW0UuvIgzZUyNKaQ-c8400CDQn1FwNthOJ_KUw?ext=png",
    numberOfVotes: 230212,
    numberOfUserVotes: 0
  },
  {
    name: 'Rogue shark',
    image: "https://cdn.magiceden.io/rs:fill:400:400:0:0/plain/https://www.arweave.net/E5p9vkFIRUuZTm9MskiM2FN8Uo3xDCKr8eIyavvPEIA?ext=png",
    numberOfVotes: 230212,
    numberOfUserVotes: 0
  },
]


const GovernancePage = () => {
  const [ selectedCollectionIndex, setSelectedCollectionIndex ] = useState(null);
  const [ showManageHoneyModal, setShowManageHoneyModal ] = useState(false);

  const onWithdrawVotes = () => {

  }

  const onAddVotes = () => {

  }

  return(
    <div className="governance-page">
      <div className="head">
        <TitleText>Vote on new collateral assets</TitleText>
      </div>
      <div className="summaries-container">
        <MarketSummary />
        <UserSummary setShowManageHoneyModal={setShowManageHoneyModal} />
      </div>
      <CollectionsVoteTable
        collections={defaultCollections}
        setSelectedCollectionIndex={setSelectedCollectionIndex}
      />
      <ModalContainer
        isVisible={ showManageHoneyModal || selectedCollectionIndex !== null }
        onClose={ () => {
          setShowManageHoneyModal(false);
          setSelectedCollectionIndex(null)
        }}
        className='governance-page-modal'
      >
        {
          selectedCollectionIndex !== null ?
            <GovernancePageModalContent
              title="Manage votes"
              description={`Lock your veHONEY in this collection’s honey jar as vote and when it gets filled it’ll get
                listed as an acceptable collateral asset.
              `}
              detailSets={[
                {
                  name: 'Collection name',
                  value: defaultCollections[selectedCollectionIndex].name
                },
                {
                  name: 'Total votes',
                  value: "332,420"
                },
                {
                  name: 'Your votes',
                  value: "2,540"
                },
                {
                  name: 'Vote balance',
                  value: "2,540"
                }
              ]}
              buttons={[
                {
                  title: "Withdraw votes",
                  onClick: onWithdrawVotes
                },
                {
                  title: 'Add votes',
                  onClick: onAddVotes,
                  primary: true
                }
              ]}
            />
          :
          <GovernancePageModalContent
            title="Manage locked HONEY"
            description={`Lock HONEY for a minimum of six days and earn veHONEY (vote escrowed HONEY)`}
            detailSets={[
              {
                name: 'Total HONEY locked',
                value: "N/A"
              },
              {
                name: 'Available locked HONEY',
                value: "N/A"
              },
              {
                name: 'HONEY balance',
                value: "N/A"
              }
            ]}
            buttons={[
              {
                title: "Unlock HONEY",
                onClick: onWithdrawVotes
              },
              {
                title: 'Lock HONEY',
                onClick: onAddVotes,
                primary: true
              }
            ]}
          />   
        }
      </ModalContainer>
    </div>
  )
}

export default GovernancePage;