<script setup>
    import { formatetime,handlePlaySong } from '@/utils';
    import { usePlayer } from '@/stores/player';
    import { computed } from 'vue';
    //接收数据
    const props=defineProps({
        customClass:{
            type:String,
            default:""
        },
        title:{
            type:String,
            default:""
        },
        tip:{
            type:String,
            default:"好像什么也没有呢"
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
            default:true
        },
        islist:{
            type:Boolean,
            default:true
        }
    })
    //设置播放列表
    const player=usePlayer()
    const handlesetPlaylist=(id,list)=>{
        player.setPlaylist(list)
        handlePlaySong(id)
    }
</script>

<template>
    <div :class="`${customClass}-style`">
        <div class="title">{{title}}</div>
        <slot name="l-title"></slot>
        <div v-if="loading" class="tip">加载中</div>
        <div v-else-if="!songlist.length" class="tip">{{ tip }}</div>
        <ul v-else class="song-list">
            <button v-show="islist" class="listbtn" @click="handlesetPlaylist(songlist[0],songlist)">▶ 播放全部(所有歌曲加入列表)</button>
            <slot name="deleteallplaylist" :deleteall="songlist"></slot>
            <li @click="handlePlaySong(song,index)" v-for="(song,index) in songlist" :key="song.id" class="song-item">
                <span v-show="isindex" class="song-index">{{index+1}}</span>
                <div class="song-main">
                    <span class="song-name">{{ song.name }}</span>
                    <span class="song-artist">{{ song.artist }}</span>
                </div>
                <div class="song-extra">
                    <div class="song-album">{{ song.album }}</div>
                    <div class="song-duration">{{ formatetime(song.duration) }}</div>
                    <slot name="deleteplaylist" :deleteindex="index"></slot>
                </div>
            </li>
        </ul>
    </div>
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
.listbtn{
    color: white;
    padding: 5px 10px;
    transition: all 0.3s ease;
    background-color: transparent;
    border: 0;
    border-radius: 20px;
    margin: 5px;
}
.listbtn:hover{
    background-color: #ff0000;
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
    white-space: nowrap;      /* 强制单行显示 */
    overflow: hidden;         /* 隐藏超出内容 */
    text-overflow: ellipsis;  /* 超出显示省略号 */
    max-width: 800px;   
}
.song-artist{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
}
.song-album{
    white-space: nowrap;    
    overflow: hidden;       
    text-overflow: ellipsis; 
    margin-right: 10px;
    max-width: 150px;
}   
.song-index{
    width: 30px;
}

.playlist-style{
    .title,.listbtn,.song-album,.song-duration{
        display: none;
    }
    .song-name{
        max-width: 150px;
    }
}
</style>