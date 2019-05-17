import * as React from 'react';
import { SearchComponent } from '../components/search/Search';
import { AppComponent } from '../components/gui/App';
import { ipcRenderer } from 'electron';
import { message } from "antd";
import queryString from 'query-string'

type Props = {
    
}

type State = {
    status: string
}

const error = () => {
    message.error('获取失败, 请稍后重试...');
};

export class App extends React.Component<Props, State> {

    constructor (props: Props) {
        super(props);
        this.state = {
            status: 'prepare'
        }
    }

    componentDidMount () {
        ipcRenderer.on('main', (event: Event, msg: string) => {

            if (msg === 'error') {
                error();
            }
            
            this.setState({
                status: msg
            })
        })
        
    }

    handleUrl = (url: string) => {
        console.log(url);
        this.setState({
            status: "crawl"
        });

        const url2 = queryString.parseUrl(url);
        // console.log(url2.url+"?me="+url2.query.me)
        ipcRenderer.send('url', url2.url+"?me="+url2.query.me)
    }

    down = () => {
        console.log("down")
        ipcRenderer.send('down', 'down')
    }

    
    render () {

        return (<AppComponent status={this.state.status} handleUrl={this.handleUrl} down={this.down} />)
        
    }
    
    
    
}