// parameterColorActions.js
export const ACTIONS = {
    SET_COLOR: 'set_color',
    SET_WHITE: 'set_white',
    TOGGLE_WHITE_SELECTION: 'toggle_white_selection',
    SET_VALUE: 'set_value',
    ADD_COLOR_VALUE: 'add_color_value',
    DELETE_COLOR_VALUE: 'delete_color_value',
    RESET_WHITE: 'reset_white'
  };
  
  export const setColor = (color) => ({
    type: ACTIONS.SET_COLOR,
    payload: color
  });
  
  export const setWhite = (color) => ({
    type: ACTIONS.SET_WHITE,
    payload: color
  });
  
  export const toggleWhiteSelection = () => ({
    type: ACTIONS.TOGGLE_WHITE_SELECTION
  });
  
  export const setValue = (value) => ({
    type: ACTIONS.SET_VALUE,
    payload: value
  });
  
  export const addColorValue = () => ({
    type: ACTIONS.ADD_COLOR_VALUE
  });
  
  export const deleteColorValue = (value) => ({
    type: ACTIONS.DELETE_COLOR_VALUE,
    payload: value
  });
  
  export const resetWhite = () => ({
    type: ACTIONS.RESET_WHITE
  });