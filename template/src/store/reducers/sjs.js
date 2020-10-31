var searchCondition = {
  page: 1,
  pagesize: 10,
  sortquery: {},
  findquery: {}, 
};
var data = [];

var initState = {
  data,
  searchCondition
};
var getdataReducer = function (state = initState, action) {
    // console.log("任意action被触发", action);
    switch (action.type) {
      //初始化数据
      case "sjsinitdata":
        console.log("匹配到sjsinitdata之后的action=", action.sjslist);
        return  {
          ...state,
          data: action.sjslist,
        }
      default:
        return state;
    }
  };

  export default getdataReducer;