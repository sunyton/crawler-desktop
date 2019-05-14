import * as React from 'react';
import { SearchComponent } from '../components/Search';


type Props = {
    
}

export const App: React.FC<Props> = props => {


    return (
        <SearchComponent url="www.baidu.com" />
    )
    
}