import { addLoader, removeLoader } from './loader.js';
import { placeOrder, fetchOrders, deleteOrder, patchOrders } from './api.js';
import { getOrdersPageTemplate } from './main.js';

export async function setupSortButtons() {
    const sortAscendingBtn = document.getElementById('sortAscendingBtn');
    const sortDescendingBtn = document.getElementById('sortDescendingBtn');
  
    sortAscendingBtn.addEventListener('click', async () => {
      const ordersData = await fetchOrders();
      const sortedOrdersData = ordersData.slice().sort((a, b) => a.totalPrice - b.totalPrice);
      renderOrders(sortedOrdersData); // Afisam comenzile sortate
    });
  
    sortDescendingBtn.addEventListener('click', async () => {
      const ordersData = await fetchOrders();
      const sortedOrdersData = ordersData.slice().sort((a, b) => b.totalPrice - a.totalPrice);
      renderOrders(sortedOrdersData); // Afisam comenzile sortate
    });
  }

export async function renderOrderCard(orderData) {
    const orderCard = document.createElement('div');
    orderCard.classList.add('order-card');
  
    const contentMarkup = `
      <div class="order-details">
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Date:</strong> ${orderData.orderedAt}</p>
        <p><strong>Ticket Category:</strong> ${orderData.ticketCategory}</p>
        <p><strong>Number of Tickets:</strong> ${orderData.numberOfTickets}</p>
        <p><strong>Total Price:</strong> ${orderData.totalPrice}</p>
      </div>
      <div class="order-actions">
        <button class="btn btn-modify">Modify</button>
        <button class="btn btn-delete">Delete</button>
      </div>
  
      <div class="edit-controls hidden">
      <label for="ticketCategoryInput">Ticket Category:</label>
      <select id="ticketCategoryInput-${orderData.orderId}" class="ticket-category-input">
          <option value=${orderData.ticketCategoryId} selected>${orderData.ticketCategory}</option>
          <option value="${orderData.ticketCategory === "VIP" ? orderData.ticketCategoryId-4 : orderData.ticketCategoryId+4}">${orderData.ticketCategory === "VIP" ? "Standard" : "VIP"}</option>
      </select>
      <label for="numTicketsInput">Number of Tickets:</label>
      <input type="number" class="num-tickets-input" value="${orderData.numberOfTickets}">
      <button class="btn btn-save">Save</button>
      <button class="btn btn-cancel">Cancel</button>
    </div>
    `;
  
    orderCard.innerHTML = contentMarkup;
  
      const deleteButton = orderCard.querySelector('.btn-delete');
      const modifyButton = orderCard.querySelector('.btn-modify');
      const editControls = orderCard.querySelector('.edit-controls');
      const ticketCategoryInput = editControls.querySelector('.ticket-category-input');
      const numTicketsInput = editControls.querySelector('.num-tickets-input');
      const saveButton = editControls.querySelector('.btn-save');
      const cancelButton = editControls.querySelector('.btn-cancel');
    
      modifyButton.addEventListener('click', () => {
        editControls.classList.remove('hidden');
        // ticketCategoryInput.innerHTML = `
        //   <option value="Standard">Standard</option>
        //   <option value="VIP">VIP</option>
        // `;
        ticketCategoryInput.value = orderData.ticketCategory;
        numTicketsInput.value = orderData.numberOfTickets;
      });
    
      saveButton.addEventListener('click', async () => {
        const newTicketCategory = ticketCategoryInput.value;
        const newNumTickets = parseInt(numTicketsInput.value);
    
        if (newNumTickets <= 0) {
          toastr.error('Invalid input. Please provide a valid number of tickets.');
          return;
        }
    
        try {
          const response = await patchOrders(orderData.orderId, newNumTickets,newTicketCategory );
          if (response != null) {
            if(newTicketCategory<5){
              orderData.ticketCategory ="Standard";
            }
            else {
              orderData.ticketCategory ="VIP";
            }
            //orderData.ticketCategory = newTicketCategory;
            orderData.numberOfTickets = newNumTickets;
            orderData.totalPrice = response.totalPrice;
            editControls.classList.add('hidden');
            // Re-render the card to reflect the updated data
            const updatedOrderCard = await renderOrderCard(orderData);
            orderCard.replaceWith(updatedOrderCard);
          } else {
            toastr.error('Error updating order on the server.');
          }
        } catch (error) {
          console.error(error);
          toastr.error('An error occurred while updating the order.');
        }
      });
    
      cancelButton.addEventListener('click', () => {
        editControls.classList.add('hidden');
      });
  
      deleteButton.addEventListener('click', async () => {
        const confirmation = window.confirm('Are you sure you want to delete this order?');
        if (confirmation) {
          const deletionResult = await deleteOrder(orderData.orderId);
    
          if (deletionResult.success) {
            orderCard.remove();
            console.log('Successful deletion');
          } else {
            console.error(deletionResult.message);
          }
        }
      });
  
    
      return orderCard;
    }

export async function renderOrders(ordersData) {
    const mainContentDiv = document.querySelector('.main-content-component');
    mainContentDiv.innerHTML = getOrdersPageTemplate();
  
    const ordersContainer = document.createElement('div');
    ordersContainer.classList.add('orders');
  
    const ordersTitle = document.createElement('h1');
    ordersTitle.classList.add('orders-title');
    ordersContainer.appendChild(ordersTitle);
  
    mainContentDiv.appendChild(ordersContainer);
  
    for (const orderData of ordersData) {
      const orderCard = await renderOrderCard(orderData);
      ordersContainer.appendChild(orderCard);
    }
  
    setupSortButtons();
  }
