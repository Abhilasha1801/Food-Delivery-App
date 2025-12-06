import React, { useReducer, useContext, createContext } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD":
            return [...state, {
                id: action.id,
                name: action.name,
                qty: parseInt(action.qty),
                size: action.size,
                price: action.price,
                img: action.img
            }];
        case "REMOVE":
            return state.filter((_, index) => index !== action.index);
        case "DROP":
            return [];
        case "UPDATE":
            return state.map(item => {
                if (item.id === action.id && item.size === action.size) {
                    const newQty = parseInt(item.qty) + parseInt(action.qty);
                    const newPrice = (action.price * newQty) / action.qty;
                    return { ...item, qty: newQty, price: newPrice };
                }
                return item;
            })
        default:
            console.log("Error in Reducer");
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, []);

    return (
        <CartDispatchContext.Provider value={dispatch}>
            <CartStateContext.Provider value={state}>
                {children}
            </CartStateContext.Provider>
        </CartDispatchContext.Provider>
    )
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);