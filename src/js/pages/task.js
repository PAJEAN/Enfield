// @ts-check

/* Namespaces */
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
/* Lib */
import { guardView, nextView } from 'JS/lib/view-manager';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';
import { MyForm } from 'JS/components/wc-form';

try {
    (function() {
        const PAGE_NAME = PAGE_NAMES.TASK;

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style>
                #main-page {
                    min-height: 100vh;
                }
                .container-decoration {
                    border-radius: 10px;
                    box-shadow: var(--box-shadow);
                }
                .icon {
                    max-width: 300px;
                }
            </style>

            <div id="main-page" class="d-flex flex-column justify-content-center">
                <h3 id="task" class="container">Task</h3>

                <div id="desc" class="container fs-5">
                    Rule: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>
                
                <div id="current-status" class="container container-decoration d-flex justify-content-center p-2 mt-4"></div>
                
                <div id="timer" class="text-center fs-2 my-4">
                    10:00
                </div>

                <div class="container text-center">
                    <div class="row">
                        <div class="col-sm-9">
                            <div class="row" id="source-model">
                                <div class="col-sm">
                                    <div class="card">
                                        <img src="assets/datasets/2.jpg" class="card-img-top icon" alt="...">
                                        <div class="card-body">
                                            <h5 class="card-title text-center">Source image</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class="card">
                                        <img src="assets/datasets/2.jpg" class="card-img-top icon" alt="...">
                                        <div class="card-body">
                                            <h5 class="card-title text-center">Model</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row row-cols-sm-2 mt-3" id="explanation">
                                <div class="col-sm">
                                    <div class="card">
                                        <img src="assets/datasets/2.jpg" class="card-img-top icon" alt="...">
                                        <div class="card-body">
                                            <h5 class="card-title text-center">Source image</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class="card">
                                        <img src="assets/datasets/2.jpg" class="card-img-top icon" alt="...">
                                        <div class="card-body">
                                            <h5 class="card-title text-center">Source image</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class="card">
                                        <img src="assets/datasets/2.jpg" class="card-img-top icon" alt="...">
                                        <div class="card-body">
                                            <h5 class="card-title text-center">Source image</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <${COMPONENT_NAMES.FORM} id="form"></${COMPONENT_NAMES.FORM}>
                            <button id="submit-btn" type="button" class="btn btn-primary btn-lg text-uppercase w-100 my-4">Submit</button>
                        </div>
                    </div>
                </div>
            </div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            _createCard(body_title_text, text, is_image) {
                let col = document.createElement('div');
                col.classList.add('col-sm');
                let card = document.createElement('div');
                card.classList.add('card');
                if (is_image) {
                    let image = document.createElement('img');
                    image.setAttribute('src', text);
                    image.classList.add('card-img-top', 'm-auto', 'icon')
                    card.appendChild(image);
                }
                let card_body = document.createElement('div');
                card_body.classList.add('card-body');
                if (!is_image) {
                    let body_text = document.createElement('div');
                    card_body.appendChild(body_text);
                }
                let body_title = document.createElement('h5');
                body_title.classList.add('card-title', 'text-center')
                body_title.textContent = body_title_text;
                card_body.appendChild(body_title);
                card.appendChild(card_body);
                col.appendChild(card);
                return col;
            }

            _currentStatus() {
                let tag = this.content.querySelector('#current-status');
                tag.textContent = '';
                let tasks = store.state[keys.s_experiment_completed][store.state[keys.s_current_experiment_index]];
                for (let i = 0; i < tasks.length; i++) {
                    let div = document.createElement('div');
                    div.classList.add('mx-1');
                    div.textContent = tasks[i]['response'].length > 0 ? '🟢': '⚪'
                    tag.appendChild(div);
                }
            }

            _dataset() {
                let tag_source_model = this.content.querySelector('#source-model');
                tag_source_model.textContent = '';
                let tag_explanation = this.content.querySelector('#explanation');
                tag_explanation.textContent = '';
                let experiment = store.state[keys.g_current_view];
                let task = experiment['task'][store.state[keys.s_current_task_index]];
                
                if (task.hasOwnProperty('source')) {
                    let div = this._createCard('Source', task['source']['text'], task['source']['is_image']);
                    tag_source_model.appendChild(div);
                }
                if (task.hasOwnProperty('model')) {
                    let path = task['model'] == 0 ? 'assets/img/pouce-vers-le-bas.png': 'assets/img/pouce-en-lair.png';
                    let div = this._createCard('Model', path, true);
                    tag_source_model.appendChild(div);
                }
                if (task.hasOwnProperty('explanation')) {
                    for (let item of task['explanation']) {
                        let div = this._createCard('Explanation', item['text'], item['is_image']);
                        tag_explanation.appendChild(div);
                    }
                }
            }

            _desc() {
                let tag = this.content.querySelector('#desc');
                let experiment = store.state[keys.g_current_view];
                tag.textContent = `${experiment['desc']}`;
            }

            _task() {
                let tag = this.content.querySelector('#task');
                let text = '';
                if (store.state[keys.s_current_experiment_index] == 0) {
                    text = `Training task`;
                } else {
                    text = `Task n°${store.state[keys.s_current_experiment_index]}`;
                }
                tag.textContent = text;
            }

            _timer() {
                let tag = this.content.querySelector('#timer');
                tag.textContent = this.current_time.toFixed(2);
                let delta_time = 1000;
                this._timer_count = window.setInterval(() => {
                    this.current_time -= delta_time/1000;
                    tag.textContent = (Math.round(this.current_time * 100) / 100).toFixed(2);
                    if (this.current_time <= 0) {
                        /** @type {MyForm} */
                        let form = this.content.querySelector('#form');
                        let responses = form.submit();
                        this._transition(responses, true);
                    }
                }, delta_time);                
            }

            _transition(response, is_time_exceeded) {
                let submit_btn = this.content.querySelector('#submit-btn');
                submit_btn.removeEventListener('click', this._submit);

                clearInterval(this._timer_count);

                let experiment = store.state[keys.g_current_view];

                store.dispatch(keys.a_update_completed_experiment, {response: response, time: Math.max(this.current_time, 0), is_time_exceeded: is_time_exceeded});

                if (store.state[keys.s_current_task_index] + 1 >= experiment['task'].length) {
                    store.dispatch(keys.a_update_current_task_index, {index: 0});
                    store.dispatch(keys.a_update_experiment_index, {index: store.state[keys.s_current_experiment_index] + 1});
                    nextView();
                } else {
                    store.dispatch(keys.a_update_current_task_index, {index: store.state[keys.s_current_task_index] + 1});
                    this._init();
                }      
            }

            _init() {
                this.current_time = store.state[keys.s_max_timer];
                this._initEvents();
                this._currentStatus();
                this._desc();
                this._task();
                this._dataset();
                // this._timer();
            }
            
            _submit() {
                /** @type {MyForm} */
                let form = this.content.querySelector('#form');
                let responses = form.submit();
                this._transition(responses, false);
            }

            _initEvents() {
                let submit_btn = this.content.querySelector('#submit-btn');
                submit_btn.addEventListener('click', this._submit);                
            }
            
            connectedCallback () {
                guardView(PAGE_NAMES.TASK);

                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main-page');
                /* Attributes */                
                this.current_time = store.state[keys.s_max_timer];
                /** @type {number | undefined} */
                this._timer_count = undefined;
                this._submit = this._submit.bind(this); // Bind to remove listener (otherwise bind create a new function).
                /* Init */
                this._init();
            }
          
            disconnectedCallback () {
                if(this._timer_count) {
                    clearInterval(this._timer_count);
                }
            }
        });
    })();
}
catch (err) {
    console.error(err);
}