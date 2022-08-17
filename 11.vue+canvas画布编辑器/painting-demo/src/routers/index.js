
import { createRouter, createWebHashHistory } from 'vue-router';

import commonRouter from './common';

const routes = [
	...commonRouter
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
