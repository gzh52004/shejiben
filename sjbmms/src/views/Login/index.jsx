import React from "react";
import { Form, Input, Button, Checkbox, Row, Col } from "antd";
import "./style.scss";
import request from "../../utils/request";

// console.log(Row, Col, Button, "引入进来的antd");
import { UserOutlined, UnlockOutlined } from '@ant-design/icons'

import info from '@/utils/info'; //导入题示信息
import SHA256 from 'crypto-js/sha256';
// console.dir(SHA256)
import { connect } from 'react-redux';  //引入这个是为了给组件添加dispatch和公共state 执行connect()(组件即可达到结果)




class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      },
      tailLayout: {
        wrapperCol: { offset: 8, span: 16 },
      },

    };
    console.log('login页面的props', props)
    this.props.dispatch({ type: 'haha', ha: 'hahaaa' })
  }

  //提交时候触发
  onFinish = async (values) => {
    console.log("这个login将要跳完哪个页+ reducer ", this.props);
    var { psw, user, remember } = values;

    var { dispatch, location, history } = this.props;
    psw = SHA256(psw).toString();
    let { data } = await request.get(
      "/manager/login", {
      params: { user, psw },
    }
    )
    console.log('user,psw', user, psw, 'data=', data);
    if (!data.error) {
      remember
        ? localStorage.setItem("currentUser", JSON.stringify(data))
        : sessionStorage.setItem("currentUser", JSON.stringify(data));
      // 触发login，我就把初始state改成登陆状态
      dispatch({ type: 'login', user: data })
      var targetUrl = location.search.slice(11)
      console.log(targetUrl)
      history.push({
        pathname: targetUrl || '/home/sjs'
      })
      info('success', '登陆成功');
      //初始化store中的sjsReducer数据



      request.post('/sjs/findpage', {}).then(
        ({ data }) => {
          var sjslist = data.msg;
          var sjsamount = data.amount;
          this.props.dispatch({ type: 'init_sjs_data', sjslist, sjsamount })
        }
      )
      // console.log('app.data=',data);

    } else {
      info('error', '密码或账号不正确')
    }


  }




  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    console.log("props:", this.props);
  };

  //免登陆
  nologin = () => {

  }



  render() {
    var { layout, tailLayout } = this.state;
    return (
      <div style={{
        width: '100%', height: 'calc( 100vh - 60px)', top: '60px', position: 'absolute', backgroundPositionY: '-260px',
        backgroundSize: "100%", backgroundImage: 'url(http://47.113.124.47:60004/img/mmsbanner2.jpg)',
      }}>
        <Row>
          <Col span={12} offset={6}>
            <h2 className="logintitle">管理员登陆</h2>
          </Col>
        </Row>
        <Form
          className="loginform"
          {...layout}
          name="loginform"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label="输入你的账号"
            name="user"
            rules={[
              { required: true, message: '账号不能为空' },
            ]}

          >
            {/* validateStatus 代表输入框框的颜色 success时是蓝色  error时候是红色
            hasFreeeback代表 输入框框后边的题示图标 跟随validateStatus变化 validateStatus 是success时，他就打勾 error就打叉
            */ }

            <Input
              allowClear
              size="large"
              prefix={<UserOutlined />}
            />

            {/*allowClear 表示清除输入内容 为空不显示那个清除图标按钮  */}

          </Form.Item>

          <Form.Item
            label="输入你的密码"
            name="psw"
            rules={[
              { required: true, message: '密码不能为空' },
            ]}

          >
            <Input.Password
              allowClear
              size="large"
              prefix={<UnlockOutlined />}
            />
          </Form.Item>



          <Form.Item
            {...tailLayout}
            name="remember"
            valuePropName="checked"
            onChange={this.nologin}
          >
            <Checkbox>下次免登陆</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout} className="loginbtn">
            <Button type="primary" htmlType="submit" size='large' >
              提交
            </Button>

          </Form.Item>
        </Form>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    state
  }
}
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  }

}

Login = connect(mapStateToProps, mapDispatchToProps)(Login);
export default Login;
// 问题1？dispatch怎么来
