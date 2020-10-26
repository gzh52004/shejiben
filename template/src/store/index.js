import { createStore, applyMiddleware } from "redux"; // 9 引入applyMiddleware
//2  引入合并之后的reducer，由于合并之后的reducer就是reducers文件夹下的index.js所以引入即可
import reducer from "./reducers";

//3 我之前都是直接在Login组件中主动发ajax请求，然后等求回来之后我再触发action,即我们手动的dispatch,然后改变公共状态
// 现在我很懒，我不想手动发ajax请求 ，所以引入saga概念

//4  saga这东西我的理解就是一个能帮我自动发ajax请求，并且触发action的一个插件，没他我一样锤代码
// 13 最好还要引入  我们自己配置编写的saga,然后传入sagaMiddleware的run方法中并执行
// 这个rootSaga就是我们配置好的saga文件
import rootSaga from "./middleware/saga";

// 11 引入可视化工具中间件redux-devtools-extension；  又引入了一个中间件
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga"; //5 引入saga 他是一个方法 就跟这个createStore一样要执行才会返回我们用的东西

var sagaMiddleware = createSagaMiddleware(); //6 执行该方法得到一个saga中间件对象 注意他是一个插件

// 8  var store = createStore(reducer); //7  我们createStore ,默认只有三个形参 createStore(reducer,initState,middleware)
//  第一个参数就是reducer 第二个参数是state初始值,第三个才是中间件
// 但是，注意：！！！ 我们只传两个参数时候，默认的规定第二个实参就是是undefined
// 也就是说我们传两个实参，会当成三个实参，  即使用两个中间件也不能同时当成第二第三个参数传入，
// 只能有一个中间件的位置，所以我们要引入redux的方法 applyMiddle

// 10 第一行引入applyMiddleware 把saga中间件当参数放入；
var enhancer = applyMiddleware(sagaMiddleware);

//12把redux可视化composeWithDevtools当参数传入createStore,
//然后把redux的applyMiddleware执行之后得到的enhancer传入componseWithDevTools
var store = createStore(reducer, composeWithDevTools(enhancer));

sagaMiddleware.run(rootSaga);

export default store;
