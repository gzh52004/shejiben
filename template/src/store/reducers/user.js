var currentUser = localStorage.getItem("currentUser"); //拿到本地存储；
try {
  currentUser = JSON.parse(currentUser) || {}; //因为有可能拿到null值 即不存在本地存储时 就是null  null json.parse还是null
} catch (err) {
  currentUser = {};
}

var isLogin = false; //令isLogin为false 即初始化状态是未登录
if (currentUser.Authorization) {
  isLogin = true;
}
var initState = {
  currentUser,
  isLogin,
};

// 2 我们要知道的是  我们在组件中触发的是这个action,
// 我们传入的对象就是这action 我们不知道这个reducer内部做了什么操作，但是从结果来看就是我只要执行了dispatch,这边这个
// action就会收到我们执行dispatch传过来的对象  ，然后根据这个对象 ‘匹配’ 相应的操作 ，这些操作中至少包含返回一个 state

var userReducer = function (state = initState, action) {
  // console.log("任意action被触发", action);
  switch (action.type) {
    case "login":
      console.log("匹配到login之后的action=", action);
      localStorage.setItem("currentUser", JSON.stringify(action.user));
      return { isLogin: true, currentUser: action.user };
    case "logout":
      console.log("登出");
      localStorage.removeItem("currentUser");
      return { isLogin: false, currentUser: {} };
    default:
      return state;
  }
};
//   1     从store文件夹中的index.js中把原来的reducer分离出来,
//   然后把userReducer,cartReducer单独弄成一个个文件合并到这个reducers文件下边的index.js

export default userReducer;
