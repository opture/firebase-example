import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import FirebaseHandler from './lib/firebasehandler'
import store from './store'
import { Provider } from 'react-redux';

export const configStaging = {
  apiKey: 'AIzaSyCjmpmW-JV8oD7PN-0CHh2sSPUe4wosh9M',
  authDomain: 'codeta-admin-stage.firebaseapp.com',
  databaseURL: 'https://codeta-admin-stage.firebaseio.com',
  projectId: 'codeta-admin-stage',
  storageBucket: 'codeta-admin-stage.appspot.com',
  messagingSenderId: '232909008343'
};

const fbHandler = FirebaseHandler({
  store,
  config:configStaging
})

ReactDOM.render(
  (<Provider store={store}>
    <App />
  </Provider>), document.getElementById('root'));
registerServiceWorker();

//Init the fbHandler


//Get promotions as a document and cache it.
fbHandler.get({ 
  path: '/webapp/promotions', 
  caching:true
})

//Add a listener to a single document
//Update the name in the document and verify the changes in redux
fbHandler.addDOcumentListener({
  path:'/games-data/100-pandas-1'
})
.then((data) => {
  const updateValue = {name:''}

  //Change the name to see that the redux store updates.
  if (data.name === '102 Pandas'){
    updateValue.name = '100 Pandas'
  }else{
    updateValue.name = '102 Pandas'
  }

  fbHandler.update({path:'/games-data/100-pandas-1', value:updateValue})
});

//Add a listener and load all the data.
fbHandler.addArrayListener({path:'game-categories-filtertags'})

//Verify the remove listener
//Check the redux store and see that the object at the key is removed.
setTimeout( ()=>{
  store.dispatch({
    type:'firebase/CHILD_REMOVED/game-categories-filtertags',
    key:'null'
  })
  //just change the name below, proper name is "Blackjack A" try to keep it that way. But see on the screen that the game component is updated.
  fbHandler.update({path:'/games-data/8342017133/name', value:{name:'Blackjack ABC'}})
  fbHandler.update({path:'/games-data/9202085855', value:{name:'Blackjack C'}})
}, 5000)
