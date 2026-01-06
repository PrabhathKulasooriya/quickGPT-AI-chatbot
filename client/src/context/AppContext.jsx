import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const AppContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

export const AppContextProvider = ({children})=>{

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [loadingUser, setLoadingUser] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/user/data", {
          headers: { authorization: token },
        });

        if (data.success) {
          setUser(data.user);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message ||error.message);
      } finally {
        setLoadingUser(false);
      }
    };

    const createNewChat = async ()=>{
        try{
            if(!user)return toast.error("User not found");

            navigate("/");
            await axios.post("/api/chat/create",{},{headers:{authorization:token}});
            await fetchUsersChats();
        }catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const fetchUsersChats = async()=>{
        try{
            const {data} = await axios.get("/api/chat/get",{headers:{authorization:token}});
            if(data.success){
                setChats(data.chats);
                //if user has no chats then create new chat
                if(data.chats.length === 0){
                    await createNewChat();
                    return fetchUsersChats();
                }else{
                    setSelectedChat(data.chats[0]);
                }
            }else{
                toast.error(data.message);
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    useEffect (()=>{
        if(theme === "dark"){
            document.documentElement.classList.add("dark");
        }else{
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
      if(token){
        fetchUser();
    }else{
        setUser(null);
    } 
    },[token]);

    useEffect(()=>{
        if(user){
        fetchUsersChats();
        }else{
            setChats([]);
            setSelectedChat(null);
        }
    }, [user]);

    

    const value = {navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChat, 
        theme, setTheme, loadingUser, createNewChat, fetchUsersChats, token, setToken, axios};
    
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=>useContext(AppContext);
