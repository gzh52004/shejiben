var searchCondition = {
  page: 1,
  pagesize: 10,
  findquery: {},
  sortquery: {},
};

const initState = {
  orderlist: [], //初始化订单展示数据
  orderAmount: 0, //初始总共条数’
  searchCondition, //查询条件
};
// reducer就是一个存了初始值的函数，触发同步action就执行相应的代码
const orderReducer = function (state = initState, action) {
  switch (action.type) {
    case "init_orderdata":
      console.log("init_orderdata", action.orderlist, action.orderAmount);
      //这是数据初始化之后，我们给每一条加一个打勾属性
      action.orderlist.forEach((v) => {
        v.singleckd = false;
      });
      return {
        ...state,
        orderlist: action.orderlist,
        orderAmount: action.orderAmount,
      };

    // 2   改变每条数据row的单独的勾选状态
    case "order_changeckd":
      console.log("order_changeckd", action.idobj);
      //传一个 orderidobj  {orderid:XXX,singleckd:bool}过来改变这个orderlist数据中的singleckd属性
      var orderlist_copy = state.orderlist; //把orderlist拿出来让orderidobj身份证相同的改变singleckd
      var idobj = action.idobj;
      orderlist_copy.forEach((v) => {
        if (idobj.orderid === v.orderid) {
          console.log("找到了", v);
          v.singleckd = idobj.singleckd;
        }
      });
      return {
        ...state,
        orderlist: orderlist_copy,
      };

    //3   全选功能 ，点击全选时，让全选框的checked属性来到这里改变所有数据的singleckd属性,那这里的orderlist发生改变
    case "order_Allckd":
      console.log("order_Allckd", action.allckd);
      var orderlist_copy = state.orderlist;
      orderlist_copy.forEach((v) => {
        v.singleckd = action.allckd;
      });
      console.log("之后orderlist_copy", orderlist_copy);
      return {
        ...state,
        orderlist: orderlist_copy,
      };

    case "order_changepage":
      console.log("order_changepage", action.searchCondition);
      return {
        ...state,
        searchCondition: action.searchCondition,
      };

    default:
      return state;
  }
};

export default orderReducer;
