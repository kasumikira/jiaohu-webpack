import { ExerciseClasses, WritingExercise } from './exercises';
import { sleep } from './utils';
// import { initMicHook } from './hook/hook.js';
import { createApp } from 'vue';
import ConfigPanel from './components/ConfigPanel.vue';
import { WAIT_AFTER_COMPLETE } from './config';

async function answer_is_correct() {  // 判断答案是否正确
    const marks = document.querySelectorAll('img')
    if (Array.from(marks).some(mark => mark.src.includes('wrong'))) {
        return false
    } else {
        return true
    }
}

async function is_submit_page() {
    return document.querySelector("#wyy-submit") !== null  // 判断是否是提交页面。如果有提交按钮，则是提交页面
}

async function submit() {
    document.querySelector('.sm-btn').click()
}

async function retry() {  // 单击重试按钮
    document.querySelector('.wy-course-btn-right .wy-btn').click()
}

async function fakeSubmit() {  // 虚假提交，返回false表示该次尝试终止，true表示可以继续
    let skip_writing = true
    const writingBlocks = []
    let elems2 = document.querySelectorAll("lib-adap-group-exercise-cs-study")
    if (elems2.length === 0) {
        elems2 = document.querySelectorAll('lib-adap-exercise-cs-study')
    }
    for (const elem of elems2) {
        const promises = ExerciseClasses.map(exercise => exercise.is_this_exercise(elem))
        const results = await Promise.all(promises)
        if (results.some(Boolean)) {
            const id = results.findIndex(Boolean)
            if (ExerciseClasses[id] === WritingExercise) {
                writingBlocks.push(elem)
                continue
            } else {
                skip_writing = false
                await ExerciseClasses[id].fill_default(elem)
            }
        } else {
            alert('不支持的题型！')
            return false
        }
    }
    if (skip_writing && writingBlocks.length > 0) { // 如果只有写作题那就直接提交答案
        for (const block of writingBlocks) {
            const exercise = new WritingExercise(block)
            await exercise.fill()
        }
        await submit()
        return false
    }
    const old_uri = window.location.href
    await submit()
    while (await is_submit_page()) {
        await sleep(500)
    }
    await sleep(1000) //慢一点
    const new_uri = window.location.href
    if (old_uri !== new_uri) return false
    return true
}

async function getAnswer() {  // 获得答案并填充
    let elems = document.querySelectorAll("lib-adap-group-exercise-cs-stu-info,lib-adap-group-exercise-cs-study")
    if (elems.length === 0) {
        elems = document.querySelectorAll('lib-adap-exercise-cs-stu-info,lib-adap-exercise-cs-study')
    }

    console.log('hint')

    const exerPromises = []

    for (const elem of elems) {
        let t = true
        for (let i = 0; i < ExerciseClasses.length; i++) {
            if (await ExerciseClasses[i].is_this_exercise(elem)) {
                exerPromises.push((async () => new ExerciseClasses[i](elem))())
                t = false
                break
            }
        }
        if (t) {
            alert('不支持的题型！')
            return null
        }
    }

    const exercises = await Promise.all(exerPromises)
    if (exerPromises.some(exer => exer === null)) {
        alert('不支持的题型！')
        return null
    }

    console.log(exercises)
    return exercises
}

async function fillAnswer(exercises) {
    //获取新元素
    let elems2 = document.querySelectorAll("lib-adap-group-exercise-cs-study")
    if (elems2.length === 0) {
        elems2 = document.querySelectorAll('lib-adap-exercise-cs-study')
    }
    
    console.log(elems2)

    let id = 0
    for (const exercise of exercises) {
        exercise.element = elems2[id++]
        console.log(exercise.element)
        await exercise.fill()
    }
}

