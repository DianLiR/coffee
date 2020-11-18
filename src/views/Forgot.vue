<template>
	<div class="forgot">
		<van-nav-bar left-text="返回" right-text="取消" @click-right="goState" @click-left="goState">
			<template #left>
				<div class="nav-left">
					<div class="logo"><img class="logo_img" src="../assets/logo.svg" alt="" /></div>
					<div class="logo-text">Luckin</div>
				</div>
			</template>
		</van-nav-bar>
		<div class="user-box">
			<div class="user-title">
				<div class="welcome">找回密码</div>
				<!-- <div class="sub-title">Please login to you account</div> -->
			</div>

			<van-form v-show="!isNext">
				<van-field v-model="userInfo.email" name="邮箱" placeholder="邮箱" autocomplete="off" />
				<van-field v-model="userInfo.code" name="验证码" placeholder="验证码" autocomplete="off" maxlength="6">
					<template #button>
						<van-button size="small" color="skyblue" :disabled="isDis" @click="getVali_code">{{ text }}</van-button>
					</template>
				</van-field>
				<div class="forgot" @click="goLogin"><span>已有账号,立即登录?</span></div>
				<div class="commit-btn"><van-button round block color="skyblue" @click="next">下一步</van-button></div>
			</van-form>

			<van-form v-show="isNext">
				<van-field v-model="userInfo.phone" name="手机号" placeholder="手机号" autocomplete="off" />
				<van-field
					v-model="userInfo.password"
					:type="isShowPassword ? 'password' : 'text'"
					name="密码"
					placeholder="密码"
					autocomplete="off"
					:right-icon="isShowPassword ? 'closed-eye' : 'eye-o'"
					@click-right-icon="toggleShowPass"
				></van-field>

				<div class="commit-btn"><van-button round block color="skyblue" @click="commit">确认</van-button></div>
				<div class="commit-btn"><van-button round block type="default" @click="back">返回</van-button></div>
			</van-form>
		</div>
	</div>
</template>

<script>
//导入外部样式表
import '../assets/less/forgot.less';
import { verification } from '../assets/js/verification';
export default {
	name: 'forgot',
	data() {
		return {
			//用户信息
			userInfo: {
				phone: '',
				password: '',
				email: '',
				code: ''
			},

			isNext: false, //下一步
			isDis: false, //验证码
			text: '发送验证码',

			isShowPassword: true
		};
	},
	methods: {
		toggleShowPass() {
			this.isShowPassword = !this.isShowPassword;
		},
		back() {
			this.isNext = false;
		},
		goLogin() {
			this.$router.push({ name: 'Login' });
		},
		goState() {
			this.$router.push({ name: 'Home' });
		},
		next() {
			let o = {
				email: {
					value: this.userInfo.email,
					errorMsg: '邮箱格式错误',
					// 邮箱地址(email)
					reg: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
				},
				code: {
					value: this.userInfo.code,
					errorMsg: '验证码格式错误',
					reg: /^[A-Za-z\d]{6}$/
				}
			};
			let isCorrect = verification.valid(o);
			if (isCorrect) {
				//

				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0
				});

				this.axios({
					method: 'POST',
					url: '/checkValidCode',
					data: {
						appkey: this.appkey,
						validCode: this.userInfo.code
					}
				}).then(res => {
					this.$toast.clear();
					if (res.data.code == 'K001') {
						this.isNext = true;
					} else {
						this.$toast(res.data.msg);
					}
					//
				});
			}
		},
		getVali_code() {
			let o = {
				email: {
					value: this.userInfo.email,
					errorMsg: '邮箱格式错误',
					// 邮箱地址(email)
					reg: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
				}
			};
			let isCorrect = verification.valid(o);
			if (!isCorrect) return;
			let time = 20;
			this.isDis = true;
			// this.text = `重新发送`;
			let timer = setInterval(() => {
				if (time <= 0) {
					clearInterval(timer);
					timer = null;
					time = 20;
					this.text = `重新发送`;
					this.isDis = false;
				} else {
					time--;
					this.text = `${time}秒后重新发送`;
				}
			}, 500);
			

			this.$toast.loading({
				message: '加载中...',
				forbidClick: true,
				duration: 0
			});
			this.axios({
				method: 'POST',
				url: '/emailValidCode',
				data: {
					appkey: this.appkey,
					email: this.userInfo.email
				}
			}).then(res => {
				this.$toast(res.data.msg);
			});
		},
		commit() {
			let o={
				phone:{
					value:this.userInfo.phone,
					errorMsg:'手机号码格式错误',
					reg:'/^(?:(?:\+|00)86)?1[3-9]\d{9}$/'
				},
				password:{
					value:this.userInfo.password,
					errorMsg:'密码格式错误',
					reg: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/
				}
			}
			let isCorrect = verification.valid(o);
			if (!isCorrect) {
				this.$toast.loading({
					message:'加载中...',
					forbidClick:true,
					duration:0
				})
				this.axios({
					method:'POST',
					url:'/retrievePassword',
					data:{
						appkey:this.appkey,
						phone:this.userInfo.phone,
						password:this.userInfo.password
					}
				}).then(res=>{
					this.$toast.clear()
					this.$toast(res.data.msg)
					if(res.data.code =="L001"){
						setTimeout(()=>{
							this.goLogin()
						},500)
					}
				}
				)
			};
		}
	}
};
</script>
