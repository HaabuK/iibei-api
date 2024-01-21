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

      // Clients
      clientInModal: { name: null },
      clients: [],
      newClient: {
        name: '',
        location: '',
        email: '',
        phone: '',
        company: '',
      },
      updatedClient: {
        name: '',
        location: '',
        email: '',
        phone: '',
        company: '',
      },
      clientToDelete: null,


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
    } else if (window.location.pathname.endsWith('clients.html')) {
      try {
        this.clients = await (await fetch('http://localhost:7070/clients')).json();
        console.log('Clients:', this.clients);
      } catch (error) {
        console.error('Error getting clients:', error); 
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
    openUpdateProfessionModal(profession) {
      // Set the updatedProfession data based on the selected profession
      this.updatedProfession = {
        id: profession.id,
        name: '',
        field: '',
      };

      // Open the updateProfessionModal
      let updateProfessionModal = new bootstrap.Modal(document.getElementById('updateProfessionModal'), {});
      updateProfessionModal.show();
    },

    updateProfession() {
      if (!this.updatedProfession.name.trim() && !this.updatedProfession.field.trim()) {
        // Handle the case where both name and field are empty (you can show an error message)
        console.error('Error: Name and Field cannot be empty');
        // Close the modal
        $('#updateProfessionModal').modal('hide');
        return;
      } else if (!this.updatedProfession.name.trim() && this.updatedProfession.field.trim()) {
        // Only the name is empty, update the field value only
        console.log('Updating profession field only:', this.updatedProfession.field);
        
        // Make a PUT request to update the field value
        fetch(`http://localhost:7070/professions/${this.updatedProfession.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ field: this.updatedProfession.field }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(updatedProfession => {
            // Handle the response from the server
            console.log('Profession field updated:', updatedProfession);
    
            // Close the modal after updating
            $('#updateProfessionModal').modal('hide');
    
            // Fetch the updated list of professions
            return fetch('http://localhost:7070/professions');
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(professions => {
            // Update the professions array with the updated list
            this.professions = professions;
          })
          .catch(error => {
            console.error('Error updating profession field:', error);
            // Handle the error appropriately (e.g., show an error message)
          });
      } else {
        // Both name and field are provided, update the profession
        console.log('Updating profession:', this.updatedProfession);
    
        // Make a PUT request to update the profession
        fetch(`http://localhost:7070/professions/${this.updatedProfession.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.updatedProfession),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(updatedProfession => {
            // Handle the response from the server
            console.log('Profession updated:', updatedProfession);
    
            // Close the modal after updating
            $('#updateProfessionModal').modal('hide');
    
            // Fetch the updated list of professions
            return fetch('http://localhost:7070/professions');
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(professions => {
            // Update the professions array with the updated list
            this.professions = professions;
          })
          .catch(error => {
            console.error('Error updating profession:', error);
            // Handle the error appropriately (e.g., show an error message)
          });
      }
    },

    prepareDeleteProfession(professionInModal) {
      // Set the profession to be deleted
      this.professionToDelete = professionInModal;
  
      // Show the delete confirmation modal
      let deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'), {});
      deleteConfirmationModal.show();
    },

    deleteProfession() {
      if (this.professionToDelete) {
        // Implement the logic for deleting a profession here
        console.log('Deleting profession with id:', this.professionToDelete.id);
  
        // Make a DELETE request to delete the profession
        fetch(`http://localhost:7070/professions/${this.professionToDelete.id}`, {
          method: 'DELETE',
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // Remove the deleted profession from the professions array
          this.professions = this.professions.filter(profession => profession.id !== this.professionToDelete.id);
  
          $('#deleteConfirmationModal').modal('hide');
        })
        .then(response =>{ 
          $('#professionInfoInModal').modal('hide');
        })
        .catch(error => {
          console.error('Error deleting profession:', error);
          // Handle the error appropriately (e.g., show an error message)
        });
      }
    },




     //CLIENTS
     getClient: async function (id) {
      this.clientInModal = await (await fetch(`http://localhost:7070/clients/${id}`)).json();
      let clientInfoInModal = new bootstrap.Modal(document.getElementById('clientInfoInModal'), {});
      clientInfoInModal.show();
    },


    createClientModal() {
      // Clear the form data
      this.newClient = {
        name: '',
        location: '',
        email: '',
        phone: '',
        company: '',
      };

      // Open the createClientModal
      let createClientModal = new bootstrap.Modal(document.getElementById('createClientModal'), {});
      createClientModal.show();
    },

    createNewClient() {
      // Check if at least the name is provided
      if (!this.newClient.name.trim()) {
        // Handle the case where the name is empty (you can show an error message)
        console.error('Error: Name cannot be empty');
        // Close the modal
        $('#createClientModal').modal('hide');
        return;
      }
    
      // Implement the logic for creating a new client here
      console.log('Creating new client:', this.newClient);
    
      // Make a POST request to create a new client
      fetch('http://localhost:7070/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.newClient.name.trim(),
          location: this.newClient.location.trim(),
          email: this.newClient.email.trim(),
          phone: this.newClient.phone.trim(),
          company: this.newClient.company.trim(),
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(client => {
          // Handle the response from the server
          console.log('New client created:', client);
    
          // Add the new client to the clients array
          this.clients.push(client);
    
          // Close the modal after creating
          $('#createClientModal').modal('hide');
        })
        .catch(error => {
          console.error('Error creating new client:', error);
          // Handle the error appropriately (e.g., show an error message)
        });
    },
    



   
    },
  mounted() {
    // Fetch professions data and assign it to the 'professions' property
    this.fetchProfessions();
  },
}).mount('#app');
