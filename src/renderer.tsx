import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './containers/app';

const styles = require('../public/index.css')
console.log(styles)
const appTarget = document.getElementById('renderer');
if (appTarget) {
    appTarget.className = styles.renderer;
}

ReactDOM.render(
<App />, document.getElementById('renderer'))