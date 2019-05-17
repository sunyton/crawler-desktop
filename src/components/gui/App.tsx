import * as React from 'react';
import { Search } from '../../containers/Search';
import Step from '../../containers/Step';

const styles = require('./app.css')

type Props = {
    status: string;
    handleUrl: (url: string) => void;
    down: () => void;
}

export const AppComponent: React.FC<Props> = props => {


    

    return (
        // Search
        <div className={styles.app}>
            <Search handleUrl={props.handleUrl} status={props.status} />
            <Step status={props.status} down={props.down}/>
        {/* Steps */}
        {/* Tables */}
        </div>
    )
    
}