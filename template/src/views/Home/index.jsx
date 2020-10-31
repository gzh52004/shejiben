import React, { useState } from 'react'
// import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { NavBar, Icon, Carousel, WingBlank } from 'antd-mobile';
// import axios from 'axios';
import request from '../../utils/request';

// 引入尾部组件
import Footer from '../../components/Footer/index'
// 引入子组件
// import Home from "./views/Home";
import Designers from "../Designers";
import Mine from "../Mine";
import Projects from "../Projects";
import Notfound from "../Notfound";
import Reg from "../Reg";
import Login from "../Login";
import Ztlist from '../Ztlist';
import Gallery from '../Gallery';
 
import './style.scss'
import '../../assets/font/iconfont.css'

import c01 from '../../assets/img/carousel01.jpg';
import c02 from '../../assets/img/carousel02.png';
import c03 from '../../assets/img/carousel03.jpg';
import m01 from '../../assets/img/more-cont01.png';
import m02 from '../../assets/img/more-cont02.png';

class Home extends React.Component {
    state = {
        menu: [{
            text: '设计案例',
            path: '/projects',
            name: 'projects',
            component: Projects,
            icon: 'iconfont icon-anli-A'
        },
        {
            text: '装修图库',
            path: '/gallery',
            name: 'gallery',
            component: Gallery,
            icon: 'iconfont icon-lishituku'
        }, {
            text: '找设计师',
            path: '/designers',
            name: 'designers',
            component: Designers,
            icon: 'iconfont icon-shejishijianzhushi'
        }, {
            text: '有问必答',
            path: '/login',
            name: 'login',
            component: Login,
            icon: 'iconfont icon-chakanjiexi'
        }, {
            text: '设计专访',
            path: '/ztlist',
            name: 'ztlist',
            component: Ztlist,
            icon: 'iconfont icon-shejishi'
        }],
        dataList: [],
    }
    //得到sjs的数据
    async UNSAFE_componentWillMount() {
        const { data } = await request.get('/sjs/find');
        console.log('请求回来了', data.msg);
        this.setState({
            dataList: data.msg
        })
    }
    //轮播图转动
    componentDidMount() {

    }
    //普通跳转
    skip = (path) => {
        this.props.history.push(path);
    }
    //图片跳转
    goto = (value) => {
        console.log('点击的图片全部信息', value);
        localStorage.setItem("casedata", JSON.stringify(value));
        const { sjsid: id } = value;
        console.log('点击跳转的id', id);
        this.props.history.push({
            pathname: '/caselist/' + id,
            search: '?id=' + id,
            state: value
        })
    }
    render() {
        // console.log('home.porps',this.props);
        const { menu, dataList } = this.state;
        console.log("这是即将渲染HOME的列表", dataList);
        return (
            <div className="home">
                {/* 轮播图 */}
                <div className="carousel">
                    <WingBlank>
                        <Carousel
                            autoplay={false}
                            infinite
                            beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                            afterChange={index => console.log('slide to', index)}
                            autoplay
                        >
                            <img src={c01} alt=""/>
                            <img src={c02} alt=""/>
                            <img src={c03} alt=""/>
                            
                        </Carousel>
                    </WingBlank>
                    {/* <img src={c01} alt="" /> */}
                </div>
                {/* 路由列表 */}
                <div className="nav-router">
                    <ul>
                        {
                            menu.map(item => <li key={item.name} onClick={this.skip.bind(this, item.path)}><i className={item.icon}></i><span>{item.text}</span></li>)
                        }
                    </ul>
                </div>
                {/* 两个静态图 */}
                <div className="more-cont">
                    <img src={m01} alt="" />
                    <img src={m02} alt="" />
                </div>
                {/* 跳转到caselist */}
                <div className="hot module">
                    <h2>热门设计师推荐</h2>
                    <ul className="hot-list">
                        {
                            dataList.map(item => <li key={item.sjsid} ><img src={item.portrait} alt="" onClick={this.goto.bind(this, item)} /></li>)
                        }
                    </ul>
                </div>
                {/* 三个静态图 */}
                <div className="recommend module">
                    <h2>案例推荐</h2>
                    <div className="img-list">
                        <img src={c01} alt="" />
                        <img src={c01} alt="" />
                        <img src={c01} alt="" />
                    </div>
                    <p className="look-more">查看更多案例&nbsp;&gt;</p>
                </div>
                {/* 点更多跳转到ztlist */}
                <div className="designer module">
                    <h2>设计师专访</h2>
                    <div className="sjs-list">
                        {
                            dataList.map(item =>
                                <div className="sjs-item" key={item.sjsid}>
                                    <img src={item.portrait} alt="" />
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
                {/* 其他频道无跳转 */}
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