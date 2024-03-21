   
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
        // Check if the name is empty
        if (!this.newOrder.worker()) {
          // Handle the case where the name is empty (you can show an error message)
          console.error('Error: Name cannot be empty');
          // Close the modal
          $('#createOrderModal').modal('hide');
          return;
        }
      
        // Check if a profession is selected
        if (!this.newOrder.client) {
          // Handle the case where no profession is selected (show an error message)
          console.error('Error: Please select a client');
          return;
        }
      
        // Create the request body with the selected profession
        const requestBody = {
          worker: this.newOrder.worker,
          client: this.newOrder.client,
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
  