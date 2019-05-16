import { Steps } from "antd";
import * as React from "react";


type Props = {
    prepare: "wait" | "process" | "finish" | "error" | undefined;
    crawl: "wait" | "process" | "finish" | "error" | undefined;
    finished: "wait" | "process" | "finish" | "error" | undefined;
}

const Step = Steps.Step;

export const StepsComponent: React.FC<Props> = props => {
    return (
        <Steps>
            <Step status={props.prepare} title="抓取" />
            <Step status={props.crawl} title="合并" />
            <Step status={props.finished} title="导出" />
        </Steps>
    )
}