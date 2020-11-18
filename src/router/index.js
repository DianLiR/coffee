import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/Login",
		name: "Login",
		component: () => import("../views/Login.vue"),
	},
	{
		path: "/main",
		name: "Main",
		component: () => import("../views/Main.vue"),
		children: [
			{
				path: "home",
				name: "Home",
				component: () => import("../views/HomePage/Home.vue"),
			},
			{
				path: "menu",
				name: "Menu",
				component: () => import("../views/HomePage/Menu.vue"),
			},
			{
				path: "shopbag",
				name: "Shopbag",
				component: () => import("../views/HomePage/Shopbag.vue"),
			},
			{
				path: "my",
				name: "My",
				component: () => import("../views/HomePage/My.vue"),
			},
		],
	},
	{
		path: "/detail/:pid",
		name: "Detail",
		component: () => import("../views/Detail.vue"),
	},
	{
		path: "/addresseset",
		name: "AddressSet",
		component: () => import("../views/User/AddressSet.vue"),
	},
	{
		path: "/order",
		name: "Order",
		component: () => import("../views/Order.vue"),
	},
	{
		path: "/pay",
		name: "Pay",
		component: () => import("../views/Pay.vue"),
	},
	{
		path: "/address",
		name: "Address",
		component: () => import("../views/User/Address.vue"),
	},
	{
		path: "/userset",
		name: "Userset",
		component: () => import("../views/User/UserSet.vue"),
	},
	{
		path: "/collect",
		name: "Collect",
		component: () => import("../views/User/Collect.vue"),
	},
	{
		path: "/safety",
		name: "Safety",
		component: () => import("../views/User/Safety.vue"),
	},
	{
		path: "/search",
		name: "Search",
		component: () => import("../views/Search.vue"),
	},{
		path: "/forgot",
		name: "Forgot",
		component: () => import("../views/Forgot.vue"),
	},
	{
		path: "*",
		redirect: {
			name: "Home",
		},
	},
];

const router = new VueRouter({
	routes,
});

export default router;
