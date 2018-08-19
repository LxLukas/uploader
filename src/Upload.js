/**
 * name: Upload.js
 * desc: 上传功能组件，底层封装
 * date: 2018/8/16
 * author: kelvin
 */

/*
@Upload
@element:dom元素
@opts:参数对象，包括：url,timeout,header,onSucess,onFail,onProgress,onStart,key,fileType
 */
let Upload = function (element, opts) {
    this.element = element;
    this.option = opts;
    this.init();
};

function setAttr(dom, attName, attValue) {
    dom.setAttribute(attName, attValue);
};

Upload.prototype.upload = function (e) {
    // 获取文件file
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    // 设置formData
    let formData = new FormData();
    for (let k in files) {
        formData.append('file', files[k], window.encodeURI(files[k].name));
    }
    // 设置XHR
    let xhr = new XMLHttpRequest();
    xhr.open('POST', this.option.url, true);
    // 设置头部
    if (this.option.header && Object.keys(this.option.header).length > 0) {
        for (let key in this.option.header) {
            xhr.setRequestHeader(key, this.option.header[key]);
        }
    }
    // 设置超时
    xhr.timeout = this.option.timeout;

    // 开始发起请求
    xhr.addEventListener('loadstart', (e) => {
        this.option.onStart(files);
    });
    // 上传过程事件，用于表示进度
    xhr.upload.addEventListener('progress', (e) => {
        this.option.onProgress(e.total, e.loaded);
    });
    // 请求成功，返回请求结果
    xhr.addEventListener('load', (e) => {
        if (xhr.status === 200) {
            this.option.onSuccess(JSON.parse(xhr.response));
        } else {
            this.option.onFail();
        }
    }, false);
    // 请求超时
    xhr.addEventListener('timeout', (e) => {
        this.option.onFail({code: 1001, msg: '上传超时'});
    });
    // 请求出错
    xhr.addEventListener('error', (e) => {
        this.option.onFail({code: 1002, msg: '网络出错'});
    }, false);

    xhr.send(formData);
    setAttr(e.target, 'type', 'text');
};

Upload.prototype.init = function () {
    let dom = document.createElement('input');
    dom.className = 'upload-input';
    dom.addEventListener('change', this.upload.bind(this), false);
    setAttr(dom, 'accept', this.option.fileType);
    this.element.addEventListener('click', () => {
        setAttr(dom, 'type', 'file');
        dom.click();
    }, false);
    this.element.appendChild(dom);
};

export default Upload;
