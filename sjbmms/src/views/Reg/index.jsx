import React from "react";
import { Form, Input, Button, Checkbox, Row, Col } from "antd";
import "./style.scss";
import request from "@/utils/request";
import { UserOutlined, UnlockOutlined } from '@ant-design/icons'
import info from '@/utils/info'; //导入题示信息

import SHA256 from 'crypto-js/sha256'; console.dir(SHA256)
class Reg extends React.Component {
  constructor(props) {
    super(props);
    console.log('reg的props=', props)
    this.state = {
      layout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      },
      tailLayout: {
        wrapperCol: { offset: 8, span: 16 },
      },
      agree: true, //勾选协议
    };
  }

  //提交时候触发
  onFinish = async (values) => {
    console.log("prop", this.props);
    console.log('values==', values)
    var { password, username, surepsw } = values;
    // 弄成满足接口的对象
    if (password != surepsw) {
      return info('error', '两次密码输入不一致')
    }
    var o = {
      user: username,
      psw: SHA256(password).toString()
    };
    console.log('加密之后的o', o)
    var { data } = await request.post("/manager/regist", o);
    if (!data.error) {
      console.log('提交返回i', 'data=', data)
      info('success', '恭喜你，注册成功');
      // 两秒跳转登陆页
      setTimeout(() => {
        this.props.history.push('/login');
      }, 2000)
    } else if (res.data.msg === 'fail') {
      info('error', '服务器异常，未能注册')
    } else {
      info('error', '服务器异常，未能注册')
    }
  }




  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    console.log("props:", this.props);

  };



  // 是否同意协议
  isAgree = (e) => {
    console.log(e.target.checked, "checked");
    var agree = e.target.checked;
    this.setState({
      agree,
    });
  };








  render() {
    var { layout, tailLayout, agree } = this.state;

    // 定义一个满足antd的表单验证对象
    var formRules = {
      username: [
        { required: true, message: "用户名为必填项" },
        //这是自定义的验证  利用validator函数进行自定义校验时候，第二个参数是校验的值
        {
          //value是验证的值
          async validator(rule, value) {
            console.log('注册用户rule=', rule)
            console.log('注册用户value=', value)

            if (!value) {
              return
            }
            if (!/^(?=\D+\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,16}$/.test(value)) {
              console.log('用户名不满足正则啊')
              return Promise.reject('必须为8到16位字符，首位不能为数字，且必须包含大小写字母');
            }
            var { data } = await request.get("/manager/isRegist", {
              params: {
                user: value,
              },

            });
            console.log("Reg的data", data)
            //error为0说明不重名
            if (!data.error) {
              console.log('满足服务器不重名')
              return Promise.resolve();
            }
            console.log('服务器重名')
            return Promise.reject('用户名已存在');

          }
        }
      ],
      password: [
        { required: true, message: '密码不能为空' },
        {
          validator(rule, value) {
            if (!value) {
              return
            }
            if (!/^(?=\D+\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,16}$/.test(value)) {
              console.log('管理员密码不满足正则啊');
              return Promise.reject('必须为8到16位字符，首位不能为数字，且必须包含大小写字母');
            } else {
              return Promise.resolve();
            }

          }
        }
      ],

      surepsw: [
        { required: true, message: '确认密码不能为空' },
      ]

    }


    return (
      <div style={{
        width: '100%', height: 'calc( 100vh - 60px)', top: '60px', position: 'absolute',
        backgroundPositionY: '-260px', backgroundSize: "100%", backgroundImage: 'url(http://47.113.124.47:60004/img/mmb.jpg)',
      }}>
        <Row >
          <Col span={12} offset={6}>
            <h2 className="regtitle">管理员注册</h2>
          </Col>
        </Row>

        <Form
          className="regform"
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label="输入你的账号"
            name="username"
            rules={formRules.username}
            hasFeedback

          >
            {/* validateStatus 代表输入框框的颜色 success时是蓝色  error时候是红色
            hasFreeeback代表 输入框框后边的题示图标 跟随validateStatus变化 validateStatus 是success时，他就打勾 error就打叉
            */ }


            <Input
              placeholder="8到16位字符，首位不能为数字，包含大小写"
              allowClear
              size="large"
              prefix={<UserOutlined />}
            />

            {/*allowClear 表示清除输入内容 为空不显示那个清除图标按钮  */}

          </Form.Item>

          <Form.Item
            label="输入你的密码"
            name="password"
            rules={formRules.password}
            hasFeedback
          >
            <Input.Password
              placeholder="8到16位字符，首位不能为数字，含大小写"
              allowClear
              size="large"
              prefix={<UnlockOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="确认输入密码"
            name="surepsw"
            rules={formRules.surepsw}
            hasFeedback

          >
            <Input.Password
              placeholder="请保持和上面的密码一致"
              allowClear
              size="large"
              prefix={<UnlockOutlined />}
            />
          </Form.Item>


          <Form.Item
            {...tailLayout}
            name="remember"
            valuePropName="checked"
            onChange={this.isAgree}
          >
            <Checkbox style={{ color: 'white' }}>同意《管理员安全注册条款》</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout} className="regbtn">
            <Button type="primary" htmlType="submit" disabled={!agree} size='large'>
              提交
            </Button>

          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Reg;
