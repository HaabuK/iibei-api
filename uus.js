    //ORDERS
    async fetchWorkerData() {
        try {
          const response = await fetch('http://localhost:7070/workers');
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          this.professions = await response.json();
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
      closeOrderrInfoModal() {
        let orderInfoInModal = new bootstrap.Modal(document.getElementById('orderInfoInModal'), {});
        orderInfoInModal.hide();
      },
  
      getOrder: async function (id) {
        try {
          // Fetch order data
          const orderResponse = await fetch(`http://localhost:7070/orders/${id}`);
          const orderData = await orderResponse.json();
          const WorkerId = orderData.workerId;
          const ClientId = orderData.clientId;
      
          // Fetch worker data
          const workerLink = await fetch(`http://localhost:7070/workers?id=${WorkerId}`);
          const workerArray = await workerLink.json();

          // Fetch client data
          const clientLink = await fetch(`http://localhost:7070/clients?id=${ClientId}`);
          const clientArray = await clientLink.json();
      
          console.log('Workers response:', workerArray);
          console.log('Clients response:', clientArray);
          }
      
          // Find the correct workersInProfession entry for the worker
          //const wIP = wIPArray.find(entry => entry.workerId === id);
      
          // Check if a matching entry was found
        //   if (!wIP) {
        //     console.error('No matching workersInProfession entry found for worker ID:', id);
        //     this.workerInModal = {
        //       id: workerData.id,
        //       name: workerData.name,
        //       profession: 'Not Assigned',
        //       salary: workerData.salary,
        //       email: workerData.email,
        //       phone: workerData.phone,
        //       company: workerData.company,
        //       driverslicense: workerData.driverslicense,
        //     };
        
        //     // Manually trigger the modal to open using Bootstrap
        //     this.showWorkerModal();
        //     return;
        //   }
      
        //   // Check if professionId is defined
        //   if (!wIP.professionId) {
        //     console.error('ProfessionId is undefined');
        //     return;
        //   }
      
          // Set the orderInModal data
          this.orderInModal = {
            id: orderData.id,
            worker: workerData.name,
            client: clientData.name,
            duration: orderData.duration,
            status: orderData.status,
            info: orderData.info,
            
          };
      
          // Manually trigger the modal to open using Bootstrap
          this.showOrderModal();
        } catch (error) {
          console.error('Error fetching order data:', error);
        }
      },
         
      showOrderModal: function () {
        // Show the orderInfoInModal
        let orderInfoInModal = new bootstrap.Modal(document.getElementById('orderInfoInModal'), {});
        orderInfoInModal.show();
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
      }  
  