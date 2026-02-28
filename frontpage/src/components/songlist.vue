<script setup>
    import { formatetime,handlePlaySong } from '@/utils';

    //接收数据
    const props=defineProps({
        title:{
            type:String,
            default:""
        },
        tip:{
            type:String,
            default:"好像什么也没有呢,刷新一下试试"
        },
        songlist:{
            type:Array,
            default:()=>[]
        },
        loading:{
            type:Boolean,
            default:false
        },
        isindex:{
            type:Boolean,
            default:false
        }
    })


</script>

<template>
    <div class="title">{{title}}</div>
    <slot name="l-title"></slot>
    <div v-if="loading" class="tip">加载中</div>
    <div v-else-if="!songlist.length" class="tip">{{ tip }}</div>
    <ul v-else class="song-list">
        <li @click="handlePlaySong(song.id)" v-for="(song,index) in songlist" :key="song.id" class="song-item">
            <span v-show="isindex" class="song-index">{{index+1}}</span>
            <div class="song-main">
                <span class="song-name">{{ song.name }}</span>
                <span class="song-artist">{{ song.artist }}</span>
            </div>
            <div class="song-extra">
                <div class="song-album">{{ song.album }}</div>
                <div class="song-duration">{{ formatetime(song.duration) }}</div>
            </div>
        </li>
    </ul>
</template>


<style scoped>
.tip{
    font-size: 18px;
    text-align: center;
    margin-top: 40px;
}
.title{
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
}
.keyword{
    margin-bottom: 20px;
}
.song-item{
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid rgb(46, 7, 7);
    font-size: 14px;
}
.song-item:hover{
    background-color: rgba(77, 77, 77, 0.637);
    transition: background-color 0.3s ease;
    color: white;
}
.song-main{
    flex: 1;
    display: flex;
    flex-direction: column;
}
.song-extra{
    display: flex;
}
.song-name{
    font-size: 16px;
}
.song-album{
    margin-right: 10px;
}
.song-index{
    width: 30px;
}
</style>