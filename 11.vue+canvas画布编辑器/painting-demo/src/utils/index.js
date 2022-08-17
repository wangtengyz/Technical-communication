const now = +(new Date());
let index = 0;

export const getUid = (comp) => {
	return `ray-${now}-${++index}`;
};

export const createSession = (key, opts = {}) => {
	let session = key || getUid();

	if (session !== key) {
		let { path, query } = URL.parse();

		let config = URL.merge({
			path,
			query: {
				...query,
				session
			}
		});
		window.history.replaceState(null, null, config);
	}

	return session;
};

/**
 * 是否为安卓环境
 */
export const isAndroid = () => {
	let u = navigator.userAgent;
	return u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
};

/**
 * 获取分辨率比例
 */
export const getPixelRatio = () => {
	return window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio || 1;
};

/**
 * 图片转 base64 (这里默认按照分辨率转)
 */
export const getBase64Image = (src, containerH) => {
	return new Promise(reslove => {
		let originImage = new Image();
		originImage.crossOrigin = 'Anonymous'; // ios适配,在属性赋值之前设置
		originImage.src = src;
		originImage.onload = () => {
			const natualWidth = originImage.width; // 图片原本宽度
			const natualHeight = originImage.height; // 图片原本高度
			const maxHeight = containerH - 40; // 屏幕展示图片的高度
			const maxWidth = window.innerWidth; // 屏幕展示图片的宽度
			const maxRatio = window.innerWidth / maxHeight; // 屏幕展示最大 宽高比
			const targetRatio = natualWidth / natualHeight; // 图片原生的 宽高比
			let originW = ''; // 图片在屏幕应该显示的宽度
			let originH = ''; // 图片在屏幕应该显示的高度

			if (maxRatio > targetRatio) {
				originH = maxHeight;
				originW = maxHeight * targetRatio;
			} else {
				originW = maxWidth;
				originH = maxWidth / targetRatio;
			}

			let canvas = document.createElement('canvas');
			let cxt = canvas.getContext("2d");
			let ratio = getPixelRatio(cxt);
			canvas.setAttribute("width", originW * ratio);
			canvas.setAttribute('height', originH * ratio);
			canvas.style.width = originW + "px";
			canvas.style.height = originH + "px";
			cxt.scale(ratio, ratio);
			cxt.drawImage(originImage, 0, 0, originW, originH);
			const image = canvas.toDataURL("image/png");
			reslove(image);
		};
	});
};


/**
 *
 * @param {object} obj
 * 对序列化后的svg内容筛选出可编辑的文本，包括价格，引用类型数据的地址不变，保持与源数据的关联性
 */
export function transformTxt(obj) {
	// 对数据进行递归，处理价格标签，删除tspan,
	const arr = [];
	const loop = (obj) => {
		if (obj.children) {
			obj.children.forEach(ele => {
				if (ele.name === 'text' && ele.type === 'element') {
					ele.children.forEach(child => {
						if (!(child.children || []).length) {
							ele.attributes['price-name'] ? arr.push({
								...child,
								id: ele.attributes?.id,
								label: '价格:'
							}) : arr.push({
								...child,
								id: ele.attributes?.id,
							});
						} else {
							child.children.forEach(c => {
								arr.push(c);
							});
						}
					});

				} else {
					loop(ele);
				}
			});
		}
	};
	loop(obj);
	return arr;
}


/**
 * 回填svg内容
 */
export function setSVGContent(svgObj, targetObj) {
	const loopFind = (obj, id, value) => {
		if (obj.attributes?.id === id) {
			obj.children[0].value = value;
		} else if (obj.children?.length) {
			obj.children.forEach(el => {
				loopFind(el, id, value);
			});
		}
	};
	svgObj.forEach(svgItem => {
		loopFind(targetObj, svgItem.id, svgItem.value);
	});

	return targetObj;
}

/**
 * 判断是否是本地图片
 * @param { string } src 图片链接
 * @returns
 */
export function isLocalImage(src) {
	let imageArr = ['jpg', 'jpeg', 'png'];
	let fileArr = src.indexOf('.') > 0 ? src.split('.') : [];
	let fileType = fileArr.length ? fileArr[fileArr.length - 1 ] : null;
	return !(src.startsWith('http') && imageArr.includes(fileType));
}
