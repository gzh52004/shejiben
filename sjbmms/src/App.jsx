import React, { lazy, Suspense } from "react";

import {
  Route,
  Redirect,
  Switch,
  withRouter,

} from "react-router-dom";


// import Login from "@/views/Login";
// import Reg from "@/views/Reg";
// import Home from "@/views/Home";
//路由懒加载  装了@babel/plugin-syntax-dynamic-import自动带有import方法
const Login = lazy(() => import('@/views/Login'))
const Reg = lazy(() => import('@/views/Reg'))
const Home = lazy(() => import('@/views/Home'))


import SHA256 from 'crypto-js/sha256'; console.dir(SHA256)
import request from '@/utils/request';

import "./App.scss";
import { Drawer, Form, Row, Col, Button, Input, message, Spin } from 'antd';
import 'antd/dist/antd.css'
// console.log(Menu,Row,Col,Button,'引入进来的antd');

// 定义mapStateToProps 和mapdisPatchToProps
// 先引入connect  执行connect之后就能在app中拿到isLogin 和dispatch
import { connect } from 'react-redux';

// 第四处改



class App extends React.Component {
  constructor(props) {
    console.log(props, '这是app的props')
    super(props)

    props.dispatch({
      type: 'init_sjsdata_async', page: 1
    })

    this.state = {
      visible_add: false, //这是新增用户时的另一个模态框

    }


  }


  onClose_add = () => {
    this.setState({
      visible_add: false,
    });
  };

  editPsw = async (values) => {
    var { psw, sureAgain, user } = values;
    if (psw != sureAgain) {
      return message.error('两次输入不一致')
    }
    psw = SHA256(psw).toString();
    var { data } = await request.put(`/manager/update/${user}`, {
      psw,
    })
    if (!data.error) {
      message.success('修改管理员密码成功')
      this.props.dispatch({ type: 'logout' });
      this.props.dispatch(
        {
          type: "searchCondition", searchCondition: {
            page: 1,
            pagesize: 10,
            findquery: {},
            sortquery: {},
          }
        }
      )
      this.onClose_add()
    } else {
      message.error('修改管理员密码失败')
    }
  }

  // icon={<MailOutlined />}
  goto = (path) => {
    this.props.history.push(path);
    console.log('path=', path)
  }


  render() {


    //第三处改
    var { userReducer } = this.props;//拿到上边mapState和mapDispatch函数中
    console.log('app的isLogin', userReducer.isLogin)
    var _this = this
    // 由于我们细分了reducer，所以多了一层子reducer,所以要拿到子reducer中得isLogin就得继续解构
    return (
      <div style={{ height: '100%' }}>

        <div >
          {/* 最上边登陆注册按钮 */}
          <Row style={{ width: '100%', height: '60px', background: 'rgb(0,92,122)', position: 'fixed', zIndex: 999 }}>
            <div style={{ width: '80%' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 700, textIndent: '60px', color: "white" }}>设计本后台管理系统</h2>

            </div>
            <div style={{ width: '20%' }}>
              {/* 第二处改 */}
              {
                userReducer.currentUser.error == 0 ?
                  <>
                    <Button style={{ height: '60px', fontSize: '24px', fontWeight: 600 }} type='link' onClick={() => {
                      this.props.dispatch({ type: 'logout' });
                      this.props.dispatch(
                        {
                          type: "searchCondition", searchCondition: {
                            page: 1,
                            pagesize: 10,
                            findquery: {},
                            sortquery: {},
                          }
                        }
                      )
                    }}>
                      退出
              </Button>
                    <Button style={{ height: '60px', fontSize: '24px', fontWeight: 600 }} type='link'
                      onClick={() => {
                        this.setState({
                          visible_add: true,
                        })
                      }}>
                      修改密码
              </Button>
                  </>
                  :
                  <>
                    <Button type='link' style={{ height: '60px', fontSize: '24px', fontWeight: 600 }} onClick={this.goto.bind(this, '/regist')}>注册</Button>
                    <Button type='link' style={{ height: '60px', fontSize: '24px', fontWeight: 600 }} onClick={this.goto.bind(this, '/login')}>登陆</Button>
                  </>
              }

            </div>
          </Row>
          <Suspense fallback={<Spin ></Spin >}>
            <Switch>

              <Route path='/home' component={Home} />
              <Route path='/login' component={Login} />
              <Route path='/regist' component={Reg} />
              <Redirect from='/' to="/home" />
              <Route path="/notfound" render={() => <div>404</div>} />
              <Redirect to="/notfound" />
            </Switch>
          </Suspense>
        </div>
        <>
          <Drawer
            title="修改密码"
            width={720}
            onClose={this.onClose_add}
            visible={this.state.visible_add}
            bodyStyle={{ paddingBottom: 80, height: '400px' }}

          >
            <Form
              layout="vertical"
              hideRequiredMark
              onFinish={this.editPsw}
            >
              <Row gutter={16}>

                <Col span={16}>
                  <Form.Item
                    name="user"
                    label="输入管理员名称"
                    rules={[
                      {
                        required: true,
                        message: "用户名不能为空",
                      },

                    ]}
                  >
                    <Input placeholder="输入用户名" />
                  </Form.Item>
                </Col>


              </Row>


              <Row gutter={16}>

                <Col span={16}>
                  <Form.Item
                    name="psw"
                    label="输入新密码"
                    rules={[
                      {
                        required: true,
                        message: "新密码不能为空",
                      },
                      {
                        validator(rule, value) {
                          if (!/^(?=\D+\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,16}$/.test(value)) {
                            console.log('管理员密码不满足正则啊');
                            return Promise.reject('必须为8到16位字符，首位不能为数字，且必须包含大小写字母');
                          } else {
                            _this.setState({
                              newpsw: value
                            })
                            return Promise.resolve();
                          }

                        }
                      }
                    ]}
                  >
                    <Input placeholder="输入新密码" />
                  </Form.Item>
                </Col>


              </Row>

              <Row gutter={16}>

                <Col span={16}>
                  <Form.Item
                    name="sureAgain"
                    label="再次确认新密码"
                    rules={[
                      {
                        required: true,
                        message: "再次确认新密码不能为空",
                      },
                    ]}
                  >
                    <Input placeholder="确认新密码" />
                  </Form.Item>
                </Col>
              </Row>




              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                    <Button type="primary" htmlType="submit">
                      提交
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                    <Button
                      type="primary"
                      htmlType="button"
                      onClick={this.onClose_add}
                    >
                      取消
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Drawer>
        </>


      </div>
    )

  }

}
App = withRouter(App);

//第一处改
var mapStateToProps = function (state) {
  //  这个玩意就是用来划分我需要传给 组件state的内容的 你可以把整个state都传给组件也可以把一部分比如这个地方
  //  我打印了state.user,那么我传给app组件的state,其实就只有user部分，购物车部分我不想传
  // console.log('mapStateToProps.state=',state,'user=',state.user)
  return state
}
var mapDispatchToProps = function (dispatch) {
  // console.log('mapDispatchToProps=',mapDispatchToProps)
  return {
    dispatch
  }
}

App = connect(mapStateToProps, mapDispatchToProps)(App)
export default App


