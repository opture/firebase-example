import fbHandler from './index'

export function getGameById(gameId, isLive){
  fbHandler().addDOcumentListener({
    path:`/games-data/${gameId}`
  })
}
export function getGameCategoryById(categoryId, country){
  fbHandler().get({
    path:`/game-categories-topgames/${categoryId}/${country}`
  })
}