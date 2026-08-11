import { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({children}) => {
//     const [user, setUser] = useState(() => {
//         const savedUser = localStorage.getItem("user");
//         return savedUser ? JSON.parse(savedUser) : null;
// });
    const [user, setUser] = useState(null);

    //function to update user data
    const updateUser = (userData) => setUser(userData);

    // const updateUser = (userData) => {
    //     setUser(userData);
    //     localStorage.setItem("user", JSON.stringify(userData));
    // };

    //function to clear user data
    const clearUser = () => setUser(null);
    // const clearUser = () => {
    //     setUser(null);
    //     localStorage.removeItem("user");
    // };

    return(
        <UserContext value={{
            user,
            updateUser,
            clearUser,
        }} 
        >
            {children}
        </UserContext>
    );
}

export default UserProvider;