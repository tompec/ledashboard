<template>
    <div class="project" :class="{'is-completed': completion == 100}">
        <div class="level">
            <div class="level-left">
                <editable v-model="own_project.name"></editable>
                <div class="dropdown is-hoverable">
                    <div class="dropdown-trigger">
                        <button class="button is-dark" aria-haspopup="true" aria-controls="dropdown-menu4" title="Sort">
                            <span class="icon is-small has-text-grey">
                                <font-awesome-icon icon="cog" />
                            </span>
                        </button>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu4" role="menu">
                        <div class="dropdown-content">
                            <div class="dropdown-item">
                                <div class="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label class="label">Type</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="field has-addons">
                                            <p class="control">
                                                <button class="button is-small" :class="{'is-link': own_project.type == 'percentage', 'is-light': own_project.type == 'fixed'}" @click.prevent="own_project.type = 'percentage'">%</button>
                                            </p>
                                            <p class="control">
                                                <button class="button is-small" :class="{'is-link': own_project.type == 'fixed', 'is-light': own_project.type == 'percentage'}" @click.prevent="own_project.type = 'fixed'">Value</button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="own_project.type == 'fixed'" class="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label class="label">Goal</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="field">
                                            <p class="control">
                                                <input type="number" class="input" id="goal" placeholder="20" v-model="own_project.goal" required>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="own_project.type == 'fixed'" class="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label class="label">Unit</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="field">
                                            <p class="control">
                                                <input type="text" class="input" id="unit" placeholder="km" v-model="own_project.unit">
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="dropdown-divider">
                            <a class="dropdown-item has-text-danger" @click="$emit('delete-project', project)">
                                <span class="icon"><font-awesome-icon icon="times"/></span>
                                <span>Delete</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="level-right">
                <p class="heading is-size-4 has-text-grey">
                    <span v-if="own_project.type == 'percentage'">{{ project.value }}%</span>
                    <span v-else="own_project.type == 'fixed'">{{ project.value }}/{{ project.goal }} {{ project.unit }}</span>
                </p>
            </div>
        </div>
        <input type="range" min="0" :max="maxSlider" v-model="own_project.value" :class="rangeClass">
    </div>
</template>

<style>
    .project .level-left {
        display: flex;
    }
</style>

<script>
    export default {

        props: ['project'],

        data: () => ({
            own_project: {
                name: '',
                value: 0,
                type: 'percentage',
                goal: null,
                unit: null
            },
            editmode: false
        }),

        mounted() {
            this.own_project = this.project;
        },

        computed: {
            maxSlider() {
                if (this.own_project.type == 'percentage') {
                    return 100;
                }

                return this.own_project.goal;
            },
            completion() {
                if (this.own_project.type == 'percentage') {
                    return this.own_project.value;
                }
                return parseInt(this.own_project.value / this.own_project.goal * 100);
            },
            rangeClass() {
                if (this.completion > 66) {
                    return 'is-success';
                }
                if (this.completion > 33) {
                    return 'is-warning';
                }
                return 'is-danger';
            }
        }
    }
</script>
