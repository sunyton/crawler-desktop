import * as React from 'react';
import { SearchComponent } from '../components/search/Search';
import { AppComponent } from '../components/gui/App';


type Props = {
    
}

export const App: React.FC<Props> = props => {


    return (
        // <SearchComponent url="www.baidu.com" />
        <AppComponent />
    )
    
}