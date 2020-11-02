import React from 'react'
import request from '../../../utils/request';
import './style.scss'
import { withRouter } from "react-router-dom";
class JiexiList extends React.Component {

    constructor(props) {
        super(props)
            this.state = {
                jiexilist:[]
            }
        }
        async componentDidMount(){
           var {data}  = await request.post('/jiexi/findpage',{});
           console.log('解析Listdata',data);
            this.setState({
                jiexilist:data.msg
            })
        }

        render() {
            var {jiexilist} = this.state;
            var list = jiexilist.map(item=>{
                var pid = item.pid
                item.details[0].pid = pid
                return item.details[0]
            })


            console.log('list=',list)
            return (
                <div className='jiexilist'>
                    {
                       list.map(v=>{
                        return <div className='listItem' key={v.pid} onClick={() => this.props.history.push(
                            `/projects/jiexi/${v.pid}`
                        )}>
                            <img src={v.src} alt=""/>
                        </div>
                       }) 
                    }
                    
                </div>
            )
    }
}
JiexiList = withRouter(JiexiList);
export default JiexiList