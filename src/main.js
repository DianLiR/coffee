import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";

//导入rem适配文件
import "lib-flexible/flexible";
//从vant框架导入Button组件
import {
	Button,
	NavBar,
	Form,
	Field,
	Popup,
	Tabbar,
	TabbarItem,
	Search,
	SwipeItem,
	Swipe,
	Lazyload,
	Card,
	Toast,
	ShareSheet,
	Icon,
	Sku,
	Empty,
	Image as VanImage,
	Stepper,
	SwipeCell,
	Cell,
	Checkbox,
	SubmitBar,
	Tag,
	AddressEdit,
	Area,
	GoodsAction,
	GoodsActionButton,
	GoodsActionIcon,
	AddressList,
} from "vant";

//注册Button组件
Vue.use(Button)
	.use(NavBar)
	.use(Form)
	.use(Field)
	.use(Popup)
	.use(Tabbar)
	.use(TabbarItem)
	.use(Search)
	.use(Swipe)
	.use(Card)
	.use(Toast)
	.use(Icon)
	.use(ShareSheet)
	.use(Sku)
	.use(Empty)
	.use(Stepper)
	.use(SwipeCell)
	.use(VanImage)
	.use(Cell)
	.use(Checkbox)
	.use(Tag)
	.use(SubmitBar)
	.use(AddressEdit)
	.use(Area)
	.use(GoodsAction)
	.use(GoodsActionButton)
	.use(GoodsActionIcon)
	.use(AddressList)
	.use(Lazyload, {
		lazyComponent: true,
		loading: "dist/loading.gif",
	})
	.use(SwipeItem);

Vue.prototype.appkey = "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=";

// 配置请求的基准URL地址
axios.defaults.baseURL = "http://www.kangliuyong.com:10002";
//axios设置请求拦截器
axios.interceptors.request.use((config) => {
	if (config.method == "post") {
		let paramS = "";
		for (const key in config.data) {
			paramS += `${key}=${config.data[key]}&`;
		}
		config.data = paramS.slice(0, -1);
		console.log(config);
	}
	return config;
});

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
