import React from 'react';
import request from '../../../utils/request';
import './style.scss'
// import '../../assets/font/iconfont.css'
class Jiexi extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props.match.params.pid,'jiexi页面的')
        this.state = {
            pid:'',
            data: {}
        }
    }

    async componentWillMount() {
        console.log(this.props.history.location)


        var pid = this.props.match.params.pid
        this.setState({
            pid
        })
        var {data}  = await request.post('/jiexi/findpage',{
        findquery:{pid}
        });
        console.log('解析Listdata',data);
         this.setState({
            data:data.msg[0]
         })
    }
    render() {
        console.log('data',this.state.data.details)
        var { data } = this.state;
      
        
        return (
            <div>
                   {data.details ?     <div className='jiexi'>
                <img className='banner' src={data.details[0].src} alt="" />
                <h3 className='title'>
                    {data.title}
                </h3>
                <section className='intro'>
                    <h4>图集简介 CASE DESCRIPTION</h4>
                    <p><strong>设计师：</strong>  <span>{data.designer}</span> </p>
                    <p><strong>设计主题：</strong> <span>{data.theme}</span> </p>
                    <p><strong>项目地址：</strong> <span>{data.address}</span> </p>
                    <p><strong>设计材料：</strong> <span>{data.materials}</span> </p>
                    <p><strong>面积：</strong>  <span>{data.area}</span> </p>
                    <p><strong>设计说明：</strong>  <span>{data.intro}</span> </p>

                </section>
                <section className='details'>
                    {
                        data.details.map(v => {
                            return <div className='detailItem'>
                                <img src={v.src} key={v.pid} className='detailsImg' />
                                <p>{v.text}</p>
                            </div>
                        })
                    }
                </section>


            </div> : '' } 
              

            </div>
           
        )
    }
}
export default Jiexi