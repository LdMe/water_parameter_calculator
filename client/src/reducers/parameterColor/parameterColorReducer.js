// parameterColorReducer.js
import { ACTIONS } from './parameterColorActions';
import Color from '../../utils/color';

export const initialState = {
  selectedColor: null,
  selectedWhite: { r: 255, g: 255, b: 255, a: 255 },
  selectingWhite: false,
  selectedValue: 0,
  values: []
};

export function parameterColorReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_COLOR:
      if (state.selectingWhite) {
        return {
          ...state,
          selectedWhite: action.payload,
          selectingWhite: false
        };
      }
      const correctedColor = new Color(
        action.payload.r,
        action.payload.g,
        action.payload.b,
        action.payload.a
      ).correctWhite(state.selectedWhite);
      return {
        ...state,
        selectedColor: correctedColor
      };

    case ACTIONS.SET_WHITE:
      return {
        ...state,
        selectedWhite: action.payload
      };

    case ACTIONS.TOGGLE_WHITE_SELECTION:
      return {
        ...state,
        selectingWhite: !state.selectingWhite
      };

    case ACTIONS.SET_VALUE:
      return {
        ...state,
        selectedValue: action.payload
      };

    case ACTIONS.ADD_COLOR_VALUE:
      const newValues = [
        ...state.values,
        {
          color: new Color(
            state.selectedColor.r,
            state.selectedColor.g,
            state.selectedColor.b,
            state.selectedColor.a
          ),
          value: state.selectedValue
        }
      ].sort((a, b) => a.value - b.value);
      return {
        ...state,
        values: newValues,
        selectedColor: null,
        selectedValue: 0
      };

    case ACTIONS.DELETE_COLOR_VALUE:
      return {
        ...state,
        values: state.values.filter(v => v !== action.payload)
      };

    case ACTIONS.RESET_WHITE:
      return {
        ...state,
        selectedWhite: { r: 255, g: 255, b: 255, a: 255 }
      };

    default:
      return state;
  }
}