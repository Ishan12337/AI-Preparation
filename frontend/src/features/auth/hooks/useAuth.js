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

    if (!data) return false;

    // 🔥 IMPORTANT: immediately fetch user
    const me = await getMe();

    if (me?.user) {
      setUser(me.user);   // ✅ Navbar update
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



const handleRegister = async ({ username, email, password }) => {
  setLoading(true);

  try {
    const data = await register({ username, email, password });

    if (!data) return false;

    const me = await getMe();

    if (me?.user) {
      setUser(me.user);   // ✅ Navbar update
      return true;
    }

    return false;

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
    await logout();
    setUser(null);   // ✅ Navbar वापस change
  } catch (err) {
    console.log(err);
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
      
      if (err.response?.status !== 401) {
        console.log("getMe error:", err.message);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  getAndSetUser();
}, []);

  return { user, loading, handleRegister, handleLogin, handleLogout };
};