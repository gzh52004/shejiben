import React from 'react';
import { render } from 'react-dom'
import { HashRouter, BrowserRouter } from 'react-router-dom';

import store from '@/store';//引入公共仓库 我们的操作方法从这里获得
import { Provider } from "react-redux"; //引入react-redux 这个是用来把Providerjsx的编译成ReactNode
import App from './App';

console.log('store', store)

//根据环境不同切换不同的路由模式 ，基于nodeJs的项目  process.env.NODE_ENV 这个值保存   会根据不同环境得到两个值 development or production
const Router = process.env.NODE_ENV === 'development' ? HashRouter : BrowserRouter
render(
    <Provider store={store}>
        <Router>
            <App style={{ hieght: '100%' }} />
            {/* <Route component={App}/> */}
            {/*如果路由出口不写path，则代表任何路径都能得到history 
        ，没办法通过Route去渲染就可以利用高阶组件withRouter()*/}
        </Router>
    </Provider>

    ,
    document.getElementById('app')
)