import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Layout from "./Layout";
import HomePage from "./components/HomePage";

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<div>About Page</div>} />
                <Route path="contact" element={<div>Contact Page</div>} />
              </Route>
            </Routes>
          </div>
        </Router>
      </Provider>
    </>
  );
}

export default App;
