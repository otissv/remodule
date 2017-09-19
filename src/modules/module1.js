export const register = 'module1';

export const initialState = {
  theme: '',
  uiSettings: {
    isSettingsModalOpen: false
  },
  size: '',
  status: ''
};

export class SetTheme {
  action (payload) {
    return { type: 'SetTheme', payload };
  }
  reducer (state, action) {
    return {
      ...state,
      theme: action.payload
    };
  }
}
