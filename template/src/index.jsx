import React from "react";
import ReactDOM from "react-dom";
import App from "./App"; //根组件
import './App'
import * as serviceWorker from "./serviceWorker"; //缓存资源
import store from "@/store";
import {BrowserRouter} from 'react-router-dom'
import { Provider } from "react-redux";

// console.log(store);
ReactDOM.render(
    <Provider store={store}>
<BrowserRouter>
<App />
</BrowserRouter>
</Provider>
, document.getElementById("root"));

serviceWorker.unregister();
