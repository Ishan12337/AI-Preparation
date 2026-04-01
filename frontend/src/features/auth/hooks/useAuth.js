import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  // 🔥 LOGIN
  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      await login({ email, password });

      // ⏳ small delay for UX
      await new Promise((res) => setTimeout(res, 1000));

      const me = await getMe();

      if (me?.user) {
        setUser(me.user);
        return true;
      }

      return false;
    } catch (err) {
      console.log("Login error:", err.response?.data || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🔥 REGISTER (auto-login)
  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);

    try {
      await register({ username, email, password });

      // ⏳ delay (important for cookie stability + UX)
      await new Promise((res) => setTimeout(res, 1000));

      const me = await getMe();

      if (me?.user) {
        setUser(me.user);
        return true;
      }

      return false;
    }catch (err) {
  const status = err.response?.status;

  if (status === 409) {
    return "exists"; // 🔥 custom signal
  }

  return false;
} finally {
      setLoading(false);
    }
  };

  // 🔥 LOGOUT
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.log("Logout error:", err.message);
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
      console.log("error come ", err)
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  getAndSetUser();
}, []);



  return { user, loading, handleRegister, handleLogin, handleLogout };
};