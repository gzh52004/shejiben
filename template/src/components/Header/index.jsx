import React from 'react';
import { Route, Redirect, Switch, Link, NavLink, withRouter } from "react-router-dom";

import './style.scss';
import '../../assets/font/iconfont.css'

class Header extends React.Component{
    render(){
        // console.log("header.porps",porps);
        return(
            <div className="header">
                <div className="logo" onClick={() => { this.props.history.goBack()}}>
                    <i className="iconfont icon-fanhui"></i>
                    <h2>设计本</h2>
                </div>
                <div className="hed-list">
                    <ul>
                        <li><i className="iconfont icon-zaixiankefu"></i><span>在线客服</span></li>
                        <li><i className="iconfont icon-xiazai"></i><span>APP下载</span></li>
                        <li><i className="iconfont icon-gengduo"></i><span>更多</span></li>
                    </ul>
                </div>
            </div>
        )
    }
    
}
Header = withRouter(Header);
export default Header;
