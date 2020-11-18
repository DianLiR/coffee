<template>
	<div class="login">
		<van-nav-bar left-text="返回" right-text="取消" @click-right="goState" @click-left="goState">
			<template #left>
				<div class="nav-left">
					<div class="logo">
						<img class="logo_img" src="../assets/logo.svg" alt="">
					</div>
					<div class="logo-text">Luckin</div>
				</div>
			</template>
		</van-nav-bar>
		<div class="user-box">
			<div class="user-title">
				<div class="welcome">登录</div>
				<!-- <div class="sub-title">Please login to you account</div> -->
			</div>

			<van-form>
				<van-field v-model="userInfo.phone" name="手机号" placeholder="手机号" autocomplete="off" />
				<van-field
					v-model="userInfo.password"
					:type="isShowPassword ? 'password' : 'text'"
					name="密码"
					placeholder="密码"
					autocomplete="off"
					:right-icon="isShowPassword ? 'closed-eye' : 'eye-o'"
					@click-right-icon="toggleShowPass"
				/>
				<div class="forgot" @click="goForgot"><span>忘记密码?</span></div>
				<div class="commit-btn"><van-button round block color="skyblue" @click="login">登录</van-button></div>
				<div class="commit-btn"><van-button round block type="default" @click="toggleRegistered">注册</van-button></div>
			</van-form>
		</div>
		<!-- <div v-show="visible">Slide Up</div> -->

		<van-popup class="register-box" v-model="isShow" position="bottom" :style="{ height: '45%' }" closeable round>
			<div class="registered-title">注册账号</div>
			<van-form>
				<van-field v-model="userRegisterInfo.nickname" name="昵称" label="昵称" placeholder="昵称" autocomplete="off" />
				<van-field v-model="userRegisterInfo.phone" type="tel" name="手机号" label="手机号" placeholder="手机号" autocomplete="off" />

				<van-field
					v-model="userRegisterInfo.password"
					name="密码"
					label="密码"
					placeholder="密码"
					autocomplete="off"
					:type="isShowPassword ? 'password' : 'text'"
					:right-icon="isShowPassword ? 'closed-eye' : 'eye-o'"
					@click-right-icon="toggleShowPass"
				/>

				<div class="commit-btn registered-btn"><van-button round block type="default" @click="register">注册</van-button></div>
			</van-form>
		</van-popup>
	</div>
</template>

<script>
//导入外部样式表
import '../assets/less/login.less';
import { verification } from '../assets/js/verification';
export default {
	name: 'Login',
	data() {
		return {
			//用户信息
			userInfo: {
				phone: '',
				password: ''
			},
			userRegisterInfo: {
				phone: '',
				password: '',
				nickname: ''
			},
			isShow: false,
			isShowPassword: true
		};
	},
	methods: {
		toggleShowPass() {
			this.isShowPassword = !this.isShowPassword;
		},
		// 打开注册
		toggleRegistered() {
			this.isShow = true;
		},
		goForgot() {
			this.$router.push({ name: 'Forgot' });
		},
		goState() {
			this.$router.push({ name: 'Home' });
		},
		// 注册验证
		register() {
			let o = {
				nickname: {
					value: this.userRegisterInfo.nickname,
					errorMsg: '昵称格式错误',
					// 用户名校验，4到16位（字母，数字，下划线，减号）
					reg: /^[a-zA-Z0-9_-]{4,16}$/
					// reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
				},
				phone: {
					value: this.userRegisterInfo.phone,
					errorMsg: '号码格式错误',
					// 中国手机号(宽松), 只要是13,14,15,16,17,18,19开头即可
					reg: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
				},
				password: {
					value: this.userRegisterInfo.password,
					errorMsg: '密码格式错误',
					// 密码强度校验，最少6位，包括至少1个大写字母，1个小写字母，1个数字
					reg: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/
				}
			};
			let isCorrect = verification.valid(o);
			if (isCorrect) {
				//
				let userInfo = Object.assign({}, this.userRegisterInfo);
				userInfo.appkey = this.appkey;

				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0
				});

				this.axios({
					method: 'POST',
					url: '/register',
					data: userInfo
				})
					.then(res => {
						this.$toast.clear();
						if (res.data.code == 100) {
							this.isShow = false;
							this.$toast.success(res.data.msg);
						} else {
							this.$toast.fail(res.data.msg);
						}
						//
					})
					.catch(res => {
						this.$toast.clear();
						//
					});
			}
		},

		login() {
			let o = {
				phone: {
					value: this.userInfo.phone,
					errorMsg: '号码格式错误',
					// 中国手机号(宽松), 只要是13,14,15,16,17,18,19开头即可
					reg: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
				},
				password: {
					value: this.userInfo.password,
					errorMsg: '密码格式错误',
					// 密码强度校验，最少6位，包括至少1个大写字母，1个小写字母，1个数字
					reg: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/
				}
			};
			let isCorrect = verification.valid(o);
			if (isCorrect) {
				//
				let userInfo = Object.assign({}, this.userInfo);
				userInfo.appkey = this.appkey;

				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0
				});

				this.axios({
					method: 'POST',
					url: '/login',
					data: userInfo
				})
					.then(res => {
						this.$toast.clear();
						if (res.data.code == 200) {
							localStorage.setItem('Kf_tk', res.data.token);
							this.$router.push({ name: 'Home' });
						} else {
							this.$toast(res.data.msg);
						}
					})
					.catch(res => {
						this.$toast.clear();
						//
					});
			}
		}
	}
};
</script>
