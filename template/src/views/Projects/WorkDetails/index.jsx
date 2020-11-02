import React from 'react'
import request from '../../../utils/request';
import './style.scss'
class WorksDetails extends React.Component {
constructor(props) {
super(props)
console.log('worksdetails的props',props)
this.state = {
    sjsid:'',
    p_detail_number:'',
    sjsproject:{},
    sjsname:""
}
}

async componentWillMount() {

    var {sjsid,caseid} = this.props.match.params;
    console.log(sjsid,'传来的workdetail的sjdid',caseid)
    var p_detail_number =sjsid +'/' + caseid;

   
    var {data}  = await request.get('/sjs/find',{
    });
    var sjsname = ''
    var sjsproject = data.msg.filter(v=>{
        if(v.sjsid == sjsid){
            sjsname = v.sjsname
            return  v
        }
       
    })[0].projects.filter(item=>{
        return item.p_detail_number == p_detail_number
    })[0]  
    this.setState({
        sjsid,
        p_detail_number,
        sjsproject,
        sjsname
    })
    console.log('sjsproject',sjsproject)
    // var project = sjsprojects.details.filter(v=>{
    //     return v.p_detail_number ==p_detail_number
    // })

    // console.log('project',project);
     
}
render() {
    var {p_detail_number,sjsid,sjsproject,sjsname} = this.state;
    console.log('项目',p_detail_number,sjsid,sjsproject,sjsname)

return (
<div className='worksdt'>
{
     sjsproject.p_details ?  
     <section className='details'>
            <img className='banner' src={sjsproject.p_src} alt="" />
            <h3 className='p_title'>
                {sjsproject.p_title_alt}
            </h3>
            <p className='maininfo'>
                <span>{sjsproject.p_room}</span><span>/</span>
                <span>{sjsproject.p_area}㎡ </span><span>/</span>
                <span>{sjsproject.p_cost}万元</span>
            </p>
            <div className='intro'>
                    <h3>案例简介</h3>
                    <p><strong>设计师：</strong>  <span>{sjsname}</span></p>
                    <p><strong>面积：</strong>  <span>{sjsproject.p_area}㎡</span> </p>
                    <p><strong>设计简介：</strong>  <span>{sjsproject.p_introduce}</span> </p>
            </div>
     {
         sjsproject.p_details.map(v => {
             return <div className='worksDetails'>
                 <img src={v.src} key={v.text} className='detailsImg' />
                 <p>{v.text}</p>
             </div>
         })
     }
    </section> :   ''
}




        
</div>
)
}
}
export default WorksDetails 