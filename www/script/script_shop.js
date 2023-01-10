// This is a JavaScript file

Vue.component('open-modal',{
  template : `
    <div id="overlay" v-on:click="clickEvent">
        <div id="content"　 v-on:click="stopEvent">
          <p><slot></slot></p>
          <button v-on:click="clickEvent">close</button>
        </div>
    </div>
    `,
  methods :{
    clickEvent: function(){
      this.$emit('from-child')
     },
    stopEvent: function(){
      event.stopPropagation()
    }    
  }
})

new Vue({
  el: '#app',
  data: {
    showContent: false
  },
  methods:{
    openModal: function(){
      this.showContent = true
    },
    closeModal: function(){
      this.showContent = false
    }
  }
})