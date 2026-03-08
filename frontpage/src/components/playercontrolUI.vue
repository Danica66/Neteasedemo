<script setup>
    import { usePlayer } from '@/stores/player';
    import { formatetime } from '@/utils';
    const player=usePlayer()
</script>
<template>
    <div class="player-controls">
        <div class="controls-main">
            <button class="btn-circle btn-small" @click="player.changePlaymode">{{ player.Playmode===1?'🔂':player.Playmode===2?'🔀':'🔁' }}</button>
            <button class="btn-circle btn-small" @click="player.upPlaylist">&#9198;</button>
            <button class="btn-circle btn-large" @click="player.Toggleplay">{{ player.isPlaying?"&#9208;":"&#9205;" }}</button>
            <button class="btn-circle btn-small" @click="player.downPlaylist">&#9197;</button>
            <button class="btn-circle btn-small" @click="player.addPlaylist(player.currentsong)">➕</button>
        </div>
        <div class="progress-wrap">
            <span class="time-label">{{ formatetime(player.currenttime*1000) }}</span>
            <div class="progress-bar" @click="player.Progressclick">
                <div class="progress-inner" :style="{width:player.duration ? `${(player.currenttime/player.duration)*100}%` : '0%' }"></div>
            </div>
            <span class="time-label">{{ formatetime(player.duration*1000) }}</span>
        </div>
    </div>
</template>
<style scoped>
.player-controls{
    background: transparent;
    width: 100%;
    padding: 16px 24px 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.controls-main{
    display:flex;
    justify-content: center;
    align-items:center;
    gap:24px;
}
.btn-circle{
    border-radius: 50%;
    border:none;
    cursor: pointer;
    background: rgb(54, 41, 41);
    color: #cbc4c4;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 18px rgba(0,0,0,0.4);
}
.btn-large{
    width: 56px;
    height: 56px;
    font-size: 22px;
}
.btn-small{
    width: 40px;
    height: 40px;
    font-size: 18px;
}
.btn-circle:hover{
    transform:translateY(-1px);
}
.progress-wrap{
    display:flex;
    align-items:center;
    gap:12px;
}
.time-label{
    font-size: 12px;
    color:#c0c0c0;
}
.progress-bar{
    flex:1;
    height: 10px;
    border-radius: 999px;
    background: rgba(85, 78, 78, 0.927);
    overflow:hidden;
}
.progress-inner{
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg,#ff4b2b,#ff416c);
}
.btn-text,.extra-left,.extra-right,.audio-hidden{
    display: none;
}
.btn-text:hover{
    color:#fff;
}
</style>