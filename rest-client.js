const vue = Vue.createApp({
  data() {
    return {
      // PROFESSIONS
      professionInModal: { name: null },
      professions: [],
      newProfession: {
        name: '',
        field: '',
      },
      updatedProfession: {
        name: '',
        field: '',
      },
      professionToDelete: null,


    };
  },
  async created() {
    // Check if the current page is 'professions.html' or 'clients.html'
    if (window.location.pathname.endsWith('professions.html')) {
      try {
        this.professions = await (await fetch('http://localhost:7070/professions')).json();
        console.log('Professions:', this.professions);
      } catch (error) {
        console.error('Error getting professions:', error); 
      }
    }
    },
  methods: {
    //PROFESSIONS
    getProfession: async function (id) {
      this.professionInModal = await (await fetch(`http://localhost:7070/professions/${id}`)).json();
      let professionInfoInModal = new bootstrap.Modal(document.getElementById('professionInfoInModal'), {});
      professionInfoInModal.show();
    },
    



   
    },
  mounted() {
    // Fetch professions data and assign it to the 'professions' property
    this.fetchProfessions();
  },
}).mount('#app');
