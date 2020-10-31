import React from 'react'
import { Tabs, WhiteSpace } from 'antd-mobile';

//引入尾组件
import Footer from '../../components/Footer';

import './style.scss';
import '../../assets/font/iconfont.css'

const tabs = [
    { title: '案例' },
    { title: '评价' },
    { title: '关于TA' },
];

class Caselist extends React.Component {
    constructor(props) {
        super(props)
        console.log('这是caselist刚进来的porops:', props);
        this.state = {
        }
    }
    state = {
        dataList: []
    }
    UNSAFE_componentWillMount() {
        let arr = []
        arr.push(JSON.parse(localStorage.getItem('casedata')));
        //用数组把传进来的对象装起来
        console.log('获取本地的存储', arr);
        this.setState({
            dataList: arr
        })
    }
    render() {
        const { dataList } = this.state;
        console.log('这是即将渲染页面的列表', dataList);
        return (
            <div className="sjs-detail-pic">
                {
                    dataList.map(item => <div key={item.sjsid}>
                        <div className="sjs-info">
                            <div className="head">
                                <div className="yuyue-total">
                                    <p>预约</p>
                                    <span>{item.yuyue}</span>
                                </div>
                                <img src={item.portrait} alt=""/>
                                <div className="order-total">
                                    <p>签单</p>
                                    <span>{item.order}</span>
                                </div>
                            </div>
                            <p className="name">
                                {item.sjsname}
                                <i className="iconfont icon-bao"></i>
                            </p>
                            <p className="city">
                                {item.province}·{item.city}
                            </p>
                            <p className="price">
                                ￥&nbsp;{item.lowprice_m2}~{item.heighp_m2}/m<sup>2</sup>
                            </p>
                        </div>
                        <div className="tab">
                            <WhiteSpace />
                            <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false}>
                                <div className="pic" style={{  alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                                    {
                                        item.projects.map(value => <div key={value.p_detail_number}>
                                            <img className="case-cover" src={value.p_src} alt=""/>
                                            <h1 className="title">{value.p_title_alt}</h1>
                                            <span className="parameter">
                                                <i>{value.p_houseType}</i>
                                                <i>/</i>
                                                <i>{value.p_style}</i>
                                                <i>/</i>
                                                <i>{value.p_area}m<sup>2</sup></i>
                                                <i>/</i>
                                                <i>{value.p_cost}万元</i>
                                            </span>
                                        </div>)
                                    }
                                </div>
                                <div className="assess" style={{  alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                                    {
                                        item.comments.map(value => <div className="comment-info" key={value.id}>
                                            <i className="iconfont icon-huabanfuben"></i>
                                            <div className="info">
                                                <p className="name">{value.id}</p>
                                                <p className="time">{value.time}</p>
                                                <p className="good">好评</p>
                                                <p className="msg">{value.content}</p>
                                            </div>
                                        </div>)
                                    }
                                </div>
                                <div className="about" style={{  alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                                    <span>
                                        <label className="column">设计经验</label>
                                        <label className="info">{item.exp}</label>
                                    </span>
                                    <span>
                                        <label className="column">擅长空间</label>
                                        <label className="info">{item.goodat}</label>
                                    </span>
                                    <span>
                                        <label className="column">个人简介</label>
                                        <label className="info">{item.intro}</label>
                                    </span>
                                    <span className="no-border">
                                        <label className="column">证书/奖项</label>
                                        <label className="info">{item.glory}</label>
                                    </span>
                                </div>
                                
                            </Tabs>
                            <WhiteSpace />
                        </div>
                        
                    </div>)
                }
                <Footer></Footer>
            </div>
        )
    }
}
export default Caselist 