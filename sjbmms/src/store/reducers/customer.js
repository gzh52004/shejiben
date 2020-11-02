var searchCondition = {
  page: 1,
  pagesize: 10,
  findquery: {},
  sortquery: {},
};

const initState = {
  customerlist: [], //初始化顾客展示数据
  customerAmount: 0, //初始总共条数’
  searchCondition, //查询条件
};
// reducer就是一个存了初始值的函数，触发同步action就执行相应的代码
const customerReducer = function (state = initState, action) {
  switch (action.type) {
    case "init_customerdata":
      console.log(
        "init_customerdata",
        action.customerlist,
        action.customerAmount
      );
      //这是数据初始化之后，我们给每一条加一个打勾属性
      action.customerlist.forEach((v) => {
        v.singleckd = false;
      });
      return {
        ...state,
        customerlist: action.customerlist,
        customerAmount: action.customerAmount,
      };

    // 2   改变每条数据row的单独的勾选状态
    case "customer_changeckd":
      console.log("changeckd", action.idobj);
      //传一个 useridobj  {userid:XXX,singleckd:bool}过来改变这个customerlist数据中的singleckd属性
      var customerlist_copy = state.customerlist; //把customerlist拿出来让useridobj身份证相同的改变singleckd
      var idobj = action.idobj;
      customerlist_copy.forEach((v) => {
        if (idobj.userid === v.userid) {
          console.log("找到了", v);
          v.singleckd = idobj.singleckd;
        }
      });
      return {
        ...state,
        customerlist: customerlist_copy,
      };

    //3   sjs组件的全选功能 ，点击全选时，让全选框的checked属性来到这里改变所有数据的singleckd属性,那这里的customerlist发生改变
    case "customer_Allckd":
      console.log("customer_Allckd", action.allckd);
      var customerlist_copy = state.customerlist;
      customerlist_copy.forEach((v) => {
        v.singleckd = action.allckd;
      });
      console.log("之后customerlist_copy", customerlist_copy);
      return {
        ...state,
        customerlist: customerlist_copy,
      };
    case "customer_changepage":
      console.log("customer_changepage", action.searchCondition);
      return {
        ...state,
        searchCondition: action.searchCondition,
      };

    default:
      return state;
  }
};

export default customerReducer;
