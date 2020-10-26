import React from "react";
import { Redirect } from "react-router-dom";
export function withUser(Com) {
  //外边的Route里包着的组件其实是这个Outer并非是Home，Login...这些我们写的
  // 但是这个Outer最终又把props传给传进来的参数组件了;
  return function OuterCom(props) {
    console.log(props, "传给了这个函数组件，并非直接传给Mine");

    //并没有从state中拿数据
    let currentUser = localStorage.getItem("currentUser");
    try {
      currentUser = JSON.parse(currentUser) || {};
    } catch (err) {
      currentUser = {};
    }

    return <Com {...props} currentUser={currentUser} />;
  };
}

export function withAuth(Com) {
  class InnerCom extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    render() {
      console.log("我将要去往何方", this.props, "!!!!!!!", this.props.location);
      var { currentUser, location } = this.props;
      console.log(location.pathname, "location");
      if (currentUser.error === 0) {
        return <Com {...this.props} />;
      } else {
        return <Redirect to={"/login?=" + location.pathname} />;
      }
    }
  }
  return withUser(InnerCom);
}
