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
  Modal, Empty
} from "antd";
import {
  SearchOutlined,
  RetweetOutlined,
  SwapOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import info from "@/utils/info";

import request from "@/utils/request";
import "./style.scss";
import { connect } from "react-redux";
import moment from 'moment'
import qs from 'qs';
class Order extends React.Component {

  constructor(props) {
    super(props)
    console.log('Order的props', props)
    props.dispatch({
      type: "init_orderdata_async",
    });

    //修改的
    this.state = {
      visible: false, //修改用户的一个模态框
      visible_add: false, //这是新增用户时的另一个模态框
      editdatarow: {}, //修改用户拿到的一条数据
      modal_isShow: false,
      p_del: [],//准备删掉的数据数组
      findsjsname: '',


      //排序  升降序
      area_sort: 1,
      ordertime_sort: 1,
      //按需搜索
      orderid: '',
      username: '',
      sjsname: '',
      sjsid: '',
      tel: '',

    };
  }

  // 1  修改用户时，模态框隐藏显示,同时用userid把该条数据拿到，放入表单中setFieldsValue方法，
  // 修改模态框默认初始值 editform是通过ref定义的改变Form组件的initialValues值
  //    同时把user头像地址拿到先存着，预防修改时不修改图片
  //     
  editorderShow = (_id) => {
    this.setState({
      visible: true,
    });
    var editdatarow = this.props.orderReducer.orderlist.filter((v) => {
      return v._id == _id;
    })[0];
    console.log('修改用户默认值=', editdatarow)
    this.setState({
      editdatarow,
      findsjsname: editdatarow.sjsname
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

    var _id = this.state.editdatarow._id;//
    values.area = +values.area;
    values.sjsname = this.state.findsjsname;//把之前存的设计师名重新放入
    console.log('order.Values=', values)
    var { data } = await request.put(`/order/update/${_id}`, values);
    console.log('修改之后返回的data')
    if (!data.error) {
      info('success', '修改数据成功')
    } else {
      info('error', '修改数据失败')
    }
    this.onClose();
    // 修改之后我们应该初始化一次，并且searchCondition和之前的一样
    this.props.dispatch({
      type: "init_orderdata_async",
      page: this.props.orderReducer.searchCondition.page,
      pagesize: this.props.orderReducer.searchCondition.pagesize
    });
    //修改之后把之前的数据置空
    this.setState({
      editdatarow: {},
      findsjsname: ''
    })

  };

  //5 新增之后表单提交触发，注意数值类型发生改变，要变回去数值类型
  makeroderid = () => {
    var arr4 = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
    var arr5 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    var str = arr4[parseInt(Math.random() * arr4.length)];
    for (var i = 0; i < 5; i++) {
      str += arr5[parseInt(Math.random() * arr5.length)];
    }
    console.log(str);
    return str;
  }



  addSub = async (values) => {
    var ordertime = moment(new Date()).format('YYYY/MM/DD');
    values.ordertime = ordertime; //提交时 的时间为新的ordertime时间
    values.area = +values.area;
    values.orderid = this.makeroderid()//订单号
    values.sjsname = this.state.findsjsname
    console.log("values", values);
    var { data } = await request.post(`/order/addOrder`, values);
    if (!data.error) {
      info('success', '新增数据成功')
    } else {
      info('error', '新增数据失败')
    }
    this.onClose_add();
    this.props.dispatch({
      type: "init_orderdata_async",
      page: this.props.orderReducer.searchCondition.page,
      pagesize: this.props.orderReducer.searchCondition.pagesize
    });
  };


  //删除数据 分为两种，一种打勾的，还有一种直接删
  // 6  打勾的打勾只是改变reducer中存的数据的singleckd属性，真正删还得点删除选中的按钮，直接删是拿到数据id直接请求服务器了
  delone = (e) => {
    //这里点击是改变orderReducer中的数据singleckd
    // console.log('打勾的bool', e.target.checked, e.target.dataset.idx)
    //注意 这里的idx是数据的_id
    var idobj = { orderid: e.target.dataset.idx, singleckd: e.target.checked }
    this.props.dispatch({
      type: "order_changeckd", idobj
    });
    console.log(this.props.orderReducer)

  }


  // 7 删除  点击右边删除按钮时，  拿到数据的身份证做成数组存到 this.state.p_del,显示对话框，然后直接发请求
  //         点击删除选中按钮时，  也是拿到数据的身份证做成数组存到 this.state.p_del,显示对话框，然后直接发请求
  deldata = async e => {

    let { data } = await request.delete(
      "/order/delmany", {
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
      type: "init_orderdata_async",
      page: this.props.orderReducer.searchCondition.page,
      pagesize: this.props.orderReducer.searchCondition.pagesize


    });
    this.setState({
      modal_isShow: false,
    });
  };

  // 8 改变所有当前数据的勾选状态
  changeAll = (e) => {
    console.log(e.target.checked)
    this.props.dispatch({
      type: "order_Allckd",
      allckd: e.target.checked
    });
  }



  // 9 分页 直接改变了orderReducer中的searchCondition状态 改变请求的页数和条数，改变之后还要初始化数据一次
  changpage = (page, pagesize) => {
    console.log('分页器', page, pagesize)
    var searchCondition = this.props.orderReducer.searchCondition;

    searchCondition.page = page
    searchCondition.pagesize = pagesize
    console.log('searchCondition分页之后', searchCondition)
    this.props.dispatch({
      type: "order_changepage",
      searchCondition
    });
    this.props.dispatch({
      type: "init_orderdata_async",
      page: page,
      pagesize: pagesize
    });
  }


  //10 rest重置
  reset = () => {
    this.props.dispatch({
      type: "init_orderdata_async",
      page: 1,
      pagesize: 10,
      findquery: {},
      sortquery: {},
    });
    this.props.dispatch({
      type: 'order_changepage',
      searchCondition: {
        page: 1,
        pagesize: 10,
        findquery: {},
        sortquery: {},
      }
    })
  }

  //11   3种排序  拿到排序key 此值每点击一次都会*-1 改变，然后重新触发saga数据初始化，和重置orderReducer中的排序条件
  sort_area = () => {
    var sortkey = this.state.area_sort
    this.props.dispatch({
      type: "init_orderdata_async",
      sortquery: { area: sortkey * -1 },
      page: 1,
      pagesize: 10,
    });
    this.setState({
      area_sort: sortkey * -1
    })
    this.props.dispatch({
      type: 'order_changepage',
      searchCondition: {
        sortquery: { area: sortkey * -1 },
        page: 1,
        pagesize: 10,
      }
    })
  }
  sort_ordertime = () => {
    var sortkey = this.state.ordertime_sort
    this.props.dispatch({
      type: "init_orderdata_async",
      sortquery: { ordertime: sortkey * -1 },
      page: 1,
      pagesize: 10,
    });
    this.setState({
      ordertime_sort: sortkey * -1
    })
    this.props.dispatch({
      type: 'order_changepage',
      searchCondition: {
        sortquery: { ordertime: sortkey * -1 },
        page: 1,
        pagesize: 10,
      }
    })
  }



  //12条件查询  应该是点击时候获取 这5个框的值this.state.findquery 弄一个对象然后初始化数据
  conditionFind = () => {
    var { username, sjsid, sjsname, tel, orderid } = this.state;
    var fc = { username, sjsid, sjsname, tel, orderid }
    var findquery = {}
    for (var p in fc) {
      if (fc[p] === '') {
        continue
      }
      findquery[p] = fc[p]
    }
    console.log('用户的查询条件findquery=', findquery)
    this.props.dispatch({
      type: "init_orderdata_async",
      findquery: findquery,
      sortquery: {},
    });

  }






  render() {
    console.log("这是渲染到custmoer的render的props", this.props);
    var { searchCondition, orderlist, orderAmount } = this.props.orderReducer
    var { editdatarow, username, tel, sjsid, orderid, sjsname } = this.state; //editdatarow该值作为修改custmoer数据的模态框表单的初始值
    var allck = orderlist.every(v => {
      return v.singleckd
    })

    var _this = this



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

          {/* 订单id查询 */}
          <Input
            size="large"
            allowClear
            style={{ width: "130px" }}
            placeholder="订单id"
            value={orderid}
            onChange={(e) => {
              this.setState({
                orderid: e.target.value
              })
            }}
          />

          {/* 用户名查询 */}
          <Input
            size="large"
            allowClear
            style={{ width: "120px" }}
            placeholder="用户名"
            value={username}
            onChange={(e) => {
              this.setState({
                username: e.target.value
              })
            }}
          />

          {/* 设计师名 */}
          <Input
            size="large"
            allowClear
            style={{ width: "120px" }}
            placeholder="设计师名"
            value={sjsname}
            onChange={(e) => {
              this.setState({
                sjsname: e.target.value
              })
            }}
          />

          {/* 设计师id */}
          <Input
            size="large"
            allowClear
            style={{ width: "120px" }}
            placeholder="设计师id"
            value={sjsid}
            onChange={(e) => {
              this.setState({
                sjsid: e.target.value
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
            onClick={this.sort_area}
          >
            <SwapOutlined style={{ transform: "rotate(90deg)" }} /> 面积大小
          </Button>
          {/* 时间排序 */}
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: "#58BC58" }}
            onClick={this.sort_ordertime}
          >
            <SwapOutlined style={{ transform: "rotate(90deg)" }} /> 订单时间
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
          orderlist.length == 0 ? <Empty style={{ marginTop: '200px' }} /> :
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
                  marginBottom: '14px'
                }}
              >
                <Col key='allckd' span={2}>
                  <input type="checkbox" id="allck" checked={allck} onClick={this.changeAll} />
              全选
            </Col>

                <Col key='userid' span={2}>
                  <span>订单id</span>
                </Col>
                <Col key='username' span={2}>
                  <span>用户</span>
                </Col>
                <Col key='sjs' span={2}>
                  <span>预约设计师</span>
                </Col>
                <Col key='tel' span={3}>
                  <span>用户电话</span>
                </Col>
                <Col key='city' span={2}>
                  <span>用户住址</span>
                </Col>
                <Col key='houseType' span={2}>
                  <span>房屋类型</span>
                </Col>
                <Col key='area' span={2}>
                  <span>面积（㎡）</span>
                </Col>
                <Col key="tips" span={2}>
                  <span>备注</span>
                </Col>
                <Col key='ordertime' span={2}>
                  <span>预约时间</span>
                </Col>

                <Col key="op" span={3}>
                  <span>操作</span>
                </Col>
              </Row>

              {orderlist.map((v) => (
                <Row
                  key={v.orderid}
                  style={{
                    width: "calc(100vw - 200px)",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "20px"
                  }}
                >
                  {/* 勾选框  2  */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <input type="checkbox" checked={v.singleckd} data-idx={v.orderid} onClick={this.delone} />
                    {/* 这里的勾选状态是直接改变的orderReducer中的数据的singleckd属性 */}
                  </Col>

                  {/*订单id  2 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <span>{v.orderid}</span>
                  </Col>

                  {/* 用户名  2 */}
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


                  {/* 预约的设计师id 姓名 2 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: 'column'
                    }}
                    span={2}
                  >


                    <span title={v.sjsid}>{v.sjsname}</span>
                  </Col>

                  {/* 用户电话密码  2*/}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={3}
                  >
                    <span>{v.tel}</span>
                  </Col>

                  {/* city住址  2 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <span>{v.city}</span>
                  </Col>

                  {/* 房屋类型 2 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: 'column'
                    }}
                    span={2}
                  >
                    <span>{v.houseType} </span>

                  </Col>
                  {/* 房屋面积 2 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: 'column'
                    }}
                    span={2}
                  >
                    <span>{v.area} </span>

                  </Col>

                  {/* 备注  2 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <span title={v.tips} className='text-ellipsis'>{v.tips}</span>
                  </Col>
                  {/* 预约时间 2 */}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <span>{v.ordertime}</span>
                  </Col>

                  {/* 操作项 4*/}
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
                      onClick={this.editorderShow.bind(null, v._id)}
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
            title="修改订单信息"
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
                    name="username"
                    label="用户名"
                    rules={[
                      {
                        required: true,
                        message: "用户名不能为空",
                      },

                    ]}
                  >
                    <Input
                      placeholder="输入用户姓名"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item

                    name="orderid"
                    label="订单id"
                    rules={[
                      { required: true, message: "订单不能为空" },

                    ]}
                  >
                    <Input
                      placeholder="订单id"
                      disabled={true}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="sjsid"
                    label="设计师id"
                    rules={[
                      {
                        required: true,

                      },
                      {
                        //value是验证的值
                        async validator(rule, value) {
                          //注意去往设计师集合查有没有该，存在的才可以
                          var { data } = await request.post("/sjs/findpage", {
                            findquery: { sjsid: value }
                          });
                          console.log('正值验证之后得到返回值', data.msg)

                          //根据输入的sjsid把sjs名保存在findsjsname中
                          if (!data.error) {
                            _this.setState({
                              findsjsname: data.msg[0].sjsname,
                            })
                            message.success('设计师' + data.msg[0].sjsname)
                            return Promise.resolve('存在该设计师');

                          } else {
                            return Promise.reject('不存在该设计师');
                          }
                        }
                      }
                    ]}
                  >
                    <Input placeholder="输入想要邀约的设计师id" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item

                    label="设计师或机构，输入设计师id即可自动保存"

                  >
                    <h3 style={{ fontWeight: 600, color: "#58bc58" }}>{this.state.findsjsname}</h3>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>

                <Col span={12}>
                  <Form.Item
                    name="houseType"
                    label="房屋类型"
                    rules={[
                      {
                        required: true,
                        message: '房屋类型不能为空'
                      },
                    ]}
                  >
                    <Input placeholder="输入房屋类型" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="area"
                    label="房屋类型(单位：/㎡)"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input placeholder="输入房屋面积" />
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
                          if (data.error) {
                            return Promise.resolve('存在该用户手机号可以预约');
                          } else {
                            return Promise.reject('手机号在用户集合中没找到');
                          }
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
                    name="city"
                    label="用户住址"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input placeholder="输入用户住址" />
                  </Form.Item>
                </Col>

              </Row>


              <Row gutter={16}>

                <Col span={24}>
                  <Form.Item
                    shouldUpdate={true}
                    name="tips"
                    label="备注"
                    rules={[
                      {
                        required: true,
                        message: "输入备注",
                      },]}
                  >
                    <Input.TextArea rows={4}
                      placeholder="输入备注"
                    />
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
            title="新增订单信息"
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
                <Col span={8}>
                  <Form.Item
                    shouldUpdate={true}
                    name="username"
                    label="用户名"
                    rules={[
                      {
                        required: true,
                        message: "用户名不能为空",
                      },

                    ]}
                  >
                    <Input
                      placeholder="输入用户姓名"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="sjsid"
                    label="设计师id,输入正确id即可记录"
                    rules={[
                      {
                        required: true,

                      },
                      {
                        //value是验证的值
                        async validator(rule, value) {
                          //注意去往设计师集合查有没有该，存在的才可以
                          var { data } = await request.post("/sjs/findpage", {
                            findquery: { sjsid: value }
                          });
                          console.log('正值验证之后得到返回值', data.msg)

                          //根据输入的sjsid把sjs名保存在findsjsname中
                          if (!data.error) {
                            _this.setState({
                              findsjsname: data.msg[0].sjsname,
                            })
                            message.success('设计师' + data.msg[0].sjsname)
                            return Promise.resolve('存在该设计师');

                          } else {
                            return Promise.reject('不存在该设计师');
                          }
                        }
                      }
                    ]}
                  >
                    <Input placeholder="输入想要邀约的设计师id" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="设计师或者机构"
                  >
                    <h3 style={{ fontWeight: 600, color: "#58bc58" }}>{this.state.findsjsname}</h3>
                  </Form.Item>
                </Col>
              </Row>



              <Row gutter={16}>

                <Col span={12}>
                  <Form.Item
                    name="houseType"
                    label="房屋类型"
                    rules={[
                      {
                        required: true,
                        message: '房屋类型不能为空'
                      },
                    ]}
                  >
                    <Input placeholder="输入房屋类型" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="area"
                    label="房屋类型(单位：/㎡)"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input placeholder="输入房屋面积" />
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
                          if (data.error) {
                            return Promise.resolve('存在该用户手机号可以预约');
                          } else {
                            return Promise.reject('手机号在用户集合中没找到');
                          }
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
                    name="city"
                    label="用户住址"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input placeholder="输入用户住址" />
                  </Form.Item>
                </Col>

              </Row>


              <Row gutter={16}>

                <Col span={24}>
                  <Form.Item
                    shouldUpdate={true}
                    name="tips"
                    label="备注"
                  >
                    <Input.TextArea rows={4}
                      placeholder="输入备注"
                    />
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
              p_del: orderlist.filter(v => {
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
          total={orderAmount}
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
Order = connect(mapStateToProps, mapDispatchToProps)(Order)
export default Order