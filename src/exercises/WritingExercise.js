import Exercise from './Exercise'
import { fill_textbox, creativeAnswerGenerator } from './utils'

export default class WritingExercise extends Exercise {
    static box_identifier = "textarea.lib-textarea-container"
    
    constructor(element) {
        super(element)
        this.answer_string = []
        
        // 获取写作题目内容
        const spans = element.querySelectorAll("span[data-type='1']")
        let questionText = Array.from(spans)
            .map(span => span.textContent.trim())
            .join('\n')
        if (questionText) {
            const words = element.querySelectorAll(".lib-select-word-list-content-item-main")
            if (words?.length > 0) {
                questionText += '\nWords:'
                questionText += Array.from(words)
                    .map(word => word.textContent.trim())
                    .join(' ')
            }
            this.answer_string.push(questionText)
        }
    }

    static async is_this_exercise(element) {
        const nodes = element.querySelectorAll("lib-writing-exercise-cs-study") // to be fixed
        return nodes.length > 0
    }

    static async fill_box(s, question) {
        if (!s || typeof s !== 'object') {
            throw new Error('Invalid textarea element')
        }

        if (s.value !== undefined && s.value !== '' || s.textContent !== '') {
            return
        }

        if (!question) {
            await fill_textbox(s, 'a')
            return
        }

        window.isAI.value = true
        try {
            const completion = await creativeAnswerGenerator(question)
            if (!completion) {
                throw new Error('Failed to generate answer')
            }

            for await (const chunk of completion) {
                if (!chunk?.choices?.[0]?.delta?.content) {
                    continue
                }
                await fill_textbox(s, chunk.choices[0].delta.content)
            }
        } finally {
            window.isAI.value = false
        }
    }
}
