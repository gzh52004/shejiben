import React from 'react'
import request from '../../utils/request';
import { Pagination, Icon } from 'antd-mobile';

import Search from '../../components/Search'
import Footer from '../../components/Footer'

import './style.scss';
import '../../assets/font/iconfont.css';

class Gallery extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    state = {
        //家装列表
        homeList: [],
        //工装列表
        workList: [],
        //用来决定工装和家装
        lock: false,
    }
    //把数据分成工装和家装
    async componentDidMount() {
        const {data} = await request.get('/sjs/find');
        let arr = [];
        data.msg.forEach((item) => {
            arr = arr.concat(item.projects.filter((value) => 
                value.p_type === '家装'
            ))
        })
        let arr2 = [];
        data.msg.forEach((item) => {
            arr2 = arr2.concat(item.projects.filter((value) => 
                value.p_type === '工装'
            ))
        })
        console.log('看下arr',arr,arr2);
        this.setState({
            homeList: arr,
            workList: arr2
        })
    }
    change = () => {
        const {lock} = this.state;
        this.setState({
            lock: !lock
        })
    }
    render() {
        const {homeList,workList,lock} = this.state;
        console.log('即将渲染的数据列表',homeList,workList,lock)
        return (
            <div className="works">
                <Search></Search>
                <div className="box-list">
                    <div className="box" onClick={this.change}>{lock ? '家装' : '工装'}<i className="iconfont icon-xiala1"></i></div>
                    <div className="box">全部风格<i className="iconfont icon-xiala1"></i></div>
                </div>   
                    {
                        lock ?
                        <div className="photo">
                            {
                                homeList ?
                                homeList.map((item) => <img key={item.p_detail_number} src={item.p_src} alt=""/>)
                                : 
                                null
                            // workList.map((item) => <img key={item.p_detail_number} src={item.p_src} alt=""/>)
                            }
                        </div>
                        :
                        <div className="photo">
                            {
                                workList ?
                                workList.map((item) => <img key={item.p_detail_number} src={item.p_src} alt=""/>)
                                :
                                null
                            }
                        </div>  
                    }
                <Pagination total={4}
                    className="custom-pagination-with-icon"
                    current={1}
                    locale={{
                        prevText: (<span className="arrow-align" ><Icon type="left" />上一页</span>),
                        nextText: (<span className="arrow-align" >下一页<Icon type="right" /></span>),
                    }}
                />
                <Footer></Footer>
            </div>
        )
    }
}
export default Gallery 