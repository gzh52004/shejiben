import React from 'react';

import './style.scss';
import '../../assets/font/iconfont.css'

let Header = function(props){
    const goto = () => {
        // console.log(props);
        props.history.push('/home')
    }
    return(
        <div className="header">
            <div className="logo" onClick={goto}>
                <h2>设计本</h2>
            </div>
            <div className="hed-list">
                <ul>
                    <li><i className="iconfont icon-zaixiankefu"></i><span>在线客服</span></li>
                    <li><i className="iconfont icon-xiazai"></i><span>APP下载</span></li>
                    <li><i className="iconfont icon-gengduo"></i><span>更多</span></li>
                </ul>
            </div>
        </div>
    )
}

export default Header;
