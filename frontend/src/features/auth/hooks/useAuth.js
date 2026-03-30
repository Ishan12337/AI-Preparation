import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { login, register, logout, getMe } from "../services/auth.api";
import { useEffect } from "react";


export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      const data = await login({ email, password });

      if (!data || !data.user) {
        return false;
      }

      setUser(data.user);
      return true;
    } catch (err) {
      console.log("Login error:", err.response?.data || err.message);
      return false; 
    } finally {
      setLoading(false);
    }
  };


  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);

    try {
      const data = await register({ username, email, password });

      if (!data || !data.user) {
        return false;
      }

      setUser(data.user);
      return true;
    } catch (err) {
      console.log("Register error:", err.response?.data || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logout();
      console.log("Logout response: ", data);
      setUser(null);
    } catch (err) {
      console.log("error come when logout as a backend ", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  const getAndSetUser = async () => {
    try {
      const data = await getMe();


      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log("getMe failed ", err);
      setUser(null);
    } finally {
      setLoading(false); 
    }
  };

  getAndSetUser();
}, []);


  return { user, loading, handleRegister, handleLogin, handleLogout };
};