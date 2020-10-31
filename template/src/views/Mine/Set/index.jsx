import React from 'react';
import request from '../../../utils/request';
import SHA256 from 'crypto-js/sha256';
import { List, InputItem, Button, WhiteSpace, WingBlank } from 'antd-mobile';
// import { createForm } from 'rc-form';
import { withRouter } from "react-router-dom";

class Set extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    state = {
        userList: [],
        //存储修改的信息
        age: '',
        nick: '',
        pwd:'',
        tel: '',
    }
    async UNSAFE_componentWillMount() {
        //把用户名从本地取出来
        let user = JSON.parse(localStorage.getItem('username'));
        console.log(user);
        //根据本地用户名模糊查询用户个人信息
        let { data } = await request.post('/users/findpage', {
            findquery: {
                username: user
            }, //默认查询所有
        })
        console.log('看下data', data.msg);
        //根据返回来的数组进行筛选
        let arr = data.msg.filter(item => item.username == user)
        this.setState({
            userList: arr,
        })
    }
    //获取年龄的更改
    changeAge = (e) => {
        console.log('年龄',e);
        this.setState({
            age: e
        })
    }
    //获取昵称的更改
    changeNick = (e) => {
        console.log('昵称',e);
        this.setState({
            nick: e
        })
    }
    //获取密码的更改
    changePwd = (e) => {
        console.log('密码',e);
        this.setState({
            pwd: e
        })
    }
    //获取手机号的更改
    changeTel = (e) => {
        console.log('手机号',e);
        this.setState({
            tel: e
        })
    }
    //提交所有修改
    submit = async() => {
        let {userList,age,nick,pwd,tel} = this.state;
        // console.log(age,nick,pwd,tel);
        let id = userList[0]._id;
        pwd = SHA256(pwd).toString();
        console.log('看下id',id);
        let {data} = await request.put('/users/update/'+id, {
            age,nickname:nick,password:pwd,tel,
        })
        console.log('修改结果',data);
        if(!data.error){
            this.forceUpdate();
        }
    }
    render() {
        const { userList } = this.state;
        // const { getFieldProps } = this.props.form;
        return (
            <div>
                <h1 style={{textAlign:'center', lineHeight:3}}>个人信息</h1>
                {
                    userList ?
                    userList.map(item =>  
                        <List key={item._id}>
                            <InputItem name="age" type="digit" defaultValue={item.age ? item.age : null} onBlur={(e) => this.changeAge(e)}>年龄</InputItem>
                            <InputItem name="nickname" defaultValue={item.nickname ? item.nickname : null} onBlur={(e) => this.changeNick(e)}>昵称</InputItem>
                            <InputItem name="password" type="password" placeholder={item.password} onBlur={(e) => this.changePwd(e)}>密码</InputItem>
                            <InputItem name="regtime" defaultValue={item.regtime} editable={false} >注册日期</InputItem>
                            <InputItem name="tel" type="phone" defaultValue={item.tel ? item.tel : null} onBlur={(e) => this.changeTel(e)}>手机号码</InputItem>
                            <InputItem name="userid" defaultValue={item.userid} editable={false}>身份证</InputItem>
                            <InputItem name="username" defaultValue={item.username} editable={false}>账号</InputItem>
                        </List>)
                    : null
                }
                <Button type="primary" onClick={this.submit} style={{marginTop:'20px'}}>保存</Button><WhiteSpace />
                <Button onClick={()=>this.props.history.push('/mine')}>返回</Button>
            </div>
        )
    }
}
Set = withRouter(Set);
// const BasicInputExampleWrapper = createForm()(BasicInputExample);
export default Set 