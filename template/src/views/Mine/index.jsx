import React from 'react';
import {withAuth} from  '@/utils/hoc.js';
class Mine extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
    return (
        <div>
            <h1>
            Mine
            </h1>

        </div>
        )
    }
}
Mine = withAuth(Mine)
export default Mine 