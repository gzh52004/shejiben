import axios from "axios";
//封装axios
var BUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3002"
    : "http://47.113.124.47:60004";
var request = axios.create({
  baseURL: BUrl,
});
// 取消ajax请求
// 如果是在原生中调用 abort();   xhr.abort()即可；jq中 jq.ajax().abort()     /əˈbɔːt/  有内鬼 中止
// 在axios中这样  调用axios的CancelToken的source方法；得到一个source对象；该对象有一个cancel方法（'中止生娃'）
// var source = axios.CancelToken.source();
// request.source = source;

export default request;
