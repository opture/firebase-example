import firebase from 'firebase';

let instance = null;

class FirebaseHandler{  
  constructor(payload = {}){
    if (instance){
      return instance;
    }
    this.config = payload.config;
    this.store = payload.store 
    this.fbRefs = {}

    firebase.initializeApp(this.config)
    this.database = firebase.database()
    instance = this;
  }
  
  updateReduxValue(path, value, reduxPath = null){
    path = path.charAt(0) === '/' ? path : `/${path}`
    if (this.store) this.store.dispatch({
      value,
      reduxPath,
      type:`firebase/VALUE${path}`
    })
  }

  removeFromRedux(path, key){
    path = path.charAt(0) === '/' ? path : `/${path}`
    if (this.store) this.store.dispatch({
      key,
      type:`firebase/CHILD_REMOVED${path}`
    })
  }

  onGetValue(snap, path, caching){
    try{
      const value = snap.val()
      if (caching) window.localStorage.setItem(`firebase${path}`, JSON.stringify(value));
      this.updateReduxValue(path, value)
      return value;
    }
    catch(error){
      return null
    }
  }

  getFbRef(path){
    let theRef;
    if (this.fbRefs[path] && this.fbRefs[path].ref){
      theRef = this.fbRefs[path].ref;
    }else{
      theRef = this.database.ref(path)
      this.fbRefs[path] = {ref: theRef};
    }
    return theRef
  }

  get(payload){
    const {path, caching} = payload,
      theRef = this.getFbRef(path);

    return new Promise( (resolve, reject) => {
      if (caching){
        const cachedValue =  this.getFromLocalStorage(path);
        if (cachedValue) resolve(cachedValue)
      }    

      return theRef.once('value')
      .then((snap) => {
        resolve(this.onGetValue(snap, path, caching)) 
      });
    })

  }

  addDOcumentListener(payload){
    const {path } = payload,
      theRef = this.getFbRef(path);
    
    return new Promise( (resolve, reject) => {
      return theRef.on('value', (snap) => {
        resolve(this.onGetValue(snap, path));
      });
    });
  }
  
  removeDocumentListener(path){
    const theRef = this.getFbRef(path);
    theRef.off()
  }

  onChildAdded(snap, path){
    const val = snap.val(),
          key = snap.key
    this.updateReduxValue(`${path}/${key}`, val)
  }

  onChildRemoved(snap, path){
    const key = snap.key
    this.removeFromRedux(path, key)
  }

  addArrayListener(payload){
    const {path } = payload
    const theRef = this.getFbRef(path)

    theRef.on('child_added', (snap) => {
      this.onChildAdded(snap, path)
    });

    theRef.on('child_changed', (snap) => {
      this.onChildAdded(snap, path)
    });

    theRef.on('child_removed', (snap) => {
      this.onChildRemoved(snap, path)
    });
  }

  removeArrayListeners(payload){
    const {path, listeners} = payload,
          theRef = this.getFbRef(path);
    
    if (Array.isArray(listeners) && listeners.length > 0){
      listeners.forEach( listener => theRef.off(listener))
    }else{
      theRef.off()
    } 
  }

  set(payload){
    const {path, value } = payload,
      theRef = this.getFbRef(path);
    return theRef.set(value)
  }

  update(payload){
    const {path, value } = payload,
      theRef = this.getFbRef(path);
    return theRef.update(value)
  }

  push(payload){
    const {path, value} = payload,
      theRef = this.getFbRef(path)
    theRef.push(value)
  }

  remove(path){
    const theRef = this.getFbRef(path)
    theRef.remove()
  }
 
  getNestedPropertyvalue(path, obj){
  return path.reduce((xs, x) =>
    (xs && xs[x]) ? xs[x] : null, obj)
  }

  getPathFromStore(payload){
    const {path} = payload
    console.log('store')
    console.log(this.store.getState())
    console.log(this.getNestedPropertyvalue(path.split('/'), this.store.getState()  ) )
  }

  getFromLocalStorage(path){
    try {
      const fromCache = JSON.parse(window.localStorage.getItem(`fbCache/${path}`));
      this.updateReduxValue(path, fromCache)
      return fromCache;
    }
    catch(error){
      return null;
    }
  }

}

//export default FirebaseHandler
export default (...params) => {
  if (!params) return new FirebaseHandler()
  return new FirebaseHandler(...params);
}