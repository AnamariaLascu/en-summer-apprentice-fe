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
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}


// async function renderHomePage() {
//   const mainContentDiv = document.querySelector('.main-content-component');
//   mainContentDiv.innerHTML = getHomePageTemplate();

//   const eventsData = await fetchTicketEvents();

//   const eventsContainer = document.querySelector('.events');

//   eventsData.forEach(eventData => {
//     const eventCard = document.createElement('div');
//     eventCard.classList.add('event-card');

//     const contentMarkup = `
//       <header>
//         <h2 class="event-title text-2xl font-bold">${eventData.eventName}</h2>
//       </header>
//       <div class="content">
//         <p class="description text-gray-700">${eventData.eventDescription}</p>
//         <div class="dropdowns absolute bottom-0 right-0 p-4 bg-white border rounded shadow-md">
//         <p class="font-bold mb-2">Choose the Ticket Category:</p>
//           <select class="ticket-category mb-2">
//             <option value="Standard">Standard</option>
//             <option value="Vip">VIP</option>
//           </select>

//           <div class="quantity">
//             <input type="number" class="ticket-quantity-input" value="0"> <!-- Setează valoarea implicită aici -->
//             <button class="btn btn-quantity" data-action="increment">+</button>
//             <button class="btn btn-quantity" data-action="decrement">-</button>
//           </div>
//           <button class="btn btn-primary mt-4 mx-auto block rounded-full font-bold bg-purple-600 py-2 px-6">Buy Tickets</button>

//         </div>
//       </div>
//     `;

//     eventCard.innerHTML = contentMarkup;
//     eventsContainer.appendChild(eventCard);

//     const dropdowns = eventCard.querySelector('.dropdowns');
//     const quantityInput = eventCard.querySelector('.ticket-quantity-input');
//     const incrementButton = eventCard.querySelector('[data-action="increment"]');
//     const decrementButton = eventCard.querySelector('[data-action="decrement"]');

//     incrementButton.addEventListener('click', () => {
//       let currentValue = parseInt(quantityInput.value);
//       if (currentValue >= 0) {
//         quantityInput.value = currentValue + 1;
//       }
//     });
    
//     decrementButton.addEventListener('click', () => {
//       let currentValue = parseInt(quantityInput.value);
//       if (currentValue > 0) {
//         quantityInput.value = currentValue - 1;
//       }
//     });
    
//   });

//   const buyTicketsButton = eventCard.querySelector('#buyTicketsBtn');
//     const ticketCategorySelect = eventCard.querySelector('.ticket-category');
//     const quantityInput = eventCard.querySelector('.ticket-quantity-input');

//     buyTicketsButton.addEventListener('click', async () => {
//       const eventID = eventsData.id; // ID-ul evenimentului
//       const ticketCategoryID = parseInt(ticketCategorySelect.value);
//       const numberOfTickets = parseInt(quantityInput.value);

//       const orderData = {
//         eventID,
//         ticketCategoryID,
//         numberOfTickets
//       };

//       try {
//         const response = await placeOrder(orderData);
//         console.log('Order placed:', response);
//         // Aici puteți efectua acțiunile necesare după ce a fost plasată comanda
//       } catch (error) {
//         console.error('Error placing order:', error);
//       }
//     });

    
// }

async function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  const eventsData = await fetchTicketEvents();
  const eventsContainer = document.querySelector('.events');

  eventsData.forEach(eventData => {
    const eventCard = document.createElement('div');
    eventCard.classList.add('event-card');
console.log(eventData);
    const contentMarkup = `
      <header>
        <h2 class="event-title text-2xl font-bold">${eventData.eventName}</h2>
      </header>
      <div class="content">
        <p class="description text-gray-700">${eventData.eventDescription}</p>
        <div class="dropdowns absolute bottom-0 right-0 p-4 bg-white border rounded shadow-md">
          <p class="font-bold mb-2">Choose the Ticket Category:</p>
          <select class='ticket-category-${eventData.eventId} mb-2'">
             <option value="1">${eventData.ticketCategory[0].description}</option>
             <option value="2">${eventData.ticketCategory[0].description}</option>
           </select>

          <div class="quantity">
            <input type="number" class="ticket-quantity-input" value="0">
            <button class="btn btn-quantity" data-action="increment">+</button>
            <button class="btn btn-quantity" data-action="decrement">-</button>
          </div>
          <button class="btn btn-primary mt-4 mx-auto block rounded-full font-bold bg-purple-600 py-2 px-6" id="buyTicketsBtn">Buy Tickets</button>
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

      const orderData = {
        eventID,
        ticketCategoryID:selectedTicketCategory,
        numberOfTickets
      };
console.log(JSON.stringify(orderData));
      try {
        const response = await placeOrder(orderData);
        console.log('Order placed:', response);
        // Aici puteți efectua acțiunile necesare după ce a fost plasată comanda
      } catch (error) {
        console.error('Error placing order:', error);
      }
    });

    const dropdowns = eventCard.querySelector('.dropdowns');
   // const quantityInput = eventCard.querySelector('.ticket-quantity-input');
    const incrementButton = eventCard.querySelector('[data-action="increment"]');
    const decrementButton = eventCard.querySelector('[data-action="decrement"]');

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
}




async function fetchTicketEvents(){
  const response = await fetch('https://localhost:7011/api/Event/GetAll');
  const data=await response.json();
  return data;
}

async function placeOrder(orderData) {
  const url = 'http://localhost:9090/orders/createOrder';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Set the appropriate content type
      // Add any additional headers if needed
    },

    body: JSON.stringify(orderData), // Convert your data to JSON
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


// Call the placeOrder function with the order data

// placeOrder(orderData).then(data => {
//   console.log('Order placed:', data);
//   // Process the response data as needed

// });

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
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
