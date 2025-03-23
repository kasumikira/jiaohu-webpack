import { sleep, isLetter, isDigit } from '../utils'

export * from '../utils'

export async function fill_textbox(s, content) {
    s.click()
    await sleep(100)
    for (let ch of content) {
        s.textContent += ch
        s.value += ch

        if (isLetter(ch)) {
            const keyDownEvent = new KeyboardEvent('keydown', {
                key: ch,
                code: 'Key' + ch.toUpperCase(),
                bubbles: true
            });
            s.dispatchEvent(keyDownEvent);

            const inputEvent = new InputEvent('input', {
                data: ch,
                bubbles: true
            });
            s.dispatchEvent(inputEvent);

        } else if (isDigit(ch)) {
            const keyDownEvent = new KeyboardEvent('keydown', {
                key: ch,
                code: 'Digit' + ch,
                bubbles: true
            });
            s.dispatchEvent(keyDownEvent);

            const inputEvent = new InputEvent('input', {
                data: ch,
                bubbles: true
            });
            s.dispatchEvent(inputEvent);

        } else {
            const keyDownEvent = new KeyboardEvent('keydown', {
                key: ch,
                code: 'Space',
                bubbles: true
            });
            s.dispatchEvent(keyDownEvent);

            const inputEvent = new InputEvent('input', {
                data: ch,
                bubbles: true
            });
            s.dispatchEvent(inputEvent);

        }
        await sleep(20)
    }
    const changeEvent = new Event('change', { bubbles: true })
    s.dispatchEvent(changeEvent)
}
