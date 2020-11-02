import React,{Suspense, lazy} from 'react';
import request from '@/utils/request';
import { Route, withRouter } from "react-router-dom";

import Search from '../../components/Search'
import Footer from '../../components/Footer'

// import Work from './Work';
// import Worketail from './WorkDetails';
// import Jiexi from './Jiexi';
// import JiexiList from './JiexiList';
//引入子组件
const Work = lazy(() => import('./Work'));
const Worketail = lazy(() => import('./WorkDetails'));
const Jiexi = lazy(() => import('./Jiexi'));
const JiexiList = lazy(() => import('./JiexiList'));

import './style.scss'
import '../../assets/font/iconfont.css'

import jiexishow1 from '../../assets/img/jiexishow1.jpg'
import jiexishow2 from '../../assets/img/jiexishow2.jpg'
import jiexilogo from '../../assets/img/jiexilogo.jpg'
import './style.scss'
import '../../assets/font/iconfont.css'

class Projects extends React.Component {
    constructor(props) {
        super(props)
        console.log('Project的props=',props)
        this.state = {
            data: [],
        }
    }

    async componentDidMount() {
        var { data } = await request.post('/sjs/findpage');
        console.log('data', data)
        // 拿到数据 amount代表数据长度， error代表请求状态 0是成功，其他是失败
        this.setState({ data: data.msg })
    }
    render() {
        var { data } = this.state;
        return (
            <div className="project">
                <Search></Search>
                {
                    this.props.history.location.pathname.includes('jiexi') ||
                     this.props.history.location.pathname.indexOf('worksdetails') != -1 ||
                     this.props.history.location.pathname==='/projects/work'
                     
                    ? '' 
                    : 
                    <div>
                        <div className="jx-list">
                        <div className="anli"  onClick={() => this.props.history.push('/projects/jiexilist')}   ><i className="iconfont icon-chakanjiexi"></i><span>案例解析</span></div>
                        <div className="homejx"  onClick={() => this.props.history.push({
                            pathname: '/projects/work',
                            state: {
                                lock: true,
                            }
                        })}
                        ><i className="iconfont icon-chakanjiexi"></i><span>家装解析</span></div>
                        <div className="workjx"  onClick={() => this.props.history.push({
                            pathname: '/projects/work',
                            state: {
                                lock: false,
                            }
                        })}
                        ><i className="iconfont icon-chakanjiexi"></i><span>工装解析</span></div>
                    </div>
                    <section className='jx-item'>
                        <div className='item-img'>
                            <h3>案例解析</h3>
                            <img className='img-bottom' src={jiexishow1} alt="" onClick={() => this.props.history.push('/projects/jiexi/jiexi1747202')} />
                            <img src={jiexishow2} alt="" onClick={() => this.props.history.push('/projects/jiexi/jiexi1747745')} />
                        </div>
                        <div className='seemore'>
                        <span onClick={() => this.props.history.push('/projects/jiexilist')}> 查看更多案例解析</span>
                        </div>
                    </section>

                    <section className='jx-home'>
                    
                        <h3>家装案例</h3>
                        <aside>
                            <img className='banner' src='http://47.113.124.47:60005/img/20200813011231-98979905.jpeg!660x374.jpg' alt="" 
                           onClick={() => this.props.history.push('/projects/worksdetails/6574789/case-4007789-1')} />

                            <h5>
                                <img className='sjslogo' src='http://47.113.124.47:60005/img/sjs6574789.jpg' alt="" />
                                梦落地时--北京设计
                                </h5>
                            <p>同小区合邻而居，年轻人与父母</p>
                        </aside>

                        <aside>
                            <img className='banner' src='http://47.113.124.47:60005/img/20200813010415-71b95520.jpeg!660x374.jpg' alt="" 
                             onClick={() => this.props.history.push('/projects/worksdetails/6574789/case-4007788-1')} />

                               <h5>
                                <img className='sjslogo' src='http://47.113.124.47:60005/img/sjs6574789.jpg' alt="" />
                                素时光--北京设计
                                </h5>
                            <p>极简风格是对生活的一种向往的心情</p>
                        </aside>
                        <div className='seemore'>
                            <span onClick={() => this.props.history.push({
                                pathname: '/projects/work',
                                state: {
                                    lock: true,
                                }
                            })}> 查看更多案例解析</span>
                        </div>
                    </section>

                    <section className='jx-work'>
                    <h3>工装案例</h3>
                    <aside>
                        <img className='banner' src='http://47.113.124.47:60005/img/20201019194420-08ef31ac.jpeg!660x374.jpg' alt=""
                        onClick={() => this.props.history.push('/projects/worksdetails/10042783/case-4012090-1')}  />

                        <h5>
                            <img className='sjslogo'  alt=""  src='http://47.113.124.47:60005/img/sjs10042783.jpg'
                             />
                            青之轩出品|女仆桌游社
                            </h5>
                        <p> 美，是形式与意义的融合</p>
                    </aside>

                    <aside>
                   
                        <img className='banner' src='http://47.113.124.47:60005/img/20190328140938-ecf57e0c.jpeg!660x374.jpg' alt="" 
                         onClick={() => this.props.history.push('/projects/worksdetails/10042783/case-3821146-1')}  />

                        <h5>
                            <img className='sjslogo' src='http://47.113.124.47:60005/img/sjs10042783.jpg' alt="" />
                            青之轩出品|南京维特熊艺术教育培训中心
                            </h5>
                        <p> 生活无处不风景</p>
                    </aside>
                    <div className='seemore'>
                        <span onClick={() => this.props.history.push({
                            pathname: '/projects/work',
                            state: {
                                lock: false,
                            }
                        })}>查看更多案例解析</span>
                    </div>
                </section>
                
                <Footer></Footer>
                    </div>
                    
                }
                <Suspense fallback={<div>loading...</div>}>
                <Route path="/projects/work" component={Work}></Route>
                <Route path="/projects/jiexi/:pid" component={Jiexi}></Route>
                <Route path="/projects/jiexilist" component={JiexiList}></Route>
                <Route path="/projects/worksdetails/:sjsid/:caseid" component={Worketail}></Route>
                </Suspense>
            </div>
        )
    }
}
Projects = withRouter(Projects);
export default Projects 