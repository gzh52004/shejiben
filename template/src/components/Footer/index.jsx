import React from 'react';

import './style.scss'
import '../../assets/font/iconfont.css'

let Footer = function(props){
    const goto = () => {
        // console.log(props);
        props.history.push('/home')
    }
    return(
        <div className="footer">
            <div className="touch module">
                    <h2>找设计师请拨打</h2>
                    <span><i className="iconfont icon-dianhua"></i><b>4006-808-509</b></span>
            </div> 
            <div className="foot-list">
                <ul>
                    <li>我的</li>
                    <li>法律声明</li>
                    <li>电脑版</li>
                    <li>客户端下载</li>
                </ul>
                <p>@2017&nbsp;设计本&nbsp;粤ICP证:B2-20120566号|粤ICP备08125558</p>
            </div>
            <div className="hg100">

            </div>
        </div>
    )
}

export default Footer;
