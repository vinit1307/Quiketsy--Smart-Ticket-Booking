import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const fullName = localStorage.getItem('fullName');
        const role = localStorage.getItem('role');
        const id = localStorage.getItem('id');

        console.log("Initializing auth with:", { token: !!token, email, role, id });

        if (token && email) {
          setUser({
            id,
            email,
            name: fullName || email.split('@')[0],
            role: role || "USER",
            accountType: role // Add accountType for compatibility
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = (token, email, fullName, role, id) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('fullName', fullName || email.split('@')[0]);
    localStorage.setItem('role', role);
    localStorage.setItem('id', id);

    setUser({
      id,
      email,
      name: fullName || email.split('@')[0],
      role,
      accountType: role // Add accountType for compatibility
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isInitialized // Add this to check if auth is ready
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// import React, { createContext, useState, useContext, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check if user is logged in on mount
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const email = localStorage.getItem('email');
//     const fullName = localStorage.getItem('fullName');
//     const role = localStorage.getItem('role'); // ✅ added role
//     const id = localStorage.getItem('id'); // ✅ added id

//     if (token && email) {
//       setUser({
//         id,
//         email,
//         name: fullName || email.split('@')[0],
//         role: role || "USER" // default to USER if not set
//       });
//     }
//     setLoading(false);
//   }, []);

//   const login = (token, email, fullName, role, id) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('email', email);
//     localStorage.setItem('fullName', fullName || email.split('@')[0]);
//     localStorage.setItem('role', role); // ✅ store role
//     localStorage.setItem('id', id); // ✅ store id

//     setUser({
//       id,
//       email,
//       name: fullName || email.split('@')[0],
//       role
//     });
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('email');
//     localStorage.removeItem('fullName');
//     localStorage.removeItem('role'); // ✅ remove role
//     localStorage.removeItem('id'); // ✅ remove id
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     isAuthenticated: !!user
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
