
import Axios from 'axios';
import Qs from 'qs';
import { Toast } from 'vant';

const isLocal = window.location.hostname === 'localhost';


// const baseURL = isLocal
// 	? 'https://sude.superboss.cc' // 测试环境域名
// 	: window.location.origin; // 生产环境域名

const baseURL = window.location.origin;

const axios = Axios.create({
	baseURL,
	timeout: 20000
});


// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// 前置拦截器
axios.interceptors.request.use(
	(config) => {
		if (
			config.headers?.['Content-Type']?.indexOf('application/x-www-form-urlencoded') > -1
		) {
			config.method === 'post' && config.data.length && (config.data = Qs.stringify(config.data));
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// 后置拦截器
axios.interceptors.response.use(
	(response) => {
		let { success, result, errorMessage = '' } = response.data;
		if (success && result === 2000) {
			Toast({
				message: errorMessage || '登录失效，请重新登录',
			});
		}
		return response.data;
	},
	(error) => {
		if (error.response && error.response.data) {
			const code = error.response?.status;
			const msg = error.response?.data?.message;
			Toast.fail(`Code: ${code}, Message: ${msg}`);
		} else {
			Toast.fail(`${error}`);
		}
		return Promise.reject(error);
	}
);

export default axios;
