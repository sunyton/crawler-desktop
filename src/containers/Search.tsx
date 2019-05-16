import * as React from 'react';
import { SearchComponent } from '../components/search/Search';
import { ipcRenderer } from 'electron';
import bindAll from 'lodash.bindall';

type Props = {
}

export class Search extends React.Component<Props> {

    constructor (props: Props) {
        super(props)
        ipcRenderer.on('infos', (event:Event, msg:string) => {
            console.log(msg)
        }) 
        ipcRenderer.on('success-page', (event:Event, msg: number) => {
            console.log(msg)
        })
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