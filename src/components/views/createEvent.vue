<template>
  <div id="eventForm">
    <md-button id="createEventButton" class="md-fab md-fab-bottom-right" @click.native="openForm('dialog')">
      <md-icon >send</md-icon>
    </md-button>

    <md-dialog id="createEventDialogue" md-open-from="#createEventButton" md-close-to="#createEventButton" ref="dialog">
      <md-dialog-title>Create a new Event</md-dialog-title>

      <md-dialog-content>
        <form novalidate>
          <md-input-container>
            <label>Title</label>
            <md-input type="text" v-model="event_title" required></md-input>
          </md-input-container>

          <md-input-container>
            <label>Description</label>
            <md-textarea v-model="event_description"></md-textarea>
          </md-input-container>

          <md-input-container>
            <label>Time</label>
            <md-input type="text" v-model="event_time" required></md-input>
          </md-input-container>

          <md-input-container>
            <label>Today or Tomorrow?</label>
            <md-select v-model="event_day" name="day" required>
              <md-option value="Today">Today</md-option>
              <md-option value="Tomorrow">Tomorrow</md-option>
            </md-select>
          </md-input-container>

          <md-input-container>
            <label>Max Number of Members</label>
            <md-input ref="memInput" v-if="event_memberNum > 0" type="number" min="1" max="" v-model="event_memberNum" :disabled="no_limit" md-inline></md-input>
          </md-input-container>
          <md-checkbox v-model="no_limit" @change="event_memberNum = event_memberNum == -1 ? 1:-1" md-inline>No Limit</md-checkbox>

          <md-input-container>
            <label>Location</label>
            <md-input type="text" v-model="event_location" required></md-input>
          </md-input-container>

          <label>Privacy?</label><br>
          <md-switch v-model="public_view">{{privacy}}</md-switch>

        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-default" @click.native="closeForm('dialog')">Cancel</md-button>
        <md-button class="md-primary" @click.native="submitForm('dialog')">Create</md-button>
      </md-dialog-actions>

    </md-dialog>
  </div>
</template>

<script>
  import helpers from '@/lib/FirebaseHelpers'
  import VueGoogleAutocomplete from 'vue-google-autocomplete'
  
  function getDefaultTime () {
    let date = new Date()
    let defaultHour = (date.getHours() + 1) % 24
    return (
      ('0' + (defaultHour % 12) || 12)).slice(-2) +
      ':' +
      ('0' + date.getMinutes()).slice(-2) +
      ' ' +
      (defaultHour < 12 ? 'AM' : 'PM')
  }

  export default {
    name: 'Form',
    computed: {
      privacy () {
        return this.public_view ? 'Public' : 'Only Friends'
      }
    },
    methods: {
      openForm (ref) {
        this.$refs[ref].open()
      },
      closeForm (ref) {
        /* reseting the variables */
        this.event_title = ''
        this.event_description = ''
        this.event_time = getDefaultTime()
        this.event_day = 'Today'
        this.event_memberNum = 1
        this.event_location = ''
        this.public_view = true
        this.datetime = new Date()
        this.no_limit = false
       /* closes the form */
        this.$refs[ref].close()
      },
      submitForm (ref) {
        /* gets the date of the event is for */
        if (this.event_day === 'Tomorrow') {
          this.datetime.setDate(this.datetime.getDate() + 1)
        }
        let time = this.event_time.split(/[\s:]/gi)
        let hours = parseInt(time[0], 10) % 12
        this.datetime.setHours(hours + (time[2].toLowerCase() === 'am' ? 0 : 12))
        this.datetime.setMinutes(parseInt(time[1], 10) || 0)
        this.datetime.setSeconds(0, 0)
        /* creates the object to be sent to the server side */
        var post = {
          title: this.event_title,
          description: this.event_description,
          datetime: this.datetime,
          public: this.public_view,
          location: this.event_location,
          maxMembers: this.event_memberNum
        }
        /* sends the above object to the server */
        helpers.createPost(post)
        /* closes and resets the form */
        this.closeForm(ref)
      }
    },
    data () {
      return {
        event_title: '',
        event_description: '',
        event_time: getDefaultTime(),
        event_day: 'Today',
        event_memberNum: 1,
        event_location: '',
        event_comments: '',
        public_view: true,
        datetime: new Date(),
        no_limit: false
      }
    }
  }
</script>

<style>
</style>
