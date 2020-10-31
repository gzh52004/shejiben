//1   引入合并Reducer文件的方法combineReducers 注意带 'S'
import { combineReducers } from "redux";

//2    引入reducer的子模块userReducer，。。。 然后利用redux的combineReducer方法合并这些子ruducer
import userReducer from "./user";
import getdataReducer from './sjs';
var reducer = combineReducers({
  user: userReducer,
  sjs: getdataReducer
});
//3    导出reducer
export default reducer;
