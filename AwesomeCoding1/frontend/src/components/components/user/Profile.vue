<template>
    <el-card class="box-card">
        <div v-loading="loadingQ">
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple"><h2 align="center">用户信息：</h2></div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <img :src="user.gravatar_url" class="avatar-icon" alt="用户头像">
                </el-col>
                <el-col v-if="!editingQ"
                        :span="16"
                        :offset="2">
                    <p>真实姓名： {{ user.realname }}</p>
                    <p>用户名： {{ user.nickname }}</p>
                    <span>身份： {{ role.text }} <img :src="role.icon_url" style="height: 40px;"/></span>
                    <p>邮箱： {{ user.email }}</p>
                    <p>手机号：{{ user.phone}}
                        <el-button icon="el-icon-edit"
                                    circle
                                   @click="handlePhoneEdit()">
                        </el-button>
                    </p>
                    <p>签名： {{ user.motto }}</p>
                </el-col>
                <el-col v-else
                        :span="16"
                        :offset="2">
                    <el-row v-for="(value, key, index) in inputs" :key="index">
                        <el-col :span="24">
                            <el-input v-if="key === 'password'"
                                      :id="key"
                                      type="password"
                                      clearable
                                      class="input-box"
                                      v-model="inputs[key]"
                                      :placeholder="heads[index]"
                                      @focus="handlePasswordInput">
                                <div slot="prepend">{{ heads[index] }}</div>
                            </el-input>
                            <el-input v-else-if="key === 're_password' && password_inputQ"
                                      :id="key"
                                      type="password"
                                      clearable
                                      class="input-box"
                                      v-model="inputs[key]"
                                      :placeholder="heads[index]">
                                <div slot="prepend">{{ heads[index] }}</div>
                            </el-input>
                            <el-input v-else-if="key !== 'password' && key !== 're_password' && key !== 'phone'"
                                      :id="key"
                                      type="text"
                                      clearable
                                      class="input-box"
                                      v-model="inputs[key]"
                                      :placeholder="heads[index]">
                                <div slot="prepend">{{ heads[index] }}</div>
                            </el-input>
                        </el-col>
                    </el-row>
                    <div style="text-align:center">
                        <el-button type="primary"
                                   style="text-align:center"
                                   @click="handleVerification"
                                   :disabled="verify.disableQ">
                            {{ verify.prompt }}
                        </el-button>
                    </div>
                </el-col>
            </el-row>

            <el-tabs style="padding-bottom: 50px;" v-model="cur_tab">

                <el-tab-pane label="用户管理">
                    <el-row style="padding-top: 20px">
                        <el-col :span="12" align="center">
                            <el-button v-if="!editingQ"
                                       type="warning"
                                       size="small"
                                       style="width: 80%"
                                       @click="handleEdit">
                                编辑
                            </el-button>
                            <el-button v-else type="success"
                                       size="small"
                                       style="width: 80%"
                                       @click="handleSave">
                                保存
                            </el-button>
                        </el-col>
                        <el-col :span="12" align="center">
                            <el-button v-if="!editingQ"
                                       type="danger"
                                       size="small"
                                       style="width: 80%"
                                       @click="handleLogout">
                                登出
                            </el-button>
                            <el-button v-else type="info"
                                       size="small"
                                       style="width: 80%"
                                       @click="handleCancel">
                                取消
                            </el-button>
                        </el-col>
                    </el-row>
                </el-tab-pane>

                <el-tab-pane label="我的动态">
                    <el-table :data="chatrecords" stripe style="width: 100%" @current-change="handleCurrentChange">
                        <el-table-column prop="message" label="主题" width="280"></el-table-column>
                        <el-table-column prop="registration_date" label="发贴时间" width="180"></el-table-column>
                    </el-table>

                </el-tab-pane>
                <el-tab-pane label="我的资源">

                    <el-table
                        :data="tableData"
                        height="250"
                        border
                        style="width: 100%">
                        <el-table-column
                            prop="showFilename"
                            label="文件名"
                            width="420">
                        </el-table-column>

                        <el-table-column align="center" label="下载">
                            <template slot-scope="scope">
                                <el-button icon="el-icon-download" circle
                                           @click="handleDownload(scope.row)">
                                </el-button>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="删除">
                            <template slot-scope="scope">
                                <el-button icon="el-icon-delete" circle
                                           @click="handleDelete(scope.row)">
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-tab-pane>
                <el-tab-pane label="我的课堂">
                    <el-card>
                        <myCourses idx='myCourses'/>
                    </el-card>
                </el-tab-pane>
            </el-tabs>

        </div>
        <div>
            <router-view @logined="handleLogined" @logout="handleLogout"
                         :user="user">
            </router-view>
        </div>
    </el-card>

</template>

