import { TASK as NS } from './__namespaces__';

export const keys = {
    // STATES.
    s_task:               `${NS}_task`,
    s_current_index_task: `${NS}_current_index_task`,
    s_current_index_item: `${NS}_current_index_item`,
    s_current_task_index: `${NS}_current_task_index`, // Annotation task index.
    s_annotated_task:     `${NS}_annotated_task`, // Store user values and time for each item.
    s_task_score:         `${NS}_annotated_task`, // Compute score for each task.
    s_max_timer:          `${NS}_max_timer`, // Time for one item.
    // ACTIONS.
    a_get_task:                  `${NS}_randomize_profils`,
    a_increment_view_index:      `${NS}_increment_view_index`, // Increment task index by 1.
    a_update_annotated_item:     `${NS}_update_item`, // Put a new annotated item.
    a_update_current_index_item: `${NS}_update_current_index_task`,
    // GETTERS.
    g_task_length:  `${NS}_profils_length`,
    g_current_task: `${NS}_current_task`,
    g_current_item: `${NS}_current_item`,
}


// TODO: Changer les nom par view/task/item.

export const module = {
    state: {
        [keys.s_task]: [
            {}, // Authentication.
            // {
            //     type: 'rules'
            // },
            {
                type: 'form',
                questions: [
                    {
                        type: 'radio',
                        title: '',
                        sub_title: 'Voici un sous texte plus long !',
                        answers: [
                            'choix1',
                            'choix2',
                        ]
                    },
                    {
                        type: 'checkbox',
                        title: 'Title 2',
                        sub_title: 'Sub title 2',
                        answers: [
                            'choix1',
                            'choix2',
                        ]
                    },
                    {
                        type: 'radio',
                        title: 'Title 3',
                        sub_title: 'Sub title 3',
                        answers: [
                            'choix1',
                            'choix2',
                        ]
                    }
                ]
            },
            {
                rule: 'Exactly 3 squares',
                type: 'annotation',
                is_training: true, // opt.
                time: '',
                items: [
                    {
                        card: 'assets/datasets/2.jpg',
                        model: 0,
                        explicability: 'assets/datasets/2target_0.jpg',
                        expected: 0
                    },
                    {
                        card: 'assets/datasets/6.jpg',
                        model: 1,
                        explicability: 'assets/datasets/6target_0.jpg',
                        expected: 0
                    },
                    {
                        card: 'assets/datasets/40.jpg',
                        model: 1,
                        explicability: 'assets/datasets/40target_0.jpg',
                        expected: 1
                    },
                    {
                        card: 'assets/datasets/52.jpg',
                        model: 0,
                        explicability: 'assets/datasets/52target_0.jpg',
                        expected: 1
                    }
                ]
            },
            // {
            //     type: 'formulaire',
            //     questions: [
            //         {
            //             type: 'radio/checkbox',
            //             title: '',
            //             answers: [
            //                 'choix1',
            //                 'choix2',
            //             ]
            //         },
            //         {
            //             card: 'assets/img/warning.png',
            //             expected: 0
            //         }
            //     ]
            // },
            // {
            //     type: 'score',
            //     items: [
            //         {
            //             card: 'assets/img/warning.png',
            //             expected: 0
            //         },
            //         {
            //             card: 'assets/img/warning.png',
            //             expected: 0
            //         }
            //     ]
            // },
            {
                rule: 'lorem ipsum',
                items: [
                    {
                        card: 'assets/img/warning.png',
                        expected: 0
                    },
                    {
                        card: 'assets/img/warning.png',
                        expected: 0
                    }
                ]
            }
        ],
        [keys.s_current_index_task]: 0,
        [keys.s_current_task_index]: 0,
        [keys.s_current_index_item]: 0,
        [keys.s_annotated_task]: [
            [
                {
                    value: -1,
                    time: 0
                },
                {
                    value: -1,
                    time: 0
                },
                {
                    value: -1,
                    time: 0
                },
                {
                    value: -1,
                    time: 0
                }
            ],
            [
                {
                    value: -1,
                    time: 0
                },
                {
                    value: -1,
                    time: 0
                }
            ]
        ],
        [keys.s_max_timer]: 10,
    },
    actions: {
        [keys.a_randomize_profils](context, payload) {
            return new Promise((resolve, reject) => {
                axios.post(USER_URL, {uid: payload.uid})
                .then((response) => {
                    const data = response.data; // Response: null or an object.
                    if (data) {
                        context.commit(`${NS}_GET_TASK`, {task: data});
                        resolve();
                    } else {
                        reject();
                    }
                }, (err) => {
                    reject();
                });
            });
        },
        [keys.a_increment_view_index](context, payload) {
            let current_view_index = context.state[keys.s_current_index_task];
            context.commit(`${NS}_INCREMENT_VIEW_INDEX`, {index: current_view_index + 1});
        },
        [keys.a_update_annotated_item](context, payload) {
            context.commit(`${NS}_UPDATE_ANNOTATED_ITEM`, payload);
        },
        [keys.a_update_current_index_item](context, payload) {
            let view = context.state[keys.s_task];
            let current_index_view = context.state[keys.s_current_index_task];
            let current_index_item = context.state[keys.s_current_index_item];
            if (current_index_item + 1 >= view[current_index_view]['items'].length) {
                context.commit(`${NS}_INCREMENT_VIEW_INDEX`, {index: current_index_task + 1});
                context.commit(`${NS}_UPDATE_INDEX_ITEM`, {index: 0});
            } else {
                context.commit(`${NS}_UPDATE_INDEX_ITEM`, {index: current_index_item + 1});
            }
        }
    },
    mutations: {
        [`${NS}_GET_TASK`](state, payload) {
            state[keys.s_task] = payload.task;
        },
        [`${NS}_UPDATE_ANNOTATED_ITEM`](state, payload) {
            state[keys.s_annotated_task][state[keys.s_current_task_index]][state[keys.s_current_index_item]] = payload;
        },
        [`${NS}_INCREMENT_VIEW_INDEX`](state, payload) {
            state[keys.s_current_index_task] = payload.index;
        },
        [`${NS}_UPDATE_INDEX_ITEM`](state, payload) {
            state[keys.s_current_index_item] = payload.index;
        },
    },
    getters: {
        [keys.g_task_length]: (state, key) => state[keys.s_task].length,
        [keys.g_current_task]: (state, key) => state[keys.s_task][state[keys.s_current_index_task]],
        [keys.g_current_item]: (state, key) => state[keys.s_task][state[keys.s_current_index_task]]['items'][state[keys.s_current_index_item]],
    }
}