import React from 'react'
import { withRouter } from "react-router-dom";
import { SearchBar, Button, WhiteSpace, WingBlank } from 'antd-mobile';
import request from '../../utils/request';

import './style.scss';

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    state = {
        value: '美食',
    };
    componentDidMount() {
        // this.autoFocusInst.focus();
    }
    // 点击搜索按钮
    onSearch = async (value)=> {
        console.log(value);
        const {data} = await request.get('/sjs/find', {
            params:{
                sjsname: value,
            }
        })
        // 判定搜索成功与否
        if(!data.error){
            const {sjsid:id} = data.msg[0];
            localStorage.setItem("casedata", JSON.stringify(data.msg[0]));
            this.props.history.push({
                pathname: '/caselist/' + id,
                search: '?id=' + id,
                state: data.msg
            })
        }
    }
    render() {
        return (
            <div>
                <SearchBar placeholder="输入设计师名称" cancelText="搜索" onCancel={this.onSearch}/>
            </div>
        )
    }
}

Search  = withRouter(Search );
export default Search 