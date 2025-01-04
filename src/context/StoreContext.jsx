import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
<<<<<<< HEAD
    const url = "http://localhost:4000"; // Fixed URL
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
=======
    const url = "https://platter-pal-nlbt.vercel.app"
    const [token, setToken] = useState("")
    const [food_list, setFoodList] = useState([])

>>>>>>> 0cd878344d90c5933f9658b6fc3b7986e447d732

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const newCount = prev[itemId] - 1;
            if (newCount <= 0) {
                const { [itemId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [itemId]: newCount };
        });
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    const getTotals = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                let itemInfo = food_list.find(item => item._id === itemId);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[itemId];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Failed to fetch food list:", error);
        }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error("Failed to load cart data:", error);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                const storedToken = localStorage.getItem("token");
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotals,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
