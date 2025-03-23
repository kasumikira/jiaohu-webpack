import Exercise from './Exercise';
import { fill_textbox } from './utils';

export default class FillBlankExercise extends Exercise {
    static box_identifier = ".lib-fill-blank-do-input-left"
    
    constructor(element) {
        super(element)
        this.element = element
        this.answer_string = []

        function find_ans(root) {
            let answer_string = []
            function task(cur) {
                if ('getAttribute' in cur && cur.getAttribute('data-type') === '1') {
                    answer_string.push(cur.textContent)
                } else {
                    for (const child of cur.childNodes) {
                        task(child)
                    }
                }
            }
            task(root)
            return answer_string
        }

        for (const answer_elem of element.querySelectorAll(".lib-edit-score")) {
            const tmp = find_ans(answer_elem, this.answer_string)
            console.log(tmp)
            this.answer_string = this.answer_string.concat(tmp)
        }
    }

    static is_this_exercise(element) {
        let nodes = element.querySelectorAll("lib-fill-blank-exercise-cs-stu-info,lib-fill-blank-exercise-cs-study,lib-cloze-exercise-cs-study,lib-cloze-exercise-cs-stu-info,lib-fill-blank-dialogue-exercise-cs-stu-info,lib-fill-blank-dialogue-exercise-cs-study")
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
        fill_textbox(s, content)
    }
}
