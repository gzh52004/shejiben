import React from 'react';
import request from '@/utils/request';
class Desginer extends React.Component {
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
<div>
    <h1>
    Desginer
    </h1>
    {
        data.map(v=>{
            return <img key={v.sjsid} src={v.portrait} alt=""/>
               
        })
    }
</div>
)
}
}
export default Desginer 