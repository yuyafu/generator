

export default function createReducer(initialState, handlers) {
  return (state = initialState, action) => {
    const handler = handlers[action.type];
    if (!handler) {
      return state;
    }
    state = handler(state, action);
    if(typeof state === 'object'){
      return Object.assign({},state);
    }
    return state
  };
}