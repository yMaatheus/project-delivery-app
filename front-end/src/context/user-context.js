const { useCallback, useEffect, useContext, useMemo } = require('react');
const { useState } = require('react');
const { createContext } = require('react');
const { setUserLocal, setToken, clearToken, getToken,
  clearUser } = require('../helpers/auth');
const { getMe, login: loginUser, register: registerUser } = require('../services/users');

const UserContext = createContext({});

function UserProvider(props) {
  const [user, setUser] = useState(null);

  const fetchUser = useCallback(async () => {
    const token = await getToken();

    try {
      if (token) {
        const userResponse = await getMe();
        setUserLocal(userResponse);
        return setUser(userResponse);
      }
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (credentials) => {
    try {
      const loginResponse = await loginUser(credentials);
      console.log(loginResponse);
      setToken(loginResponse.token);
      setUserLocal(loginResponse);
      setUser(loginResponse);
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  const register = useCallback(async (credentials) => {
    try {
      const registerResponse = await registerUser(credentials);
      setToken(registerResponse.token);
      setUser(registerResponse);
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  const logout = () => {
    clearToken();
    clearUser();
    setUser(null);
  };

  const valueToExport = useMemo(() => ({
    user,
    login,
    register,
    logout,
  }), [login, register, user]);

  return (
    <UserContext.Provider
      value={ valueToExport }
      { ...props }
    />
  );
}

const useUser = () => useContext(UserContext);

export { UserProvider, useUser };
