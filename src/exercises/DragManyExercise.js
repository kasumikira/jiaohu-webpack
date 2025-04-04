import { WAIT_AFTER_FILL } from '../config'
import Exercise from './Exercise'
import { sleep, dragTo } from './utils'

export default class DragManyExercise extends Exercise {
    static box_identifier = ".lib-drag-answer-h"

    constructor(element) {
        super(element)
        this.element = element
        this.answer_string = []
        for (const s of element.querySelectorAll('.lib-drag-stu-info-answer')) {
            this.answer_string.push(Array.from(s.querySelectorAll('span')).map((item) => item.textContent))
        }
    }

    static async is_this_exercise(element) {
        let nodes = element.querySelectorAll('lib-drag-drop-many-exercise-cs-stu-info,lib-drag-drop-many-exercise-cs-study')
        return nodes.length > 0
    }

    static async fill_default(element) {
        document.querySelector(".lib-drag-block").scrollTop = 0
        let async_input = false // 异步输入可能会造成问题，暂时禁用
        const options = element.querySelectorAll('.lib-drag-box')
        let cnt = 0
        if (async_input) {
            let waits = []
            const boxes = element.querySelectorAll(this.box_identifier)
            for (let i = 0; i < boxes.length; i++) {
                if (boxes[i].querySelector('.lib-drop-message') !== null) {
                    if (cnt >= options.length) {
                        cnt = 0
                    }
                    const fillPromise = dragTo(options[cnt++], boxes[i])
                    waits.push(fillPromise)
                }
            }
            for (const promise of waits) {
                await promise
            }
            return true
        } else {
            const boxes = element.querySelectorAll(this.box_identifier)
            console.log(boxes)
            for (let i = 0; i < boxes.length; i++) {
                if (boxes[i].querySelector('.lib-drop-message') !== null) {
                    if (cnt >= options.length) {
                        return false
                    } else {
                        await dragTo(options[cnt++], boxes[i])
                        await sleep(WAIT_AFTER_FILL)
                    }
                }
            }
            return true
        }
    }

    static async fill_box(s, content) {
        const options = document.querySelectorAll('.lib-drag-box')
        console.log(options)
        for (const option of options) {
            const option_text = option.querySelector('span').textContent
            if (content.some((content_item) => option_text.startsWith(content_item.trim()))) {
                await dragTo(option, s)
            }
        }
        return true
    }
}
