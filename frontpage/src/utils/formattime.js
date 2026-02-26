/**
 * 格式化时间
 * @param {number} duration 时长(毫秒)
 * @param {number} st 类型标记: 1返回时间戳格式，其他返回mm:ss格式
 * @returns {string} 格式化后的时间
 */
export const formatetime=(duration,st=0)=>{
    const minutes=Math.floor(duration/1000/60)
    const seconds=Math.floor((duration/1000)%60)
    const mm = minutes.toString().padStart(2, '0')
    const ss = seconds.toString().padStart(2, '0')
    if(st===1){
        const milliseconds = Math.floor((duration % 1) * 1000)
        const ms = milliseconds.toString().padStart(3, '0') 
        return `[${mm}:${ss}.${ms}]`
    }
    return `${mm}:${ss}`
}