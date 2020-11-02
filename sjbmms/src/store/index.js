//改文件是一个仓库  用来放公共状态

import { createStore, applyMiddleware } from "redux";
import reducer from "./reducers"; //只需要引入合并得reducer就行了
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./middleware/saga";
var sagaMiddleware = createSagaMiddleware();
var enhancer = applyMiddleware(sagaMiddleware);

var store = createStore(reducer, composeWithDevTools(enhancer));
//引入并运行saga配置，实质就是执行inital生成器函数
sagaMiddleware.run(rootSaga);
export default store;
// 和之前相比我们把reducer整个放在这个文件中太混乱了，我们把reducer细分并且抽离在一个新的文件夹中，通过引入合并文件即可
