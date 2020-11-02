import request from "@/utils/request";
import { put, takeEvery } from "redux-saga/effects";
import store from "../../store"; //store里边有dispatch
//initial这个函数是store里执行的
function* initial() {
  console.log("hellow! saga");
  //异步action 或者叫sagaaction

  yield takeEvery("init_sjsdata_async", init_sjsdata_async); //   定义之后就一值处于监听状态，在任意组件dispatch这个action都会执行对应的
  yield takeEvery("init_customerdata_async", init_customerdata_async); //定义 顾客监听
  yield takeEvery("init_orderdata_async", init_orderdata_async); //定义 订单监听
}

// 1  这个专门负责sjs设计师初始化数据，传一个条件 我就发请求，然后请求回来数据之后 触发 同步action把数据存到sjsReducer中
function* init_sjsdata_async(sagaAction) {
  console.log("init_sjsdata_async=", sagaAction);
  var { data } = yield request.post("/sjs/findpage", {
    page: sagaAction.page || 1,
    pagesize: sagaAction.pagesize || 10,
    findquery: sagaAction.findquery || {},
    sortquery: sagaAction.sortquery || {},
  });

  var res = Object.prototype.toString.call(data.msg).slice(8, -1).toLowerCase();

  store.dispatch({
    type: "init_sjsdata",
    sjslist: res === "array" ? data.msg : [],
    sjsamount: data.amount,
  });
}

//2 这个专门负责顾客初始化数据
function* init_customerdata_async(sagaAction) {
  var { data } = yield request.post("/users/findpage", {
    page: sagaAction.page || 1,
    pagesize: sagaAction.pagesize || 10,
    findquery: sagaAction.findquery || {},
    sortquery: sagaAction.sortquery || {},
  });

  var res = Object.prototype.toString.call(data.msg).slice(8, -1).toLowerCase();
  console.log("数据类型", res);

  console.log("sagaAction解构=", data);
  store.dispatch({
    type: "init_customerdata",
    customerlist: res === "array" ? data.msg : [],
    customerAmount: data.amount,
  });
}

//3 这个专门负责订单初始化数据
function* init_orderdata_async(sagaAction) {
  var { data } = yield request.post("/order/findpage", {
    page: sagaAction.page || 1,
    pagesize: sagaAction.pagesize || 10,
    findquery: sagaAction.findquery || {},
    sortquery: sagaAction.sortquery || {},
  });

  var res = Object.prototype.toString.call(data.msg).slice(8, -1).toLowerCase();
  console.log("saga请求订单数据类型", res);
  console.log("saga请求订单数据sagaAction解构=", data);
  store.dispatch({
    type: "init_orderdata",
    orderlist: res === "array" ? data.msg : [],
    orderAmount: data.amount,
  });
}

export default initial;
