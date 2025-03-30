import { sleep, isLetter, isDigit } from '../utils'
import OpenAI from 'openai'

export * from '../utils'

let deepseek;

export function initDeepSeek(deepseekKey) {
    deepseek = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: deepseekKey,
        dangerouslyAllowBrowser: true,
    });
}

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


function mouseEvent(div, type, pos) {
    let x = 0;
    let y = 0;

    if(pos === undefined) {
        let rect = div.getBoundingClientRect();
        x = (rect.x*2 + rect.width)/2;
        y = (rect.y*2 + rect.height)/2;
    } else {
        x = pos.x;
        y = pos.y;
    }

    const mouseEvent = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        detail: 0,
        screenX: x,
        screenY: y,
        clientX: x,
        clientY: y,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: null
    });
    div.dispatchEvent(mouseEvent);
}

export async function dragTo(from, to) {
    const dragBlock = document.querySelector(".lib-drag-block");
    await sleep(200);
    mouseEvent(from, 'mousedown');
    await sleep(100);
    mouseEvent(to, 'mousemove');
    await sleep(10);
    mouseEvent(to, 'mousemove');
    mouseEvent(to, 'mouseup');
    await sleep(400);
    document.documentElement.scrollTop = dragBlock.offsetTop;
    const offset = to.offsetTop + to.clientHeight - dragBlock.offsetTop;
    dragBlock.scrollTop = offset;
    await sleep(200);
}

export async function creativeAnswerGenerator(question) {
    const completion = await deepseek.chat.completions.create({
        messages: [
            { role: 'system', content: `You are a student taking an English exam. You're now given a question. Answer it in brief words. Your teacher hates markdown, and she don't want to see anything like "Here is my answer".` },
            { role: 'user', content: question }
        ],
        model: "deepseek-chat",
        stream: true,
    });
    return completion
}