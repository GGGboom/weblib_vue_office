<template>
    <div>
        <div style=" width:100%;height: 30px;margin-left: 0px;margin-top: 15px; border-bottom: 1px #000 solid">个人基本信息</div>
        <div style="width: 100%;height: 150px;">
            <div style="float:left;width: 140px;height: 100%;margin-left: 10px;margin-top: 10px;margin-bottom: 10px">
                <img ref="headicon" style="width: 140px;height:140px;">
            </div>
            <div style="float:left; height: 100%;margin-left: 10px;margin-top: 10px;margin-bottom: 10px">
                <p>账号：{{this.$store.getters.account}}</p>
                <!--在user.js查看变量命名-->
                <p>用户名：{{this.$store.getters.name}}</p>
                <el-upload
                        style="float: left"
                        class="upload-demo"
                        accept="image/png,image/gif,image/jpg,image/jpeg"
                        :before-upload="BeforeUpload"
                        :show-file-list="false"
                        :http-request="uploadicon"
                        action="string"
                >
                    <el-button  type="primary">修改头像</el-button>
                </el-upload>


                <el-button type="primary" v-on:click="dialogvisible=true" style="float: left;margin-left: 10px">修改密码</el-button>
                <el-dialog title="修改密码" :visible.sync="dialogvisible" :close-on-click-modal="false" width="600px">
                    <el-form :model="this.form">
                        <el-form-item label="原始密码" :label-width="formLabelWidth">
                            <el-input v-model="form.password" type="password" style="width: 300px"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" :label-width="formLabelWidth">
                            <el-input v-model="form.newpassword" type="password" style="width:300px"></el-input>
                        </el-form-item>
                        <el-form-item label="确认新密码" :label-width="formLabelWidth">
                            <el-input v-model="form.confirmNewPassword" type="password" style="width: 300px"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogvisible = false">取 消</el-button>
                        <el-button type="primary" @click="modifyps">确 定</el-button>
                    </div>
                </el-dialog>

            </div>
        </div>

        <!--<el-row>-->
            <!--<el-col :span="2" style="float: left"><div class="bg-icon">-->
                <!--&lt;!&ndash;<img src="../../../1592826805.jpg"&ndash;&gt;-->
                     <!--&lt;!&ndash;height="120px" width="120px" >&ndash;&gt;-->
                <!--<img ref="headicon" height="100%" width="100%">-->
            <!--</div></el-col>-->
            <!--<el-col :span="22" style="float: left">-->
                <!--<div class="bg-icon">-->
                    <!--<p>账号：{{this.$store.getters.account}}</p>-->
                    <!--&lt;!&ndash;在user.js查看变量命名&ndash;&gt;-->
                    <!--<p>用户名：{{this.$store.getters.name}}</p>-->
                    <!--<el-upload-->
                            <!--style="float: left"-->
                            <!--class="upload-demo"-->
                            <!--accept="image/png,image/gif,image/jpg,image/jpeg"-->
                            <!--:before-upload="BeforeUpload"-->
                            <!--:show-file-list="false"-->
                            <!--:http-request="uploadicon"-->
                            <!--action="string"-->
                           <!--&gt;-->
                        <!--<el-button  type="primary">修改头像</el-button>-->
                    <!--</el-upload>-->


                    <!--<el-button type="primary" v-on:click="dialogvisible=true" style="float: left;margin-left: 10px">修改密码</el-button>-->
                    <!--<el-dialog title="修改密码" :visible.sync="dialogvisible" :close-on-click-modal="false" width="600px">-->
                        <!--<el-form :model="this.form">-->
                            <!--<el-form-item label="原始密码" :label-width="formLabelWidth">-->
                                <!--<el-input v-model="form.password" type="password" style="width: 300px"></el-input>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="新密码" :label-width="formLabelWidth">-->
                                <!--<el-input v-model="form.newpassword" type="password" style="width:300px"></el-input>-->
                            <!--</el-form-item>-->
                        <!--</el-form>-->
                        <!--<div slot="footer" class="dialog-footer">-->
                            <!--<el-button @click="dialogvisible = false">取 消</el-button>-->
                            <!--<el-button type="primary" @click="modifyps">确 定</el-button>-->
                        <!--</div>-->
                    <!--</el-dialog>-->
                <!--</div>-->

            <!--</el-col>-->
        <!--</el-row>-->

        <el-row>
            <el-col :span="24"><div  style="margin-top:20px;height: 200px;border-top: #000 1px solid">
                <p style="border-bottom: #000 1px solid">系统基本信息</p>
                <p>文件柜总容量：{{totalGb}}GB</p>
                <p>已使用容量:{{useGb}}GB</p>
                <el-progress style="margin-top: 20px"  :text-inside="false" :color="progresscolor" :show-text="true" :stroke-width="20" :percentage="use_percent" ></el-progress>

            </div></el-col>

        </el-row>

    </div>
</template>

