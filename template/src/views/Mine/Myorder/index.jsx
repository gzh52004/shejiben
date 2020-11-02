import React from 'react'
import { List, InputItem, Button, WhiteSpace, WingBlank } from 'antd-mobile';
class Myorder extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
        }
    }
    state = {
        orderList: null,
    }
    async UNSAFE_componentWillMount() {
        let arr = [];
        arr.push(JSON.parse(localStorage.getItem("myorder"))) ;
        console.log('myorder的arr', arr);
        this.setState({
            orderList: arr,
        })
    }
    render() {
        const {orderList} = this.state;
        console.log(orderList);
        return (
            <div>
                <h1 style={{lineHeight:3,textAlign:"center"}}>订单信息</h1>
                {
                    orderList[0] ?
                    orderList.map( item => 
                    <List key={item.orderid}>
                        <InputItem name="username" defaultValue={item.username ? item.username : null} editable={false} >您的称呼</InputItem>
                        <InputItem name="sjsname" defaultValue={item.sjsname ? item.sjsname : null} editable={false} >设计师</InputItem>
                        <InputItem name="ordertime" defaultValue={item.ordertime} editable={false} >订单日期</InputItem>
                        <InputItem name="tel" type="phone" defaultValue={item.tel ? item.tel : null} editable={false} >您的电话</InputItem>
                        <InputItem name="city" defaultValue={item.city} editable={false}>城市</InputItem>
                        <InputItem name="area" defaultValue={item.area} editable={false}>面积</InputItem>
                        <InputItem name="house" defaultValue={item.houseType} editable={false}>房屋类型</InputItem>
                        <InputItem name="orderid" defaultValue={item.orderid} editable={false}>订单编号</InputItem>
                        <InputItem name="tips" defaultValue={item.tips} editable={false}>备注信息</InputItem>
                    </List>)
                    : null
                }
            </div>
        )
    }
}
export default Myorder 