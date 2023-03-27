import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

export default function UserData() {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cookies = new Cookies();

  useEffect(() => {
    const fetchData = async () => {
      const token = cookies.get('token');

      if (!token) {
        return;
      }

      try {
        const response = await axios.get('/api/user/login', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return { userData, isLoggedIn };
};
