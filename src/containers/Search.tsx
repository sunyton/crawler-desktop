import * as React from 'react';
import { SearchComponent } from '../components/search/Search';
import { ipcRenderer } from 'electron';

type Props = {
    handleUrl: (url: string) => void;
    status: string;
}

export class Search extends React.Component<Props> {

    constructor (props: Props) {
        super(props)

    }

    
    render () {
        return (
            <SearchComponent handleUrl={this.props.handleUrl} status={this.props.status} />
        )
    }
}