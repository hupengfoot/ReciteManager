<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img src="@/assets/avatar/header.png" class="user-avatar">
        <span class="name">{{$store.getters.name}}</span>
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <el-dropdown-item divided>
          <span style="display:block;" @click="editPassword">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <reset-password v-if="isDialog" @close="isDialog=false"></reset-password>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import resetPassword from '@/components/dialog/resetPassword'
import store from '@/store'

export default {
  data() {
    return {
      isDialog:false
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    resetPassword,
  },
  computed: {
    ...mapGetters([
      'sidebar',
    ])
  },
  methods: {
    editPassword(){
      this.isDialog=true;
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .name{
        position:relative;
        top:-10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top:19px;
        font-size: 12px;
      }
    }
  }
}
</style>

