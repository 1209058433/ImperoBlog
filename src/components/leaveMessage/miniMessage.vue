<template>
    <div class="messageBox">
        <div class="headImg">
            <div class="mesageHead" @click="goToPersonalCenter">
                <img :src="pinia.apiRoot + info.headImg" alt="head">
            </div>
        </div>
        <div class="messageContent">
            {{ item.content }}
        </div>
    </div>
</template>

<script setup lang="ts">
import useAxios from '../../hooks/axios/axios';
import { useStore } from '../../store/count'
import { useRouter } from "vue-router";

const pinia = useStore()
const router = useRouter()

type Message = {
    id: number
    account: string
    time: string
    content: string
}

type Props = {
    item: Message
}
const props = defineProps<Props>()


//请求对应account的信息
const { data: res } = await useAxios.get('/userinfo', {
    params: {
        account: props.item.account
    }
})
const info = res.data[0]

const goToPersonalCenter = () => {
    const token = localStorage.getItem('userAccount')
    if (token) {
        const tokenInfo = JSON.parse(window.atob(token))
        if (tokenInfo.account === props.item.account) {   //如果点击的是自己的留言的头像，就跳转到自己的个人中心
            router.push('/personalcenter')
        } else {    //不是就正常跳转到别人的个人中心
            router.push({
                path: '/otherspersonalcenter',
                query: {
                    account: props.item.account
                }
            })
        }

    } else {    //未登录，直接跳转到别人的个人中心
        router.push({
            path: '/otherspersonalcenter',
            query: {
                account: props.item.account
            }
        })
    }
}

</script>

<style scoped lang="less">
.messageBox {
    width: 100%;
    height: 4rem;
    display: flex;
    align-items: center;
    margin: .5rem 0;

    .headImg {
        display: flex;
        justify-content: center;
        align-items: center;

        .mesageHead {
            width: 3.5rem;
            height: 3.5rem;
            background-color: rgb(214, 214, 214);
            border-radius: 50%;
            margin-right: 1rem;
            overflow: hidden;
            transition: all .5s;

            &:hover {
                cursor: pointer;
                transform: rotateZ(360deg);
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

    .messageContent {
        width: 100%;
        padding: .5rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        background-color: rgb(233, 233, 233);
        box-sizing: border-box;
        border-radius: .5rem;
        padding: .5rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

}
</style>