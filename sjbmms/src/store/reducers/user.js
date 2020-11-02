var currentUser = localStorage.getItem("currentUser"); //拿到本地存储；

var isLogin = false; //令isLogin为false 即初始化状态是未登录
try {
  currentUser = JSON.parse(currentUser) || {}; //因为有可能拿到null值 即不存在本地存储时 就是null  null json.parse还是null
} catch (err) {
  currentUser = {};
}
// 拿到currentUser之后再判断isLogin的值
if (currentUser.token) {
  // 如果登陆了，那么
  isLogin = true;
}

// 定义初始化state
var initState = {
  currentUser,
  isLogin,
};
// { type: "login", user };
var userReducer = function (state = initState, action) {
  switch (action.type) {
    case "login":
      return {
        isLogin: true,
        currentUser: action.user,
      };
    case "logout":
      //触发logout，我就把state改成退出状态删掉本地存储并且把store仓库中的isLogin改为false
      console.log("登出状态");
      localStorage.removeItem("currentUser");
      return {
        currentUser: {},
        isLogin: false,
      };
    case "update_user":
      //这里是更新state数据,为了不删除之前state中其他的数据，我们做个覆盖
      var newState = {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...action.user,
        },
      };
      localStorage.setItem("currentUser", JSON.stringify(newState.currentUser));
      return newState;
    default:
      return state;
  }
};

export default userReducer;
