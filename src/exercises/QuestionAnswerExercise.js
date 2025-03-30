import Exercise from './Exercise'
import { fill_textbox } from './utils'

export default class QuestionAnswerExercise extends Exercise {
    static box_identifier = "textarea.lib-textarea-container"
    
    constructor(element) {
        super(element)
        this.answer_string = []
        for (const s of element.querySelectorAll('.wy-lib-cs-key')) {
            const keyBlock = s.parentNode.childNodes;
            let p = keyBlock.length - 1;
            while (keyBlock[p] instanceof Comment) p--;
            this.answer_string.push(keyBlock[p].textContent)
        }
    }

    static async is_this_exercise(element) {
        let nodes = element.querySelectorAll("lib-questions-answers-exercise-cs-study,lib-questions-answers-exercise-cs-stu-info")
        return nodes.length > 0
    }

    static async fill_box(s, content = null) {
        if (content === null) {
            if ((s.value === undefined || s.value === '') && s.textContent === '') {
                content = 'a'
            } else {
                return
            }
        }
        await fill_textbox(s, content)
    }
}
