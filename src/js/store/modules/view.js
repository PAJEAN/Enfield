// @ts-check

/* Lib */
import { viewToObject, experimentCompleted, formCompleted } from 'JS/lib/view-manager';
/* Namespaces */
import { VIEW as NS } from './__namespaces__';
/* Utils */
import { TEST_VIEW } from 'JS/utils/test_data';
import { DATA_URL } from 'JS/utils/constants';


/* -------------------------------------------------------------------------- */
/*                                    KEYS                                    */
/* -------------------------------------------------------------------------- */

export const keys = {
    /*** STATES ***/
    /* -------------------------------- view -------------------------------- */
    s_view:               `${NS}_view`,               // All json views info.
    s_view_objects:       `${NS}_view_objects`,       // All views objects.
    s_current_view_index: `${NS}_current_view_index`, // Current index on s_view.
    /* -------------------------- experiment & task ------------------------- */
    s_current_experiment_index: `${NS}_current_experiment_index`, // Annotation experiment index.
    s_current_task_index:       `${NS}_current_index_task`,       // Annotation task index (each annotation in an experiment).
    s_experiment_completed:     `${NS}_experiment_completed`,     // Store user values and time for each task of an experiment.
    s_experiment_score:         `${NS}_experiment_score`,         // Compute score for each experiment.
    /* -------------------------------- form -------------------------------- */
    s_current_form_index: `${NS}_current_form_index`, // Current completed form index.
    s_form_completed:     `${NS}_form_completed`,     // Store responses of completed forms.
   /* -------------------------------- global ------------------------------- */
    s_max_timer: `${NS}_max_timer`, // Time for one item.
    
    /*** ACTIONS ***/
    /* -------------------------------- view -------------------------------- */
    a_fetch_view:          `${NS}_fetch_view`,          // Get view from server.
    a_update_view_index:   `${NS}_update_view_index`,   // Update view index.
    /* -------------------------- experiment & task ------------------------- */
    a_update_experiment_completed:    `${NS}_update_experiment_completed`,    // Put a new task.
    a_update_experiment_completed_at: `${NS}_update_experiment_completed_at`, // Put a new task at current experiment index.
    a_update_experiment_index:        `${NS}_update_experiment_index`,        // Update completed experiment index.
    a_update_current_task_index:      `${NS}_update_current_index_task`,      // Update task index.
    /* -------------------------------- form -------------------------------- */
    a_update_form_completed:    `${NS}_update_form_completed`,    // Put new answers in completed form.
    a_update_form_completed_at: `${NS}_update_form_completed_at`, // Put new answers in completed form at current form index.
    a_update_form_index:        `${NS}_update_form_index`,        // Update completed form index.
    
    /*** GETTERS ***/
    g_view_length:        `${NS}_view_length`,       // Length of view.
    g_current_view:       `${NS}_current_view`,      // Get current view info.
    g_experiment_length:  `${NS}_experiment_length`, // Length of completed experiment.
}


/* -------------------------------------------------------------------------- */
/*                                   MODULE                                   */
/* -------------------------------------------------------------------------- */

