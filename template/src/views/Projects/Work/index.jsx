import React from 'react'
import request from '../../../utils/request';

import './style.scss'
import '../../../assets/font/iconfont.css';
import { Route, withRouter } from "react-router-dom";
class Work extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props);
        this.state = {
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
    UNSAFE_componentWillMount() {
        let { state } = this.props.location;
        console.log('state',state);
        if (state != undefined) {
            this.setState({
                lock: state.lock
            })
        }
    }
    //把数据分成工装和家装
    async componentDidMount() {
        const { data } = await request.get('/sjs/find');
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
        console.log('看下arr', arr, arr2);
        this.setState({
            homeList: arr,
            workList: arr2
        })
    }
    change = () => {
        const { lock } = this.state;
        this.setState({
            lock: !lock
        })
    }
    render() {
        const { homeList, workList, lock } = this.state;
        
        return (
            <div>

            <div className="work">


                <div className="box" onClick={this.change}>{lock ? '家装' : '工装'}<i className="iconfont icon-xiala1"></i></div>

                {
                    lock ?
                        <div className="photo">
                            {
                                homeList ?
                                    homeList.map((item) =>
                                        <div key={item.p_detail_number}  onClick={()=>{this.props.history.push(
                                           '/projects/worksdetails/'+item.p_detail_number
                                        )}}>
                                            <img src={item.p_src} alt="" />
                                            <h1 className="title">{item.p_title_alt}</h1>
                                            <span className="jj">{item.p_introduce}</span>
                                            <span className="parameter">
                                                <i>{item.p_houseType}</i>
                                                <i>/</i>
                                                <i>{item.p_style}</i>
                                                <i>/</i>
                                                <i>{item.p_area}m<sup>2</sup></i>
                                                <i>/</i>
                                                <i>{item.p_cost}万元</i>
                                            </span>
                                        </div>
                                    )
                                    :
                                    null
                                // workList.map((item) => <img key={item.p_detail_number} src={item.p_src} alt=""/>)
                            }
                        </div>
                        :
                        <div className="photo">
                            {
                                workList ?
                                    workList.map((item) => 
                                    <div key={item.p_detail_number}  onClick={()=>{this.props.history.push(
                                        '/projects/worksdetails/'+item.p_detail_number
                                     )}}>
                                            <img src={item.p_src} alt="" />
                                            <h1 className="title">{item.p_title_alt}</h1>
                                            <span className="jj">{item.p_introduce}</span>
                                            <span className="parameter">
                                              
                                                <i>{item.p_room}</i>
                                                <i>/</i>
                                                <i>{item.p_area}m<sup>2</sup></i>
                                                <i>/</i>
                                                <i>{item.p_cost}万元</i>
                                            </span>
                                        </div>)
                                    :
                                    null
                            }
                        </div>
                }
                  </div>
            
         
            </div>
        )
    }
}
export default Work