<template>
    <div id="app">
        <transition name="fade">
            <div v-if="background" class="background" :style="background_style"></div>
        </transition>
        <div class="hero is-dark is-fullheight">
            <div class="hero-head">
                <div class="container is-fluid">
                    <div class="level is-mobile">
                        <div class="level-left">
                            <!--  -->
                        </div>
                        <div class="level-right">
                            <div class="buttons">
                                <button class="button is-text" @click="addProject" title="Add Project"><font-awesome-icon icon="plus" /></button>
                                <div class="dropdown is-hoverable is-right">
                                    <div class="dropdown-trigger">
                                        <button class="button is-text" aria-haspopup="true" aria-controls="dropdown-menu4" title="Sort">
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
            <div class="hero-foot">
                <div class="container is-fluid">
                    <div class="level">
                        <div class="level-left">
                                <a class="button is-outlined is-light is-rounded is-small" href="https://www.ledashboard.com/?utm_source=ledashboard_app&utm_medium=footer" target="_blank" rel="noopener"><font-awesome-icon :icon="['fas', 'link']" /></a>
                                <a class="button is-outlined is-light is-rounded is-small" href="https://twitter.com/thomaspetracco" target="_blank" rel="noopener"><font-awesome-icon :icon="['fab', 'twitter']" /></a>
                        </div>
                        <div v-if="background" class="level-right">
                            <p><a :href="background.photo.html" target="_blank" rel="noopener" title="View photo on Unsplash">Photo</a> by <a :href="background.user.html" target="_blank" rel="noopener" :title="background.user.name + ' on Unsplash'">{{ background.user.name }}</a> on <a href="https://unsplash.com/?utm_source=ledashboard.com&utm_medium=referral" target="_blank" rel="noopener" title="Unsplash">Unsplash</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .fade-enter-to {
        transition: opacity 0.5s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>

<script>
    var moment = require('moment');

    export default {

        name: 'app',

        data: () => ({
            chromeStorage: true,
            projects: [],
            sortBy: 'name',
            backgrounds: []
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
                this.getBackgrounds();
                this.preloadNextBackground()
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
                    var self = this;
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
            getBackgrounds() {
                var self = this;
                if (this.chromeStorage) {
                    chrome.storage.sync.get(['backgrounds'], function(storage) {
                        if (storage.backgrounds) {
                            self.backgrounds = storage.backgrounds;
                        }
                        self.checkBackground();
                    });
                } else {
                    const storage = JSON.parse(localStorage.getItem("backgrounds"));
                    if (storage) {
                        this.backgrounds = storage;
                    }
                    self.checkBackground();
                }
            },
            checkBackground() {
                if (this.background === undefined) {
                    axios.get('https://api.ledashboard.com/backgrounds')
                        .then(response => {
                            this.backgrounds = response.data;
                        })
                        .catch();
                }
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
            },
            preloadNextBackground() {
                if (this.next_background) {
                    const img = new Image()
                    img.src = this.next_background.photo.url
                }
            }
        },

        computed: {
            background() {
                return this.backgrounds[moment().format('YYYYMMDD')];
            },
            background_style() {
                return {
                    backgroundImage: "url(" + this.background.photo.url + ")"
                };
            },
            next_background() {
                if (this.backgrounds[moment().add(1, 'day').format('YYYYMMDD')]) {
                    return this.backgrounds[moment().add(1, 'day').format('YYYYMMDD')]
                }

                return null
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
            },
            backgrounds: function() {
                if (this.chromeStorage) {
                    chrome.storage.sync.set({backgrounds: this.backgrounds});
                } else {
                    localStorage.setItem("backgrounds", JSON.stringify(this.backgrounds));
                }
            }
        }
    }
</script>
