import Main from "./main";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./_core/store/store";
import { persistStore } from "redux-persist";
import { Toaster } from "react-hot-toast";

const persistor = persistStore(store);
const App = () => {
  console.log("CICD test 1");
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <Toaster />
            <Main />
          </Router>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
