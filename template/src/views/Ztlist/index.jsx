import React from 'react'
import { connect } from "react-redux";
import { Pagination, Icon } from 'antd-mobile';

// 引入尾组件
import Footer from '../../components/Footer';

import './style.scss'

class Ztlist extends React.Component {
    constructor(props) {
        props.dispatch({
            type: "initdata_async",
            value: {}
        });
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
        console.log('这是默认请求回来的porps',this.props.sjs.data);
    }
    render() {
        var {data} = this.props.sjs;
        console.log('这是默认请求回来的porps',this.props.sjs.data);
        return (
            <div className="sjs-list">
                {
                    data.map(item =>
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
const mapStateToProps = (state) => {
    console.log("请求回来的列表", state);
    return state;
};
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
};
Ztlist = connect(mapStateToProps, mapDispatchToProps)(Ztlist);
export default Ztlist;