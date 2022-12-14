import { defineStore } from 'pinia'

export const useStore = defineStore('piniaStore', {
    state: () => {
        return {
            // apiRoot: 'http://127.0.0.1:3030',
            apiRoot: 'https://www.ibukisk.top:3031',
            bodyWidth: 0,  //做响应式的nav使用，判断窗口的宽度
            sessionInfo: '',   //判断登录状态，重新渲染nav里面的用户信息的dom
            ifDelMessage: 0,  //删除留言重新渲染dom
            pariseOrCollection: 0,  //点赞或者收藏更新数据
            nickNameLength: 16, //昵称的最大字符数
            articleCommentsAdd: 0,  //文章评论更新后更新dom
        }
    },
    getters: {

    },
    actions: {
        setBodyWidth(val: number) {
            this.bodyWidth = val
        }
    }
}) 