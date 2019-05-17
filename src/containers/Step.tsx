import * as React from 'react';
import { StepsComponent } from '../components/steps/Steps';

type Props = {
    status: string;
    down: ()=>void;
}

class Step extends React.Component<Props> {





    render () {
        return (
            <StepsComponent status={this.props.status} down={this.props.down} />
        )
    }
    
    
}

export default Step;