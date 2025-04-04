import Exercise from './Exercise';
import { fill_textbox } from './utils';

export default class FillBlankTableExercise extends Exercise {
    static box_identifier = ".lib-fill-blank-do-input-left"
    
    constructor(element) {
        super(element)
        this.element = element
        this.answer_string = []

        const answerElements = element.querySelectorAll(".lib-edit-score [data-type='1']");        
        this.answer_string = Array.from(answerElements).map(elem => elem.textContent);
        
        console.log(this.answer_string);
    }

    static async is_this_exercise(element) {
        let nodes = element.querySelectorAll("lib-fill-blank-table-exercise-cs-stu-info,lib-fill-blank-table-exercise-cs-study")
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
        const answers = content.split('/')
        const id = Math.floor(answers.length * Math.random())
        console.log(answers, id)
        await fill_textbox(s, answers[id])
    }
}
