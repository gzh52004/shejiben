import { combineReducers } from "redux"; //从redux中引入合并方法combineReducers合并方法
// 该方法能够把子reducer合并

// 我们要知道的是combine方法是从redux中得到的，以及传参是以对象形式传参
import sjsReducer from "./sjs";
import userReducer from "./user";
import customerReducer from "./customer";
import orderReducer from "./order";
console.log("sjsReducer=", sjsReducer);
var reducer = combineReducers({
  sjsReducer,
  userReducer,
  customerReducer,
  orderReducer,
});
export default reducer;
