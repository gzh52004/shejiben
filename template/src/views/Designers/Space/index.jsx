import React from 'react'
import { connect } from "react-redux"; //    引入桥接工具 通过条件查询设计师列表

const mapStateToProps = (state) => {
    console.log("请求回来的列表", state);
    return state;
};
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
};
class Space extends React.Component {
constructor(props) {
super(props)
this.state = {
}
}
render() {
return (
<div>
    Space
</div>
)
}
}
Space  = connect(mapStateToProps, mapDispatchToProps)(Space);
export default Space 