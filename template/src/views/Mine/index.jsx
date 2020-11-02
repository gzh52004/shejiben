import React,{Suspense, lazy} from 'react';
import { Route,Switch, withRouter } from "react-router-dom";
// import { connect } from "react-redux"; 
import {withAuth} from  '@/utils/hoc.js';
import request from '../../utils/request';

// import Set from './Set'
// import Myorder from './Myorder'
//引入子路由
const Set = lazy(() => import('./Set'));
const Myorder = lazy(() => import('./Myorder'));

import './style.scss'
import '../../assets/font/iconfont.css'

import head from '../../assets/img/headphoto.jpg'
console.log(head);

const mapStateToProps = (state) => {
    console.log('请求回来', state);
      return state;
    };
    
    
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
};
class Mine extends React.Component {
    constructor(props) {
        super(props)
        // this.state = {
        // }
    }
    
    state = {
        menu: [{
            text: '我的图片',
            name: 'photo',
            icon: 'iconfont icon-lishituku'
        },{
            text: '我的收藏',
            name: 'like',
            icon: 'iconfont icon-xihuan'
        },{
            text: '我的回答',
            name: 'huida',
            icon: 'iconfont icon-chakanhuida'
        },{
            text: '我的信息',
            name: 'information',
            icon: 'iconfont icon-huabanfuben'
        },{
            text: '我的金币',
            name: 'money',
            icon: 'iconfont icon-youhuiquan01'
        },],
        userList: []
    }
    async UNSAFE_componentWillMount() {
        //把用户名从本地取出来
        let user = JSON.parse(localStorage.getItem('username'));
        console.log(user);
        //根据本地用户名模糊查询用户个人信息
        let { data } = await request.post('/users/findpage', {
            findquery: {
                username: user
            }, //默认查询所有
        })
        console.log('看下data', data.msg);
        //根据返回来的数组进行筛选
        let arr = data.msg.filter(item => item.username == user)
        this.setState({
            userList: arr,
        })
    }
    render() {
        const {menu,userList} = this.state;
        console.log('mine页面的loaction',this.props)
        return (
            <div className="user">
                {/* 展示个人信息 */}
                {
                    this.props.history.location.pathname==='/mine/myorder' 
                    || this.props.history.location.pathname==='/mine/set' 
                    ? '' 
                    : 
                    <div >
                    {   
                        userList.map(item => 
                        <div className="user-info" key={item._id}>
                            <div className="user-photo">
                                {
                                    item.portrait ?
                                    <img src={item.portrait} alt=""></img>
                                    :
                                    <img src={head} alt=""></img>
                                    // <img src={item.portrait} alt=""></img>
                                }
                            </div>
                            <h3>{item.nickname}</h3>
                            <button onClick={()=> this.props.history.push('/mine/set')}>完善个人信息</button>
                        </div>)
                    }
                    {/* 进入个人信息页面 */}
                    <div className="my-list">
                        <ul>
                            {
                                menu.map(item => <li key={item.name} onClick={() => this.props.history.push('/mine/myorder')}><i className={item.icon}></i><span>{item.text}</span><i className
                                ='iconfont icon-next'></i></li>)
                            } 
                        </ul>
                    </div>
                    <button></button>
                    </div>
                } 
                <Suspense fallback={<div>loading...</div>}>
                <Route path='/mine/set' component={Set}></Route>        
                <Route path='/mine/myorder' component={Myorder}></Route>        
                </Suspense>
            </div>
        )
    }
}
Mine = withAuth(Mine)
Mine = withRouter(Mine);
// Mine = connect(mapStateToProps, mapDispatchToProps)(Mine);
export default Mine 