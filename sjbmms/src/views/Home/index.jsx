import React, { lazy, Suspense } from 'react';
// import Users from "@/views/Users";
// import Sjs from "@/views/Sjs";
// import Order from "@/views/Order";
const Users = lazy(() => import("@/views/Users"))
const Sjs = lazy(() => import("@/views/Sjs"))
const Order = lazy(() => import("@/views/Order"))
import { withAuth } from '@/utils/hoc.js';
import {
  Route,
  Redirect,
  Switch,
  withRouter,
} from "react-router-dom";
import { Menu, Spin } from 'antd';
import { HomeOutlined, ReconciliationOutlined, UserOutlined } from '@ant-design/icons'
class Home extends React.Component {
  constructor(props) {
    super(props)
    console.log('home.props', props)
    this.state = {
      menu: [
        {
          text: "设计师",
          path: "/home/sjs",
          name: "sjs",
          component: Sjs,
          icon: <HomeOutlined />
        },
        {
          text: "用户",
          path: "/home/users",
          name: "users",
          component: Users,
          icon: <UserOutlined />
        },

        {
          text: "订单",
          path: "/home/order",
          name: "order",
          component: Order,
          icon: <ReconciliationOutlined />
        },


      ],
      current: '/home/sjs',//高亮初始值
      isShow: true
    }
  }

  changeMenu = ({ key }) => {
    // console.log(key,'这是menu的key')
    this.props.history.push(key)
    this.setState({//这个是控制不刷新页面是高亮
      current: key,

    })

  }

  UNSAFE_componentWillMount() {
    //  console.log(this.props.location,'这个时location')
    var { pathname } = this.props.location;
    console.log('这是home页面的pathname=', pathname)
    this.setState({//这个是控制刷新页面是高亮
      current: pathname
    })

  }

  componentDidMount() {

    console.log(this.props.location)
    var { pathname } = this.props.location;
    if (pathname === '/login' || pathname === '/regist') {
      this.setState({//这个是控制刷新页面是高亮
        isShow: false
      })
    } else {
      this.setState({//这个是控制刷新页面是高亮
        isShow: true
      })
    }
    console.log(this.state.isShow)
  }

  render() {
    var { menu, current, isShow } = this.state;
    return (
      <div>

        <div style={{ float: 'left', display: isShow ? 'block' : 'none' }}>
          <Menu theme='dark' style={{ width: '160px', height: '100vh' }} onClick={this.changeMenu} selectedKeys={[current]}>
            <div style={{ marginTop: '80px' }}></div>
            {
              menu.map((v, i) => <Menu.Item key={v.path} icon={v.icon} style={{ fontSize: '20px', height: '40px', lineHeight: '40px', marginTop: '20px', marginBottom: '20px' }} > {v.text}</Menu.Item>)
            }
          </Menu>
        </div>
        <Suspense fallback={<Spin ></Spin >}>
          <Switch>
            <Route path='/home/sjs' component={Sjs} />
            <Route path='/home/users' component={Users} />
            <Route path='/home/order' component={Order} />
            <Redirect from='/home' to="/home/sjs" />

          </Switch>
        </Suspense>
      </div>
    )
  }
}



Home = withRouter(Home)
Home = withAuth(Home)
export default Home 