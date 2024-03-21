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

      // Workers
      workerInModal: { name: null, 
        //professionId: '', 
      },
      workerProfession: null,
      workers: [],
      newWorker: {
        name: '',
        salary: '',
        email: '',
        phone: '',
        company: '',
        driverslicense: '',
        profession: '',
      },
      professions: [],
      updatedWorker: {
        name: '',
        salary: '',
        email: '',
        phone: '',
        company: '',
        driverslicense: '',
        profession: '',
      },
      workerToDelete: null,

       // Orders
       orderInModal: { 
        name: null,
        worker: null,
        client: null,
        duration: '',
        status: '',
        info: '',
        },
        orders: [],
        newOrder: {
            worker: '',
            client: '',
            duration: '',
            status: '',
            info: '',
        },
        workers: [],
        clients: [],
        updatedOrder: {
            worker: '',
            client: '',
            duration: '',
            status: '',
            info: '',
        },
        orderToDelete: null,

    };
  },
  async created() {
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
    } else if (window.location.pathname.endsWith('workers.html')) {
      // Fetch workers directly
      try {
        this.workers = await (await fetch('http://localhost:7070/workers')).json();
        console.log('Workers:', this.workers);
        this.fetchProfessionData();
      } catch (error) {
        console.error('Error getting workers:', error); 
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
    
    async deleteProfession() {
      if (this.professionToDelete) {
        try {
          // Fetch workersInProfession data for the profession
          const wIPLink = await fetch(`http://localhost:7070/workersInProfession?professionId=${this.professionToDelete.id}`);
          const wIPArray = await wIPLink.json();
    
          // Log the response from workersInProfession
          console.log('WorkersInProfession response:', wIPArray);
    
          // Iterate over wIP entries and delete them
          for (let i = 0; i < wIPArray.length; i++) {
            const wIPEntry = wIPArray[i];
            if(wIPEntry.professionId == this.professionToDelete.id){
            await this.deleteWIP(wIPEntry);
            }
          }
    
          // Delete the profession itself
          const deleteProfessionResponse = await fetch(`http://localhost:7070/professions/${this.professionToDelete.id}`, {
            method: 'DELETE',
          });
    
          console.log('Delete profession response:', deleteProfessionResponse.status);
    
          if (!deleteProfessionResponse.ok) {
            throw new Error(`HTTP error! Status: ${deleteProfessionResponse.status}`);
          }
    
          // Remove the deleted profession from the professions array
          this.professions = this.professions.filter(profession => profession.id !== this.professionToDelete.id);
    
          // Hide the modals
          $('#deleteConfirmationModal').modal('hide');
          $('#professionInfoInModal').modal('hide');
        } catch (error) {
          console.error('Error deleting profession:', error);
          // Handle the error appropriately (e.g., show an error message)
        }
      }
    },

    async deletepWIP(workerId, professionId) {
      try {
        // Fetch workersInProfession data for the specific worker and profession
        const wIPLink = await fetch(`http://localhost:7070/workersInProfession?workerId=${workerId}&professionId=${professionId}`);
        const wIPArray = await wIPLink.json();
    
        // Log the response from workersInProfession
        console.log('WorkersInProfession response:', wIPArray);
    
        // Iterate over wIP entries and delete them
        for (const wIPEntry of wIPArray) {
          const deleteWIPResponse = await fetch(`http://localhost:7070/workersInProfession/${wIPEntry.id}`, {
            method: 'DELETE',
          });
    
          console.log('Deleted entry from workersInProfession:', await deleteWIPResponse.json());
        }
      } catch (error) {
        console.error('Error deleting workersInProfession entries:', error);
        // Handle the error appropriately (e.g., show an error message)
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
    
    

    openUpdateClientModal(client) {
      // Set the updatedClient data based on the selected client
      this.updatedClient = {
        id: client.id,
        name: '',
        location: '',
        email: '',
        phone: '',
        company: '',
      };

      // Open the updateClientModal
      let updateClientModal = new bootstrap.Modal(document.getElementById('updateClientModal'), {});
      updateClientModal.show();
    },

    updateClient() {
      // Create an object with non-empty fields
      const nonEmptyFields = {
        name: this.updatedClient.name.trim(),
        location: this.updatedClient.location.trim(),
        email: this.updatedClient.email.trim(),
        phone: this.updatedClient.phone.trim(),
        company: this.updatedClient.company.trim(),
      };
    
      // Remove fields with empty values
      Object.keys(nonEmptyFields).forEach(key => {
        if (!nonEmptyFields[key]) {
          delete nonEmptyFields[key];
        }
      });
    
      // Check if there are any non-empty fields
      if (Object.keys(nonEmptyFields).length === 0) {
        console.error('Error: At least one field (name, location, email, phone, company) must be provided');
        // Close the modal
        $('#updateClientModal').modal('hide');
        return;
      }
    
      // Make a PUT request to update the client
      fetch(`http://localhost:7070/clients/${this.updatedClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nonEmptyFields),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(updatedClient => {
          // Handle the response from the server
          console.log('Client updated:', updatedClient);
    
          // Close the modal after updating
          $('#updateClientModal').modal('hide');
    
          // Fetch the updated list of clients
          return fetch('http://localhost:7070/clients');
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(clients => {
          // Update the clients array with the updated list
          this.clients = clients;
        })
        .catch(error => {
          console.error('Error updating client:', error);
          // Handle the error appropriately (e.g., show an error message)
        });
    },
    
    
    
    
    
    prepareDeleteClient(clientInModal) {
      // Set the client to be deleted
      this.clientToDelete = clientInModal;
  
      // Show the delete confirmation modal
      let deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'), {});
      deleteConfirmationModal.show();
    },

    deleteClient() {
      if (this.clientToDelete) {
        // Implement the logic for deleting a client here
        console.log('Deleting client with id:', this.clientToDelete.id);
  
        // Make a DELETE request to delete the client
        fetch(`http://localhost:7070/clients/${this.clientToDelete.id}`, {
          method: 'DELETE',
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // Remove the deleted client from the clients array
          this.clients = this.clients.filter(client => client.id !== this.clientToDelete.id);
  
          $('#deleteConfirmationModal').modal('hide');
        })
        .then(response =>{ 
          $('#clientInfoInModal').modal('hide');
        })
        .catch(error => {
          console.error('Error deleting client:', error);
          // Handle the error appropriately (e.g., show an error message)
        });
      }
    },



    //WORKERS
    // getWorker: async function (id) {
    //   this.workerInModal = await (await fetch(`http://localhost:7070/workers/${id}`)).json();
    //   let workerInfoInModal = new bootstrap.Modal(document.getElementById('workerInfoInModal'), {});
    //   workerInfoInModal.show();
    // },
    async fetchProfessionData() {
      try {
        const response = await fetch('http://localhost:7070/professions');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        this.professions = await response.json();
        console.log('Professions:', this.professions);
      } catch (error) {
        console.error('Error fetching professions:', error.message); 
      }
    },
    closeWorkerInfoModal() {
      let workerInfoInModal = new bootstrap.Modal(document.getElementById('workerInfoInModal'), {});
      workerInfoInModal.hide();
    },

    getWorker: async function (id) {
      try {
        // Fetch worker data
        const workerResponse = await fetch(`http://localhost:7070/workers/${id}`);
        const workerData = await workerResponse.json();
    
        // Fetch workersInProfession data
        const wIPLink = await fetch(`http://localhost:7070/workersInProfession?workerId=${id}`);
        const wIPArray = await wIPLink.json();
    
        // Log the response from workersInProfession
        console.log('WorkersInProfession response:', wIPArray);
    
        // Check if the array is not empty
        if (wIPArray.length === 0) {
          console.error('No matching workersInProfession found');
          this.workerInModal = {
            id: workerData.id,
            name: workerData.name,
            profession: 'Not Assigned',
            salary: workerData.salary,
            email: workerData.email,
            phone: workerData.phone,
            company: workerData.company,
            driverslicense: workerData.driverslicense
          }
        }
    
        // Find the correct workersInProfession entry for the worker
        const wIP = wIPArray.find(entry => entry.workerId === id);
    
        // Check if a matching entry was found
        if (!wIP) {
          console.error('No matching workersInProfession entry found for worker ID:', id);
          this.workerInModal = {
            id: workerData.id,
            name: workerData.name,
            profession: 'Not Assigned',
            salary: workerData.salary,
            email: workerData.email,
            phone: workerData.phone,
            company: workerData.company,
            driverslicense: workerData.driverslicense,
          };
      
          // Manually trigger the modal to open using Bootstrap
          this.showWorkerModal();
          return;
        }
    
        // Check if professionId is defined
        if (!wIP.professionId) {
          console.error('ProfessionId is undefined');
          return;
        }
    
        // Fetch profession details
        const professionId = wIP.professionId;
        const professionLink = await fetch(`http://localhost:7070/professions/${professionId}`);
        const professionData = await professionLink.json();
    
        // Set the workerInModal data
        this.workerInModal = {
          id: workerData.id,
          name: workerData.name,
          profession: professionData.name,
          salary: workerData.salary,
          email: workerData.email,
          phone: workerData.phone,
          company: workerData.company,
          driverslicense: workerData.driverslicense,
        };
    
        // Manually trigger the modal to open using Bootstrap
        this.showWorkerModal();
      } catch (error) {
        console.error('Error fetching worker data:', error);
      }
    },
       
    showWorkerModal: function () {
      // Show the workerInfoInModal
      let workerInfoInModal = new bootstrap.Modal(document.getElementById('workerInfoInModal'), {});
      workerInfoInModal.show();
    },
    
     
    
    createWorkerModal() {
      // Clear the form data
      this.newWorker = {
        name: '',
        salary: '',
        email: '',
        phone: '',
        company: '',
        driverslicense: '',
      };
    
      // Open the createWorkerModal
      let createWorkerModal = new bootstrap.Modal(document.getElementById('createWorkerModal'), {});
      createWorkerModal.show();
    },
    
    createNewWorker() {
      // Check if the name is empty
      if (!this.newWorker.name.trim()) {
        // Handle the case where the name is empty (you can show an error message)
        console.error('Error: Name cannot be empty');
        // Close the modal
        $('#createWorkerModal').modal('hide');
        return;
      }
    
      // Check if a profession is selected
      if (!this.newWorker.profession) {
        // Handle the case where no profession is selected (show an error message)
        console.error('Error: Please select a profession');
        return;
      }
    
      // Create the request body with the selected profession
      const requestBody = {
        name: this.newWorker.name.trim(),
        salary: this.newWorker.salary.trim(),
        email: this.newWorker.email.trim(),
        phone: this.newWorker.phone.trim(),
        company: this.newWorker.company.trim(),
        driverslicense: this.newWorker.driverslicense.trim(),
        professionId: this.newWorker.profession, // Include the selected professionId
      };
    
      // Implement the logic for creating a new worker here
      console.log('Creating new worker:', requestBody);
    
      // Make a POST request to create a new worker
      fetch('http://localhost:7070/workers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(async worker => {
          // Handle the response from the server
          console.log('New worker created:', worker);
    
          // Add the new worker to the workers array
          this.workers.push(worker);
    
          // Call the function to associate the profession with the new worker
          await this.associateProfessionWithWorker(worker.id, requestBody.professionId);
    
          // Close the modal after creating
          $('#createWorkerModal').modal('hide');
        })
        .catch(error => {
          console.error('Error creating new worker:', error);
          // Handle the error appropriately (e.g., show an error message)
        });
    },
    
    async associateProfessionWithWorker(wId, pId) {
      try {
        // Fetch workersInProfession data
        const wIPLink = await fetch(`http://localhost:7070/workersInProfession?workerId=${wId}`);
        const wIPArray = await wIPLink.json();
    
        // Log the response from workersInProfession
        console.log('WorkersInProfession response:', wIPArray);
    
        const existingEntry = wIPArray.find(entry => entry.workerId === wId);
    
        if (existingEntry) {
          // If an entry exists, update it using the PUT method
          const requestBody = {
            workerId: wId,
            professionId: pId,
          };
    
          const response = await fetch(`http://localhost:7070/workersInProfession/${existingEntry.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
    
          console.log('Profession updated for worker:', await response.json());
        } else {
          // If no entry exists, create a new one using the POST method
          const newRequestBody = {
            workerId: wId,
            professionId: pId,
          };
    
          const newResponse = await fetch('http://localhost:7070/workersInProfession', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRequestBody),
          });
    
          console.log('New profession associated with worker:', await newResponse.json());
        }
      } catch (error) {
        console.error('Error associating profession with worker:', error);
        // Handle the error appropriately (e.g., show an error message)
      }
    },
    
    
    openUpdateWorkerModal(worker) {
      // Set the updatedWorker data based on the selected worker
      this.updatedWorker = {
        id: worker.id,
        name: '',
        salary: '',
        email: '',
        phone: '',
        company: '',
        driverslicense: '',
        profession: '',
      };
    
      // Open the createWorkerModal
      let createWorkerModal = new bootstrap.Modal(document.getElementById('updateWorkerModal'), {});
      createWorkerModal.show();
    },
    
    updateWorker() {
      // Create an object with non-empty fields
      const nonEmptyFields = {
        name: this.updatedWorker.name.trim(),
        salary: this.updatedWorker.salary.trim(),
        email: this.updatedWorker.email.trim(),
        phone: this.updatedWorker.phone.trim(),
        company: this.updatedWorker.company.trim(),
        driverslicense: this.updatedWorker.driverslicense.trim(),
        professionId: this.updatedWorker.profession,
      };
    
      // Remove fields with empty values
      Object.keys(nonEmptyFields).forEach(key => {
        if (!nonEmptyFields[key]) {
          delete nonEmptyFields[key];
        }
      });
    
      // Check if there are any non-empty fields
      if (Object.keys(nonEmptyFields).length === 0) {
        // All fields are empty, just close the modal
        console.log('No fields provided for update. Closing modal.');
        // Close the modal
        $('#updateWorkerModal').modal('hide');
        return;
      }
    
      // Make a PUT request to update the worker
      fetch(`http://localhost:7070/workers/${this.updatedWorker.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nonEmptyFields),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(async updatedWorker => {
          // Handle the response from the server
          console.log('Worker updated:', updatedWorker);

          if (nonEmptyFields.professionId) {
            await this.associateProfessionWithWorker(updatedWorker.id, nonEmptyFields.professionId);
          }
    
          // Close the modal after updating
          $('#updateWorkerModal').modal('hide');
    
          // Fetch the updated list of workers
          return fetch('http://localhost:7070/workers');
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(workers => {
          // Update the workers array with the updated list
          this.workers = workers;
        })
        .catch(error => {
          console.error('Error updating worker:', error);
          // Handle the error appropriately (e.g., show an error message)
        });
    },
    
      
    
    prepareDeleteWorker(workerInModal) {
      // Set the worker to be deleted
      this.workerToDelete = workerInModal;
    
      // Show the delete confirmation modal
      let deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'), {});
      deleteConfirmationModal.show();
    },
    
    async deleteWorker() {
      if (this.workerToDelete) {
        try {
          // Fetch workersInProfession data
          const wIPLink = await fetch(`http://localhost:7070/workersInProfession?workerId=${this.workerToDelete.id}`);
          const wIPArray = await wIPLink.json();
    
          // Log the response from workersInProfession
          console.log('WorkersInProfession response:', wIPArray);
    
          const existingEntry = wIPArray.find(entry => entry.workerId === this.workerToDelete.id);
    
          if (existingEntry) {
            // Delete entry from workersInProfession
            await this.deleteWIP(existingEntry);
          }
    
          // Delete worker
          console.log('Deleting worker with id:', this.workerToDelete.id);
          const deleteWorkerResponse = await fetch(`http://localhost:7070/workers/${this.workerToDelete.id}`, {
            method: 'DELETE',
          });

          
    
          console.log('Delete worker response:', deleteWorkerResponse.status);
    
          if (!deleteWorkerResponse.ok) {
            throw new Error(`HTTP error! Status: ${deleteWorkerResponse.status}`);
          }
    
          // Remove the deleted worker from the workers array
          this.workers = this.workers.filter(worker => worker.id !== this.workerToDelete.id);
    
          // Hide the modals
          $('#workerInfoInModal').modal('hide');
        } catch (error) {
          console.error('Error deleting worker:', error);
          // Handle the error appropriately (e.g., show an error message)
        }
      }
    },
    
    async deleteWIP(existingEntry) {
      try {
        console.log('Deleting entry from workersInProfession:', existingEntry);
        const deleteWIPResponse = await fetch(`http://localhost:7070/workersInProfession/${existingEntry.id}`, {
          method: 'DELETE',
        });
    
        console.log('Deleted entry from workersInProfession:', await deleteWIPResponse.json());
      } catch (error) {
        console.error('Error deleting workersInProfession entry:', error);
        // Handle the error appropriately (e.g., show an error message)
      }
    },

    //ORDERS
    async fetchWorkerData() {
      try {
          const response = await fetch('http://localhost:7070/workers');
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          this.workers = await response.json();
          console.log('Workers:', this.workers);
      } catch (error) {
          console.error('Error fetching workers:', error.message);
      }
  },
  async fetchClientData() {
      try {
          const response = await fetch('http://localhost:7070/clients');
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          this.clients = await response.json();
          console.log('Clients:', this.clients);
      } catch (error) {
          console.error('Error fetching clients:', error.message);
      }
  },
  async fetchOrders() {
      try {
          const response = await fetch('http://localhost:7070/orders');
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          this.orders = await response.json();
      } catch (error) {
          console.error('Error fetching orders:', error.message);
      }
  },
  getWorkerName(workerId) {
      const worker = this.workers.find(w => w.id === workerId);
      return worker ? worker.name : 'Unknown';
  },
  getClientName(clientId) {
      const client = this.clients.find(c => c.id === clientId);
      return client ? client.name : 'Unknown';
  },
  async getOrder(id) {
      try {
          const orderResponse = await fetch(`http://localhost:7070/orders/${id}`);
          const orderData = await orderResponse.json();
          const workerId = orderData.workerId;
          const clientId = orderData.clientId;

          const workerResponse = await fetch(`http://localhost:7070/workers/${workerId}`);
          const workerData = await workerResponse.json();

          const clientResponse = await fetch(`http://localhost:7070/clients/${clientId}`);
          const clientData = await clientResponse.json();

          this.orderInModal = {
              id: orderData.id,
              name: orderData.name,
              worker: workerData.name,
              client: clientData.name,
              duration: orderData.duration,
              status: orderData.status,
              info: orderData.info
          };

          this.showOrderModal();
      } catch (error) {
          console.error('Error fetching order data:', error);
      }
  },
  showOrderModal() {
      let orderInfoInModal = new bootstrap.Modal(document.getElementById('orderInfoInModal'), {});
      orderInfoInModal.show();
  },
  closeOrderInfoModal() {
      let orderInfoInModal = new bootstrap.Modal(document.getElementById('orderInfoInModal'), {});
      orderInfoInModal.hide();
  },
  createOrderModal() {
    // Clear the form data
    this.newOrder = {
      worker: '',
      client: '',
      duration: '',
      status: '',
      info: '',
      
    };
  
    // Open the createOrderModal
    let createOrderModal = new bootstrap.Modal(document.getElementById('createOrderModal'), {});
    createOrderModal.show();
  },
  
  createNewOrder() {
    // Check if the worker and client IDs are selected
    if (!this.newOrder.worker || !this.newOrder.client) {
        console.error('Error: Please select a worker and client');
        return;
    }

    // Create the request body with the selected worker and client IDs
    const requestBody = {
        workerId: this.newOrder.worker,
        clientId: this.newOrder.client,
        duration: this.newOrder.duration,
        status: this.newOrder.status,
        info: this.newOrder.info,
    };

    // Implement the logic for creating a new order here
    console.log('Creating new order:', requestBody);

    // Make a POST request to create a new order
    fetch('http://localhost:7070/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(async order => {
        // Handle the response from the server
        console.log('New order created:', order);

        // Add the new order to the orders array
        this.orders.push(order);

        // Close the modal after creating
        $('#createOrderModal').modal('hide');
    })
    .catch(error => {
        console.error('Error creating new order:', error);
        // Handle the error appropriately (e.g., show an error message)
      });
  },
},
mounted() {
  this.fetchWorkerData();
  this.fetchClientData();
  this.fetchOrders();
},
}).mount('#app');
