<template>
    <div>
        <p class="heading is-size-4" @click="editing = true" v-show="! editing">
            {{value}}
        </p>
        <form v-show="editing" @submit.prevent="editing = false">
            <div class="field is-grouped">
                <div class="control is-expanded">
                    <input
                        ref="input"
                        :value="value"
                        @input="$emit('input', $event.target.value)"
                        type="text"
                        class="input"
                    >
                </div>
                <div class="control">
                    <button class="button is-success" type="submit">Save</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {

        props: ['value'],

        data: () => ({
            editing: false
        }),

        watch: {
            'editing': function (newval, oldval) {
                if (newval) {
                    this.$nextTick(function() {
                        this.$refs.input.select();
                    });
                }
            }
        }

    }
</script>
