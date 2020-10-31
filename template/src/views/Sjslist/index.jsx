import React from 'react'
import { connect } from "react-redux"; 

import './style.scss';

class Sjslist extends React.Component {
    constructor(props) {
        super(props)
        // console.log('这是sjslist刚进来的porops:',props);
        this.state = {
        }
    }
    state = {
        dataList: []
    }
    UNSAFE_componentWillMount() {
        let arr = []
        arr.push(JSON.parse(localStorage.getItem('sjsdata')));
        //用数组把传进来的对象装起来
        console.log('获取本地的存储',arr);
        this.setState({
            dataList: arr
        })
    }
    render() {
        const {dataList} = this.state;
        console.log('这是即将渲染页面的列表',dataList);
        return (
            <div className="case-detail-pic">
                {
                    dataList.map(item => 
                    <div>
                        <img className="case-cover" src={item.p_src} alt=""/>
                        <h1 className="title">{item.p_title_alt}</h1>
                        <span className="parameter">
                            <i>{item.p_houseType}</i>
                            <i>/</i>
                            <i>{item.p_style}</i>
                            <i>/</i>
                            <i>{item.p_area}m<sup>2</sup></i>
                            <i>/</i>
                            <i>{item.p_cost}万元</i>
                        </span>
                        
                            <fieldset className="description">
                                <legend className='column'><span>案例简介</span>CASE DESCRIPTION</legend>
                                <p>{item.p_introduce}</p>
                            </fieldset>
                       
                        <div className="pic">
                            {
                                item.p_details.map(value =>
                                    <div key={value.src}>
                                        <img src={value.src} alt=""/>
                                        <p>{value.text}</p>
                                    </div>
                                    )
                            }
                        </div>
                    </div>)
                }
            </div>
        )
    }
}

// Sjslist = connect(mapStateToProps, mapDispatchToProps)(Sjslist);
export default  Sjslist;