<template>
  <div class="login-container" :style="login_bg">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules"
             ref="loginForm"
             label-position="left" :style="login_wrap_bg">
      <!--<div class="title-container">-->
      <!--<h3 class="title">{{$t('login.title')}}</h3>-->
      <!--&lt;!&ndash;<lang-select class="set-language"></lang-select>&ndash;&gt;-->
      <!--</div>-->
      <div v-if="cas === 0" class="loginInput">
        <div class="loginTitle">登录</div>
        <el-form-item prop="username" v-if="cas === 0">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
          <el-input @focus="handleFocus" @blur="handleBLur" name="username" type="text" v-model="loginForm.username"
                    autoComplete="on"
                    placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item prop="password" v-if="cas === 0">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
          <el-input @focus="handleFocus" @blur="handleBLur" name="password" :type="passwordType"
                    @keyup.enter.native="handleLogin" v-model="loginForm.password"
                    autoComplete="on" placeholder="请输入密码" />
          <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
        </el-form-item>
      </div>
      <form class="loginInput" v-if="cas === 1" id="casForm" method="post" name="casForm">
        <div class="loginTitle">登录</div>
        <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
          <el-input @focus="handleFocus" @blur="handleBLur" name="username" type="text" v-model="loginForm.username"
                    autoComplete="on" placeholder="username" />
        </el-form-item>

        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
          <el-input @focus="handleFocus" @blur="handleBLur" name="password" :type="passwordType"
                    @keyup.enter.native="handleLogin" v-model="loginForm.password"
                    autoComplete="on" placeholder="password" />
          <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
        </el-form-item>
      </form>

      <div style="width:280px;text-align:center;position:absolute;right:80px;bottom:200px;color:#333;">
        <el-select v-model="cas" style="width:100%" class="casSelect">
          <el-option v-for="item in options" :value="item.value" :label="item.label" :key="item.value"></el-option>
        </el-select>
      </div>
      <el-button class="loginBtn" v-if="cas === 0" type="primary" style="width:100%;margin-bottom:30px;"
                 :loading="loading"
                 @click.native.prevent="handleLogin">登录
      </el-button>
      <el-button class="loginBtn" v-if="cas === 1" type="primary" style="width:100%;margin-bottom:30px;"
                 :loading="loading"
                 @click.native.prevent="handleLogin">登录
      </el-button>

      <div style="color:#333;text-align:center;font-size:12px;opacity:.7;position:absolute;width:100%;bottom:-30px;"
           class="footer">{{copyright}}
        <el-popover
          placement="top-start"
          title=""
          width="175"
          trigger="hover"
          content="123">
          <div style="width:131px;height:142px;background-size:131px 142px;" :style="wx_code"></div>
          <a style="color:#66ba07" href="javascript:void(0)" slot="reference">扫码下载客户端</a>
        </el-popover>
      </div>
    </el-form>

  </div>
</template>

<script>
  import { isvalidUsername } from '@/utils/validate'
  import LangSelect from '@/components/LangSelect'
  import SocialSign from './socialsignin'
  import { getUserInfo } from '@/api/login'
  import { getToken, removeToken, setToken } from '@/utils/auth'
  import login_bg from '@/assets/login/login_bg.png'
  import login_wrap_bg from '@/assets/login/login_wrap_bg.png'
  import wx_code from '@/assets/login/WX20181024-021001@2x.png'


  export default {
    components: {
      LangSelect, SocialSign
    },
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('Please enter the correct user name'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 2) {
          callback(new Error('The password can not be less than 6 digits'))
        } else {
          callback()
        }
      }
      return {
        login_bg: { backgroundImage: 'url("login_bg.png")' },
        login_wrap_bg: { backgroundImage: 'url("login_wrap_bg.png")' },
        wx_code: { backgroundImage: 'url(' + wx_code + ')' },
        copyright: copyright,
        cas: 0,
        options: [
          { label: '本地认证', value: 0 },
          { label: '中央认证', value: 1 }
        ],
        loginForm: {
          username: '',
          password: ''
        },
        casForm: {
          username: '',
          password: ''
        },
        loginRules: {
//          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
//          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        passwordType: 'password',
        casPasswordType: 'password',
        loading: false
      }
    },
    methods: {
      resize(){
        if (document.body.scrollHeight < 650) {
          this.login_wrap_bg = Object.assign({}, this.login_wrap_bg, { marginTop: '40px' })
        } else {
          this.login_wrap_bg = Object.assign({}, this.login_wrap_bg, { marginTop: '80px' })
        }
      },
      handleFocus(event){
        event.srcElement.parentNode.parentNode.parentNode.className = 'el-form-item el-form-item--mini actived'
      },
      handleBLur(event) {
        event.srcElement.parentNode.parentNode.parentNode.className = 'el-form-item el-form-item--mini'
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      showCasPwd() {
        if (this.casPasswordType === 'password') {
          this.casPasswordType = ''
        } else {
          this.casPasswordType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            if (this.cas === 0) {
              this.loading = true
              this.$store.dispatch('LoginByUsername', this.loginForm).then((data) => {
                this.loading = false
                this.$router.push({ path: '/' })
              }).catch(() => {
                this.loading = false
              })
            } else {
              document.getElementById('casForm').action = casUrl
              setTimeout(() => {
                this.loading = true
                document.getElementById('casForm').submit()
              }, 100)
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    created() {
      if (isJwtLogin) {
        this.$router.push({ path: '/jwt' })
      }
      this.resize()
      window.onresize = () => {
        this.resize()
      }
    },
    mounted() {
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;

  /* reset element-ui css */
  .login-container {
    background-size: cover;
    .loginTitle {
      position: relative;
      top: -20px;
      font-size: 22px;
      font-weight: bold;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 100%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        font-size: 14px;
        &:-webkit-autofill {
          -webkit-text-fill-color: #fff !important;
        }
      }
    }

    .el-form-item {
      &.actived {
        border-bottom: 1px solid #f8921c;
      }
      /*border: 1px solid rgba(255, 255, 255, 0.1);*/
      /*background: rgba(0, 0, 0, 0.1);*/
      border: 0;
      border-radius: 0;
      color: #454545;
      border-bottom: 1px solid #ccc;
      width: 280px;
    }
    .loginInput {
      width: 280px;
      position: absolute;
      right: 80px;
      top: 120px;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  $bg: #fff;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .el-form-item__error {
      width: 100%;
      text-align: center;
      padding-top: 5px;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 1024px;
      height: 540px;
      padding: 35px 35px 15px 35px;
      margin: 80px auto;
      .loginBtn {
        position: absolute !important;
        right: 80px;
        bottom: 100px;
        width: 280px !important;
        background: #5db307 !important;
        height: 40px;
        font-size: 16px;
      }
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      /*display: inline-block;*/
      display: none;
      &_login {
        font-size: 20px;
      }
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }
    .show-pwd {
      position: absolute;
      right: 12px;
      top: 12px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }

  .casSelect {
    -webkit-text-fill-color: #333 !important;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    box-sizing: border-box;
    height: 47px;
    line-height: 47px;
  }

  .login-container .el-input input {
    color: #333;
  }

  .login-container .el-input input:-webkit-autofill {
    -webkit-text-fill-color: #333 !important;
    /*border-bottom: 1px solid #ccc;*/
  }


</style>
