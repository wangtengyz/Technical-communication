import { createApp } from 'vue';
import App from './App.vue';
import { Loading, Dialog, Form, Icon, Button, List, Tab, Tabs, Image, NavBar,
	Tabbar, TabbarItem, ActionSheet, Overlay, Slider, Popup, Field, CellGroup, Cell, Toast, Popover
} from 'vant';
import '@raycloud/sass/index.min.css';
import router from '@/routers/index.js';
import stores from '@/stores/index.js';
import Pointer from '@/utils/point/index.js';

const app = createApp({
	...App,
});
app.use(Loading)
	.use(Dialog)
	.use(Form)
	.use(Icon)
	.use(Button)
	.use(List)
	.use(Tab)
	.use(Tabs)
	.use(Overlay)
	.use(NavBar)
	.use(Tabbar)
	.use(TabbarItem)
	.use(ActionSheet)
	.use(Image)
	.use(Slider)
	.use(Field)
	.use(CellGroup)
	.use(Cell)
	.use(Toast)
	.use(Popover)
	.use(Popup);
app.use(stores);
app.use(router);
app.use(Pointer);

app.mount('#app');
