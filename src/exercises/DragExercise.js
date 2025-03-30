import { WAIT_AFTER_FILL } from '../config'
import Exercise from './Exercise'
import { sleep, dragTo } from './utils'

export default class DragExercise extends Exercise {
    static box_identifier = ".lib-drag-answer-h"

    constructor(element) {
        super(element)
        this.element = element
        this.answer_string = []
        for (const s of element.querySelectorAll('.lib-drag-stu-info-answer')) {
            this.answer_string.push(s.querySelector('span').textContent)
        }
    }

    static async is_this_exercise(element) {
        let nodes = element.querySelectorAll('lib-drag-drop-one-exercise-cs-stu-info,lib-drag-drop-one-exercise-cs-study')
        return nodes.length > 0
    }

    static async fill_default(element) {
        let async_input = false // 异步输入可能会造成问题，暂时禁用
        const options = element.querySelectorAll('.lib-drag-box')
        let cnt = 0
        if (async_input) {
            let waits = []
            const boxes = element.querySelectorAll(this.box_identifier)
            for (let i = 0; i < boxes.length; i++) {
                if (boxes[i].querySelector('.lib-drop-message') !== null) {
                    if (cnt >= options.length) {
                        return false
                    } else {
                        const fillPromise = dragTo(options[cnt++], boxes[i])
                        waits.push(fillPromise)
                    }
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
        content = content.trim()
        for (const option of options) {
            const option_text = option.querySelector('span').textContent
            if (option_text.startsWith(content)) {
                await dragTo(option, s)
                return true
            }
        }
    }
}