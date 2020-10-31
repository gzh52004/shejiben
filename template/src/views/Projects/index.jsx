import React from 'react';
import request from '@/utils/request';
import { withRouter } from "react-router-dom";

import './style.scss'
import '../../assets/font/iconfont.css'
class Projects extends React.Component {
constructor(props) {
    super(props)
        this.state = {
            data : [],
        }
    }

async componentDidMount(){
    var {data} = await request.post('/sjs/findpage');
    console.log('data',data)
    // 拿到数据 amount代表数据长度， error代表请求状态 0是成功，其他是失败
    this.setState({data:data.msg})
}
render() {
        var {data} = this.state;
    return (
        <div className="project">
            <div className="jx-list">
                <div className="anli"><i className="iconfont icon-chakanjiexi"></i><span>案例解析</span></div>
                <div className="homejx"><i className="iconfont icon-chakanjiexi"></i><span>家装解析</span></div>
                <div className="workjx"><i className="iconfont icon-chakanjiexi"></i><span>工装解析</span></div>
            </div>
            <button onClick={()=> this.props.history.push('/jiexi')}>跳转到案例解析</button>
            {/* {
                data.map(v=>{
                    return  <img key={v.sjsid} src={v.portrait} alt=""/>
                })
            } */}
        </div>
        )
    }
}
Projects = withRouter(Projects);
export default Projects 