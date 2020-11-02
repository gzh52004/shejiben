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
  Modal, Empty
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

import qs from 'qs';
class Sjs extends React.Component {
  constructor(props) {
    super(props);
    console.log("这是进入到Sjs组件的props", props);
    //设计师数据初始化
    props.dispatch({
      type: "init_sjsdata_async",
    });


    this.state = {
      visible: false, //修改设计师的一个模态框
      visible_add: false, //这是新增设计师时的另一个模态框
      editdatarow: {}, //修改sjs拿到的一条数据
      imgsrc: "", //这是修改信息时返回的图片地址保存变量
      imgsrc_add: "", //这是增加sjs时候返回的图片的地址保存变量
      modal_isShow: false,
      p_del: [],//准备删掉的数据数组
      //排序  升降序
      price_sort: 1,
      yuyue_sort: 1,
      order_sort: 1,
      //按需搜索

      sjsname: '',
      city: '',
      sjsid: '',
      exp: '',
      goodat: '',




    };
  }

  // 1  修改sjs时，模态框隐藏显示,同时用sjsid把该条数据拿到，放入表单中setFieldsValue方法，
  // 修改模态框默认初始值 editform是通过ref定义的改变Form组件的initialValues值
  //    同时把sjs头像地址拿到先存着，预防修改时不修改图片
  //     
  editSjsShow = (sjsid) => {
    this.setState({
      visible: true,
    });
    var editdatarow = this.props.sjsReducer.sjslist.filter((v) => {
      return v.sjsid == sjsid;
    })[0];
    this.setState({
      editdatarow,
    });
    this.setState({
      imgsrc: editdatarow.portrait,
    });
    this.editform.setFieldsValue(editdatarow); //修改模态框默认初始值 editform是通过ref定义的改变Form组件的initialValues值
  };


  // 2 新增sjs 表单不需要 默认值
  addSjs = () => {
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
    values.heighp_m2 = +values.heighp_m2;
    values.lowprice_m2 = +values.lowprice_m2;
    values.order = +values.order;
    values.yuyue = +values.yuyue;


    values.portrait = this.state.imgsrc;  //  ！！！存入图片地址
    console.log('newValues=', values)
    var _id = this.state.editdatarow._id;//
    var { data } = await request.put(`/sjs/update/${_id}`, values);
    if (!data.error) {
      info('success', '修改数据成功')
    } else {
      info('error', '修改数据失败')
    }
    this.onClose();
    // 修改之后我们应该重新发一次请求，并且searchCondition和之前的一样
    this.props.dispatch({
      type: "init_customerdata_async",
      page: this.props.sjsReducer.searchCondition.page,
      pagesize: this.props.sjsReducer.searchCondition.pagesize
    });
    this.setState({
      editdatarow: {}
    })

  };

  //5 新增之后表单提交触发，注意数值类型发生改变，要变回去数值类型
  addSub = async (values) => {
    console.log("values", values);
    values.heighp_m2 = +values.heighp_m2;
    values.lowprice_m2 = +values.lowprice_m2;
    values.order = +values.order;
    values.yuyue = +values.yuyue;
    values.portrait = this.state.imgsrc_add;//存入图片地址
    var { data } = await request.post(`/sjs/insert`, values);
    if (!data.error) {
      info('success', '新增数据成功')
    } else {
      info('error', '新增数据失败')
    }
    this.onClose_add();
    this.props.dispatch({
      type: "init_sjsdata_async",
      page: this.props.sjsReducer.searchCondition.page,
      pagesize: this.props.sjsReducer.searchCondition.pagesize
    });
  };


  //删除数据 分为两种，一种打勾的，还有一种直接删
  // 6  打勾的打勾只是改变reducer中存的数据的singleckd属性，真正删还得点删除选中的按钮，直接删是拿到数据id直接请求服务器了
  delone = (e) => {
    //这里点击也是改变sjsReducer中的数据
    // console.log('打勾的bool', e.target.checked, e.target.dataset.idx)
    var idobj = { sjsid: e.target.dataset.idx, singleckd: e.target.checked }
    this.props.dispatch({
      type: "changeckd", idobj
    });
    console.log(this.props.sjsReducer)

  }


  // 7 删除  点击右边删除按钮时，  拿到数据的身份证做成数组存到 this.state.p_del,显示对话框，然后直接发请求
  //         点击删除选中按钮时，  也是拿到数据的身份证做成数组存到 this.state.p_del,显示对话框，然后直接发请求
  deldata = async e => {

    let { data } = await request.delete(
      "/sjs/delmany", {
      params: this.state.p_del,
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
      type: "init_sjsdata_async",
      page: this.props.sjsReducer.searchCondition.page,
      pagesize: this.props.sjsReducer.searchCondition.pagesize


    });
    this.setState({
      modal_isShow: false,
    });
  };

