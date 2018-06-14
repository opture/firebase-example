import React, { Component } from 'react';
import {connect} from 'react-redux'
import { getGameById } from './lib/firebasehandler/games';
import { hasNestedProperty } from './lib/common';

class GameCard extends Component {

  componentWillMount() {
    getGameById(this.props.gameId)
  }

  render() {
    return (
      <div>
        { this.props.game ? `${this.props.game.name} ${this.props.gameId}`  : null}
      </div>
    );
  }
}

function mstp(state, ownprops){
  //Here you would check is user-fav-games/${userId}/gameId is fav marked.
  //When the user fav-marks the update would be present directly if the proper listener is setup for it.
  return {
    game: hasNestedProperty(state, `games-data.${ownprops.gameId}`) 
      ? state['games-data'][ownprops.gameId]
      : {},
    
    // isFavGame: state.app.sessionInfo.isAuthenticated && hasNestedProperty(state, `user-fav-games.${state.app.sessionInfo.userID}.${ownprops.gameId}`)
    //   ? true
    //   : false
    //Above wont work here since we dont have sessionInfo. But setting a listener to the user-fav-games/userId would make sure that when a
    // (It would impose a minor change to the storage of the user-fav-games. ) But the concept works...
    //fbHandler.update({path:'user-fav-games/userID', value:{[gameId]:1} }). 
  }
}
export default connect(mstp)(GameCard);