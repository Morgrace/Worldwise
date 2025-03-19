import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'logout':
      return { ...state, isAuthenticated: false, user: {} };
    default:
      throw new Error('Unknown Action');
  }
}

const Auth = createContext();
const initialState = {
  isAuthenticated: false,
  user: {},
};
const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};
function AuthContext({ children }) {
  const [{ isAuthenticated, user }, dispatch] = useReducer(
    reducer,
    initialState
  );

  async function handleLogin(e, email, password) {
    e.preventDefault();
    if (
      email.toLowerCase() === FAKE_USER.email.toLowerCase() &&
      password === FAKE_USER.password
    )
      return dispatch({ type: 'login', payload: FAKE_USER });
    else throw new Error('invalid password/email address');
  }
  function handleLogout() {
    dispatch({ type: 'logout' });
  }
  return (
    <Auth.Provider value={{ handleLogin, handleLogout, isAuthenticated, user }}>
      {children}
    </Auth.Provider>
  );
}
function useAuth() {
  const context = useContext(Auth);
  if (!context)
    throw new Error('useAuth must be used within the AuthContext Provider');
  return context;
}
AuthContext.propTypes = {
  children: PropTypes.node.isRequired,
};
export { AuthContext, useAuth };
