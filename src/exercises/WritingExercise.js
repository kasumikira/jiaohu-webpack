import Exercise from './Exercise'
import { fill_textbox, creativeAnswerGenerator } from './utils'

export default class WritingExercise extends Exercise {
    static box_identifier = "textarea.lib-textarea-container"
    
    constructor(element) {
        super(element)
        this.answer_string = []
        
        // 获取写作题目内容
        const directiveContents = element.querySelectorAll(".exercise-directiveContent")
        for (const content of directiveContents) {
            const spans = content.querySelectorAll('span')
            const questionText = Array.from(spans)
                .map(span => span.textContent.trim())
                .join('\n')
            if (questionText) {
                this.answer_string.push(questionText)
            }
        }
    }

    static async is_this_exercise(element) {
        const nodes = element.querySelectorAll("lib-writing-exercise-cs-study") // to be fixed
        return nodes.length > 0
    }

    static async fill_box(s, question) {
        if (s.value !== undefined && s.value !== '' || s.textContent !== '') {
            return
        }

        if (!question) {
            await fill_textbox(s,'a')
        } else {
            try {
                const completion = await creativeAnswerGenerator(question)
                for await (const chunk of completion) {
                    if (chunk.choices[0].delta.content) {
                        await fill_textbox(s, chunk.choices[0].delta.content)
                    }
                }
                return true
            } catch (error) {
                console.error('Error generating answer:', error)
                return false
            }
        }
    }
}
