import React from "react";
import {
  Button,
  Row,
  Col,
  Input,
  Pagination,
  Drawer,
  Form,
  message,
  Upload,
  Modal,
  Empty
} from "antd";
import {
  SearchOutlined,
  RetweetOutlined,
  SwapOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import info from "@/utils/info";

import request from "@/utils/request";
import "./style.scss";
import { connect } from "react-redux";
import moment from 'moment'
import qs from 'qs';
class User extends React.Component {
  constructor(props) {
    super(props);
    console.log("这是进入到User组件组件的props", props);
    //设计师数据初始化
    props.dispatch({
      type: "init_customerdata_async",
    });


    this.state = {
      visible: false, //修改用户的一个模态框
      visible_add: false, //这是新增用户时的另一个模态框
      editdatarow: {}, //修改用户拿到的一条数据
      imgsrc: "", //这是修改信息时返回的图片地址保存变量
      imgsrc_add: "", //这是增加用户时候返回的图片的地址保存变量
      modal_isShow: false,
      p_del: [],//准备删掉的数据数组
      //排序  升降序
      age_sort: 1,
      regtime_sort: 1,
      //按需搜索

      username: '',
      nickname: '',
      userid: '',
      tel: '',

    };
  }

  // 1  修改用户时，模态框隐藏显示,同时用userid把该条数据拿到，放入表单中setFieldsValue方法，
  // 修改模态框默认初始值 editform是通过ref定义的改变Form组件的initialValues值
  //    同时把user头像地址拿到先存着，预防修改时不修改图片
  //     
  editCustomerShow = (_id) => {
    this.setState({
      visible: true,
    });
    var editdatarow = this.props.customerReducer.customerlist.filter((v) => {
      return v._id == _id;
    })[0];
    console.log('修改用户默认值=', editdatarow)
    this.setState({
      editdatarow,
      imgsrc: editdatarow.portrait,
    });
    this.editform.setFieldsValue(editdatarow); //修改模态框默认初始值 editform是通过ref定义的改变Form组件的initialValues值
  };


  // 2 新增用户 表单不需要 默认值
  addUser = () => {
    this.setState({
      visible_add: true,
    });

  }

  // 3.1 关闭修改模态框
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 3.2关闭新增的模态框
  onClose_add = () => {
    this.setState({
      visible_add: false,
    });
  };


  //4 修改之后提交表单触发 
  editSub = async (values) => {
    console.log('values,修改提交', values)
    values.age = +values.age;
    values.portrait = this.state.imgsrc;  //  ！！！存入图片地址

    console.log('Edit的Values=', values)
    var _id = this.state.editdatarow._id;//
    var { data } = await request.put(`/users/update/${_id}`, values);
    if (!data.error) {
      info('success', '修改数据成功')
    } else {
      info('error', '修改数据失败')
    }
    this.onClose();
    // 修改之后我们应该初始化一次，并且searchCondition和之前的一样
    this.props.dispatch({
      type: "init_customerdata_async",
      page: this.props.customerReducer.searchCondition.page,
      pagesize: this.props.customerReducer.searchCondition.pagesize
    });
    //修改之后把之前的数据置空
    this.setState({
      editdatarow: {}
    })

  };

  //5 新增之后表单提交触发，注意数值类型发生改变，要变回去数值类型

  addSub = async (values) => {
    var regtime = moment(new Date()).format('YYYY/MM/DD');
    values.regtime = regtime; //提交时 的时间为新的regtime时间
    console.log("values", values);
    values.age = +values.age;
    values.portrait = this.state.imgsrc_add;//存入图片地址
    var { data } = await request.post(`/users/regist`, values);
    if (!data.error) {
      info('success', '新增数据成功')
    } else {
      info('error', '新增数据失败')
    }
    this.onClose_add();
    this.props.dispatch({
      type: "init_customerdata_async",
      page: this.props.customerReducer.searchCondition.page,
      pagesize: this.props.customerReducer.searchCondition.pagesize
    });
  };


  //删除数据 分为两种，一种打勾的，还有一种直接删
  // 6  打勾的打勾只是改变reducer中存的数据的singleckd属性，真正删还得点删除选中的按钮，直接删是拿到数据id直接请求服务器了
  delone = (e) => {
    //这里点击是改变customerReducer中的数据singleckd
    // console.log('打勾的bool', e.target.checked, e.target.dataset.idx)
    //注意 这里的idx是数据的_id
    var idobj = { userid: e.target.dataset.idx, singleckd: e.target.checked }
    this.props.dispatch({
      type: "customer_changeckd", idobj
    });
    console.log(this.props.customerReducer)

  }


  // 7 删除  点击右边删除按钮时，  拿到数据的身份证做成数组存到 this.state.p_del,显示对话框，然后直接发请求
  //         点击删除选中按钮时，  也是拿到数据的身份证做成数组存到 this.state.p_del,显示对话框，然后直接发请求
  deldata = async e => {

    let { data } = await request.delete(
      "/users/delmany", {
      params: this.state.p_del, //这个是点击删除按钮是把那条数据的_id存到state中了state.p_del = [{_id:'xxxx'}]
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false })
      }
    }
    )
    if (!data.error) {
      info('success', data.msg)
    } else {
      info('error', data.msg)
    }
    this.props.dispatch({
      type: "init_customerdata_async",
      page: this.props.customerReducer.searchCondition.page,
      pagesize: this.props.customerReducer.searchCondition.pagesize


    });
    this.setState({
      modal_isShow: false,
    });
  };

  // 8 改变所有当前数据的勾选状态
  changeAll = (e) => {
    console.log(e.target.checked)
    this.props.dispatch({
      type: "customer_Allckd",
      allckd: e.target.checked
    });
  }



  // 9 分页 直接改变了customerReducer中的searchCondition状态 改变请求的页数和条数，改变之后还要初始化数据一次
  changpage = (page, pagesize) => {
    console.log('分页器', page, pagesize)
    var searchCondition = this.props.customerReducer.searchCondition;

    searchCondition.page = page
    searchCondition.pagesize = pagesize
    console.log('searchCondition分页之后', searchCondition)
    this.props.dispatch({
      type: "customer_changepage",
      searchCondition
    });
    this.props.dispatch({
      type: "init_customerdata_async",
      page: page,
      pagesize: pagesize
    });
  }


  //10 rest重置
  reset = () => {
    this.props.dispatch({
      type: "init_customerdata_async",
      page: 1,
      pagesize: 10,
      findquery: {},
      sortquery: {},
    });
    this.props.dispatch({
      type: 'customer_changepage',
      searchCondition: {
        page: 1,
        pagesize: 10,
        findquery: {},
        sortquery: {},
      }
    })
  }

  //11   3种排序  拿到排序key 此值每点击一次都会*-1 改变，然后重新触发saga数据初始化，和重置customerReducer中的排序条件
  sort_age = () => {
    var sortkey = this.state.age_sort
    this.props.dispatch({
      type: "init_customerdata_async",
      sortquery: { age: sortkey * -1 },
      page: 1,
      pagesize: 10,
    });
    this.setState({
      age_sort: sortkey * -1
    })
    this.props.dispatch({
      type: 'customer_changepage',
      searchCondition: {
        sortquery: { age: sortkey * -1 },
        page: 1,
        pagesize: 10,
      }
    })
  }
  sort_regtime = () => {
    var sortkey = this.state.regtime_sort
    this.props.dispatch({
      type: "init_customerdata_async",
      sortquery: { regtime: sortkey * -1 },
      page: 1,
      pagesize: 10,
    });
    this.setState({
      regtime_sort: sortkey * -1
    })
    this.props.dispatch({
      type: 'customer_changepage',
      searchCondition: {
        sortquery: { regtime: sortkey * -1 },
        page: 1,
        pagesize: 10,
      }
    })
  }



  //12条件查询  应该是点击时候获取 这5个框的值this.state.findquery 弄一个对象然后初始化数据
  conditionFind = () => {
    var { username, nickname, userid, tel } = this.state;
    var fc = { username, nickname, userid, tel }
    var findquery = {}
    for (var p in fc) {
      if (fc[p] === '') {
        continue
      }
      findquery[p] = fc[p]
    }
    console.log('用户的查询条件findquery=', findquery)
    this.props.dispatch({
      type: "init_customerdata_async",
      findquery: findquery,
      sortquery: {},
    });

  }






  render() {
    console.log("这是渲染到custmoer的render的props", this.props);
    var { searchCondition, customerlist, customerAmount } = this.props.customerReducer
    var { editdatarow, username, nickname, userid, tel } = this.state; //editdatarow该值作为修改custmoer数据的模态框表单的初始值
    var allck = customerlist.every(v => {
      return v.singleckd
    })

    var _this = this;
    const editconfig = {
      //这个editconfig就是修改上传图片的配置对象,成功上传后应该把回来的图片地址保存到state中的imgsrc
      name: "portrait",
      action: "http://localhost:3002/users/portrait",
      onChange(info) {
        if (info.file.status !== "uploading") {
          console.log(info.file, "文件地址", info.file.response, info.fileList);
        }
        if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully`);
          _this.setState({
            imgsrc: info.file.response,
          });
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    //新增用户的上传图片配置对象
    const addconfig = {
      name: "portrait",
      action: "http://localhost:3002/users/portrait",
      onChange(info) {
        if (info.file.status !== "uploading") {
          console.log(info.file, "文件地址", info.file.response, info.fileList);
        }
        if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully`);
          _this.setState({
            imgsrc_add: info.file.response,
          });
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    }



    return (
      <div style={{ marginLeft: "160px", paddingTop: "60px", height: "100vh" }}>
        {/* 为了和浮动的左菜单划开距离 */}
        <div
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >

          {/* 用户名查询 */}
          <Input
            size="large"
            allowClear
            style={{ width: "130px" }}
            placeholder="姓名"
            value={username}
            onChange={(e) => {
              this.setState({
                username: e.target.value
              })
            }}
          />
          {/* 昵称查询 */}
          <Input
            size="large"
            allowClear
            style={{ width: "120px" }}
            placeholder="昵称"
            value={nickname}
            onChange={(e) => {
              this.setState({
                nickname: e.target.value
              })
            }}
          />

          {/* 用户id查询 */}
          <Input
            size="large"
            allowClear
            style={{ width: "120px" }}
            placeholder="用户id"
            value={userid}
            onChange={(e) => {
              this.setState({
                userid: e.target.value
              })
            }}
          />
          {/* 用户查询 */}
          <Input
            size="large"
            allowClear
            style={{ width: "120px" }}
            placeholder="用户电话"
            value={tel}
            onChange={(e) => {
              this.setState({
                tel: e.target.value
              })
            }}
          />

          {/* 年龄排序 */}
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: "#58BC58" }}
            onClick={this.sort_age}
          >
            <SwapOutlined style={{ transform: "rotate(90deg)" }} /> 年龄
          </Button>
          {/* 时间排序 */}
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: "#58BC58" }}
            onClick={this.sort_regtime}
          >
            <SwapOutlined style={{ transform: "rotate(90deg)" }} /> 注册时间
          </Button>

          {/* 查询按钮 */}
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            onClick={this.conditionFind}
          >
            查询
          </Button>

          {/* 新增按钮 */}
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={this.addUser}
          >
            新增
          </Button>

          {/* 重置按钮 */}
          <Button
            type="primary"
            size="large"
            icon={<RetweetOutlined />}
            style={{ backgroundColor: "gray" }}
            onClick={this.reset}
          >
            重置
          </Button>
        </div>

        {
          customerlist.length == 0 ? <Empty style={{ marginTop: '200px' }} /> :
            <div
              style={{
                display: "inline-block",
                height: "calc( 100vh - 140px )",
                overflowY: "auto",
              }}
            >
              <Row
                style={{
                  width: "calc(100%- 160px)",
                  textAlign: "center",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                <Col key='allckd' span={2}>
                  <input type="checkbox" id="allck" checked={allck} onClick={this.changeAll} />
              全选
            </Col>

                <Col key='userid' span={2}>
                  <span>用户id</span>
                </Col>
                <Col key='username' span={2}>
                  <span>姓名</span>
                </Col>
                <Col key='nickname' span={2}>
                  <span>昵称</span>
                </Col>
                <Col key='portrait' span={2}>
                  <span>头像</span>
                </Col>
                <Col key='password' span={4}>
                  <span>密码</span>
                </Col>
                <Col key='tel' span={2}>
                  <span>电话</span>
                </Col>
                <Col key="age" span={2}>
                  <span>年龄</span>
                </Col>
                <Col key='regtime' span={2}>
                  <span>注册时间</span>
                </Col>

                <Col key="op" span={4}>
                  <span>操作</span>
                </Col>
              </Row>

              {customerlist.map((v) => (
                <Row
                  key={v.userid}
                  style={{
                    width: "calc(100vw - 200px)",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "10px"
                  }}
                >
                  {/* 勾选框 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <input type="checkbox" checked={v.singleckd} data-idx={v.userid} onClick={this.delone} />
                    {/* 这里的勾选状态是直接改变的customerReducer中的数据的singleckd属性 */}
                  </Col>

                  {/* 用户id */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <span>{v.userid}</span>
                  </Col>

                  {/* 用户名 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <span>{v.username}</span>
                  </Col>

                  {/* 用户昵称 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <span>{v.nickname}</span>
                  </Col>

                  {/* 图片 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <img src={v.portrait} alt="" style={{ width: "100%" }} />
                  </Col>

                  {/* 密码 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={4}
                  >
                    <span>{v.password}</span>
                  </Col>

                  {/* 电话 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <span>{v.tel}</span>
                  </Col>

                  {/* 年龄 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <span>{v.age}</span>岁
              </Col>

                  {/* 注册时间 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <span>{moment(v.regtime).format('YYYY/MM/DD')}</span>
                  </Col>


                  {/* 操作项 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={3}
                  >
                    <Button
                      type="primary"
                      size="small"
                      icon={<EditOutlined />}
                      style={{ marginRight: "10px" }}
                      onClick={this.editCustomerShow.bind(null, v._id)}
                    >
                      {" "}
                  修改
                </Button>

                    <Button type="danger" size="small" icon={<DeleteOutlined />} onClick={() => {
                      this.setState({
                        p_del: [{ _id: v._id }],
                        //删除时 把该条数据的_id身份证弄成数组形式存在state中 ，并且让对话框显示出来
                        modal_isShow: true
                      })
                    }}>
                      {" "}
                  删除
                </Button>
                  </Col>
                </Row>
              ))}
            </div>
        }






        {/* 修改 */}
        <>
          <Drawer
            title="修改用户注册信息"
            width={720}
            onClose={this.onClose}
            visible={this.state.visible}
            bodyStyle={{ paddingBottom: 80 }}

          >
            <Form
              layout="vertical"
              ref={(editform) => (this.editform = editform)}
              initialValues={editdatarow}
              hideRequiredMark
              onFinish={this.editSub}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    shouldUpdate={true}
                    name="userid"
                    label="用户id"
                    rules={[
                      {
                        required: true,
                        message: "用户id不能为空",
                      },
                      {
                        //value是验证的值
                        async validator(rule, value) {
                          if (value === editdatarow.userid) {
                            return Promise.resolve('没有修改');
                          }

                          if (!/^[a-zA-Z]\w{5,}$/.test(value)) {
                            return Promise.reject('用户id为数字字母下划线组合且第一位不能为数字，不少于6位');
                          }

                          var { data } = await request.get("/users/isRegist", {
                            params: {
                              userid: value,
                            },

                          });
                          console.log("Reg的data", data)
                          //error为0说明不重名
                          if (!data.error) {
                            return Promise.resolve('可以使用');
                          }

                          return Promise.reject('用户id重复');

                        }
                      }
                    ]}
                  >
                    <Input
                      placeholder="输入新的用户id"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item

                    name="username"
                    label="用户名"
                    // disabled={true}
                    //不能修改用户名 只可以修改昵称
                    rules={[
                      { required: true, message: "用户名不能为空" },
                      {
                        //value是验证的值
                        async validator(rule, value) {
                          if (value === editdatarow.username) {
                            return Promise.resolve('没有修改');
                          }
                          var { data } = await request.get("/users/isRegist", {
                            params: {
                              username: value,
                            },

                          });
                          console.log("验证用户名", data)
                          if (!data.error) {
                            return Promise.resolve('可以使用');
                          }
                          return Promise.reject('用户名重复');

                        }
                      }
                    ]}
                  >
                    <Input
                      placeholder="输入用户名"

                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    shouldUpdate={true}
                    name="nickname"
                    label="用户昵称"
                  >
                    <Input
                      placeholder="输入用户昵称"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="用户密码"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input placeholder="输入要修改的密码，系统会自动加密" />
                  </Form.Item>
                </Col>

              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    shouldUpdate={true}
                    name="tel"
                    label="用户手机号"
                    rules={[
                      {
                        required: true,
                        message: "不能手机号不能为空",
                      },
                      {
                        //value是验证的值
                        async validator(rule, value) {
                          console.log('注册用户rule=', rule)
                          console.log('注册用户value=', value)
                          if (value === editdatarow.tel) {
                            return Promise.resolve('没有修改');
                          }

                          if (!/^1[3-9]\d{9}$/.test(value)) {
                            return Promise.reject('请输入正确格式的电话号码');
                          }

                          var { data } = await request.get("/users/isRegist", {
                            params: {
                              tel: value,
                            },

                          });
                          console.log("Reg的data", data)
                          //error为0说明不重名
                          if (!data.error) {
                            return Promise.resolve('可以使用');
                          }

                          return Promise.reject('电话已存在');

                        }
                      }
                    ]}
                  >
                    <Input
                      placeholder="输入用户手机号"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="age"
                    label="年龄"
                    rules={[
                      {
                        required: true,
                        message: "不能为空且必须是数字",
                        type: "number",
                        transform: (value) => +value,
                      },
                    ]}
                  >
                    <Input placeholder="输入用户年龄" />
                  </Form.Item>
                </Col>

              </Row>


              <Row gutter={16}>
                <Col>
                  <Form.Item label="修改用户头像">
                    <Upload {...editconfig}>
                      <Button icon={<UploadOutlined />}>点击上传用户头像</Button>
                    </Upload>
                    ,
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
                      onClick={this.onClose}
                    >
                      取消
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Drawer>
        </>

        {/* 注册新的 */}
        <>
          <Drawer
            title="注册新用户"
            width={720}
            onClose={this.onClose_add}
            visible={this.state.visible_add}
            bodyStyle={{ paddingBottom: 80 }}

          >
            <Form
              layout="vertical"
              hideRequiredMark
              onFinish={this.addSub}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    shouldUpdate={true}
                    name="userid"
                    label="用户id"
                    rules={[
                      {
                        required: true,
                        message: "用户id不能为空",
                      },
                      {
                        //value是验证的值
                        async validator(rule, value) {
                          if (!/^[a-zA-Z]\w{5,}$/.test(value)) {
                            return Promise.reject('数字字母下划线组合且首位非数字，不少于6位');
                          }

                          var { data } = await request.get("/users/isRegist", {
                            params: {
                              userid: value,
                            },

                          });
                          console.log("Reg的data", data)
                          //error为0说明不重名
                          if (!data.error) {
                            return Promise.resolve('可以使用');
                          }
                          console.log('服务器重名')
                          return Promise.reject('用户id重复');

                        }
                      }
                    ]}
                  >
                    <Input
                      placeholder="输入新的用户id"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item

                    name="username"
                    label="用户名"
                    // disabled={true}
                    //不能修改用户名 只可以修改昵称
                    rules={[
                      { required: true, message: "用户名不能为空" },
                      {
                        //value是验证的值
                        async validator(rule, value) {
                          if (value === editdatarow.username) {
                            return Promise.resolve('没有修改');
                          }
                          var { data } = await request.get("/users/isRegist", {
                            params: {
                              username: value,
                            },

                          });
                          console.log("验证用户名", data)
                          if (!data.error) {
                            return Promise.resolve('可以使用');
                          }
                          return Promise.reject('用户名重复');

                        }
                      }
                    ]}
                  >
                    <Input
                      placeholder="输入用户名"

                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    shouldUpdate={true}
                    name="nickname"
                    label="用户昵称"
                  >
                    <Input
                      placeholder="输入用户昵称"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="用户密码"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input placeholder="输入要修改的密码，系统会自动加密" />
                  </Form.Item>
                </Col>

              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    shouldUpdate={true}
                    name="tel"
                    label="用户手机号"
                    rules={[
                      {
                        required: true,
                        message: "不能手机号不能为空",
                      },
                      {
                        //value是验证的值
                        async validator(rule, value) {
                          if (!/^1[3-9]\d{9}$/.test(value)) {
                            return Promise.reject('请输入正确格式的电话号码');
                          }
                          var { data } = await request.get("/users/isRegist", {
                            params: {
                              tel: value,
                            },
                          });
                          console.log("Reg的data", data)
                          //error为0说明不重名
                          if (!data.error) {
                            return Promise.resolve('可以使用');
                          }
                          console.log('服务器重名')
                          return Promise.reject('电话已存在');

                        }
                      }
                    ]}
                  >
                    <Input
                      placeholder="输入用户手机号"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="age"
                    label="年龄"
                    rules={[
                      {
                        required: true,
                        message: "不能为空且必须是数字",
                        type: "number",
                        transform: (value) => +value,
                      },
                    ]}
                  >
                    <Input placeholder="输入用户年龄" />
                  </Form.Item>
                </Col>

              </Row>


              <Row gutter={16}>
                <Col>
                  <Form.Item label="上传新用户头像">
                    <Upload {...addconfig}>
                      <Button icon={<UploadOutlined />}>点击上传用户头像</Button>
                    </Upload>
                    ,
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


        {/* 对话框 */}
        <>

          <Modal
            title="友情提示"
            visible={this.state.modal_isShow}
            onOk={this.deldata}
            okText='确认删除'
            okType='danger'
            cancelText='取消'
            onCancel={() => {
              //取消之后应该把之前存到state中的准备删除的身份证去掉
              this.setState(
                {
                  modal_isShow: false,
                  p_del: [],
                }
              )
            }}
          >
            你确认删除数据
        </Modal>
        </>



        {/* 删除选中 */}
        <Button
          type="danger"
          style={{ position: "fixed", bottom: "10px", left: "160px" }}
          size="small  "
          icon={<DeleteOutlined />}
          //删除 选中的数据 ，先把当前请求回来的所有数据过滤出勾中的，还是存在 p_del 这个state中，并且显示对话框
          //对话点同意才删除 
          onClick={() => {

            this.setState({
              p_del: customerlist.filter(v => {
                return v.singleckd
              }).map(item => {
                return { _id: item._id }
              }),
              modal_isShow: true
            })
          }}
        >
          删除选中的
        </Button>

        <Pagination
          style={{ position: "fixed", bottom: "10px", right: "200px" }}
          current={searchCondition.page}
          total={customerAmount}
          showSizeChanger
          onChange={this.changpage}
        />
      </div>
    );
  }
}






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

User = connect(mapStateToProps, mapDispatchToProps)(User)

export default User