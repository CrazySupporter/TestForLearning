<template>
	<div style='width:100%'>
		<div v-bind:class="{ fly: fly }">
			<el-row :gutter="40">
				<el-col :xs="24" :sm="15" :md="15" :lg="15" :xl="15">
					<!--正中直播窗口-->
					<div style='min-height:500px'>
						<keep-alive>
							<components ref='cp_main' :is='cp_main'></components>
						</keep-alive>
					</div>
				</el-col>
				<!--右侧边栏-->
				<el-col :xs="0" :sm="9" :md="9" :lg="9" :xl="9">
					<sidebar class="right-sidebar" :course_status="course_status" ref="sidebar"
                             @privateChat="handlePrivateChat" :user="user"></sidebar>
				</el-col>
			</el-row>
		</div>
		<!--右下角ppt窗口-->
		<div class='pop-up-container'>
			<Popup name='live'
				   @display='handleDisplay("live")'
				   v-show='cp_live'
				   ref='pu_live'
				   >
                <template slot='abbrev'>
                    直播
                </template>
			    <components ref='cp_live' :is='cp_live'></components>
			</Popup>
			<Popup name='pdf'
				   @display='handleDisplay("pdf")'
				   v-show='cp_pdf'
				   ref='pu_pdf'
				   >
                <template slot='abbrev'>
                    课件
                </template>
			    <keep-alive>
                    <components ref='cp_pdf' :is='cp_pdf'
                                :course_role="course_status.role"
                                @jump="handleJump">
                    </components>
                </keep-alive>
			</Popup>
			<Popup name='practice'
				   @display='handleDisplay("prob")'
				   v-show='cp_prob'
				   ref='pu_prob'
				   >
                <template slot='abbrev'>
                    习题
                </template>
                <components ref='cp_prob' :is='cp_prob'
                            :course_role="course_status.role"
                            @jump="handleJump">
                </components>
			</Popup>
		</div>
	</div>
</template>


<script>
import 'element-ui/lib/theme-chalk/display.css';
import Vue from 'vue';
import Player from './Player';
import Sidebar from './Sidebar';
import ProbViewer from './ProbViewer';
import Popup from './Popup';
import FileViewer from '@/components/components/FileViewer.vue';
import {createCookie, getCookie} from "../../../utils/Cookie";


Vue.component('sub_pdf', FileViewer);
Vue.component('sub_live', Player);
Vue.component('sub_prob', ProbViewer);

export default {
	name: 'Live',
	props: ['course_status', 'fly', 'user'],
	data() {
		return {
			cp_main: 'sub_live',
			cp_pdf: 'sub_pdf',
			cp_live: null,
			cp_prob: 'sub_prob',
		};
	},
	sockets: {
		alert: function(msg) {
			if (msg.operation === 'PROBLEM_PUBLISH.') {
				if (this.cp_prob === null) {
					this.$refs.cp_main.update(msg.info);
				}else {
					this.$refs.cp_prob.update(msg.info);
					this.$refs.pu_prob.handleHidden(1);
				}
			} else if (msg.operation === 'PROBLEM_RECALL.') {
				if (this.cp_prob === null) {
					this.$refs.cp_main.update(null);
				}else {
					this.$refs.cp_prob.update(null);
					this.$refs.pu_prob.handleHidden(0);
				}
			}
		}
	},
    mounted() {
        if (getCookie()['flag'] === undefined) {    // 第一次进入显示提示
            this.$notify({
                title: '⤴这里可以查看课件和习题',
                position: 'bottom-left',
                duration: 0
            });
            createCookie({ 'flag': 1 });
        }
    },
	components: {
		Sidebar,
		Popup
	},
	methods: {
		handleDisplay: function (name) {
			let old = this.cp_main.substr(4);
			this['cp_'+old] = this.cp_main;
			this.cp_main = this['cp_'+name];
			this['cp_'+name] = null;
		},
        handleJump(where) {
            this.$emit('jump', where);
        },
        handlePrivateChat(o) {
            this.$emit('privateChat', o);
        }
	},
};
</script>

<style scoped>
.fly {
	position: fixed;
	width: 83%;
	visibility: hidden;
}
.right-sidebar{
	float: right;
	/*position: relative;*/
	/*left: 30px;*/
	/*min-width: 5%;*/
	width: 100%;
	height: 100%;
	overflow: auto;
}
.spanner {
	min-height:600px;
}

.pop-up-container {
	position: fixed;
    width: 350px;
    bottom: 50px;
    left: 40px;
}

</style>

