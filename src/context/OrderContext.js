// OrderContext.js
import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [address, setAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("none by default");
  const [pickup, setPickup] = useState(false);
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  return (
    <OrderContext.Provider
      value={{
        address,
        setAddress,
        selectedMethod,
        setSelectedMethod,
        pickup,
        setPickup,
        useSavedAddress,
        setUseSavedAddress,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
