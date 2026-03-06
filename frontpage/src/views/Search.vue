<script setup>
    import { ref,computed,watch } from 'vue'
    import { useRoute } from 'vue-router';
    import { fetchSearchResult } from '@/api/fetch';
    import Songlist from '@/components/songlist.vue';
    const route=useRoute()

    
    const songlist=ref([])
    const loading=ref(false)
    const keyword =computed(()=>(route.query.keyword ||'').toString())
    


    //加载数据(代替onMounted),且处理搜索完还可以搜索的问题
    watch(
        () =>keyword.value,
        async()=>{
            try {
                loading.value=true 
                songlist.value=await fetchSearchResult(keyword)
            } catch (error) {
                console.log("加载数据失败",error);
            }finally{
                loading.value=false
            }
        },
        { 
        immediate: true,  // 立即执行一次
        deep: false       // 不需要深度监听
        }
    )

</script>


<template>
    <div class="page">
        <div class="inner">
            <Songlist :songlist="songlist" :title="'搜索结果(展示100条)'" :tip="`找不到与“${keyword}”相关内容`" :loading="loading" :islist="false" :isindex="false">
                <template #l-title>
                    <p class="keyword" >关键字:{{ keyword }}</p>
                </template>
            </Songlist>
        </div>
    </div>
</template>