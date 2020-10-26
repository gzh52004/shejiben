import React from 'react'

// 引入头尾组件
import Header from '../../components/Header';

class Reg extends React.Component {
constructor(props) {
super(props)
this.state = {
}
}
render() {
return (
<div>
    <Header></Header>
    <h1>Reg</h1>
    <div>用户名<input type="text"/></div>
    <div>密码<input type="text"/></div>
    <button>注册</button>
</div>
)
}
}
export default Reg 