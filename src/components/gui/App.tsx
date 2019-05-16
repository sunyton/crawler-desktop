import * as React from 'react';
import { Search } from '../../containers/Search';

const styles = require('./app.css')

type Props = {
    
}


export const AppComponent: React.FC<Props> = props => {


    return (
        // Search
        <div className={styles.app}>
            <Search />
        {/* Steps */}
        {/* Tables */}
        </div>
    )
    
}