function showErrorDialog(error) {
  const dialog = document.createElement('div');
  dialog.style = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 24px;
    width: 400px;
    max-width: 90%;
    max-height: 80vh;
    z-index: 10000;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `;
  
  dialog.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 16px;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 12px;">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#ff4d4f"/>
      </svg>
      <h3 style="margin: 0; color: #ff4d4f; font-size: 18px; font-weight: 500;">操作失败</h3>
    </div>
    
    <div style="color: #595959; margin-bottom: 20px; line-height: 1.5;">
      ${error.message || '发生未知错误'}
    </div>
    
    <details style="margin-bottom: 20px;">
      <summary style="color: #1890ff; cursor: pointer; outline: none;">查看技术详情</summary>
      <pre style="
        background: #f5f5f5; 
        padding: 12px;
        border-radius: 6px;
        overflow: auto;
        max-height: 200px;
        font-size: 13px;
        margin-top: 8px;
        white-space: pre-wrap;
        color: #595959;
      ">${error.stack || '无调用栈信息'}</pre>
    </details>
    
    <div style="display: flex; justify-content: flex-end;">
      <button onclick="this.parentNode.parentNode.remove()" style="
        background: #1890ff;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
      " onmouseover="this.style.background='#40a9ff'" 
      onmouseout="this.style.background='#1890ff'">
        我明白了
      </button>
    </div>
  `;
  
  document.body.appendChild(dialog);
}

async function button_activate() {
    try {
        console.log(window.auto_fill)
        if (await is_submit_page()) {
            const res = await fakeSubmit()
            if (!res || !window.auto_fill || await answer_is_correct()) return
            const exercises = await getAnswer()
            if (exercises === null) return
            await retry()
            await fillAnswer(exercises)
            await sleep(WAIT_AFTER_COMPLETE)
            if (window.auto_submit) submit()
        } else {
            const exercises = await getAnswer()
            if (exercises === null) return
            await retry()
            await fillAnswer(exercises)
            await sleep(WAIT_AFTER_COMPLETE)
            if (window.auto_submit) submit()
        }
    } catch (error) {
        console.error('操作失败:', error);
        showErrorDialog(error);
        throw error;
    }
}

async function add_button() {
    'use strict'
    var bar = document.querySelector('.wy-course-btn-left')
    if (bar === null) {
        return
    }

    const button = document.createElement('button');

    button.textContent = 'Shoot'
    button.className = 'ng-star-inserted wy-btn hacked'

    if (bar.querySelector('button') !== null) {
        button.style = 'margin-left: 20px'
    }

    button.addEventListener('click', () => button_activate())

    bar.appendChild(button)
}

(function() {
    // const isSafari = /apple/i.test(navigator.userAgent) &&
    //          !navigator.userAgent.match(/crios/i) &&
    //          !navigator.userAgent.match(/fxios/i) &&
    //          !navigator.userAgent.match(/Opera|OPT\//);

    // if (!isSafari) {
    //     initMicHook()
    // }
    let adding = false

    const observer = new MutationObserver(mutations => {
        console.log('mutation')
        const URLPattern = /[http|https]:\/\/www.tsinghuaelt.com\/course-study-student\/[0-9]+\/[0-9]+\/[0-9]+\/[0-9a-z]+/

        if (adding) return
        if (!URLPattern.test(window.location.href)) return // 跳过所有非答题页
        if (Array.from(mutations).every(mutation => {
            if (mutation.addedNodes.length === 0) {
                return true
            }
            
            // 加载时机在app-course加载之后
            return Array.from(mutation.addedNodes).every(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) return true
                // if (node.classList?.contains('wy-course-btn-left') || node.querySelector('.wy-course-btn-left') !== null) console.log(node.tagName?.toLowerCase().includes('app-course'))
                return !node.tagName?.toLowerCase().includes('app-course')
            })
        })) return
        if (document.querySelector('.wy-course-btn-left') !== null && document.querySelector('.hacked') === null) {
            adding = true
            setTimeout(() => {
                add_button().then(() => adding = false)
            }, 300)
        }
    })

    const config = { childList: true, subtree: true };
    
    // 确保document.body存在后再观察
    if (document.body) {
        observer.observe(document.body, config);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, config);
            // 初始化配置面板
            const configApp = createApp(ConfigPanel);
            const configContainer = document.createElement('div');
            document.body.appendChild(configContainer);
            configApp.mount(configContainer);
        });
    }
})();
