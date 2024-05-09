import React, { useState } from "react";
import LoginForm from "./Components/LoginForm";
import ImageGridScreen from "./Components/ImageGridScreen";
import { Provider } from "react-redux";
import store from "./Redux/store";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);//State for isLoggedIn,setIsLoggedIn

  return (
    <Provider store={store}>
      <div>
        {isLoggedIn ? (//if logged in render this thing
          <ImageGridScreen setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <LoginForm setIsLoggedIn={setIsLoggedIn} />//or else render 
        )}
      </div>
    </Provider>
  );
};

export default App;
