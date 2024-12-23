import { useReducer, useCallback } from 'react';
import { parameterColorReducer, initialState } from '../reducers/parameterColor/parameterColorReducer';
import {
  setColor,
  setWhite,
  toggleWhiteSelection,
  setValue,
  addColorValue,
  deleteColorValue,
  resetWhite
} from '../reducers/parameterColor/parameterColorActions';

export function useParameterColor(values = []) {
    const initialStateWithValues = {
        ...initialState,
        values
    }
  const [state, dispatch] = useReducer(parameterColorReducer, initialStateWithValues);

  const handlers = {
    handleSelectColor: useCallback((color) => {
      dispatch(setColor(color));
    }, []),

    handleSetWhite: useCallback((color) => {
      dispatch(setWhite(color));
    }, []),

    handleToggleWhiteSelection: useCallback(() => {
      dispatch(toggleWhiteSelection());
    }, []),

    handleSetValue: useCallback((value) => {
      dispatch(setValue(parseFloat(value)));
    }, []),

    handleAddColorValue: useCallback(() => {
      dispatch(addColorValue());
    }, []),

    handleDeleteColorValue: useCallback((value) => {
      dispatch(deleteColorValue(value));
    }, []),

    handleResetWhite: useCallback(() => {
      dispatch(resetWhite());
    }, [])
  };

  return [state, handlers];
}