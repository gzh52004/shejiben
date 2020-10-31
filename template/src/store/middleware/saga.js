//4 从saga包中引入 takeLatest takeEvery ,call , put
//7检查到 引入路径出错 ,少写了一个/effects ,报错说takeLatest不是函数
import { takeLatest, takeEvery, call, put, apply } from "redux-saga/effects";
// 5 解释下什么作用
// 由于这个saga导出的是一个生成器Generator函数，在store文件夹下的index.js主文件中
// 执行了sagaMiddleware.run(rootSaga);  这个rootSaga就是这个initial,
//然后, 生成器函数执行之后会得到迭代器，迭代器必须配合next方法使用
// 所以一定要有东西让他执行next方法,这个时候 takeEvery，takeLatest就起作用了
// takeEvery在组件每一次触发时都会执行next方法，takeLatest只会执行一次
// call和apply会改变this执行,但是现在看来我们还用不到,
//put就相当于  store.dispatch这就是直接执行store的dispatch方法

//1    saga配置  其实 就是写一个生成器函数，然后导出它，没什么了不起的

//2  由于我们要这个saga中间件帮我们发ajax,所以先要引入request
import request from "@/utils/request";
function* initial() {
  // console.log("hello saga!,saga配置文件执行了");
  yield takeLatest("login_async", login);
  // yield takeLatest("initSjsdata_async", initdata);
  yield takeLatest("initdata_async", initdata);
}


//初始化设计师数据
function * initdata(query){
  const { page,
    pagesize,
    sortquery,
    findquery,  } = query;
  console.log("查询设计师列表的条件",query);
  var { data } = yield call(request.post, "/sjs/findpage", {page,
    pagesize,
    sortquery,
    findquery,});
  console.log("getdata发送请求之后回来的data=", data,data.msg);
  var action = { type: "sjsinitdata", sjslist:data.msg };
  yield put(action);
}

// 6开始写具体的触发条件之后执行的函数
function* login(sagaAction) {
  // console.log(
  //   "sagaAction外边触发saga事件时传进来的参数和触发事件组成的对象{type:'login_async',values:{...} }",
  //   sagaAction
  // );
  // console.log(
  //   "sagaAction外边触发saga事件时传进来的参数和触发事件组成的对象{type:'login_async',values:{...} }",
  //   sagaAction.values
  // );
  //7  利用call改变指向并且发Ajax请求 注意这个call时saga帮我们封装之后的,函数作为第一个参数传入

  var { data } = yield call(request.get, "/users/login", {
    params: sagaAction.values,
  });
  console.log("这是saga帮我们发送请求之后回来的data=", sagaAction);
  //8   注意这里,我没写底下的内容他就不执行上边这个打印

  // 等待异步结果返回后，调用同步action：reducer action
  var action = { type: "login", user: data };
  yield put(action);
}

function* logout(sagaAction) {
  // console.log("登出的sagaAction", sagaAction);
  var action = { type: "logout", user: {} };
  yield put(action);
}

export default initial;
//总结:saga其实就是触发dispatch另一个分支,和原始dispatch触发不冲突,
// 并且帮我们做了异步请求操作
