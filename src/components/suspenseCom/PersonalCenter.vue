<template>
    <div class="personalCenrer">
        <div class="personalCoverImg">
            <img :src="pinia.apiRoot + userInfo.personalCover" alt="personalCoverImg">
        </div>
        <userInfoCom></userInfoCom>
        <div class="userFunction">
            <el-tabs v-model="activeName" class="demo-tabs">
                <el-tab-pane label="我的收藏" name="first" class="list" :lazy="true">
                    <div class="ifHave">
                        <div class="boxex">
                            <Suspense v-for="item in showArticles.showArticle" :key="item.id">
                                <template #default>
                                    <ArticleBox :info="item" class="comBoxex">
                                    </ArticleBox>
                                </template>

                                <template #fallback>
                                    <Loading></Loading>
                                </template>
                            </Suspense>
                        </div>
                        <div class="pageInfo">
                            <div class="allPage">共有{{ collectionArray.length }}条数据</div>
                            <el-pagination background layout="prev, pager, next" :page-count="pages.page.length"
                                :current-page="pages.nowPage" @update:current-page="updataCollectionPage" />
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label=" 我发布的" name="second" class="list" :lazy="true">
                    <div class="ifHave">
                        <div class="boxex">
                            <Suspense v-for="item in showPush.showArticle" :key="item.id">
                                <template #default>
                                    <ArticleBox :info="item" class="comBoxex">
                                    </ArticleBox>
                                </template>

                                <template #fallback>
                                    <Loading></Loading>
                                </template>
                            </Suspense>
                        </div>
                        <div class="pageInfo">
                            <div class="allPage">共有{{ pushArticleNum.length }}条数据</div>
                            <el-pagination background layout="prev, pager, next" :page-count="push.page.length"
                                :current-page="push.nowPage" @update:current-page="updataPushPage" />
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import useAxios from '../../hooks/axios/axios';
import { useStore } from "../../store/count";
import { ref, watchEffect, reactive, defineAsyncComponent } from 'vue'
import userInfoCom from '../personalCenter/userInfo.vue';
import Loading from "@/components/loading/loading2.vue";
const ArticleBox = defineAsyncComponent(() => import('../articleBox/articleBox.vue'))

const pinia = useStore()
//请求用户信息
const tokenInfo = JSON.parse(window.atob(localStorage.getItem('userAccount')!))
const { data: res } = await useAxios.get('/userinfo', {
    params: {
        account: tokenInfo.account
    }
})
const userInfo = res.data[0]


//收藏卡片
const activeName = ref('first')
//用户收藏的文章列表
const collectionList = userInfo.collectionArticles
//要传给articlebox组件的文章列表信息数组  收藏文章的列表
const collectionArray = new Array
collectionList.map(async (item: string) => {
    const { data: res } = await useAxios.get('/getidarticle', {
        params: {
            id: item
        }
    })
    collectionArray.push(res.data)
})

//发布的文章
const { data: list } = await useAxios.get('/pusharticlenum', {
    params: {
        account: userInfo.account
    }
})
const pushArticleNum = list.data


//分页组件分页
//请求收藏的文章列表(上面有了)
//应该有的页数
type Page = {
    page: Array<number>
    pageNums: number
    nowPage: number
}
let pages = reactive<Page>({
    page: [],
    pageNums: collectionArray.length,
    nowPage: 1
})
// 当前展示页
//不能使用let来定义reactive，这样在重新赋值的时候内存地址会变，无法实现响应式
const showArticles = reactive({
    showArticle: collectionArray.slice(6 * (pages.nowPage - 1), 6 * (pages.nowPage - 1) + 6)
})
watchEffect(() => {
    //先清空一下数组，再计算页数
    pages.page = []
    if (pages.pageNums % 6 === 0) {
        for (let i = 0; i < Math.floor(pages.pageNums / 6); i++) {
            pages.page.push(i + 1)
        }
    } else {
        for (let i = 0; i < Math.floor(pages.pageNums / 6) + 1; i++) {
            pages.page.push(i + 1)
        }
    }

    showArticles.showArticle = collectionArray.slice(6 * (pages.nowPage - 1), 6 * (pages.nowPage - 1) + 6)  //页码更新后更新显示的文章内容
})
const updataCollectionPage = (val: number) => {
    pages.nowPage = val
}

//发布组件分页
//请求发布的文章列表(有了)  pushArticleNum
let push = reactive<Page>({
    page: [],
    pageNums: pushArticleNum.length,
    nowPage: 1
})
// 当前展示页
//不能使用let来定义reactive，这样在重新赋值的时候内存地址会变，无法实现响应式
const showPush = reactive({
    showArticle: pushArticleNum.slice(6 * (push.nowPage - 1), 6 * (push.nowPage - 1) + 6)
})

watchEffect(() => {
    //先清空一下数组，再计算页数
    push.page = []
    if (push.pageNums % 6 === 0) {
        for (let i = 0; i < Math.floor(push.pageNums / 6); i++) {
            push.page.push(i + 1)
        }
    } else {
        for (let i = 0; i < Math.floor(push.pageNums / 6) + 1; i++) {
            push.page.push(i + 1)
        }
    }
    showPush.showArticle = pushArticleNum.slice(6 * (push.nowPage - 1), 6 * (push.nowPage - 1) + 6)  //页码更新后更新显示的文章内容
})

const updataPushPage = (val: number) => {
    push.nowPage = val
}



</script>

<style scoped lang="less">
.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;

    .list {
        .ifHave {
            .boxex {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                column-gap: 1rem;
                row-gap: 1rem;
                justify-content: center;

                .comBoxex {
                    width: 100%;
                }
            }

            .pageInfo {
                margin-top: 2rem;

                .allPage {
                    font-size: 1.4rem;
                    margin: 1rem;
                }
            }
        }
    }
}

.personalCenrer {
    width: 70%;
    margin: 4.8rem auto;
    border-radius: 1rem;
    overflow: hidden;
    background-color: var(--white-background-color);
    display: flex;
    flex-direction: column;

    .personalCoverImg {
        width: 100%;
        height: 25rem;

        img {
            object-fit: cover;
            width: 100%;
            height: 100%;
        }
    }


    .userFunction {
        box-sizing: border-box;
        padding: 1rem;
    }
}

@media screen and (max-width: 800px) {
    .personalCenrer {
        width: 100%;
        border: none;
    }


    .demo-tabs>.el-tabs__content {
        .list {
            .ifHave {
                .boxex {
                    grid-template-columns: 1fr;
                }
            }
        }
    }
}
</style>