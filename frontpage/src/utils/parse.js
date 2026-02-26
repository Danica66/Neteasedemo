//解析歌手
export const parseartist=(artists,joinstr)=>{
    if (!artists || !Array.isArray(artists) || artists.length === 0) {
    return '未知歌手'
  }
  return artists.map(a => a.name).join(joinstr)
}
//解析歌曲
export const parsesong = (song,arjoinstr='/') => {
  if (!song) return null
  
  return {
    id: song.id,
    name: song.name || '未知歌曲',
    // 统一处理 ar 或 artists 字段
    artist: parseartist(song.ar || song.artists,arjoinstr),
    duration: song.dt || song.duration || 0,
    album: (song.al || song.album)?.name || '未知专辑',
    cover: (song.al || song.album || song )?.picUrl
  }||[]
}

//解析歌曲数组
export const parsesonglist=(songs=[])=>{
    return songs.map(parsesong).filter(s => s !== null)
}


//解析歌单
export const parseplaylist = (item) => {
  if (!item) return null
  
  return {
    id: item.id,
    name: item.name,
    cover: item.picUrl || item.coverImgUrl,  // 歌单封面字段可能不同
    trackCount: item.trackCount || 0,         // 歌曲数量
    desc: item.copywriter || item.description || ''  // 描述
  }
}

//解析歌单数组
export const parseplaylistList = (playlists = []) => {
  return playlists.map(parseplaylist).filter(p => p !== null)
}

//解析歌词
export const parselyric=(raw='')=>{
    return raw.split("\n").map((line)=>line.trim()).filter((line)=>line).map((line)=>{
        const text=line.replace(/^\[[^\]]*]/g,'').trim()
        return text||'~♫♫♫~'
    })
}

//解析时间戳[mm:ss.ms]
export const parsetimestamp=(raw='')=>{
    return raw.split("\n").map(line => line.trim()).filter(line => line).map(line => {
        const match = line.match(/^\[[^\]]+\]/)
        return match[0]
    })
}