export const module = {
    /*** STATES ***/
    state: {
        /* -------------------------------- view -------------------------------- */
        [keys.s_current_view_index]: 0,
        [keys.s_view]: TEST_VIEW,
        [keys.s_view_objects]: viewToObject(TEST_VIEW),
        /* -------------------------- experiment & task ------------------------- */
        [keys.s_experiment_completed]: experimentCompleted(TEST_VIEW),
        [keys.s_current_experiment_index]: 0,
        [keys.s_current_task_index]: 0,
        /* -------------------------------- form -------------------------------- */
        [keys.s_form_completed]: formCompleted(TEST_VIEW),
        [keys.s_current_form_index]: 0,
        /* ------------------------------- global ------------------------------- */
        [keys.s_max_timer]: 10
    },
    
    /*** Actions ***/
    actions: {
        /* -------------------------------- view -------------------------------- */
        [keys.a_fetch_view](context, payload) {
            // return Promise.resolve();
            return new Promise((resolve, reject) => {
                // @ts-ignore
                axios.get(DATA_URL, {
                    params: {
                        uid: payload.uid
                    }
                })
                .then((response) => {
                    let data = response.data; // Response: null or an object.                    
                    if (data) {
                        let data_views = [{}, ...data.views]; // Add authentication view first.
                        context.commit(`${NS}_UPDATE_VIEW`, data_views);
                        context.commit(`${NS}_UPDATE_VIEW_OBJECTS`, data_views);
                        context.commit(`${NS}_UPDATE_EXPERIMENT_COMPLETED`, experimentCompleted(data_views));
                        context.commit(`${NS}_UPDATE_FORM_COMPLETED`, formCompleted(data_views));
                        resolve(data);
                    } else {
                        reject();
                    }
                }, (err) => {
                    console.error(err);
                    reject();
                });
            });
        },
        [keys.a_update_view_index](context, payload) {
            context.commit(`${NS}_UPDATE_VIEW_INDEX`, {index: context.state[keys.s_current_view_index] + 1});
        },
        /* -------------------------- experiment & task ------------------------- */
        [keys.a_update_experiment_completed](context, payload) { // Update a subtask in completed tasks.
            context.commit(`${NS}_UPDATE_EXPERIMENT_COMPLETED`, payload);
        },
        [keys.a_update_experiment_completed_at](context, payload) { // Update a subtask in completed tasks.
            context.commit(`${NS}_UPDATE_EXPERIMENT_COMPLETED_AT`, payload);
        },
        [keys.a_update_experiment_index](context, payload) {
            context.commit(`${NS}_UPDATE_EXPERIMENT_INDEX`, payload);
        },
        [keys.a_update_current_task_index](context, payload) {
            context.commit(`${NS}_UPDATE_TASK_INDEX`, payload);
        },
        /* -------------------------------- form -------------------------------- */
        [keys.a_update_form_completed](context, payload) {
            context.commit(`${NS}_UPDATE_FORM_COMPLETED`, payload);
        },
        [keys.a_update_form_completed_at](context, payload) {
            context.commit(`${NS}_UPDATE_FORM_COMPLETED_AT`, payload);
        },
        [keys.a_update_form_index](context, payload) {
            context.commit(`${NS}_UPDATE_FORM_INDEX`, payload);
        },
    },
    
    /*** Mutations ***/
    mutations: {
        /* -------------------------------- view -------------------------------- */
        [`${NS}_UPDATE_VIEW`](state, payload) {
            state[keys.s_view] = payload;
        },
        [`${NS}_UPDATE_VIEW_INDEX`](state, payload) {            
            state[keys.s_current_view_index] = payload.index;
        },
        [`${NS}_UPDATE_VIEW_OBJECTS`](state, payload) {
            state[keys.s_view_objects] = viewToObject(payload);
        },
        /* -------------------------- experiment & task ------------------------- */
        [`${NS}_UPDATE_EXPERIMENT_COMPLETED`](state, payload) {
            state[keys.s_experiment_completed] = payload;
        },
        [`${NS}_UPDATE_EXPERIMENT_COMPLETED_AT`](state, payload) {
            state[keys.s_experiment_completed][state[keys.s_current_experiment_index]][state[keys.s_current_task_index]] = payload;
        },
        [`${NS}_UPDATE_EXPERIMENT_INDEX`](state, payload) {
            state[keys.s_current_experiment_index] = payload.index;
        },
        [`${NS}_UPDATE_TASK_INDEX`](state, payload) {
            state[keys.s_current_task_index] = payload.index;
        },
        /* -------------------------------- form -------------------------------- */
        [`${NS}_UPDATE_FORM_COMPLETED`](state, payload) {
            state[keys.s_form_completed] = payload;
        },
        [`${NS}_UPDATE_FORM_COMPLETED_AT`](state, payload) {
            state[keys.s_form_completed][state[keys.s_current_form_index]] = payload.answer;
        },
        [`${NS}_UPDATE_FORM_INDEX`](state, payload) {
            state[keys.s_current_form_index] = payload.index;
        },
    },
    
    /*** Getters ***/
    getters: {
        [keys.g_view_length]:  (state, key) => state[keys.s_view].length,
        [keys.g_task_length]:  (state, key) => state[keys.s_experiment_completed].length,
        [keys.g_current_view]: (state, key) => state[keys.s_view][state[keys.s_current_view_index]]
    }
}