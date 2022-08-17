const TOKEN_KEY = 'token';
const OPEN_ID = 'openid';

export function getToken() {
	return sessionStorage.getItem(TOKEN_KEY) || '';
}

export function setToken(data) {
	sessionStorage.setItem(TOKEN_KEY, data);
}
export function getOpenId() {
	return sessionStorage.getItem(OPEN_ID) || '';
}

export function setOpenId(data) {
	sessionStorage.setItem(OPEN_ID, data);
}

export function logout() {
	sessionStorage.removeItem(TOKEN_KEY);
	sessionStorage.removeItem(OPEN_ID);
	/*eslint-disable*/
	// window.location.href = '';
}
