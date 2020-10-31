import React from "react";
import { connect } from "react-redux"; //    引入桥接工具 直接把这个Reg组件执行一次即可
import request from '../../utils/request';
import { Toast, WhiteSpace, WingBlank, Button } from 'antd-mobile';
import SHA256 from 'crypto-js/sha256'//sha256加密
import moment from 'moment'//时间处理库
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

class Reg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  state = {
    username: '',
    //用户名验证结果
    sg: '',
    password: '',
  }
  // logout= () => {
  //   //拿到账号密码之后直接触发saga
  //   this.props.dispatch({
  //     type: "logout",
  //     values: {},
  //   });
  // };
  // 监听用户名输入
  changeName = async (e)=>{//input输入什么，就监听这个方法，然后再修改state，然后返回到视图
    // console.log('看下用户输入了什么',e.target.value);
    const {value} = e.target;
    if(!value){
        Toast.fail("不能为空！", 1, null, true);
        return;
    }
    const { data } = await request.get('/users/isRegist', {
        params: {
            username: value
        }
    });
    if(!data.error){
      this.setState({
        username: value,
      })
      return;
    }
    Toast.offline('这个用户名已经被使用了！', 1,null, true);
  } 
  // 监听密码输入
  changePwd = (e)=>{
    const {value} = e.target;
    if(!value){
        Toast.fail("不能为空！", 1, null, true);
        return;
    }
    this.setState({
        password: value,
    })
  }
  //用来生成身份证
  mid = () => {
      var arr4 = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
      var arr5 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      var str = arr4[parseInt(Math.random() * arr4.length)];
      for (var i = 0; i < 5; i++) {
        str += arr5[parseInt(Math.random() * arr5.length)];
      }
      return str;
    }
  // 注册按钮事件
  Reg = async () => {
    //获取账号和密码
    let {username,password,sg} = this.state;
    console.log(password);
    password = SHA256(password).toString();
    console.log(password);
    // 获取注册时间
    let regtime = moment(new Date()).format('YYYY/MM/DD');
    console.log(regtime);
    // 获取身份证
    let userid = this.mid();
    let {data} = await request.post('/users/regist', {
        userid,
        username,
        password,
        regtime
    })
    this.props.history.push({
        pathname: '/login',
        state: { 
            user: username,
            pwd: password,
        }
    })
    // 保存到本地
    //拿到账号密码之后直接触发saga
    // this.props.history.push('/designers');
    // this.props.dispatch({
    //   type: "getdata_async",
    //   values: {
    //     tel: "getdata",
    //     psw: "100151yrl",
    //   },
    // });
    // this.props.dispatch({
    //   type: "Reg_async",
    //   values: {
    //     tel: "18890486258",
    //     psw: "100151yrl",
    //   },
    // });
    // console.log('点击之后',state);
  };


  render() {
      const {username, res} = this.state;
      console.log(res);
    return (
      <div className="Reg">
        <h1>免费注册</h1>
        <p className="small-msg">未注册用户，验证后即完成注册</p>
        <div className="form">
            <input type="text" placeholder="请输入账号" onBlur={(e)=>this.changeName(e)} />
            {/* <h3>{res}</h3> */}
        </div>
        <div className="form">
          <input type="password" placeholder="请输入密码" onBlur={(e)=>this.changePwd(e)}/>
        </div>
        <button onClick={this.Reg} className="Reg-btn">注册</button>
        {/* <button onClick={this.logout}>Logout</button> */}
      </div>
    );
  }
}

Reg = connect(mapStateToProps, mapDispatchToProps)(Reg); // 8 利用纯函数connect执行之后生成的高阶组件对Reg组件进行加工
export default Reg;
