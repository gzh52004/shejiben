import React from "react";
import { NavLink, withRouter, Switch, Redirect, Route } from "react-router-dom";

// 引入头尾组件
import Header from './components/Header';
import Footer from './components/Footer';
// 引入子组件
import Home from "./views/Home";
import Designers from "./views/Designers";
import Mine from "./views/Mine";
import Projects from "./views/Projects";
import Notfound from "./views/Notfound";
import Reg from "./views/Reg";
import Login from "./views/Login";

//引入 App.scss
import './App.scss'
import './assets/font/iconfont.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="app">
        <Header></Header>
        <div>
          <Switch>
            <Route path="/home" component={Home}></Route>
            <Route path="/projects" component={Projects}></Route>
            <Route path="/designers" component={Designers}></Route>
            <Route path="/projects" component={Projects}></Route>
            <Route path="/mine" component={Mine}></Route>
            <Route path="/login" component={Login}></Route>
            <Route path="/reg" component={Reg}></Route>
            <Route path="/notfound" component={Notfound}></Route>
            
            <Redirect from='/' to='/home' exact />
            <Redirect to='/notfound' /> 
            {/* 这个404,要弄个能隔着3秒 自动跳回刚才浏览得页面,或者首页得功能 */}
          </Switch>
        </div>
        {/* 路由导航 */}
        <div className="nav-list">
          <NavLink to="/home" className="nav-item"><i className="iconfont icon-shouye"></i><span>首页</span></NavLink>
          <NavLink to="/projects" className="nav-item"><i className="iconfont icon-anli-A"></i><span>案例</span></NavLink>
          {/* 分工 装家装，还有解析， */}
          <NavLink to="/designers" className="nav-item"><i className="iconfont icon-shejishijianzhushi"></i><span>设计师</span></NavLink>
          <NavLink to="/mine" className="nav-item"><i className="iconfont icon-wode"></i><span>我的</span></NavLink>
          {/* 没有 登陆不能进入我的,登陆之后,才能进入我的页面, 登陆注册得按钮 */}
          {/* <NavLink to="/login"><i className="iconfont icon-wode"></i><span>登陆</span></NavLink> */}
        </div>
      </div>
    );
  }
}
App = withRouter(App);
export default App;
