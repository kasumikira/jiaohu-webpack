import { ExerciseClasses, WritingExercise } from './exercises';
import { sleep } from './utils.js';
import { initMicHook } from './hook/hook.js';
import { createApp } from 'vue';
import ConfigPanel from './components/ConfigPanel.vue';

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
    if (await answer_is_correct()) return
    document.querySelector('.wy-course-btn-right .wy-btn').click()
}

async function button_activate() {
    console.log(window.auto_fill)
    if (await is_submit_page()) {
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
                return
            }
        }
        if (skip_writing && writingBlocks.length > 0) {
            for (const block of writingBlocks) {
                const exercise = new WritingExercise(block)
                await exercise.fill()
            }
            await submit()
            return
        }
        if (!window.auto_fill) {
            return
        }
        const old_uri = window.location.href
        await submit()
        while (await is_submit_page()) {
            await sleep(500)
        }
        await sleep(1000) //慢一点
        const new_uri = window.location.href
        if (old_uri !== new_uri) return
    }

    console.log('get answer go')

    if (await answer_is_correct()) return

    console.log('get answer go')

    //获取答案
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
            return
        }
    }

    const exercises = await Promise.all(exerPromises)
    if (exerPromises.some(exer => exer === null)) {
        alert('不支持的题型！')
        return
    }

    console.log(exercises)

    await retry()
    //获取新元素
    let elems2 = document.querySelectorAll("lib-adap-group-exercise-cs-study")
    if (elems2.length === 0) {
        elems2 = document.querySelectorAll('lib-adap-exercise-cs-study')
    }

    let id = 0
    for (const exercise of exercises) {
        exercise.element = elems2[id++]
        await exercise.fill()
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
    initMicHook()
    let adding = false

    const observer = new MutationObserver(mutations => {
        console.log('mutation')
        if (adding) return
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
