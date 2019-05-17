import { Steps, Icon, Button } from "antd";
import * as React from "react";

const styles = require('./Steps.css')

type Props = {
    status: string;
    down: () => void;
}

const Step = Steps.Step;



export const StepsComponent: React.FC<Props> = props => {
    return (
          <Steps className={styles.step}>
            <Step status={props.status ==="crawl"?"process":"wait"} icon={props.status === "crawl" ? <Icon type="loading" /> : <Icon type="search"/>} title="抓取" />
            <Step status={props.status ==="file"?"process":"wait"} icon={props.status==="file" ? <Icon type="loading" /> : <Icon type="file-zip"/>}  title="合并" />
            <Step status={props.status ==="down"?"process":"wait"} title="导出" icon={<Button type="primary" shape="circle" icon="download" onClick={props.down} />} />
        </Steps>  
        
    )
}