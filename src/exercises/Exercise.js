import { async_input } from '../config.js'

export default class Exercise {
    constructor(element) {
        this.element = element
        this.answer_string = null
        this.box_identifier = null
    }

    is_this_exercise() {
        alert("Unknown Error")
    }

    static async fill_box(s, content) {  // 填充题目答案，如果不支持则返回false
        alert("Unknown Error")
    }

    static async fill_default(element) { // 填充默认答案
        let waits = []
        // 获取所有需要填充的元素
        const boxes = element.querySelectorAll(this.box_identifier);
            
        // 处理每个元素
        if (async_input) {
            // 异步输入模式 - 并行启动所有操作
            for (const box of boxes) {
                const fillPromise = this.fill_box(box);
                waits.push(fillPromise);
            }
            
            // 等待所有填充操作完成
            for (const promise of waits) {
                if (await promise === false) {
                    // 如果任何填充操作失败，退出函数
                    return false;
                }
            }
        } else {
            // 同步输入模式 - 一个接一个处理
            for (const box of boxes) {
                const result = await this.fill_box(box);
                if (result === false) {
                    // 如果填充操作失败，立即退出
                    return false;
                }
            }
        }
    }

    async fill() { // 将answer_string填充到题目中
        let id = 0
        let waits = []
        for (const s of this.element.querySelectorAll(this.constructor.box_identifier)) {
            let res
            if (async_input) {
                res = this.constructor.fill_box(s, this.answer_string[id++])
                waits.push(res)
            }
            else {
                res = await this.constructor.fill_box(s, this.answer_string[id++])
                if (res === false) {
                    // alert('不支持的题型')
                    return false
                }
            }

        }
        if (async_input) {
            for (const s of waits) {
                if (await s === false) {
                    // alert('不支持的题型')
                    return false
                }
            }
        }
    }


}