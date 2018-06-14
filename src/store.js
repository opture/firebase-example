import {
  createStore,
  compose
} from 'redux';

/* Games are supposed to be used as arrays most of the time */
/* Store them with the slug as their key. */

const initialState = {
  isOnline: true
};
const _firebase = (state = initialState, action) => {
  const splittedActionType = action.type.split('/');

  if (splittedActionType[0] !== 'firebase'
      || (!splittedActionType[1] && !splittedActionType[2]) ) return state;


  function createNestedObject(base, names, value) {
    const lastProp = names.pop();

    names.forEach((name) => {
      base = base[name] = base[name] || {};
    });

    base = base[lastProp] = { ...value};
  };

  function createUpdateObject(state,value) {
    const retval = {...state}
    createNestedObject(retval, splittedActionType.slice(3), value)
    return retval
  }

  function removeProperty(state, property){
    const retval = {...state}
    delete retval[property]
    return retval
  }

  switch (splittedActionType[1]) {
    case 'VALUE':
      return {
        ...state,
        [splittedActionType[2]]:{
          ...createUpdateObject(state[splittedActionType[2]],action.value),
        }
        //...createUpdateObject(state,action.value),
      }

    case 'CHILD_ADDED':
      return {
        ...state,
        [splittedActionType[2]]:{
          ...createUpdateObject(state[splittedActionType[2]],action.value),
        }
      };

    case 'CHILD_REMOVED':
      return {
        ...state,
        [splittedActionType[2]]: {
          ...removeProperty(state[splittedActionType[2]], action.key),
        }        
      };

    default:
      return state;
  }
};


let reduxDevTools = null;
if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    actionsBlacklist: ['EVOLUTION_MESSAGE']
  })
}

const composeEnhancers = reduxDevTools || compose;

const store = createStore(_firebase,
  composeEnhancers());
export default store