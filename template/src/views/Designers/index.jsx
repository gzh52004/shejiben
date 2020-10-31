import React from 'react';
import { Pagination, Icon } from 'antd-mobile';
import request from '@/utils/request';
import { connect } from "react-redux"; //    引入桥接工具 通过条件查询设计师列表
import { Route, Switch, withRouter } from 'react-router-dom'

import './style.scss'
import '../../assets/font/iconfont.css'

//引子组件
import Footer from '../../components/Footer'
import Search from '../../components/Search'
// import Children from './Children'
import City from './City'
import Space from './Space'
import Sort from './Sort'
// console.log('Children',Children)

const mapStateToProps = (state) => {
    console.log("请求回来的列表", state);
    return state;
};
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
};
const locale = {
    prevText: 'Prev',
    nextText: 'Next',
};
class Desginer extends React.Component {
    constructor(props) {
        props.dispatch({
            type: "initdata_async",
            page: 1,
            pagesize: 10,
            sortquery: {},
            findquery: {},
        });
        super(props);
        console.log('这是默认请求回来的porps', props);
    }
    state = {
        queryList: [],
        //三大分类数组
        moduleArr: [{
            id: 1,
            name: '所在城市',
        }, {
            id: 2,
            name: '擅长空间',
        }, {
            id: 3,
            name: '排序方式',
        },],
        //省会数组
        capArr: [],
        //城市数组
        cityArr: [],
        //风格数组
        styleArr: [],
        //排序数组
        sortArr: [{
            s_name: '综合排序',
            sort: ''
        }, {
            s_name: '预约数优先',
            sort: 'yuyue'
        }, {
            s_name: '成交数优先',
            sort: 'order'
        }, {
            s_name: '评价数优先',
            sort: ''
        }],

        // city: [],
        // styleArr: [{
        //     name:'所在城市',
        //     style:[

        //     ],
        // },{
        //     name:'擅长空间',
        //     style:[

        //     ],
        // },{
        //     name:'排序方式',
        //     style:[{
        //         s_name:'综合排序',
        //         sort: ''
        //     },{
        //         s_name:'预约数优先',
        //         sort: 'yuyue'
        //     },{
        //         s_name:'成交数优先',
        //         sort: 'order'
        //     },{
        //         s_name:'评价数优先',
        //         sort: ''
        //     }],
        // }],

        citylock: false,
        //默认隐藏大盒子
        // 弄三把锁
        stylelock: false,
        sortlock: false,

        //默认页码
        page: 1,
        id: null,
    }
    async componentDidMount() {
        // let {page} = this.state;
        let { data } = await request.post('/sjs/findpage', { page: 1, pagesize: 40 });
        console.log('所有数据data', data.msg)
        //创建一个数组，用来保存空间种类
        let kj = [];
        data.msg.forEach((item) => {
            item.projects.forEach((value) => {
                if (value.p_style) {
                    kj.push(value.p_style);
                }
            })
        })
        //空间数组去重
        let kj2 = [...new Set(kj)];
        console.log(kj2);
        // 创建两个数组，分别用来保存地区的省会和城市种类
        let cap = [];
        let town = [];
        let big = [];
        data.msg.forEach((item) => {
            if (item.province) {
                cap.push(item.province);
            }
            if (item.city) {
                town.push(item.city);
            }
        })
        let cap2 = [...new Set(cap)];
        let town2 = [...new Set(town)];
        big.push(cap2, town2);
        console.log('这是城市数组', cap2, town2, big);
        // 修改状态 
        this.setState({
            styleArr: kj2,
            capArr: cap2,
            cityArr: town2,
        })
    }
    // 展开对应的二级列表
    change = ({ id }) => {
        // console.log(id);
        this.setState({
            citylock: false,
            stylelock: false,
            sortlock: false,
        })
        const { sortlock, stylelock, citylock } = this.state;
        if (id === 3) {
            this.setState({
                sortlock: !sortlock,
            })
        } else if (id === 2) {
            this.setState({
                stylelock: !stylelock,
            })
        } else {
            this.setState({
                citylock: !citylock,
            })
        }
    }
    // 根据二级菜单的条件获取对应的sjs列表
    query = (obj) => {
        console.log(obj);
        // const {sort} = item;
        //触发saga,进行条件排序
        this.setState({
            citylock: false,
            stylelock: false,
            sortlock: false,
        })
        this.props.dispatch({
            type: "initdata_async",
            value:
                obj,
        });
    }
    // 图片跳转
    goto = (value) => {
        console.log('点击的图片全部信息', value);
        localStorage.setItem("sjsdata", JSON.stringify(value));
        const { p_detail_number: id } = value;
        console.log('点击跳转的id', id);
        this.props.history.push({
            pathname: '/sjslist/' + id,
            search: '?id=' + id,
            state: value
        })
    }
    //  跳转到case
    case = (value) => {
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
    //上下页切换
    pageChange = (value) => {
        console.log("这是点击上下页得到的数据", value);
        this.props.dispatch({
            type: "initdata_async",
            value: {
                page: value,
            }
        });
    }
    render() {
        console.log('设计师列表的getdataReducer', this.props);
        let { sjs } = this.props;
        let { moduleArr, styleArr, sortArr, cityArr, capArr, page, stylelock, sortlock, citylock, id } = this.state;
        console.log('设计师列表的props', sjs);
        return (
            <div className="pagination-container" >
                <Search></Search>
                <div className="term">
                    {
                        moduleArr.map((item) => <div key={item.id} onClick={this.change.bind(this, item)} className="box">{item.name}<i className="iconfont icon-xiala1"></i></div>)
                    }
                    <div className="lag-box">
                        {
                            citylock ?
                                cityArr.map((item) => <div className="style-box" key={item} onClick={this.query.bind(this, 'city')}><span>{item}</span></div>)
                                :
                                null
                        }
                        {
                            stylelock ?
                                styleArr.map((item) => <div className="style-box" key={item} onClick={this.query.bind(this, { order: -1 })}><span>{item}</span></div>)
                                :
                                null
                        }
                        {
                            sortlock ?
                                sortArr.map((item) => <div className="sort-box" key={item.s_name} onClick={this.query.bind(this, { yuyue: -1 })}><span>{item.s_name}</span></div>)
                                :
                                null
                        }
                    </div>
                </div>
                <div className="content">
                    {
                        // 这是利用saga请求回来的数组进行渲染
                        sjs.data.map(item =>
                            <div key={item.sjsid} className="info-box">
                                <div className="sjsname" onClick={this.case.bind(this, item)}>
                                    <div className="left">
                                        <img src={item.portrait} alt="" />
                                        <div>
                                            <p>{item.sjsname}</p>
                                            <span>{item.province}</span>
                                            <span>{item.city}</span>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <span className="red">{item.lowprice_m2}~{item.heighp_m2}</span>
                                        <span>元/m<sup>2</sup></span>
                                    </div>
                                </div>
                                <div className="p_src">
                                    {
                                        item.projects.map(value =>
                                            <img key={value.p_detail_number} src={value.p_src} alt="" onClick={this.goto.bind(this, value)} />
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
                <Pagination total={4}
                    className="custom-pagination-with-icon"
                    current={page}
                    onChange={this.pageChange}
                    locale={{
                        prevText: (<span className="arrow-align" ><Icon type="left" />上一页</span>),
                        nextText: (<span className="arrow-align" >下一页<Icon type="right" /></span>),
                    }}
                />
                {/* <Switch>
                    <Route path='/designers/Children/id' component={Children}/>   
                </Switch> */}
                {/* <Switch>
                    <Route path='/designers/city' component={City }/>
                    <Route path='/designers/sort' component={Sort}/>
                    <Route path='/designers/space'component={Space }/>
                </Switch> */}
                <Footer></Footer>
            </div>
        )
    }
}
Desginer = withRouter(Desginer)
Desginer = connect(mapStateToProps, mapDispatchToProps)(Desginer);
export default Desginer 