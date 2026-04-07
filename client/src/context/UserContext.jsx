import { createContext, useContext, useEffect, useState } from "react";
import { getMyProfileService } from "@/features/profile/services/profileServices";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMyProfileService();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser(); // 🔥 ONLY ONCE
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// custom hook (clean usage)
export const useUser = () => useContext(UserContext);
