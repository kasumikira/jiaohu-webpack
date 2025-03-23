import Exercise from './Exercise'
import { sleep } from './utils'

export default class SingleChoiceExercise extends Exercise {
    static box_identifier = ".lib-single-box"
    
    constructor(element) {
        super(element)
        this.element = element
        this.answer_string = []
        for (const s of element.querySelectorAll('.wy-lib-cs-key')) {
            const keyBlock = s.parentNode.childNodes;
            let p = keyBlock.length - 1;
            while (keyBlock[p] instanceof Comment) p--;
            this.answer_string.push(keyBlock[p].textContent)
        }
    }

    static is_this_exercise(element) {
        let nodes = element.querySelectorAll("lib-single-choice-exercise-cs-stu-info,lib-single-choice-exercise-tb-study")
        return nodes.length > 0
    }

    static async fill_box(s, content = null) {
        if (content === null) {
            const isAlreadyAnswered = Array.from(s.querySelectorAll('.lib-single-item-img')).some(img_div => !img_div.querySelector('img').src.includes('no-choice'));
            if (!isAlreadyAnswered) {
                s.querySelector('.lib-single-item-one').click();
            }
        } else {
            for (const item of s.querySelectorAll('.lib-single-item-one')) {
                for (const conten of content) {
                    const id = item.querySelector(".lib-single-item-order").textContent;
                    if (id === conten + '.') {
                        item.click()
                        await sleep(120)
                        break
                    }
                }
            }
        }
    }
}
