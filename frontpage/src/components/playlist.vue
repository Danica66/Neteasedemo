<script setup>
    import { ref } from 'vue';
    import songlist from './songlist.vue';
    import { usePlayer } from '@/stores/player';

    const player=usePlayer()



    const isopen=ref(false)
    const handleshowslider=()=>{
        isopen.value=!isopen.value
    }





</script>
<template>
    <div class="slider-main" :class="{ open: isopen }">
        <div class="slider-smallclick" @click="handleshowslider">
            <div class="title">播放列表</div>
        </div>
        <div v-show="isopen" class="slider-playlist">
            <songlist customClass="playlist" :songlist="player.playlist||[]">
                <template #deleteallplaylist>
                    <button class="listbtn" @click="player.deletePlaylist">删除全部</button>
                </template>
                <template #deleteplaylist="index">
                    <button class="deletebtn" @click.stop="player.deletePlaylistByIndex(index.deleteindex)">❌</button>
                </template>
            </songlist>
        </div>
    </div>
</template>
<style scoped>
.deletebtn{
    background-color: transparent;
    border: none;
}
.listbtn{
    color: white;
    padding: 5px 10px;
    background-color: transparent;
    border: 0;
    border-radius: 20px;
    margin: 5px;
}
.listbtn:hover{
    background-color: #ff0000;
}
.slider-main {
    position: fixed;  /* 改为 fixed 更好 */
    width: 320px;      /* 减小宽度更合理 */
    height: 100vh;     /* 全屏高度 */
    top: 0;
    right: -320px;     /* 初始隐藏（完全在屏幕外） */
    transition: right 0.3s ease; 
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
    background-color: #3f3030;
    z-index: 1000;
}

.slider-main.open {
    right: 0;  /* 显示时滑入 */
}

.slider-smallclick {
    position: absolute;
    left: -40px;      /* 把触发器放在左侧外部 */
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 80px;
    background-color: #181a1b;
    border-radius: 8px 0 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: -2px 0 5px rgba(0,0,0,0.2);
}

.slider-smallclick .title {
    writing-mode: vertical-rl;  /* 文字竖排 */
    text-orientation: mixed;
    font-size: 14px;
    letter-spacing: 2px;
}

.slider-playlist {
    height: 100%;
    padding: 20px;
    overflow-y: auto; /*加滚动条 */
    scrollbar-width: none;/*隐藏滚动条 */
}
</style>