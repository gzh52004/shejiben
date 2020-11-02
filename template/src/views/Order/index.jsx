import React from "react";
import { Menu, Modal, Toast } from "antd-mobile";
import moment from 'moment';
import request from '@/utils/request'
//引子组件

import "./style.scss";

import sjslogo from "../../img/sjs7248840.jpg"; //暂时代替发ajax的图片

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //设计师数组
            dataList: [],
            //路由传参拿到这个要预约的sjsid,然后发请求拿到sjs图片
            //应该从this.props 
            isShow: false,
            username: '',//顾客名
            city: '北京',//顾客地址
            houseType: '房屋类型',//房屋类型
            sjsid: '',//sjsid
            sjsname: '',// 发请求拿到
            tel: '',//顾客电话
            area: '',//区域多大,注意必须是数字类型
            tips: '',//备注
            //orderid 提交时候随机生成即可
            //ordertime 提交时候获得当前时间
            initData: [
                {
                    value: "1",
                    label: "安徽",
                    children: [
                        {
                            label: "阜阳",
                            value: "1",

                        },
                        {
                            label: "芜湖",
                            value: "2",
                        },
                        {
                            label: "合肥",
                            value: "3",
                        },
                        {
                            label: "蚌埠",
                            value: "4",
                        },
                        {
                            label: "淮南",
                            value: "5",
                        },
                        {
                            label: "马鞍山",
                            value: "6",
                        },
                        {
                            label: "淮北",
                            value: "7",
                        },
                        {
                            label: "铜陵",
                            value: "8",
                        },
                        {
                            label: "安庆",
                            value: "9",
                        },
                        {
                            label: "黄山",
                            value: "10",
                        },
                        {
                            label: "滁州",
                            value: "11",
                        },
                        {
                            label: "宿州",
                            value: "12",
                        },
                        {
                            label: "巢湖",
                            value: "13",
                        },
                        {
                            label: "六安",
                            value: "14",
                        },
                        {
                            label: "亳州",
                            value: "14",
                        },
                        {
                            label: "池州",
                            value: "15",
                        },
                        {
                            label: "宣城",
                            value: "16",
                        },
                    ],
                },
                {
                    value: "2",
                    label: "北京",
                    isLeaf: true,

                },
                {
                    value: "3",
                    label: "重庆",
                    isLeaf: true,

                },
                {
                    value: "4",
                    label: "福建",
                    children: [
                        {
                            label: "福州",
                            value: "1",
                        },
                        {
                            label: "厦门",
                            value: "2",
                        },
                        {
                            label: "三明",
                            value: "3",
                        },
                        {
                            label: "莆田",
                            value: "4",
                        },
                        {
                            label: "泉州",
                            value: "5",
                        },
                        {
                            label: "漳州",
                            value: "6",
                        },
                    ]

                },
                {
                    value: "1",
                    label: "安徽",
                    children: [
                        {
                            label: "阜阳",
                            value: "1",

                        },
                        {
                            label: "芜湖",
                            value: "2",
                        },
                        {
                            label: "合肥",
                            value: "3",
                        },
                        {
                            label: "蚌埠",
                            value: "4",
                        },
                        {
                            label: "淮南",
                            value: "5",
                        },
                        {
                            label: "马鞍山",
                            value: "6",
                        },
                        {
                            label: "淮北",
                            value: "7",
                        },
                        {
                            label: "铜陵",
                            value: "8",
                        },
                        {
                            label: "安庆",
                            value: "9",
                        },
                        {
                            label: "黄山",
                            value: "10",
                        },
                        {
                            label: "滁州",
                            value: "11",
                        },
                        {
                            label: "宿州",
                            value: "12",
                        },
                        {
                            label: "巢湖",
                            value: "13",
                        },
                        {
                            label: "六安",
                            value: "14",
                        },
                        {
                            label: "亳州",
                            value: "14",
                        },
                        {
                            label: "池州",
                            value: "15",
                        },
                        {
                            label: "宣城",
                            value: "16",
                        },
                    ],
                },
                {
                    value: "2",
                    label: "北京",
                    isLeaf: true,

                },
                {
                    value: "3",
                    label: "重庆",
                    isLeaf: true,

                },
                {
                    value: "4",
                    label: "福建",
                    children: [
                        {
                            label: "福州",
                            value: "1",
                        },
                        {
                            label: "厦门",
                            value: "2",
                        },
                        {
                            label: "三明",
                            value: "3",
                        },
                        {
                            label: "莆田",
                            value: "4",
                        },
                        {
                            label: "泉州",
                            value: "5",
                        },
                        {
                            label: "漳州",
                            value: "6",
                        },
                    ]

                },
                {
                    value: "1",
                    label: "安徽",
                    children: [
                        {
                            label: "阜阳",
                            value: "1",

                        },
                        {
                            label: "芜湖",
                            value: "2",
                        },
                        {
                            label: "合肥",
                            value: "3",
                        },
                        {
                            label: "蚌埠",
                            value: "4",
                        },
                        {
                            label: "淮南",
                            value: "5",
                        },
                        {
                            label: "马鞍山",
                            value: "6",
                        },
                        {
                            label: "淮北",
                            value: "7",
                        },
                        {
                            label: "铜陵",
                            value: "8",
                        },
                        {
                            label: "安庆",
                            value: "9",
                        },
                        {
                            label: "黄山",
                            value: "10",
                        },
                        {
                            label: "滁州",
                            value: "11",
                        },
                        {
                            label: "宿州",
                            value: "12",
                        },
                        {
                            label: "巢湖",
                            value: "13",
                        },
                        {
                            label: "六安",
                            value: "14",
                        },
                        {
                            label: "亳州",
                            value: "14",
                        },
                        {
                            label: "池州",
                            value: "15",
                        },
                        {
                            label: "宣城",
                            value: "16",
                        },
                    ],
                },
                {
                    value: "2",
                    label: "北京",
                    isLeaf: true,

                },
                {
                    value: "3",
                    label: "重庆",
                    isLeaf: true,

                },
                {
                    value: "4",
                    label: "福建",
                    children: [
                        {
                            label: "福州",
                            value: "1",
                        },
                        {
                            label: "厦门",
                            value: "2",
                        },
                        {
                            label: "三明",
                            value: "3",
                        },
                        {
                            label: "莆田",
                            value: "4",
                        },
                        {
                            label: "泉州",
                            value: "5",
                        },
                        {
                            label: "漳州",
                            value: "6",
                        },
                    ]

                },
                {
                    value: "1",
                    label: "安徽",
                    children: [
                        {
                            label: "阜阳",
                            value: "1",

                        },
                        {
                            label: "芜湖",
                            value: "2",
                        },
                        {
                            label: "合肥",
                            value: "3",
                        },
                        {
                            label: "蚌埠",
                            value: "4",
                        },
                        {
                            label: "淮南",
                            value: "5",
                        },
                        {
                            label: "马鞍山",
                            value: "6",
                        },
                        {
                            label: "淮北",
                            value: "7",
                        },
                        {
                            label: "铜陵",
                            value: "8",
                        },
                        {
                            label: "安庆",
                            value: "9",
                        },
                        {
                            label: "黄山",
                            value: "10",
                        },
                        {
                            label: "滁州",
                            value: "11",
                        },
                        {
                            label: "宿州",
                            value: "12",
                        },
                        {
                            label: "巢湖",
                            value: "13",
                        },
                        {
                            label: "六安",
                            value: "14",
                        },
                        {
                            label: "亳州",
                            value: "14",
                        },
                        {
                            label: "池州",
                            value: "15",
                        },
                        {
                            label: "宣城",
                            value: "16",
                        },
                    ],
                },
                {
                    value: "2",
                    label: "北京",
                    isLeaf: true,

                },
                {
                    value: "3",
                    label: "重庆",
                    isLeaf: true,

                },
                {
                    value: "4",
                    label: "福建",
                    children: [
                        {
                            label: "福州",
                            value: "1",
                        },
                        {
                            label: "厦门",
                            value: "2",
                        },
                        {
                            label: "三明",
                            value: "3",
                        },
                        {
                            label: "莆田",
                            value: "4",
                        },
                        {
                            label: "泉州",
                            value: "5",
                        },
                        {
                            label: "漳州",
                            value: "6",
                        },
                    ]

                },
                {
                    value: "4",
                    label: "福建",
                    children: [
                        {
                            label: "福州",
                            value: "1",
                        },
                        {
                            label: "厦门",
                            value: "2",
                        },
                        {
                            label: "三明",
                            value: "3",
                        },
                        {
                            label: "莆田",
                            value: "4",
                        },
                        {
                            label: "泉州",
                            value: "5",
                        },
                        {
                            label: "漳州",
                            value: "6",
                        },
                    ]

                },
                {
                    value: "1",
                    label: "安徽",
                    children: [
                        {
                            label: "阜阳",
                            value: "1",

                        },
                        {
                            label: "芜湖",
                            value: "2",
                        },
                        {
                            label: "合肥",
                            value: "3",
                        },
                        {
                            label: "蚌埠",
                            value: "4",
                        },
                        {
                            label: "淮南",
                            value: "5",
                        },
                        {
                            label: "马鞍山",
                            value: "6",
                        },
                        {
                            label: "淮北",
                            value: "7",
                        },
                        {
                            label: "铜陵",
                            value: "8",
                        },
                        {
                            label: "安庆",
                            value: "9",
                        },
                        {
                            label: "黄山",
                            value: "10",
                        },
                        {
                            label: "滁州",
                            value: "11",
                        },
                        {
                            label: "宿州",
                            value: "12",
                        },
                        {
                            label: "巢湖",
                            value: "13",
                        },
                        {
                            label: "六安",
                            value: "14",
                        },
                        {
                            label: "亳州",
                            value: "14",
                        },
                        {
                            label: "池州",
                            value: "15",
                        },
                        {
                            label: "宣城",
                            value: "16",
                        },
                    ],
                },
                {
                    value: "2",
                    label: "北京",
                    isLeaf: true,

                },
                {
                    value: "3",
                    label: "重庆",
                    isLeaf: true,

                },
                {
                    value: "4",
                    label: "福建",
                    children: [
                        {
                            label: "福州",
                            value: "1",
                        },
                        {
                            label: "厦门",
                            value: "2",
                        },
                        {
                            label: "三明",
                            value: "3",
                        },
                        {
                            label: "莆田",
                            value: "4",
                        },
                        {
                            label: "泉州",
                            value: "5",
                        },
                        {
                            label: "漳州",
                            value: "6",
                        },
                    ]

                },
            ],
        };
    }
    UNSAFE_componentWillMount() {
        let arr = []
        arr.push(JSON.parse(localStorage.getItem('casedata')));
        this.setState({
            dataList: arr,
        })
    }
    onChange = (value) => {
        let label = "";
        this.state.initData.forEach((dataItem) => {
            if (dataItem.value === value[0]) {
                label = dataItem.label;
                if (dataItem.children && value[1]) {
                    dataItem.children.forEach((cItem) => {
                        if (cItem.value === value[1]) {
                            label += ` ${cItem.label}`;
                        }
                    });
                }
            }
        });
        this.setState({
            isShow: false,
            city: label
        })

    };

    changeHouseType = (e) => {
        // console.log(e, e.target.value)
        this.setState({
            houseType: e.target.value
        })
        console.log(this.state.houseType)
    }

    mid = () => {
        var arr4 = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
        var arr5 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        var str = arr4[parseInt(Math.random() * arr4.length)];
        for (var i = 0; i < 5; i++) {
            str += arr5[parseInt(Math.random() * arr5.length)];
        }
        console.log(str);
        return str;
    }


    //提交订单 获取state中所有数据
    onFinish = async () => {
        var { dataList, username, tel, area, tips, city, houseType, sjsid, sjsname } = this.state;
        var {sjsid,sjsname} = dataList[0];
        //验证 用户名 和 tel ,area 这三个即可，其他不可能为空
        if (!username) {
            return Toast.fail('联系人不能为空')
        }
        if (!tel || !/^1[3-9]\d{9}$/.test(tel)) {
            return Toast.fail('请输入正确的联系电话')
        }
        if (isNaN(area)) {
            return Toast.fail('房屋面积只能输入数字')
        }
        if (houseType === '房屋类型') {
            return Toast.fail('请至少选一个房屋类型')
        }
        var ordertime = moment(new Date()).format('YYYY/MM/DD');
        var orderid = this.mid()
        console.log(username, tel, area, tips, city, houseType, sjsid, sjsname, ordertime, orderid)
        var { data } = await request.post('/order/addOrder', {
            username, tel, area: +area, tips, city, houseType, sjsid, sjsname, ordertime, orderid
        })
        console.log('order发送之后data=', data);
        if (!data.error) {
            Toast.success('成功')
            //然后在跳转 记得加一个定时器
            localStorage.setItem("myorder", JSON.stringify({username, tel, area: +area, tips, city, houseType, sjsid, sjsname, ordertime, orderid}))
            setTimeout(() => {
                this.props.history.push('/mine/myorder')
            },1000)
        } else {
            Toast.fail('添加订单失败')
        }

    }
    render() {
        var { dataList,username, tel, area, tips } = this.state;
        return (
            <div className="orderpage">
                {
                    dataList.map(item => 
                        <div key={item.sjsid}>
                            <section className="sjslogo" >
                            <img src={item.portrait} className="logo" alt="imgsrc" />
                            <h3>
                                {/* 这个也是请求回来的那条数据中拿到的 */}
                                {item.sjsname}
                            </h3>
                            <h4>留下您的信息，让TA联系您</h4>
                            </section>
                        </div>
                        
                    )
                }
                

                <section className="order_form">

                    <div>
                        <div className='formItem'>
                            <input type="text" placeholder='您的称呼' value={username} onChange={
                                (e) => {
                                    this.setState({ username: e.target.value })
                                }
                            } />
                        </div>
                        <div className='formItem'>
                            <input type="text" maxLength={11} placeholder='手机号码' value={tel} onChange={
                                (e) => {
                                    this.setState({ tel: e.target.value })
                                }
                            } />
                        </div>

                        <div className='formItem city' onClick={() => {
                            this.setState({
                                isShow: true
                            })
                        }}>
                            <span>
                                {this.state.city}
                            </span>
                        </div>
                        <div className='formItem'>
                            <select value={this.state.houseType} onChange={this.changeHouseType}>
                                <option value="房屋类型">房屋类型</option>
                                <option value="住宅空间">住宅空间</option>
                                <option value="餐饮空间">餐饮空间</option>
                                <option value="办公空间">办公空间</option>
                                <option value="酒店空间">酒店空间</option>
                                <option value="商业展示">商业展示</option>
                                <option value="娱乐空间">娱乐空间</option>
                                <option value="休闲场所">休闲场所</option>
                                <option value="文化空间">文化空间</option>
                                <option value="医疗机构">医疗机构</option>
                                <option value="售楼中心">售楼中心</option>
                                <option value="金融机构">金融机构</option>
                                <option value="运动场所">运动场所</option>
                                <option value="教育机构">教育机构</option>
                                <option value="其他">其他</option>
                            </select>

                        </div>
                        <div className='formItem'>
                            <input type="text" placeholder='房屋面积单位（/㎡）' value={area} onChange={
                                (e) => {
                                    this.setState({ area: e.target.value })
                                }
                            } />
                        </div>

                        <div className='formItem'>
                            <textarea placeholder='备注信息（选填）' value={tips} onChange={
                                (e) => {
                                    this.setState({ tips: e.target.value })
                                }
                            } ></textarea>
                        </div>

                        <div className='formItem submit' onClick={this.onFinish}>
                            <span>提交</span>
                        </div>
                        <div className='formItem tipsP'>
                            <span className='tips'>温馨提示:</span><br />
                            <p>为了您的利益及我们的口碑，您的隐私将被严格保密，请放心填写</p>
                            <p>为了保障您的资金安全，设计本免费提供在线交易资金托管服务</p>
                        </div>



                    </div>




                </section>
                <Modal
                    // closable={true}
                    transparent={true}
                    maskClosable={true}
                    visible={this.state.isShow}
                    onClose={() => {
                        this.setState({
                            isShow: false,
                        });
                    }}
                >
                    <Menu
                        className="foo-menu"
                        data={this.state.initData}
                        value={["1", "3"]}
                        onChange={this.onChange}
                        height={document.documentElement.clientHeight}
                        width={document.documentElement.clientWidth * 0.7}
                    />
                </Modal>
            </div>
        );
    }
}
export default Order;
