/**
 * 授权相关接口
 */
import axios from '@/utils/axios.js';

/**
 * 获取token
 * @param data
 */
export function authTokenApi(data) {
	return axios.get('/auth/getToken', {
		params: { ...data }
	}).then(res => res.data);
}
