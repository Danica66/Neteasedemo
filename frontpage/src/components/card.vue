<script setup>
    const props=defineProps({
        title:{
            type:String,
            default:""
        },
        itemlist:{
            type:Array,
            default:()=>[]
        },
        handle:{
            type:Function,
            default:()=>{}
        },
        customClass:{
            type:String,
            default:""
        }
    })
</script>
<template>
    <div :class="`${customClass}-style`">
        <h2 class="title">{{title}}</h2>
        <div v-if="customClass==='mymusiclist'&&!itemlist.length" class="tip">没歌</div>
        <ul v-else class="item-list">
            <li v-for="item in itemlist" :key="item.id" class="item-item" @click="handle(item.id)">
                <div class="cover">
                    <img :src="item.cover" :alt="item.title||item.name" class="cover-image" />
                </div>
                <div class="info">
                    <p class="item-title">{{ item.name }}</p>
                    <p v-if="customClass==='mymusiclist'" class="item-p">共 {{item.trackCount}} 首</p>
                    <p v-else class="item-p">{{ item.desc||item.artist}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<style scoped>
/* 推荐歌单 */
.playlist-style{
    .title {
        margin: 20px 0 10px;
    }
    .item-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .item-item {
        width: 220px;
        height: 310px;
        margin-right: 1px;
    }
    .cover {
        margin-bottom: 10px;
    }
    .cover-image {
        width: 100%;
        height: 220px;
        border-radius: 10px;
    }
    .cover-image:hover {
        transform: scale(1.05);
        transition: all 0.3s ease;
    }
    .info {
        text-align: center;
    }
    .item-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
    }
    .item-p {
        font-size: 14px;
        color: #666;
    }
}
/* 推荐新音乐 */
.newsonglist-style{
    .title{
        margin: 30px 0 15px;
    }
    .item-list {
        display: flex;
        flex-direction: column;
        flex-wrap:wrap;
        justify-content: space-between;
        height: 400px;
    }
    .item-item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        width: 48%;
    }
    .item-item:hover {
        background-color: rgba(125, 124, 124, 0.1);
        transition: all 0.3s ease;
        border-radius: 5px;
    }
    .cover {
        width: 60px;
        height: 60px;
        margin-right: 15px;
    }
    .cover-image{
        width: 100%;
        height: 100%;
        border-radius: 5px;
    }
    .info {
        font-size: small;
    }
    .item-title {
        font-weight: bold; 
        margin-bottom: 5px;
    }
    .item-p{
        color: #666;
    }
}

/* 我的音乐 */
.mymusiclist-style{
    .title{
        margin: 20px 0 10px;
    }
    .tip{
        font-size: 18px;
        text-align: center;
        margin-top: 40px;
    }
    .item-list{
        display: flex;
        flex-wrap: wrap;
        gap:20px
    }
    .item-item{
        width: 270px;
        height: 360px;
        background: #f7f1f1;
        align-items: center;
        border-radius: 5px;
        box-shadow: 1px 1px 5px black;
    }
    .item-item:hover {
        cursor: pointer;
        transform: scale(1.05);
        transition: all 0.3s ease;
    }   
    .cover-image{
        width: 100%;
        height: 100%;
        border-radius: 5px 5px 0 0;
    }
    .info{
        padding: 10px;
        height: 100px;
    }
}


</style>