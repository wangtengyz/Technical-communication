let Fontmin = require('fontmin');
let CommonChinese = require('./CommonChinese');

let srcPath = 'src/assets/font/oldfont/*.ttf'; // 字体源文件路径
let destPath = 'src/assets/font/newfont'; // 字体输出路径
let text = CommonChinese; // 有哪些文字可能需要用到这个字体的,都可以在这里进行配置

// 初始化
let fontmin = new Fontmin()
	.src(srcPath) // 输入配置
	.use(Fontmin.glyph({ // 字型提取插件
		text: text // 所需文字
	}))
	// .use(Fontmin.ttf2eot()) // eot 转换插件
	// .use(Fontmin.ttf2woff()) // woff 转换插件     
	// .use(Fontmin.ttf2svg()) // svg 转换插件
	// .use(Fontmin.css()) // css 生成插件
	.dest(destPath); // 输出配置

// 执行
fontmin.run(function(err, files, stream) {
	if (err) { // 异常捕捉
		console.error(err);
	}
	console.log('done'); // 成功
});