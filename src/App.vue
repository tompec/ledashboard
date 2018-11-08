<template>
    <div id="app">
        <div class="hero is-primary is-fullheight">
            <div class="hero-body">
                <div class="container">
                    <img src="./assets/logo.png">
                    <h1 class="title">{{ msg }}</h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'app',
    data () {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    }
}
</script>
