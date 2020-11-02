// 这个库是用来管理设计师的基本信息的
//查询条件
var searchCondition = {
  page: 1,
  pagesize: 10,
  findquery: {},
  sortquery: {},
};

const initState = {
  sjslist: [], //初始展示数据
  sjsamount: 0, //一共找到多少条数据 ，分页器有用 total
  searchCondition, //查询条件
};

const sjsReducer = function (state = initState, action) {
  switch (action.type) {
    //  1  初始化数据时，给每一条数据添加singleckd属性作为勾选框的状态条件，默认不勾选
    case "init_sjsdata":
      console.log("init_sjsdata=", action.sjslist, action.sjsamount);
      //初始化数据对所有数据增加一给 singleckd:false属性
      action.sjslist.forEach((v) => {
        v.singleckd = false;
      });

      return {
        ...state,
        sjslist: action.sjslist,
        sjsamount: action.sjsamount,
      };

    // 2   改变每条数据row的单独的勾选状态
    case "changeckd":
      console.log("changeckd", action.idobj);
      //传一个 sjsid  {sjsid:XXX,singleckd:bool}过来改变这个sjslist数据中的singleckd属性
      var sjs_list = state.sjslist; //把sjslist拿出来让sjsidlist身份证相同的改变singleckd
      var idobj = action.idobj;
      sjs_list.forEach((v) => {
        if (idobj.sjsid === v.sjsid) {
          console.log("找到了", v);
          v.singleckd = idobj.singleckd;
        }
      });
      // 从sjslist数组中找到和改变打勾状态改变的id一样的
      console.log("sjs_list=", sjs_list);
      return {
        ...state,
        sjslist: sjs_list,
      };

    //3   sjs组件的全选功能 ，点击全选时，让全选框的checked属性来到这里改变所有数据的singleckd属性,那这里的sjslist发生改变
    case "changeAll_ckd":
      console.log("changeAll_ckd", action.allckd);
      var sjs_list = state.sjslist;
      sjs_list.forEach((v) => {
        v.singleckd = action.allckd;
      });
      console.log("之后sjs_list", sjs_list);
      return {
        ...state,
        sjslist: sjs_list,
      };

    // 4    改变查询条件,其实是改变分页器
    case "changepage":
      console.log("changepage", action.searchCondition);
      return {
        ...state,
        searchCondition: action.searchCondition,
      };

    default:
      return state;
  }
};

export default sjsReducer;
