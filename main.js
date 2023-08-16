//Imports
import { removeLoader, addLoader} from './loader.js';

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      <div class="sort-buttons">
        <button class="btn btn-sort" id="sortAscendingBtn">Sort Ascending By Price</button>
        <button class="btn btn-sort" id="sortDescendingBtn">Sort Descending By Price</button>
      </div>
      <div class="orders"></div>
    </div>
  `;
}


function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
    setupSortButtons();
  });
}

function setupSortButtons() {
  const sortAscendingBtn = document.getElementById('sortAscendingBtn');
  sortAscendingBtn.addEventListener('click', () => {
    sortOrders(true);
  });

  const sortDescendingBtn = document.getElementById('sortDescendingBtn');
  sortDescendingBtn.addEventListener('click', () => {
    sortOrders(false);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}


// async function renderOrders() {
//   const ordersData = await fetchOrders();
//   const ordersContainer = document.querySelector('.orders');
//   ordersContainer.innerHTML = '';
//   for (const orderData of ordersData) {
//     const orderCard = await renderOrderCard(orderData);
//     ordersContainer.appendChild(orderCard);
//   }
// }

async function sortOrders(ascending) {
  const ordersData = await fetchOrders();
  ordersData.sort((a, b) => {
    return ascending ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice;
  });

  const ordersContainer = document.querySelector('.orders');
  ordersContainer.innerHTML = '';

  for (const orderData of ordersData) {
    const orderCard = await renderOrderCard(orderData);
    ordersContainer.appendChild(orderCard);
  }
}

async function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  
  mainContentDiv.innerHTML = getHomePageTemplate();

  addLoader();
  
  setTimeout(async () => {

  const eventsData = await fetchTicketEvents();
  const eventsContainer = document.querySelector('.events');

  const eventImages = [
    'src/assets/untold_logo.png',
    'src/assets/electric_logo.jpg',
    'src/assets/football.png',
    'src/assets/wine_logo.jpg',
  ];

  eventsData.forEach((eventData, index) => {
    const eventCard = document.createElement('div');
    eventCard.classList.add('event-card');
    const eventImage = eventImages[index];
    const contentMarkup = `
    <div class ="card">
      <header>
        <h2 class="event-title text-2xl font-bold">${eventData.eventName}</h2>
      </header>
      <div class="content">
      <img src="${eventImages[index]}" alt="Event Image" class="event-image">
        <p class="description text-gray-700">${eventData.eventDescription}</p>
        <div class="dropdowns absolute bottom-0 right-0 p-4 bg-white border rounded shadow-md">
          <p class="font-bold mb-2">Choose the Ticket Category:</p>
          <select class='ticket-category-${eventData.eventId} mb-2'">
             <option value="${eventData.ticketCategory[0].ticketCategoryId}">${eventData.ticketCategory[0].description}</option>
             <option value="${eventData.ticketCategory[1].ticketCategoryId}">${eventData.ticketCategory[1].description}</option>
           </select>

          <div class="quantity">
            <input type="number" class="ticket-quantity-input" value="0">
            <button class="btn btn-quantity" data-action="increment">+</button>
            <button class="btn btn-quantity" data-action="decrement">-</button>
          </div>
          <button class="btn btn-primary mt-4 mx-auto block rounded-full font-bold bg-purple-600 py-2 px-6" id="buyTicketsBtn">Buy Tickets</button>
        </div>
      </div>
      </div>
    `;

    eventCard.innerHTML = contentMarkup;
    eventsContainer.appendChild(eventCard);

    const buyTicketsButton = eventCard.querySelector('#buyTicketsBtn');
    const ticketCategorySelect = eventCard.querySelector(`.ticket-category-${eventData.eventId}`);
    const quantityInput = eventCard.querySelector('.ticket-quantity-input');

    buyTicketsButton.addEventListener('click', async () => 
    {
     const ticketCategorySelect= document.querySelector(`.ticket-category-${eventData.eventId}`);
     const selectedTicketCategory=ticketCategorySelect.value;
     console.log(selectedTicketCategory);
      const eventID = eventData.eventId; // ID-ul evenimentului
      const ticketCategoryID = parseInt(ticketCategorySelect.value);
      const numberOfTickets = parseInt(quantityInput.value);

      if (numberOfTickets === 0) {
        toastr.error('You must select at least 1 ticket to place an order.');
        return;
      }

      const orderData = {
        eventID,
        ticketCategoryID:selectedTicketCategory,
        numberOfTickets
      };
console.log(JSON.stringify(orderData));

      addLoader();
      try {
        const response = await placeOrder(orderData);
        console.log('Order placed:', response);
        toastr.success('Order placed successfully!');
      } catch (err) {
        console.error('Error placing order:', err);
        toastr.error('Error placing order');
      }
      finally {
        removeLoader();
      }
      ticketCategorySelect.value = eventData.ticketCategory[0].ticketCategoryId;
      quantityInput.value = '0';
    });

    const dropdowns = eventCard.querySelector('.dropdowns');
    const incrementButton = eventCard.querySelector('[data-action="increment"]');
    const decrementButton = eventCard.querySelector('[data-action="decrement"]');

    quantityInput.addEventListener('input', () => {
      const currentValue = parseInt(quantityInput.value);
    
      if (currentValue < 0) {
        quantityInput.value = 0;
      }
    });

    incrementButton.addEventListener('click', () => {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue >= 0) {
        quantityInput.value = currentValue + 1;
      }
    });

    decrementButton.addEventListener('click', () => {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue > 0) {
        quantityInput.value = currentValue - 1;
      }
    });
  });
  setTimeout(() => {
    removeLoader();
  }, 200);
}, 200);
}


async function fetchTicketEvents(){
  const response = await fetch('https://localhost:7011/api/Event/GetAll');
  const data=await response.json();
  return data;
}

async function fetchOrders() {
  const response = await fetch('https://localhost:7011/api/Order/GetAll');
  const orders = await response.json();

  orders.forEach(order => {
    order.totalPrice = parseFloat(order.totalPrice);
  });

  return orders;

}


async function placeOrder(orderData) {
  const url = 'http://localhost:9090/orders/createOrder';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(orderData), 
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Fetch error:', error);

  }

}

async function renderOrderCard(orderData) {
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
  `;

  orderCard.innerHTML = contentMarkup;
  return orderCard;
}

async function renderOrdersPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  addLoader();

  setTimeout(async () => {
  const ordersData = await fetchOrders();

  const ordersContainer = document.createElement('div');
  ordersContainer.classList.add('orders');

  const ordersTitle = document.createElement('h1');
  ordersTitle.classList.add('orders-title');
  ordersContainer.appendChild(ordersTitle);

  for (const orderData of ordersData) {
    const orderCard = await renderOrderCard(orderData);
    ordersContainer.appendChild(orderCard);
  }

  mainContentDiv.appendChild(ordersContainer);
  setupSortButtons();

  setTimeout(() => {
    removeLoader();
  }, 200);
}, 200);
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
