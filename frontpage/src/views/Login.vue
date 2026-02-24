<script setup>
import {ref,onMounted,watch,onUnmounted} from 'vue'
import api from "../api"
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router=useRouter()
const userstore=useUserStore()

//刷新登录状态,防止小bug
const refreshlogin=async()=>{
    try {
        await api.get('/login/refresh')
    } catch (error) {
        console.log(err);
        
    }
}

//点击空白返回
const handleclick=(event)=>{
    if(event.target===event.currentTarget){
        router.push("/")
    }
}

//获取二维码登录key
const loginKey=ref('')
const fetchLoginKey=async ()=>{
    try{
        const res = await api.get("/login/qr/key", {
            params: {
                timestamp: Date.now()  // 强制刷新
            }
        })
        loginKey.value=res.data?.unikey||''
        console.log(loginKey.value);
        
    }catch(err){
        console.log("获取二维码登录key失败",err);
        loginKey.value=''
    }
}


//根据key生成图片
const qrImg=ref('')
const fetchQrImage=async(key)=>{
    try{
        const res=await api.get("/login/qr/create",{
        key,
        timestamp:Date.now(),
        qrimg:true
    })
    qrImg.value=res.data?.qrimg||''
    }catch(err){
        console.log("获取二维码图片失败",err)
        qrImg.value=""
    }
}



//轮询定时器
const qrCheckTimer=ref(null)

//轮询状态,成功保存信息
const startQrcheck=(key)=>{
    if(qrCheckTimer.value){
        clearInterval(qrCheckTimer.value)
    }
    qrCheckTimer.value=setInterval(async()=>{
        try{
            const res=await api.get("/login/qr/check",{
                key,
                timestamp:Date.now(),
                ua:"PC"
            })             
            console.log(res);
            if(res.code===803){
                clearInterval(qrCheckTimer.value)
                qrCheckTimer.value=null
                router.push("/")
            }
            try{
                const statusres =await api.get("/login/status",{
                    timestamp:Date.now(),
                    ua:"pc"
                })             
                const profile=statusres.data?.profile||statusres.profile||statusres.account
                if(profile){
                    userstore.setUser({
                        id:profile.userId,
                        nickname:profile.nickname,
                        avatar:profile.avatarUrl
                    })
                }
            }catch(err){
                console.log("获取登录状态失败",err)
            }        
        }catch(err){
            console.log("二维码生成失败");        
        }
    },1000)
}

//点击刷新二维码
const handlerefreshqrimg=async () => {
    // 清理旧的轮询
    if (qrCheckTimer.value) {
        clearInterval(qrCheckTimer.value)
        qrCheckTimer.value = null
    }
    
    // 清空当前二维码
    qrImg.value = ''
    
    // 等待一下
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 重新获取 key 和二维码
    await fetchLoginKey()
}

//监听得到key生成图片
watch(
    ()=>loginKey.value,
    (val)=>{
        if(val){
            fetchQrImage(val)
        }
    }
)

//监听图片生成后轮询登录状态
watch(
    ()=>qrImg.value,
    (val)=>{
        if(val&&loginKey.value)
        startQrcheck(loginKey.value)
    }
)


onMounted(()=>{
    refreshlogin()
    fetchLoginKey()
})
//清除轮询器
onUnmounted(()=>{
    if(qrCheckTimer.value){
        clearInterval(qrCheckTimer.value)
        qrCheckTimer.value=null;
    }
})


</script>


<template>
    <div class="login-overlay" @click="handleclick">
        <div class="login-modal">
            <div class="login-header">
                <h2>扫码登录</h2>
                <p>网易云音乐app扫码登录,贼方便</p>
            </div>
            <div class="login-body">
                <div class="qrcode-box">
                    <div class="qrcode-placeholder">
                        <template v-if="qrImg">
                            <img :src="qrImg" alt="登录二维码" @click="handlerefreshqrimg">
                        </template>
                        <template v-else>
                            <span>二维码加载中...</span>
                        </template>
                    </div>
                    <p class="qrcode-tip">打开网易云音乐app</p>
                    <p class="qrcode-tip">点击图片刷新二维码</p>
                </div>
                <ul class="login-features">
                    <li>好处1:Danica自制更安全</li>
                    <li>好处2:本地部署个性化页面</li>
                    <li>好处3:不会编了,赶紧扫吧!</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<style scoped>
.login-overlay{
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}
.login-modal{
    width: 420px;
    padding: 24px 32px 32px;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    block-size: border-box;
}
.login-header h2{
    margin: 0;
    font-size: 20px;
    color:#333;
}
.login-header p{
    margin: 8px 0 0;
    font-size: 13px;
    color:#666;
}
.login-body{
    margin-top: 20px;
    display: flex;
    gap: 20px;
}
.qrcode-box{
    text-align: center;
}
.qrcode-placeholder{
    width: 140px;
    height: 140px;
    border-radius: 4px;
    background: #f5f5f5;
    border: 1px solid #e1e1e1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 14px;
}
.qrcode-placeholder img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.qrcode-tip{
    margin-top: 8px;
    font-size: 12px;
    color: #666;
}
.login-features{
    padding: 0;
    margin: 0;
    font-size: 13px;
    color: #555;
}
.login-features li + li{
    margin-top: 8px;
}
</style>