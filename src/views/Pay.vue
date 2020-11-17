<template>
	<div class="pay">
		<van-nav-bar title="提交订单" left-text="返回" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
		<div class="pay_box">
			<div class="address_box">
				<van-cell title="选择收货地址" is-link @click="show_address_list" />
				<div class="user_box">
					<div class="user_info">
						<div class="user_name">{{ current_address.name }}</div>
						<div class="user_phone">{{ current_address.tel }}</div>
					</div>
					<div class="address_info">
						<div class="tag" v-if="current_address.isDefault">默认</div>
						<div class="default_address">{{ current_address.address }}</div>
					</div>
				</div>
			</div>
			<div class="order_info">
				<OrderList titleLeft="订单信息" :count="proInfo.count" :total="proInfo.total">
					<OrderItem v-for="(item, index) in products" :key="index" :item="item"></OrderItem>
				</OrderList>
			</div>
		</div>
		<div class="btn_box"><van-button type="primary" round block @click="paySubmit">提交</van-button></div>
		<van-popup v-model="isOpen" round position="bottom" lazy-render closeable>
			<van-address-list :list="address_list" default-tag-text="默认" v-model="Check_address" @add="add" @select="select_address" @edit="edit" />
		</van-popup>
	</div>
</template>

<script>
import '../assets/less/pay.less';
import OrderList from '../components/OrderList';
import OrderItem from '../components/OrderItem';
export default {
	name: 'Pay',
	data() {
		return {
			isOpen: false,
			Check_address: '',
			address_list: [],
			current_address: {},
			sids: [],
			products: [],
			proInfo: {
				count: 0,
				total: 0
			}
		};
	},
	created() {
		this.sids = this.$route.query.sids.split('-');
		this.get_shopbag_sids();
		this.get_address_data();
	},
	components: {
		OrderList,
		OrderItem
	},
	methods: {
		onClickLeft() {
			// 返回按钮
			this.$router.back(-1);
		},
		add() {
			// 新增地址按钮
			this.$router.push({ name: 'AddressSet' });
		},
		edit(item) {
			// 编辑地址按钮
			this.$router.push({ name: 'AddressSet', query: { aid: item.aid } });
		},
		select_address(item) {
			// 选择地址
			this.isOpen = false;
			this.current_address = item;
		},
		show_address_list() {
			// 展示地址列表
			this.isOpen = true;
		},
		// 获取购物袋数据
		get_shopbag_sids() {
			let tokenString = localStorage.getItem('Kf_tk');
			if (!tokenString) {
				return this.$router.push({ name: 'Login' });
			}
			this.axios({
				method: 'GET',
				url: '/commitShopcart',
				params: {
					appkey: this.appkey,
					tokenString,
					sids: JSON.stringify(this.sids)
				}
			}).then(res => {
				if (res.data.code == 700) {
					this.$router.push({ name: 'Login' });
				} else if (res.data.code == 50000) {
					if (res.data.result.length == 0) {
						return this.$router.push({ name: 'Home' });
					}
					res.data.result.map(v => {
						this.proInfo.count += v.count;
						this.proInfo.total += v.count * v.price;
					});
					this.products = res.data.result;
				}
			});
		},

		pay() {
			let tokenString = localStorage.getItem('Kf_tk');
			if (!tokenString) {
				return this.$router.push({ name: 'Login' });
			}
			this.axios({
				method: 'POST',
				url: '/pay',
				data: {
					appkey: this.appkey,
					tokenString,
					sids: JSON.stringify(this.sids),
					phone: this.current_address.tel,
					address: this.current_address.address,
					receiver: this.current_address.name
				}
			}).then(res => {
				if (res.data.code == 700) {
					this.$router.push({ name: 'Login' });
				} else {
					setTimeout(() => {
						this.$router.push({ name: 'Order' });
					}, 300);
				}
			});
		},
		paySubmit() {
			if (!this.Check_address) {
				this.$toast("未选择收货地址")
				return
			}
			this.$dialog
				.confirm({
					title: '确认订单',
					message: '立即结算'
				})
				.then(() => {
					this.pay();
				});
		},
		get_address_data() {
			let tokenString = localStorage.getItem('Kf_tk');
			if (!tokenString) {
				return this.$router.push({ name: 'Login' });
			}
			this.axios({
				method: 'GET',
				url: '/findAddress',
				params: {
					appkey: this.appkey,
					tokenString
				}
			}).then(res => {
				if (res.data.code == 700) {
					this.$router.push({ name: 'Login' });
				} else if (res.data.code == 20000) {
					res.data.result.map(item => {
						item.isDefault = Boolean(item.isDefault);
						item.id = item.aid;
						item.address = `${item.province}${item.city}${item.county}${item.addressDetail}`;
						if (item.isDefault) {
							this.Check_address = item.aid;
							this.current_address = item;
						}
					});
					this.address_list = res.data.result;
					// console.log(this.address_list);
				}
			});
		}
	}
};
</script>

<style lang="less" scoped></style>
