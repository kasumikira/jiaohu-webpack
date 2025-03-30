import { WAIT_AFTER_FILL } from '../config.js'
import { sleep } from '../utils.js'

export default class Exercise {
    constructor(element) {
        this.element = element
        this.answer_string = null
        this.box_identifier = null //填充区域的标识符
    }

    async is_this_exercise() {
        alert("Unknown Error")
    }

    static async fill_box(s, content) {  // 填充题目答案，如果不支持则返回false
        alert("Unknown Error")
    }

    static async fill_default(element) { // 填充默认答案
        // 获取所有需要填充的元素
        const boxes = element.querySelectorAll(this.box_identifier);
            
        // 处理每个元素
        if (window.async_input) {
            // 异步输入模式 - 并行启动所有操作
            const waits = Array.from(boxes).map(box => this.fill_box(box))

            // 等待所有填充操作完成            
            if ((await Promise.all(waits)).some(bool => bool === false)) {
                return false
            }
        } else {
            // 同步输入模式 - 一个接一个处理
            for (const box of boxes) {
                const result = await this.fill_box(box);
                if (result === false) {
                    // 如果填充操作失败，立即退出
                    return false;
                }
                await sleep(WAIT_AFTER_FILL)
            }
        }
        return true
    }

    async fill() { // 将answer_string填充到题目中
        let id = 0
        let waits = []
        for (const s of this.element.querySelectorAll(this.constructor.box_identifier)) {
            let res
            if (window.async_input) {
                res = this.constructor.fill_box(s, this.answer_string[id++])
                waits.push(res)
            }
            else {
                res = await this.constructor.fill_box(s, this.answer_string[id++])
                if (res === false) {
                    // alert('不支持的题型')
                    return false
                }
                await sleep(WAIT_AFTER_FILL)
            }

        }
        if (window.async_input) {
            if ((await Promise.all(waits)).some(bool => !bool)) {
                // alert('不支持的题型')
                return false
            }
        }
    }


}