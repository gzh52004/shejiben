import React from "react";
import { Route, Redirect, Switch, Link, NavLink, withRouter } from "react-router-dom";

// 引入头尾组件
import Header from './components/Header';
import Footer from './components/Footer';
// 引入子组件
import Home from "./views/Home";
import Designers from "./views/Designers";
import Mine from "./views/Mine";
import Projects from "./views/Projects";
import Notfound from "./views/Notfound";
import Sjslist from './views/Sjslist';
import Caselist from './views/Caselist';
import Ztlist from './views/Ztlist';
import Gallery from './views/Gallery';
import Set from './views/Mine/Set';
import Reg from "./views/Reg";
import Login from "./views/Login";

//引入 App.scss
import './App.scss';
import './assets/font/iconfont.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {};
  }
  state = {
    menu: [{
        text: '首页',
        path: '/home',
        name: 'home',
        component: Home,
        icon: 'iconfont icon-shouye'
    },
    {
        text: '案例',
        path: '/projects',
        name: 'projects',
        component: Projects,
        icon: 'iconfont icon-anli-A'
    },{
      text: '设计师',
      path: '/designers',
      name: 'designers',
      component: Designers,
      icon: 'icon-shejishijianzhushi'
    },{
      text: '我的',
      path: '/mine',
      name: 'mine',
      component: Mine,
      icon: 'iconfont icon-wode'
    }],
  }
  goto = (path)=>{
    console.log(path);
    this.props.history.push(path);
  }
  render() {
    // console.log(this.props);
    const { menu } = this.state;
    return (
      <div className="app">
        <Header ></Header>
        <div>
          <Switch>
            {
              menu.map(item => <Route key={item.name} path={item.path} component={item.component}></Route>)
            }
              <Route path="/sjslist/:id" component={Sjslist}></Route>
              <Route path="/caselist/:id" component={Caselist}></Route>
              <Route path="/ztlist" component={Ztlist}></Route>
              <Route path="/gallery" component={Gallery}></Route>
              <Route path="/set" component={Set}></Route>
              <Route path="/login" component={Login}></Route>
              <Route path="/reg" component={Reg}></Route>
              <Route path="/notfound" component={Notfound}></Route>
            
            <Redirect from='/' to='/home' exact />
            <Redirect to='/notfound' /> 
          </Switch>
        </div>
        {/* 路由导航 */}
        <div className="nav-list">
          {
            menu.map(item => <div key={item.name} className="nav-item" onClick= { this.goto.bind(this, item.path) }><i className={item.icon}></i><span>{item.text}</span></div>)
          }
        </div>
      </div>
    );
  }
}
App = withRouter(App);
export default App;
