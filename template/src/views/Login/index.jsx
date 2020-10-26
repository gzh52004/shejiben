import React from "react";
import { connect } from "react-redux"; //    引入桥接工具 直接把这个Login组件执行一次即可

//import SHA256 from "crypto-js/sha256"; //  由于password密码是加密的，所以我们还得引入crytpo-js
import './style.scss';

// 9  定义，将state中的数据映射到UI组件的props，当state更新的时，会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染
//负责组件的输入逻辑，即将state映射到 UI 组件的参数(props)必须返回一个对象
const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log('Login的props=',props)
  }

  login = () => {
    //拿到账号密码之后直接触发saga
    this.props.dispatch({
      type: "login_async",
      values: {
        tel: "18890486258",
        psw: "100151yrl",
      },
    });
  };

  logout= () => {
    //拿到账号密码之后直接触发saga
    this.props.dispatch({
      type: "logout",
      values: {},
    });
  };



  render() {
    return (
      <div className="login">
        <h1>登录注册</h1>
        <p className="small-msg">未注册用户，验证后即完成注册</p>
        <div className="form">
          {" "}
          <input type="text" placeholder="请输入账号"/>
        </div>
        <div className="form">
          {" "}
          <input type="text" placeholder="请输入密码"/>
        </div>
        <button onClick={this.login} className="login-btn">登录</button>
        <span className="yzm">收不到验证码?</span>
        {/* <button onClick={this.logout}>Logout</button> */}
      </div>
    );
  }
}

Login = connect(mapStateToProps, mapDispatchToProps)(Login); // 8 利用纯函数connect执行之后生成的高阶组件对Login组件进行加工
export default Login;
