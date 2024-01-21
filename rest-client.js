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

    createProfessionModal() {
      // Clear the form data
      this.newProfession = {
        name: '',
        field: '',
      };

      // Open the createProfessionModal
      let createProfessionModal = new bootstrap.Modal(document.getElementById('createProfessionModal'), {});
      createProfessionModal.show();
    },

    createNewProfession() {
      // Check if the name is empty
      if (!this.newProfession.name.trim()) {
        // Handle the case where the name is empty (you can show an error message)
        console.error('Error: Name cannot be empty');
        // Close the modal
        $('#createProfessionModal').modal('hide');
        return;
      }

      else{
    
        // Implement the logic for creating a new profession here
        console.log('Creating new profession:', this.newProfession);
      
        // Make a POST request to create a new profession
        fetch('http://localhost:7070/professions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.newProfession),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(profession => {
          // Handle the response from the server
          console.log('New profession created:', profession);
      
          // Add the new profession to the professions array
          this.professions.push(profession);
      
          // Close the modal after creating
          $('#createProfessionModal').modal('hide');
        })
        .catch(error => {
          console.error('Error creating new profession:', error);
          // Handle the error appropriately (e.g., show an error message)
        });
      }
    },
    



   
    },
  mounted() {
    // Fetch professions data and assign it to the 'professions' property
    this.fetchProfessions();
  },
}).mount('#app');
