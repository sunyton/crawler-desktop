import * as React from 'react';
import { Input, Button } from "antd";
const styles = require('./Search.css');

type Props = {
    url: string,
    handleUrl: (url: string) => void
}

const Search = Input.Search;
export const SearchComponent: React.FC<Props> = props => {
    return (
        <div className={styles.search}>
            <Search placeholder="put url here for crawler" onSearch={props.handleUrl}  enterButton/>
            
        </div>
    )
}