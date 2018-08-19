/**
 * name: UploadBtn.js
 * desc: 上传按钮,基于React的实现
 * date: 2018/8/19
 * author: kelvin
 */
import React from 'react';
import PropTypes from 'prop-types';
import {RayrBtn, Upload} from 'rayr';
import './UploadBtn.scss';

export default class UploadBtn extends React.Component {
    static propTypes = {
        fileType: PropTypes.string,
        url: PropTypes.string.isRequired,
        timeout: PropTypes.number,
        onStart: PropTypes.func,
        onProgress: PropTypes.func,
        onSuccess: PropTypes.func,
        onFail: PropTypes.func
    };

    static defaultProps = {
        fileType: '*',
        timeout: 3000,
        onProgress: (total, loaded) => {
            console.log(`上传进度:${loaded / total * 100}%`);
        }
    };

    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        let uploadDom = this.refs.uploadInput;
        let options = {
            url: this.props.url,
            fileType: this.props.fileType,
            timeout: this.props.timeout,
            onStart: (file) => {
                this.props.onStart(file);
            },
            onProgress: (total, loaded) => {
                this.props.onProgress(total, loaded);
            },
            onSuccess: (res) => {
                this.props.onSuccess(res, '上传成功');
            },
            onFail: (res) => {
                this.props.onFail(res, '上传失败');
            }
        };
        new Upload(uploadDom, options);
    }

    uploadClick() {
        this.refs.uploadInput.click();
    }

    render() {
        return (
            <div className="rayr-upload-button">
                <RayrBtn type="primary" onClick={this.uploadClick.bind(this)}>
                    {
                        this.props.children
                    }
                </RayrBtn>
                <div ref="uploadInput" className="upload-input"></div>
            </div>
        );
    }
}
