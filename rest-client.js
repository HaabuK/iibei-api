const vue = Vue.createApp({
  data() {
    return {
      jobInModal: {name: null},
      jobs: []
    }
  },
  async created() {
    this.jobs = await (await fetch('http://localhost:7070/jobs')).json();
  },
  methods: {
    getJob: async function(id) {
      this.jobInModal = await (await fetch(`http://localhost:7070/jobs/${id}`)).json();
      let jobInfoModal = new bootstrap.Modal(document.getElementById('jobInfoModal'), {})
      gameInfoModal.show()
    }
  }
}).mount('#app')