<script>
    import request from '../../utils/request'
    import axios from 'axios'
    export default {
        name: "info",
        data(){
            return{
                iconurl:null,
                name:null,
                acount:null,
                icon:null,
                totalsize:0,
                usesize:0,
                useGb:0,
                totalGb:0 ,//已经使用的量和总量用Gb表示
                use_percent:0,
                dialogvisible:false,
                dialogvisible2:false,
                progresscolor:"#1989fa",
                formLabelWidth:'120px',
                form:{
                    password:null,
                    newpassword:null,
                    confirmNewPassword:null,
                }
            }

        },
        created(){
        //     console.log("打印个人信息")
        //     this.getuserinfo().then(response => {
        //     const data = response.data
        //     this.name = data.name
        //     this.account = data.account
        // })
            var originurl="http://localhost:9090/group/downloadResource_v2?id=289";
            var previewurl=originurl+'&fullfilename=test.pdf';
            window.open('http://127.0.0.1:8014/onlinePreview?url='+encodeURIComponent(previewurl));
            this.getusericon().then(response=>{
                console.log("进入")
                console.log(response)
                const data=response.data
                // console.log(data)
                // console.log(data.profilePics)
                // console.log(data.profilePics[0])
                // console.log(data.profilePics[0].picUrl)
                this.iconurl=data.profilePics[0].picUrl
                // console.log(this.iconurl)
                // var res=request({
                //     url:this.iconurl,
                //     method:'get',
                // })
                this.$refs.headicon.src='http://'+window.location.host+this.iconurl//部署版
            //this.$refs.headicon.src=process.env.BASE_API+this.iconurl
                //console.log("下载图片"+res)

        }),
            console.log("获取使用情况")
            this.getuse().then(response=>{
                const data=response.data
                console.log("获取使用情况")
            this.totalsize=data.totalSize
            this.usesize=data.resourcesSize
            this.totalGb=Number(this.totalsize/1024/1024).toFixed(2)
            this.useGb=Number(this.usesize/1024/1024).toFixed(2)
            console.log(this.totalsize)
            console.log(this.usesize)
            this.use_percent=this.usesize/this.totalsize*100
            this.use_percent=Number(this.use_percent.toFixed(2))
            console.log(typeof(this.use_percent))
            console.log(this.use_percent)


        })


        },
        beforeCreate(){

        },
        methods:{
            getusericon(){
                return request({
                    url:'/user/getProfilePic',
                    //url:'user/getProfilePic.action',
                    method: 'post',
                    params:{
                        account:this.$store.getters.account
                    }
                })
            },
            //上传头像前钩子
            BeforeUpload (file) {
                if (!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
                    this.$message.error('请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片');
                }else{

                }
            },
            //getuserinfo(){
            //     return request({
            //         url: '/user/getAccount.action',
            //         method: 'post',
            //
            //     })
            // },
            modifyps(){
                if(this.form.newpassword==this.form.confirmNewPassword){
                    request({
                        url:'/user/modifyPassword_v2',
                       // url:'user/modifyPassword_v2.action',
                        method:'post',
                        params: {
                            password:this.form.password,
                            newPassword:this.form.newpassword
                        }
                    }).then(response=>{
                        const data=response.data;
                        console.log(data)
                        console.log(data.result)
                        if(data.result==true){
                            this.dialogvisible=false;
                            this.$message({
                                message: data.message,
                                type: 'success'
                            });

                        }else{
                            this.$message({
                                message: data.message,
                                type: 'warning'
                            });
                        }
                        console.log(response)
                    })
                }else{
                    this.form.newpassword=null
                    this.form.confirmNewPassword=null
                    this.$message({
                        message: '两次输入密码不一致！请重新输入',
                        type: 'warning'
                    });
                }
                console.log(this.form.password)
                console.log(this.form.newpassword)
            },
            getuse(){
                return request({
                    url:'/group/getResourceSize_v2',//Math.abs(localStorage.groupId)
              //      url:'group/getResourceSize_v2.action',
                    method:'post',
                    params:{
                        groupId:Math.abs(localStorage.groupId)
                    }
                })
            },
            uploadicon(f){
                let formdata=new FormData()
                formdata.append('filedata',f.file)
                formdata.append('filename',f.file.name)
                // const formdata=new FormData()
                // formdata.append(file:params.file)
                request({
                    url:'/user/uploadProfilePic',
                    //url:'user/uploadProfilePic.action',
                    method:'post',
                    headers:{'Content-Type': 'multipart/form-data'},
                    data:formdata
                }).then(res=>{
                    if(res.status==200){
                    location.reload();
                    }else{
                    this.$message({
                        message: '请确认图片格式',
                        type: 'warning'
                    });
                    }
                })
               // location.reload();
                //上传后更新
                // this.getusericon().then(response=> {
                //     console.log("进入")
                // console.log(response)
                // const data = response.data
                // console.log(data)
                // console.log(data.profilePics)
                // console.log(data.profilePics[0])
                // console.log(data.profilePics[0].picUrl)
                // this.iconurl = data.profilePics[0].picUrl
                // // console.log(this.iconurl)
                // // var res=request({
                // //     url:this.iconurl,
                // //     method:'get',
                // // })
                // this.$refs.headicon.src = process.env.BASE_API + this.iconurl
                // console.log("下载图片" + res)
                // })


            },

        }
    }
</script>

<style scoped>
    .el-row {
        margin-bottom: 20px;
        height:10px;
    &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-icon{
        float: left;
        background: white;
        height: 120px;
        margin-top: 10px;
        margin-left: 20px;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>