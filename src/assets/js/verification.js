import Vue from "vue";
import { Toast } from "vant";
Vue.use(Toast);
class Verification {
	constructor() {}
	valid(o) {
		//

		for (let key in o) {
			if (!o[key].reg.test(o[key].value)) {
				Toast(o[key].errorMsg); //提示错误信息
				return false;
			}
		}
		return true;
	}
}
export const verification = new Verification();
// export default new Verification();