  // 8 改变所有当前数据的勾选状态
  changeAll = (e) => {
    console.log(e.target.checked)
    this.props.dispatch({
      type: "changeAll_ckd",
      allckd: e.target.checked
    });
  }



  // 9 分页 直接改变了sjsReducer中的searchCondition状态 
  changpage = (page, pagesize) => {
    console.log('分页器', page, pagesize)
    var searchCondition = this.props.sjsReducer.searchCondition;

    searchCondition.page = page
    searchCondition.pagesize = pagesize
    console.log('searchCondition分页之后', searchCondition)
    this.props.dispatch({
      type: "changepage",
      searchCondition
    });
    this.props.dispatch({
      type: "init_sjsdata_async",
      page: page,
      pagesize: pagesize
    });
  }

  //10 rest重置
  reset = () => {
    this.props.dispatch({
      type: "init_sjsdata_async",
      page: 1,
      pagesize: 10,
      findquery: {},
      sortquery: {},
    });
    this.props.dispatch({
      type: 'changepage',
      searchCondition: {
        page: 1,
        pagesize: 10,
        findquery: {},
        sortquery: {},
      }
    })
  }

  //11   3种排序  拿到排序key 此值每点击一次都会*-1 改变，然后重新触发saga数据初始化，和重置sjsReducer中的排序条件
  sort_price = () => {
    var sortkey = this.state.price_sort
    this.props.dispatch({
      type: "init_sjsdata_async",
      sortquery: { lowprice_m2: sortkey * -1 },
      page: 1,
      pagesize: 10,
    });
    this.setState({
      price_sort: sortkey * -1
    })
    this.props.dispatch({
      type: 'changepage',
      searchCondition: {
        sortquery: { lowprice_m2: sortkey * -1 },
        page: 1,
        pagesize: 10,
      }
    })
  }
  sort_order = () => {
    var sortkey = this.state.order_sort
    this.props.dispatch({
      type: "init_sjsdata_async",
      sortquery: { order: sortkey * -1 },
      page: 1,
      pagesize: 10,
    });
    this.setState({
      order_sort: sortkey * -1
    })
    this.props.dispatch({
      type: 'changepage',
      searchCondition: {
        sortquery: { order: sortkey * -1 },
        page: 1,
        pagesize: 10,
      }
    })
  }
  sort_yuyue = () => {
    var sortkey = this.state.yuyue_sort
    this.props.dispatch({
      type: "init_sjsdata_async",
      sortquery: { yuyue: sortkey * -1 },
      page: 1,
      pagesize: 10,
    });
    this.setState({
      yuyue_sort: sortkey * -1
    })
    this.props.dispatch({
      type: 'changepage',
      searchCondition: {
        sortquery: { yuyue: sortkey * -1 },
        page: 1,
        pagesize: 10,
      }
    })
  }

  //12条件查询  应该是点击时候获取 这5个框的值this.state.findquery 弄一个对象然后初始化数据
  conditionFind = () => {
    var {
      sjsname,
      city,
      sjsid,
      exp,
      goodat
    } = this.state;
    var fc = {
      sjsname,
      city,
      sjsid,
      exp,
      goodat,
    }
    var findquery = {}
    for (var p in fc) {
      if (fc[p] === '') {
        continue
      }
      findquery[p] = fc[p]
    }
    console.log('findquery=', findquery)
    this.props.dispatch({
      type: "init_sjsdata_async",
      findquery: findquery,
      sortquery: {},
    });
    // this.props.dispatch({
    //   type: 'changepage',
    //   searchCondition: {
    //     page: 1,
    //     pagesize: 10,
    //   }
    // })


  }






