import React from "react";
import { Redirect } from "react-router-dom";
export function withLogin(Com) {
  return class Outer extends React.Component {
    constructor(props) {
      // console.log("这是进入Outer组件了自动带有lmh", props);
      super(props);
      // this.state = {
      //   currentUser: {},
      // };
      console.log(1, props, "这是最外层Route传来路由地址");
    }
    render() {
      var currentUser = localStorage.getItem("currentUser");
      console.log("withLogin的currentUser=", currentUser);
      try {
        currentUser = JSON.parse(currentUser) || {};
      } catch (err) {
        currentUser = {};
      }
      //要return时 自身并不具备jsx ;而是又重新调用一个组件  调用时把state中的数据当成props传入调用的组件
      return <Com {...this.props} currentUser={currentUser} />;
    }
  };
}

export function withAuth(Mycomponent) {
  return withLogin(
    class OuterComponent extends React.Component {
      constructor(props) {
        super(props);
      }
      componentDidMount() {}
      render() {
        console.log(2);
        var {
          currentUser,
          location: { pathname },
        } = this.props;
        console.log("currentUser=", currentUser);
        if (currentUser.token) {
          console.log("我有值不是undefined代表我登陆了");
          //这里还差一步验证token的步骤，发请求验证token是否正确 才可跳转
          return <Mycomponent {...this.props} />;
        } else {
          return <Redirect to="/login" />;
        }
      }
    }
  );
}
