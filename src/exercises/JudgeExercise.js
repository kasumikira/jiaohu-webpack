import Exercise from './Exercise'
import { sleep } from './utils'

export default class JudgeExercise extends Exercise {
    static box_identifier = ".lib-judge-right-item"

    constructor(element) {
        super(element)
        this.element = element
        this.answer_string = []
        for (const s of element.querySelectorAll('.lib-judge-info-text')) {
            this.answer_string.push(s.textContent)
        }
    }

    static async is_this_exercise(element) {
        let nodes = element.querySelectorAll("lib-judge-exercise-cs-stu-info,lib-judge-exercise-cs-study")
        return nodes.length > 0
    }

    static async fill_box(s, content = null) {
        const radios = s.querySelectorAll(".lib-judge-radio");

        if (content === null) {
            // 检查是否已经有答案
            const isAlreadyAnswered = Array.from(radios).some(radio => radio.querySelector('img').hidden === false);
            if (!isAlreadyAnswered) {
                radios[0].click();
            }
        } else {
            content = content.trim()
            if (content === 'T' || content === 'A') {
                radios[0].click()
            } else if (content === 'F' || content === 'D') {
                radios[1].click()
            } else if (content === 'NI') {
                radios[2].click()
            } else {
                return false
            }
        }
    }

}