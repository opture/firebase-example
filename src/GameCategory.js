import React, { Component } from 'react';
import {connect} from 'react-redux'
import { getGameCategoryById } from './lib/firebasehandler/games';
import { hasNestedProperty } from './lib/common';
import GameCard from './GameCard';

class GameCategory extends Component {
  
  componentWillMount() {
    getGameCategoryById(this.props.categoryId, this.props.country)
  }
  
  render() {
    const games = Object.keys(this.props.gameCategory)
                  .map( key => this.props.gameCategory[key])
                  .sort( (a,b) => {return a.sortOrder > b.sortOrder} ) 
    return (
      <div>
        Gamecateogry
        {games.map( game => <GameCard gameId={game._key} key={game._key}/>)}
      </div>
    );
  }
}
function mstp(state, ownprops){
  return {
    gameCategory: hasNestedProperty(state, `game-categories-topgames.${ownprops.categoryId}.${ownprops.country}`) 
      ? state['game-categories-topgames'][ownprops.categoryId][ownprops.country]
      : {}
  }
}

export default connect(mstp)(GameCategory);