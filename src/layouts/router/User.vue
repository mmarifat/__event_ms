<!--
  - Author mmarifat<mma.rifat66@gmail.com>
  - Email: mma.rifat66@gmail.com
  - Created on : Friday 31 Jul, 2020 03:55:33 BDT
  -->

<template>
    <q-page class="has-sticky" padding>
        <q-page-sticky position="top-right" expand class="full-width q-page-menu q-pa-sm">
            <q-space v-if="$q.screen.gt.xs"/>
            <q-btn :color="$colors.primary" @click="$root.$emit('newUserModalOn')" icon="add" :size="$q.screen.gt.sm ? 'md':'sm'"
                   rounded push :label="!$q.screen.xs ? 'New User' : null"/>
        </q-page-sticky>
        <users-index/>
        <new-user/>
    </q-page>
</template>

<script lang='ts'>
import {Component, Vue} from "vue-property-decorator";
import UsersIndex from "pages/users/Index.vue";
import NewUser from "components/users/New.vue";

@Component({
    components: {NewUser, UsersIndex}
})
export default class User extends Vue {

    created() {
    }
}
</script>

<style lang='scss'>

</style>
