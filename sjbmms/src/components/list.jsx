import React from 'react'
import {withRouter} from 'react-router-dom';
import { Button, Row, Col, Divider,List, Avatar  } from "antd";
import {
    AlertTwoTone,
    TagTwoTone,
    FireTwoTone,
    BankTwoTone,
    RightOutlined,
  } from "@ant-design/icons";
import moment from 'moment'  //引入时刻 
class HomeList extends React.Component {

constructor(props) {

super(props)

this.state = {

}

}

goiq = (id) => {
    console.log('id=',id)
    // this.props.history.push('/iq/'+id)
    console.log(this.props,'homelist的props',this.props.history)
    this.props.history.push({
        pathname:'/iq/'+id, //在props的match始终存在
        search:'?=id'+id,//在props的location中始终存在
        state:{goodsPrice:'998'} //这个在location也能找到，但是不能刷新，刷新之后就消失了
        // query:{ //这个query传过来之后，在location中能找到query，但是不能刷新，刷新之后就消失了
        //     id:4
        // }
    })
} 

render() {
    var {obj} = this.props; //解构
return (

<div>

<Row style={{width:'96%',marginLeft:'2%'}}>
        <Divider/>
            <Col span={4}>
<h2 style={{fontWeight:600}}>{obj._h2}</h2>
            </Col>
            <Col span={2} offset={18}>
            <Button type='link' >更多<RightOutlined /></Button>
            </Col>
        </Row>
    <List
       itemLayout="horizontal"
      size="large"
      dataSource={obj.data}
      renderItem={(item,index) => <List.Item> 
        {/* avator属性是列表item的图标可以放一张完整的图片，以ReactNode的形式放入
           avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />} 
           也就超级简单 放个数组元素下标+1 */}
           {/* dataSource就是列表渲染的数组，并且不用写key值，自动出列了 */}
           {/* render代表每一项每一项中List.Item 里又有两个node<List.Item.Meta/><moment>时间 */}
          <List.Item.Meta  
                    onClick = {this.goiq.bind(this,item._id)}
                    avatar={index+1}
                                  title={<div>{item.question}</div>}
                                  description={<div className="description"><span>回答：{item.answer}</span><span>人气：{item.hot}</span> </div>}
                              />
                                <div>{moment(item.addtime).format('YYYY/MM/DD')}</div></List.Item>
                            
                              }
  /* 引入moment对象 然后传入一个时间字符串2020-08-10T15:24:29.749Z 传入之后利用format格式化成需要的样子 */
    />
       
</div>
)

}

}

HomeList = withRouter(HomeList); 
export default HomeList