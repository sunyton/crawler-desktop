import * as React from 'react';
import { SearchComponent } from '../components/search/Search';
import { ipcRenderer } from 'electron';
import bindAll from 'lodash.bindall';

type Props = {
}

export class Search extends React.Component<Props> {

    constructor (props: Props) {
        super(props)
        bindAll(this, 'handleUrl')
    }

    handleUrl = (url: string) => {
        console.log(url)
        ipcRenderer.send('url', url)
    }
    
    render () {
        return (
            <SearchComponent url="" handleUrl={this.handleUrl} />
        )
    }
}