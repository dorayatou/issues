import axios from 'axios';
const config = {
    url: '/user',
    method: 'get',
    baseUrl: 'https://some-domain.com/api/',
    // 允许向服务器发送前，修改请求数据
    // 只能用在 'PUT' 'POST' 'PATCH'方法
    // 后面数组中的函数必须返回一个字符串/ArrayBuffer/Stream
    transformRequest: [funciton(){}],
    // 传递给then/catch前，阴虚修改响应数据
    transformResponse: [],
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    // 将于请求一起发送的URL参数，必须是一个无格式对象(plain object)或者URLSearchParams对象
    params: {
    },
    // 负责params序列化的函数
    paramsSerializer: function(params) {},
    // 作为请求主体被发送的数据
    // 只能用在 'PUT' 'POST' 'PATCH'方法
    data: {
    },
    timeout: 1000,
    // 跨域请求时是否需要使用凭证
    withCredentials: false,
    adapter: function(config) {},
    auth: {},
    responseType: 'json',
    xsrfCookieName: 'X-XSRF-TOKEN',
    onUploadProgress: function(progressEvent) {},
    onDownloadProgress: function(progressEvent) {},
    // 定义允许的响应内容的最大尺寸
    maxContentLength: 2000,
    // 定义对于给定的HTTP响应状态码是resolve或者reject promise
    // 如果返回true/null/undefined，promise将被resolve
    // 否则promise将被rejected
    validateStatus: function(status) {
        return status >= 200 && status < 300; // 默认的
    },
    // 重定向最大数目 for node
    maxRedirects: 5, // 默认的
    httpAgent: new http.Agent({keepAlive: true}),
    httpsAgent: new http.Agent({keepAlive: true}),
    // 代理服务器
    proxy: {
        host: '127.0.0.1',
        port: 9000,
        auth: {

        }
    },
    cancelToken: new CancelToken(function(cancel) {})
};