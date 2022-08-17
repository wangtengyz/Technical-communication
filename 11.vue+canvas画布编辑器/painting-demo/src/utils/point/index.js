
import PointMaps from './pointMaps.js';
import store from '@/stores/index';

const POINT_EVENT_SIGN = 'POINT_EVENT_SIGN';

export default {
	install: (app, options) => {
		// 序列化方法
		const serialization = (keyMap) => {
			const result = [];
			Object.keys(keyMap).forEach((key) => {
				if (Object.prototype.hasOwnProperty.call(keyMap, key)) {
					result.push(`${key}=${keyMap[key]}`);
				}
			});
			return result.join('&');
		};

		/**
     * 打点方法
     * @param pointPath {String} 点坐标路径
     */
		const handPoint = async(pointPath) => {
			const pointValue = PointMaps[pointPath];
			const { userInfo = {} } = store.state.userStore;
			if (!pointValue) return;
			const img = new Image();
			const keyMap = {
				app_type: 'url_tj',
				log_type: 'click',
				taobaoNick: userInfo.taobaoNick || 'no-id',
				taobaoId: userInfo.taobaoId || 'no-id',
				point: pointValue,
				rad: Math.random(),
			};
			img.src = `//ftj.superboss.cc/tj.jpg?${serialization(keyMap)}`;
		};

		app.config.globalProperties.$point = key => {
			handPoint(key);
		};

		app.directive('point', {
			mounted(el, binding, vnode, oldVnode) {
				el[POINT_EVENT_SIGN] = () => {
					handPoint(binding.value);
				};
				el.addEventListener('click', el[POINT_EVENT_SIGN]);
			}
		});
	}
};
