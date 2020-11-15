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
	Tabs,
	Tab,
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
	.use(Tabs)
	.use(Tab)
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
		// console.log(config);
	}
	return config;
});

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

// 添加小数
Vue.filter("Decimal_res", (item, n = 2) => {
	return item.toFixed(n);
});

Vue.filter("Time_format", (value, format) => {
	let date = new Date(value);

	// 格式化年份位数
	let year = date.getFullYear().toString();
	if (/(y+)/.test(format)) {
		let content = RegExp.$1;
		format = format.replace(content, year.slice(year.length - content.length));
	}

	let o = {
		M: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		m: date.getMinutes(),
		s: date.getSeconds(),
	};
	// console.log(o);
	for (const key in o) {
		let reg = new RegExp(`(${key}+)`);
		if (reg.test(format)) {
			let Match_content = RegExp.$1;
			format = format.replace(
				Match_content,
				o[key] >= 10
					? o[key]
					: Match_content.length == 2
					? "0" + o[key]
					: o[key]
			);
		}
	}
	return format;
});
new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
