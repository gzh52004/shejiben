import React from "react";
import SHA256 from 'crypto-js/sha256';
import { connect } from "react-redux"; //    引入桥接工具 直接把这个Login组件执行一次即可
import { Toast, WhiteSpace, WingBlank, Button } from 'antd-mobile';
import request from '../../utils/request';
//import SHA256 from "crypto-js/sha256"; //  由于password密码是加密的，所以我们还得引入crytpo-js
import './style.scss';

// 9  定义，将state中的数据映射到UI组件的props，当state更新的时，会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染
//负责组件的输入逻辑，即将state映射到 UI 组件的参数(props)必须返回一个对象
const mapStateToProps = (state) => {
console.log('请求回来', state);
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
  }
  state = {
    username: '',
    password: '',
    lock: true,
  }
  changeName = async (e)=>{//input输入什么，就监听这个方法，然后再修改state，然后返回到视图
    console.log('看下用户输入了什么',e.target.value);
    const {value} = e.target;
    if(!value){
        return;
    }
    this.setState({
        username: value,
    })
  } 
  changePwd = (e)=>{
    const {value} = e.target;
    if(!value){
        return;
    }
    this.setState({
        password: value,
    })
  }
  //监听7天免登录
  // remember = (e)=>{
  //   let {lock} = this.state;
  //   console.log('看下remember', e.target);
  //   this.setState({
  //     lock: !lock,
  //   })
  //   console.log('看下remember', lock);
  // }

  login = async() => {
  //拿到账号密码之后直接触发saga
    // this.props.history.push('/designers');
  //   this.props.dispatch({
  //     type: "getdata_async",
  //     values: {
  //       tel: "getdata",
  //       psw: "100151yrl",
  //     },
  //   });
    let {username,password} = this.state;
    password = SHA256(password).toString();
    let { data } = await request.get('/users/login', {
      params: {
          username,
          password,
      }
    });
    if(!data.error){
      localStorage.setItem('username',JSON.stringify(username));
      this.props.dispatch({
        type: "login_async",
        values: {
          username: username,
          password: password,
        },
      });
      Toast.success("登录成功！", 1);
      setTimeout(() => {
        this.props.history.push('./mine');
      }, 1000);
    }else{
      Toast.fail("账号或者密码错误！", 1);
      return;
    }
    console.log("看下state里的东西",username,password)
    
    // this.props.history.push('/home');
  };

  // logout= () => {
  //   //拿到账号密码之后直接触发saga
  //   this.props.dispatch({
  //     type: "logout",
  //     values: {},
  //   });




  render() {
    // let user = '';
    // let pwd = '';
    // if(this.props.location.state){
    //   user = this.props.location.state.user;
    //   pwd = this.props.location.state.pwd;
    // // }
    // const {username} = this.state;
    // console.log("看下用户名，",username);
    return (
      <div className="login">
        <h1>登录有惊喜！</h1>
        <p className="small-msg">未注册用户，验证后即完成注册</p>
        <div className="form">
            <input type="text" placeholder="请输入账号"   onBlur={(e)=>this.changeName(e)} />
            {/* <h3>{res}</h3> */}
        </div>
        <div className="form">
            <input type="password" placeholder="请输入密码"  onBlur={(e)=>this.changePwd(e)}/>
        </div>
        {/* <input type="checkbox" value="" onChange={(e) => this.remember(e)}/>七天免登录 */}
        <button onClick={this.login} className="login-btn">登录</button>
        <span className="yzm" onClick={() => {
          this.props.history.push('./reg')
        }}>还没有账号?来这里注册</span>
        {/* <button onClick={this.logout}>Logout</button> */}
      </div>
    );
  }
}

Login = connect(mapStateToProps, mapDispatchToProps)(Login); // 8 利用纯函数connect执行之后生成的高阶组件对Login组件进行加工
export default Login;
