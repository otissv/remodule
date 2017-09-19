export const register = 'module2';

export const initialState = {
  living: '',
  country: '',
  name: '',
  address: {
    line1: '',
    line2: ''
  }
};

export class setCountry {
  action (payload) {
    return { type: 'setCountry', payload };
  }
  reducer (state, action) {
    return {
      ...state,
      country: action.payload
    };
  }
}
