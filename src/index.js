import { JudgeExercise, MultipleChoiceExercise, FillBlankExercise, QuestionAnswerExercise, SingleChoiceExercise, AudioExercise} from './exercises';
import { auto_fill } from './config.js';
import { sleep } from './utils.js';

function no_answer() {  // 判断页面是否有答案
    let elems2 = document.querySelectorAll("lib-adap-group-exercise-cs-stu-info,lib-adap-group-exercise-cs-study")
    if (elems2.length === 0) {
        elems2 = document.querySelectorAll('lib-adap-exercise-cs-study,lib-adap-exercise-cs-stu-info')
    }
    for (const elem of elems2) {
        let t = true
        for (let i = 0; i < ExerciseClasses.length; i++) {
            if (ExerciseClasses[i].is_this_exercise(elem)) {
                if (ExerciseClasses[i] !== AudioExercise) {
                    return false
                }
                t = false
                break
            }
        }
        if (t) {
            return false
        }
    }
    return true
}

function is_submit_page() {
    return !((document.querySelector("#wyy-submit") === null) || no_answer())  // 判断是否是提交页面。如果没有答案，或者没有提交按钮，则不是提交页面
}

function submit() {
    document.querySelector('.sm-btn').click()
}

function retry() {  // 单击重试按钮
    if (no_answer()) return
    document.querySelector('.wy-course-btn-right .wy-btn').click()
}

const ExerciseClasses = [JudgeExercise, MultipleChoiceExercise, FillBlankExercise, SingleChoiceExercise, QuestionAnswerExercise, AudioExercise]

async function button_activate() {
    if (is_submit_page()) {
        let elems2 = document.querySelectorAll("lib-adap-group-exercise-cs-study")
        if (elems2.length === 0) {
            elems2 = document.querySelectorAll('lib-adap-exercise-cs-study')
        }
        for (const elem of elems2) {
            let t = true
            for (let i = 0; i < ExerciseClasses.length; i++) {
                if (ExerciseClasses[i].is_this_exercise(elem)) {
                    await ExerciseClasses[i].fill_default(elem)
                    t = false
                    break
                }
            }
            if (t) {
                alert('不支持的题型！')
                return
            }
        }
        if (!auto_fill) {
            return;
        }
        const old_uri = window.location.href
        submit()
        while (is_submit_page()) {
            await sleep(500)
        }
        await sleep(1000) //慢一点
        const new_uri = window.location.href
        if (old_uri !== new_uri) return
    }

    //获取答案
    let elems = document.querySelectorAll("lib-adap-group-exercise-cs-stu-info,lib-adap-group-exercise-cs-study")
    if (elems.length === 0) {
        elems = document.querySelectorAll('lib-adap-exercise-cs-stu-info,lib-adap-exercise-cs-study')
    }

    const exercises = []
    for (const elem of elems) {
        let t = true
        for (let i = 0; i < ExerciseClasses.length; i++) {
            if (ExerciseClasses[i].is_this_exercise(elem)) {
                exercises.push(new ExerciseClasses[i](elem))
                t = false
                break
            }
        }
        if (t) {
            alert('不支持的题型！')
            return
        }
    }

    console.log(exercises)

    retry()
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

function add_button() {
    'use strict';
    var bar = document.querySelector('.wy-course-btn-left')
    if (bar === null) {
        return
    }

    const button = document.createElement('button');

    button.textContent = 'Shoot';
    button.className = 'ng-star-inserted wy-btn hacked'

    if (bar.querySelector('button') !== null) {
        button.style = 'margin-left: 20px'
    }

    button.addEventListener('click', () => {
        button_activate()
    });

    bar.appendChild(button)
}

(function() {
    if (document.querySelector('.hacked') === null) {
        add_button()
    }
    setInterval(() => {
        if (document.querySelector('.hacked') === null) {
            add_button()
        }
    }, 2000)
})();