<script>
    /* eslint-disable no-undef,camelcase */

    import {changeSQL} from "../../../utils/DoSQL";
    import CourseList from '@/components/components/CourseList.vue';
    import axios from 'axios';

    export default {
        name: "Profile",
        props: ['user'],
        data () {
            return {
                title: '个人页面',
                cur_tab: '',
                role: {
                    text: '',
                    icon_url: '',
                },
                heads: ['真实姓名', '签名', '邮箱', '密码', '重复', '验证码'], // 输入框提示词
                editingQ: false, // if the use pushed the 'edit' button
                inputs: {
                    realname: '',
                    motto: '',
                    email: '',
                    password: '',
                    re_password: '',
                    verify_code: '',
                    phone: '',
                },
                tableData: [],
                chatrecords: [],
                loadingQ: false,
                password_inputQ: false, // if password input box was focused
                verify: {
                    code_generated: '',
                    prompt: '发送验证码',
                    countdown: 60,
                    disableQ: false,
                },
            };
        },
        beforeMount () {
            if (this.user.role === 0) {
                this.role.text = '管理员';
                this.role.icon_url = require('../../../assets/images/icons/administrator.png');
            } else if (this.user.role === 1) {
                this.role.text = '教师';
                this.role.icon_url = require('../../../assets/images/icons/teacher.png');
            } else if (this.user.role === 2) {
                this.role.text = '学生';
                this.role.icon_url = require('../../../assets/images/icons/student.png');
            } else {
                this.role.text = '未知身份';
            }
        },
        mounted: function () {
            this.loadTableData();
        },
        methods: {

            loadTableData () {
                this.$http.post('/api/file/fetch', {}).
                     then(function (res) {
                         this.tableData = res.body.results;
                         for (let i = 0; i < this.tableData.length; i++) {
                             this.tableData[i].showFilename = this.tableData[i].filename.slice(32);
                         }
                     });
                this.$http.post('/api/chat/info/query/user', {}).
                    then(function (res) {
                        if (res.body.status === 'NOT FOUND.') {
                            this.$message("Room " + this.title + " not found!");
                        } else {
                            this.chatrecords = res.body.chatrecords;
                        }
                    });
            },
            handleEdit () {
                // this.$router.push('/user/settings');
                this.inputs.realname = this.user.realname;
                this.inputs.motto = this.user.motto;
                this.inputs.email = this.user.email;
                this.inputs.password = '●●●●●●●●●●●●';
                this.inputs.verify_code = '';
                this.editingQ = true;
                this.password_inputQ = false;
                this.inputs.phone = this.user.phone;
            },

            handleSave () { // submit changes
                if (this.inputs.realname === '') {
                    this.$message("真实姓名不能为空。");
                    return;
                }
                let reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
                if(!reg.test(this.inputs.email)){
                    this.$message("邮箱不合法。");
                    return;
                }

                if (this.password_inputQ) {
                    if (this.inputs.password.length < 6) {
                        this.$message("密码不能少于6位。");
                        return;
                    }
                    if (this.inputs.password !== this.inputs.re_password) {
                        this.$message("两次输入的密码不同。");
                        return;
                    }
                } else {
                    this.inputs.password = ''; // 空字符表示不修改某个键-值
                }
                this.loadingQ = true;
                changeSQL(this, this.inputs).
                    then((res) => {
                        this.loadingQ = false;
                        this.user = res.results;
                        this.$message('修改成功。');
                        this.editingQ = false;
                        this.inputs.password = '●●●●●●●●●●●●';
                        this.password_inputQ = false;
                    }).
                    catch((err) => {
                        this.loadingQ = false;
                        if (err.details === 'WRONG_VERIFICATION_CODE.') {
                            this.$message.error("修改密码失败，验证码不正确！");
                        } else {
                            this.$message.error('修改失败。' + JSON.stringify(err.details, null, 3));
                        }
                        this.inputs.password = '●●●●●●●●●●●●';
                        this.password_inputQ = false;
                    });
            },
            handlePasswordInput () {
                if (this.password_inputQ) {
                    return;
                }
                this.password_inputQ = true;
                this.inputs.re_password = this.inputs.password = '';
            },
            handleLogout () {
                this.$emit('logout');
                this.$router.push('/home');
            },
            handleCancel () {
                this.editingQ = false;
            },
            handleCurrentChange: function (item) {
                this.$router.push(
                    {name: 'posts', params: {forumid: item.forumid}});
            },

            handleDownload: function (row) {
                let a = document.createElement('a');
                a.content = "text/html;charset=utf-8";
                a.href = '/api/file/download?filename=' + row.filename;
                a.click();
            },
            handleDelete: function (row) {
                this.$http.post('/api/file/delete', {
                    fileId: row.id,
                    filename: row.filename,
                }).
                     then(function (res) {
                         this.loadTableData();
                     });
            },
            handleVerification: function () {
                var clock;
                clock = window.setInterval(() => {
                    this.verify.disableQ = true;
                    this.verify.countdown--;
                    this.verify.prompt = this.verify.countdown + 's后重新发送';
                    if (this.verify.countdown <= 0) {
                        window.clearInterval(clock);
                        this.verify.disableQ = false;
                        this.verify.prompt = '重新发送验证码';
                        this.verify.countdown = 60;
                    }
                }, 1000);

                this.$message.warning("验证码已发送！请注意查收");

                let nowpath = '/api/user/verification';
                axios.post(nowpath, {number: this.user.phone})
                      .then((resp) => {
                    //this.verify.code_generated = parseInt(resp.data.code_generated);
                });
            },
            handlePhoneEdit: function () {
                window.location.href = "/user/change_phone";
                this.loadingQ = true;
            },
            handleLogined (user_info) { // logined event emitted by children router-view
                this.user = user_info;
                this.loginQ = true;
            },
        },
        components: {'myCourses': CourseList}
    };
</script>

<style scoped>

    .clear-fix:before,
    .clear-fix:after {
        display: table;
        content: "";
    }

    .clear-fix:after {
        clear: both
    }

    .box-card {
        width: 640px;
    }

    .avatar-icon {
        width: 100%;
        height: 100%;
        display: flex;
        border-radius: 100%;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        margin: 10px;
        border: 2px #dedede solid;
    }

    .input-box {
        width: 100%;
        margin-bottom: 20px;
    }

</style>
