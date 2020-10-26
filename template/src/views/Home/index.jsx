import React, { useState } from 'react'
// import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { NavBar, Icon } from 'antd-mobile';
import axios from 'axios';

import Footer from '../../components/Footer/index'

import './style.scss'
import '../../assets/font/iconfont.css'

import c01 from '../../assets/img/carousel01.jpg';
import m01 from '../../assets/img/more-cont01.png';
import m02 from '../../assets/img/more-cont02.png';

class Home extends React.Component{
    state = {
        // menu: [{
        //     text: '首页',
        //     path: '/home',
        //     name: 'home',
        //     component: Home,
        //     icon: 'iconfont icon-lishituku'
        // },{
        //     text: '注册',
        //     path: '/reg',
        //     name: 'reg',
        //     component: Reg,
        //     icon: 'iconfont icon-chakanjiexi'
        // },{
        //     text: '登录',
        //     path: '/login',
        //     name: 'login',
        //     component: Login,
        //     icon: 'iconfont icon-shejishi'
        // },{
        //     text: '设计案例',
        //     path: '/sjcase',
        //     name: 'sjcase',
        //     component: Sjcase,
        //     icon: 'iconfont icon-anli-A'
        // },{
        //     text: '找设计师',
        //     path: '/designer',
        //     name: 'designer',
        //     component: Designer,
        //     icon: 'iconfont icon-shejishijianzhushi'
        // },],
        dataList: [],
    }
    UNSAFE_componentWillMount() {
        axios('./data.json').then((res) => {
            console.log(res.data);
            this.setState({
                dataList: res.data
            })
        })
    }
    render(){
        const { dataList } = this.state;
        return (
            <div className="home">
                <div className="carousel">
                    <img src={c01} alt=""/>
                </div>
                <div className="nav-router">
                    {
                        <ul>
                            <li><i className="iconfont icon-anli-A"></i><span>设计案例</span></li>
                            <li><i className="iconfont icon-lishituku"></i><span>装修图库</span></li>
                            <li><i className="iconfont icon-shejishijianzhushi"></i><span>找设计师</span></li>
                            <li><i className="iconfont icon-chakanjiexi"></i><span>有问必答</span></li>
                            <li><i className="iconfont icon-shejishi"></i><span>设计专访</span></li>
                        </ul>
                    }
                </div>
                <div className="more-cont">
                    <img src={m01} alt=""/>
                    <img src={m02} alt=""/>
                </div>
                <div className="hot module">
                    <h2>热门设计师推荐</h2>
                    <ul>
                    {
                        dataList.map(item => <li><img key={item.sjsid} src={item.portrait} alt=""/></li>)
                    }
                    </ul>
                </div>
                <div className="recommend module">
                    <h2>案例推荐</h2>
                    <div className="img-list">
                        <img src={c01} alt=""/>
                        <img src={c01} alt=""/>
                        <img src={c01} alt=""/>
                    </div>
                    <p className="look-more">查看更多案例&nbsp;&gt;</p>
                </div>
                <div className="designer module">
                    <h2>设计师专访</h2>
                    <div className="sjs-list">
                        {
                            dataList.map(item =>
                                <div className="sjs-item" key={item.sjsid}>
                                    <img src={item.portrait} alt=""/>
                                    <div className="brief">
                                        <div className="brief-top">
                                            <p><i>NO.{item.yuyue}</i><span>{item.sjsname}</span></p>
                                            <span>设计总监</span>
                                        </div>
                                        <div className="brief-btm">
                                            <span>擅长空间</span>
                                            <p>{item.goodat}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <p className="look-more">查看更多专访&nbsp;&gt;</p>
                </div>
                <div className="other module">
                    <h2>其他频道</h2>
                    <span>提交需求</span>
                    <span>设计资讯</span>
                    <span>模型下载</span>
                </div>  
                <Footer />
            </div>
            );
    }
};

export default Home; 