import Exercise from './Exercise'
import { sleep } from './utils'

export default class AudioExercise extends Exercise {
    static box_identifier = ".lib-oral-shadow"
    
    constructor(element) {
        super(element)
        this.element = element
        this.answer_string = []
    }

    static async is_this_exercise(element) {
        let nodes = element.querySelectorAll("lib-oral-brief-exercise-cs-study,lib-oral-brief-exercise-cs-stu-info")
        return nodes.length > 0
    }

    static lock

    static async fill_box(s, content = '') {  // 这里的content是一个空字符串，因为音频题目不需要填充
        let t = setInterval(() => {
            if (this.lock !== true) {
                clearInterval(t)
                this.lock = true
                const btn = s.querySelector('img')
                btn.click()
                setTimeout(() => {
                    const btn2 = s.querySelector('img')
                    btn2.click()
                    console.log('go')
                }, 2000)
            }
        }, 500)
        await sleep(500)
        while (s.querySelector('img').src.includes('gif')) {
            await sleep(500)
        }
        this.lock = false
    }
}
