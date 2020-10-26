//对axios进行二次封装
import axios from "axios";
var baseUrl = "http://localhost:3002";
const request = axios.create({
  baseURL: baseUrl,
});

export default request; // 导出 axios 对象

// 注册用户       http://localhost:3002/users/regist   body传参
//登陆已经写了
