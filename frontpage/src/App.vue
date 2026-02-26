<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from './stores/user'
import { useRoute,useRouter } from 'vue-router'
import api from './api'

const userstore=useUserStore()
const route=useRoute()
const router=useRouter()

// 搜索关键词
const searchKeyword = ref('')
const handlesearch = () => {
  const keyword =searchKeyword.value.trim()
  if(!keyword)return
  router.push({
    name:"search",
    query:{keyword}
  })
}


//退出登录
const showdropdown=ref(false)
const handleavatarclick=()=>{
    showdropdown.value=!showdropdown.value
}
const handlelogout=async()=>{
    try{
      await api.get('/logout')
      userstore.clearUser()
    }catch(err){
      console.log(("登出失败",err));
    }finally{  
      showdropdown.value=false
      router.push("/")
    }
  }
</script>

<template>
  <div class="app">
    <header class="top-nav">
      <div class="inner">
        <div class="logo">
          <a hidefocus="true" href="/#">网易云音乐</a>
        </div>
        <nav class="nav-links">
          <RouterLink to="/">音乐大厅</RouterLink>
          <RouterLink to="/Mymusic">我的音乐</RouterLink>
        </nav>
        <div class="nav-actions">
          <div class="searchbox">
            <input type="text" class="search-input" placeholder="搜索歌曲/歌手/专辑" v-model="searchKeyword" @keyup.enter="handlesearch" />
          </div>
          <RouterLink v-if="!userstore.isLoggedIn" to="/login" class="login-btn">登录</RouterLink>
          <div v-else class="user-menu">
            <button class="user-avatar" type="button" @click="handleavatarclick">
              <img :src="userstore.user?.avatar" alt="用户头像">
            </button>
            <div v-show="showdropdown"  class="user-dropdown">
              <div class="user-dropdown-header">
                <span class="user-name">{{ userstore.user?.nickname||'我的账号' }}</span>
              </div>
              <button class="user-dropdown-item" type="button" @click="handlelogout">退出登录</button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main class="main-view">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  background-color: rgb(27, 21, 21);
  height: 90px;
}
.inner {
  display: flex;
  justify-content:space-evenly;
  align-items: center;
  height: 90px;
}
.top-nav{
  color: rgb(196, 219, 219);
}
.logo{
  font-size: 24px;
  font-weight: bold;
}
.nav-links a {
  padding: 5px 10px;
  transition: all 0.3s ease;
  border-radius: 20px;
  margin-right: 10px;
}
.nav-links a[href="/"]:hover {
  background-color: #ff0000;
}
.nav-links a[href="/Mymusic"]:hover {
  background-color: #ff0000;
}  
.nav-actions {
  display: flex;
  align-items: center;
}
.searchbox {
  position: relative;
  margin-right: 20px;
}
.search-input {
  padding: 5px 10px;
  border-radius: 20px;
  border: none;
}
.login-btn {
  padding: 5px 15px;
  border-radius: 20px;
  background-color: #ff0000;
  color: #fff;
}
.login-btn:hover {
  transition: all 0.3s ease;
  background-color: #ff4d4d;
}
.user-avatar{
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  cursor: pointer;
}
.user-avatar img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.user-dropdown{
  border-radius: 5px;
  position: absolute;
  top: 60px;
  width: 100px;
  background: rgb(53, 43, 43);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  overflow: hidden;
}
.user-dropdown-header {
  padding: 10px;
}

.user-name {
  display: block;
  margin-bottom: 4px;
  text-align: center;
}

.user-dropdown-item {
  display: block;
  width: 100%;
  padding: 10px;
  text-decoration: none;
  background: none;
  border: none;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  color: rgb(196, 219, 219)
}

</style>