  render() {
    console.log("这是渲染到Sjs的render的props", this.props);
    var { searchCondition, sjslist, sjsamount } = this.props.sjsReducer
    var { editdatarow, sjsname,
      city,
      sjsid,
      exp,
      goodat } = this.state; //该值作为修改sjs数据的模态框表单的初始值
    var allck = sjslist.every(v => {
      return v.singleckd
    })

    var _this = this;
    const editconfig = {
      //这个editconfig就是上传图片的配置对象,成功上传后应该把回来的图片地址保存到state中的imgsrc
      name: "addsjs",
      action: "http://localhost:3002/sjs/addsjs",
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

    //新增sjs的上传图片配置对象
    const addconfig = {
      name: "addsjs",
      action: "http://localhost:3002/sjs/addsjs",
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
          <Input
            size="large"
            allowClear
            style={{ width: "130px" }}
            placeholder="姓名或机构"
            value={sjsname}
            onChange={(e) => {
              this.setState({
                sjsname: e.target.value
              })
            }}
          />
          <Input
            size="large"
            allowClear
            style={{ width: "120px" }}
            placeholder="城市"
            value={city}
            onChange={(e) => {
              this.setState({
                city: e.target.value
              })
            }}
          />
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
          <Input
            size="large"
            allowClear
            style={{ width: "120px" }}
            placeholder="行业经验"
            value={exp}
            onChange={(e) => {
              this.setState({
                exp: e.target.value
              })
            }}
          />
          <Input
            size="large"
            allowClear
            style={{ width: "120px" }}
            placeholder="擅长领域"
            value={goodat}
            onChange={(e) => {
              this.setState({
                goodat: e.target.value
              })
            }}
          />
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: "#58BC58" }}
            onClick={this.sort_price}
          >
            <SwapOutlined style={{ transform: "rotate(90deg)" }} /> 价格
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: "#58BC58" }}
            onClick={this.sort_yuyue}
          >
            <SwapOutlined style={{ transform: "rotate(90deg)" }} /> 预约
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: "#58BC58" }}
            onClick={this.sort_order}
          >
            <SwapOutlined style={{ transform: "rotate(90deg)" }} /> 成交
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            onClick={this.conditionFind}
          >
            查询
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={this.addSjs}
          >
            新增
          </Button>
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
          sjslist.length == 0 ? <Empty style={{ marginTop: '200px' }} /> :
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
                <Col key='name' span={2}>
                  <span>姓名</span>
                </Col>
                <Col key='sjsid' span={2}>
                  <span>设计师id</span>
                </Col>
                <Col key='portrait' span={2}>
                  <span>头像</span>
                </Col>
                <Col key='goodat' span={4}>
                  <span>擅长领域</span>
                </Col>
                <Col key='exp' span={2}>
                  <span>经验</span>
                </Col>
                <Col key='pay' span={2}>
                  <span>佣金</span>
                  <span>/㎡</span>{" "}
                </Col>
                <Col key="yuyue" span={2}>
                  <span>预约</span>
                </Col>
                <Col key="order" span={1}>
                  <span>成交</span>
                </Col>
                <Col key="area" span={2}>
                  <span>地区</span>
                </Col>
                <Col key="op" span={3}>
                  <span>操作</span>
                </Col>



              </Row>

              {sjslist.map((v) => (
                <Row
                  key={v.sjsid}
                  style={{
                    width: "calc(100vw - 200px)",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "10px"
                  }}
                >
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <input type="checkbox" checked={v.singleckd} data-idx={v.sjsid} onClick={this.delone} />
                    {/* 这里的勾选状态是直接改变的sjsReducer中的数据的singleckd属性 */}
                  </Col>
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <span>{v.sjsname}</span>
                  </Col>
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <span>{v.sjsid}</span>
                  </Col>
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
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={4}
                  >
                    <span>{v.goodat}</span>
                  </Col>
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <span>{v.exp}</span>
                  </Col>
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    ￥<span>{v.lowprice_m2}</span>~<span>{v.heighp_m2}</span>{" "}
                  </Col>
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={2}
                  >
                    <span>{v.yuyue}</span>人
              </Col>
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    span={1}
                  >
                    <span>{v.order}</span>人
              </Col>
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
                      onClick={this.editSjsShow.bind(null, v.sjsid)}
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

        <>
          <Drawer
            title="修改设计师"
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
                <Col span={8}>
                  <Form.Item
                    // shouldUpdate={true}
                    name="sjsname"
                    label="设计师名"
                    rules={[
                      { required: true, message: "设计师用户名不能为空" },
                    ]}
                  >
                    <Input
                      placeholder="输入设计师名"

                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    shouldUpdate={true}
                    name="sjsid"
                    label="设计师id"

                  >
                    <Input
                      placeholder="输入设计师id"
                      disabled={true}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    name="city"
                    label="居住地"
                    rules={[{ required: true, message: "设计师不能为空" }]}
                  >
                    <Input placeholder="输入设计师居住地" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="exp"
                    label="行业经验"
                    rules={[{ required: true, message: "设计师经验不能为空" }]}
                  >
                    <Input placeholder="输入设计师行业经验年限" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="lowprice_m2"
                    label="佣金最低￥/㎡"
                    rules={[
                      {
                        required: true,
                        message: "不能为空且必须是数字",
                        type: "number",
                        transform: (value) => +value,
                      },
                    ]}
                  >
                    <Input placeholder="输入设计师佣金" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="heighp_m2"
                    label="佣金最高￥/㎡"
                    rules={[
                      {
                        required: true,
                        message: "不能为空且必须是数字",
                        type: "number",
                        transform: (value) => +value,
                      },
                    ]}
                  >
                    <Input placeholder="输入设计师佣金" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="yuyue"
                    label="预约量"
                    rules={[
                      {
                        required: true,
                        message: "不能为空且必须是数字",
                        type: "number",
                        transform: (value) => +value,
                      },
                    ]}
                  >
                    <Input placeholder="输入预约量" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="order"
                    label="成交量"
                    rules={[
                      {
                        required: true,
                        message: "不能为空且必须是数字",
                        type: "number",
                        transform: (value) => +value,
                      },
                    ]}
                  >
                    <Input placeholder="输入成交量" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col>
                  <Form.Item label="修改设计师头像">
                    <Upload {...editconfig}>
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                    ,
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="goodat"
                    label="设计师擅长领域"
                    rules={[
                      {
                        required: true,
                        message: "设计师擅长领域不能为空",
                      },
                    ]}
                  >
                    <Input.TextArea rows={4} placeholder="输入设计师擅长模块" />
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

        <>
          <Drawer
            title="新增设计师数据"
            width={720}
            key='new'
            onClose={this.onClose_add}
            visible={this.state.visible_add}
            bodyStyle={{ paddingBottom: 80 }}
          >
            <Form
              key='new'
              layout="vertical"
              hideRequiredMark
              onFinish={this.addSub}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    shouldUpdate={true}
                    name="sjsname"
                    label="设计师名"
                    rules={[
                      { required: true, message: "设计师用户名不能为空" },
                    ]}
                  >
                    <Input
                      placeholder="输入设计师名"

                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    shouldUpdate={true}
                    name="sjsid"
                    label="设计师id"
                    rules={[
                      { required: true, message: "设计师id不能为空" },
                      {
                        //value是验证的值
                        async validator(rule, value) {
                          console.log('注册用户value=', value)
                          if (!value) {
                            return
                          }
                          var { data } = await request.get("/sjs/find", {
                            params: {
                              sjsid: value,
                            },

                          });
                          //这个error为1时候说明没找到没找到就是不重名
                          if (data.error) {

                            return Promise.resolve();
                          } else if (!data.error) {
                            console.log('服务器重名')
                            return Promise.reject('设计师id不能重复');
                          }

                        }
                      }
                    ]}
                  >
                    <Input
                      placeholder="输入设计师id"

                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    name="city"
                    label="居住地"
                    rules={[{ required: true, message: "设计师不能为空" }]}
                  >
                    <Input placeholder="输入设计师居住地" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="exp"
                    label="行业经验"
                    rules={[{ required: true, message: "设计师经验不能为空" }]}
                  >
                    <Input placeholder="输入设计师行业经验年限" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="lowprice_m2"
                    label="佣金最低￥/㎡"
                    rules={[
                      {
                        required: true,
                        message: "不能为空且必须是数字",
                        type: "number",
                        transform: (value) => +value,
                      },
                    ]}
                  >
                    <Input placeholder="输入设计师佣金" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="heighp_m2"
                    label="佣金最高￥/㎡"
                    rules={[
                      {
                        required: true,
                        message: "不能为空且必须是数字",
                        type: "number",
                        transform: (value) => +value,
                      },
                    ]}
                  >
                    <Input placeholder="输入设计师佣金" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="yuyue"
                    label="预约量"
                    rules={[
                      {
                        required: true,
                        message: "不能为空且必须是数字",
                        type: "number",
                        transform: (value) => +value,
                      },
                    ]}
                  >
                    <Input placeholder="输入预约量" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="order"
                    label="成交量"
                    rules={[
                      {
                        required: true,
                        message: "不能为空且必须是数字",
                        type: "number",
                        transform: (value) => +value,
                      },
                    ]}
                  >
                    <Input placeholder="输入成交量" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col>
                  <Form.Item label="修改设计师头像">
                    <Upload {...addconfig}>
                      <Button icon={<UploadOutlined />}>上传图片</Button>
                    </Upload>
                    ,
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="goodat"
                    label="设计师擅长领域"
                    rules={[
                      {
                        required: true,
                        message: "设计师擅长领域不能为空",
                      },
                    ]}
                  >
                    <Input.TextArea rows={4} placeholder="输入设计师擅长模块" />
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




        <Button
          type="danger"
          style={{ position: "fixed", bottom: "10px", left: "160px" }}
          size="small  "
          icon={<DeleteOutlined />}
          //删除 选中的数据 ，先把当前请求回来的所有数据过滤出勾中的，还是存在 p_del 这个state中，并且显示对话框
          //对话点同意才删除 
          onClick={() => {

            this.setState({
              p_del: sjslist.filter(v => {
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
          total={sjsamount}
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
  return state;
};
var mapDispatchToProps = function (dispatch) {
  // console.log('mapDispatchToProps=',mapDispatchToProps)
  return {
    dispatch,
  };
};

Sjs = connect(mapStateToProps, mapDispatchToProps)(Sjs);

export default Sjs;
