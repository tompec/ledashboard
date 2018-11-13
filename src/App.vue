<template>
    <div id="app">
        <div class="hero is-dark is-fullheight">
            <div class="hero-head">
                <div class="container is-fluid">
                    <div class="level is-mobile">
                        <div class="level-left">
                            <!--  -->
                        </div>
                        <div class="level-right">
                            <div class="buttons">
                                <button class="button is-dark" @click="addProject" title="Add Project"><font-awesome-icon icon="plus" /></button>
                                <div class="dropdown is-hoverable is-right">
                                    <div class="dropdown-trigger">
                                        <button class="button is-dark" aria-haspopup="true" aria-controls="dropdown-menu4" title="Sort">
                                            <span class="icon is-small">
                                                <font-awesome-icon icon="sort" />
                                            </span>
                                        </button>
                                    </div>
                                    <div class="dropdown-menu" id="dropdown-menu4" role="menu">
                                        <div class="dropdown-content">
                                            <div class="dropdown-item">
                                                <label class="label">Sort by:</label>
                                            </div>
                                            <a class="dropdown-item" :class="{'is-active': sortBy == 'name'}" @click="sortBy = 'name'">
                                                Name
                                            </a>
                                            <a class="dropdown-item" :class="{'is-active': sortBy == 'value'}" @click="sortBy = 'value'">
                                                Progress
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hero-body">
                <div class="container is-fluid">
                    <project v-for="(project, index) in projects" :key="project.id" :project="project" @delete-project="deleteProject"></project>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .hero-head {
        padding: 0 1.5rem;
    }
</style>

<script>
    export default {
        name: 'app',

        data: () => ({
            chromeStorage: true,
            projects: [],
            sortBy: 'name'
        }),

        created() {
            this.setup();
        },

        methods: {
            setup() {
                if (typeof chrome.storage == 'undefined') {
                    this.chromeStorage = false;
                }
                this.getProjects();
                this.getSortBy();
            },
            getProjects() {
                if (this.chromeStorage) {
                    var self = this;
                    chrome.storage.sync.get(['projects'], function(storage) {
                        if (storage.projects) {
                            self.projects = storage.projects;
                        }
                    });
                } else {
                    const storage = JSON.parse(localStorage.getItem("projects"));
                    if (storage) {
                        this.projects = storage;
                    }
                }

                if (this.projects.length == 0) {
                    this.addProject();
                }
            },
            getSortBy() {
                if (this.chromeStorage) {
                    chrome.storage.sync.get(['sortBy'], function(storage) {
                        if (storage.sortBy) {
                            self.sortBy = storage.sortBy;
                        }
                    });
                } else {
                    const storage = localStorage.getItem("sortBy");
                    if (storage) {
                        this.sortBy = storage;
                    }
                }
                this.sortProjects();
            },
            addProject() {
                this.projects.push({
                    id: + new Date(),
                    name: 'New project',
                    value: 0,
                    type: 'percentage',
                    goal: null,
                    unit: null
                });
            },
            deleteProject(project) {
                this.projects.splice(this.projects.indexOf(project), 1);
            },
            sortProjects() {
                var self = this;
                self.projects = _.sortBy(self.projects, [function(project) {
                    if (self.sortBy == 'value') {
                        if (project.type == 'fixed' && project.goal) {
                            return parseInt(project['value'] / project['goal'] * 100);
                        }
                        return parseInt(project['value']);
                    }
                    return project[self.sortBy].toLowerCase();
                }]);
            }
        },

        watch: {
            projects: {
                handler: function () {
                    if (this.chromeStorage) {
                        chrome.storage.sync.set({projects: this.projects});
                    } else {
                        localStorage.setItem("projects", JSON.stringify(this.projects));
                    }
                },
                deep: true
            },
            sortBy: function() {
                if (this.chromeStorage) {
                    chrome.storage.sync.set({sortBy: this.sortBy});
                } else {
                    localStorage.setItem("sortBy", this.sortBy);
                }
                this.sortProjects();
            }
        }
    }
</script>
