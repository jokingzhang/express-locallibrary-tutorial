import React from "react";
import history from "../../utils/http/history";

export const initialState = {
  isAuthenticated: false,
  user: null,
  token: null
} as any;

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

if (token) {
  initialState.isAuthenticated = true;
  initialState.token = token;
}

if (user) {
  initialState.user = user;
}

export const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    case "LOGOUT":
      localStorage.clear();
      history.push("/login");
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    default:
      return state;
  }
};

export const AuthContext = React.createContext(initialState);
