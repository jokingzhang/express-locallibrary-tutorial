import React, { useReducer } from "react";
import Login from "./modules/Login";
import { Switch, Route, Redirect } from "react-router-dom";
import App from "./App";
import { AuthContext, initialState, reducer } from "./store/Auth";

const Entry = props => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // not login
  if (!state.token) {
    return (
      <AuthContext.Provider
        value={{
          state,
          dispatch
        }}
      >
        <Switch>
          <Route path="/login" component={Login} />
          <Redirect to="/login" />
        </Switch>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      <Route component={App} />
    </AuthContext.Provider>
  );
};

export default Entry;
