// 我想把这个store中的action弄得清晰一点
// 这个是一个函数 我会传一个参数  然后 函数执行返回一个对象
function login(user) {
  return {
    type: "login",
    user,
  };
}

function logout() {
  return {
    type: "logout",
  };
}

export default {
  login,
  logout,
};
