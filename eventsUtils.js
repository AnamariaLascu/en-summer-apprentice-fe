import { addLoader, removeLoader } from './loader.js';
import { fetchTicketEvents } from './api.js';

export const eventImages = [
          'src/assets/untold_logo.png',
          'src/assets/electric_logo.jpg',
          'src/assets/football.png',
          'src/assets/wine_logo.jpg',
        ];

export const eventIdToImageIndexMap = {
    1: 0, // Untold
    2: 1, // Electric Castle
    3: 2, // Meci de fotbal
    4: 3, // Wine festival
  };
  
export async function renderEventCard(eventData, eventImage, eventsContainer) {
      console.log(`Rendering event card for ${eventData.eventName}`);
    const eventCard = document.createElement('div');
    eventCard.classList.add('event-card');
  
    const eventImageIndex = eventIdToImageIndexMap[eventData.eventId];
   eventImage = eventImages[eventImageIndex];
  
    const eventCardMarkup = getEventCardTemplate(eventData, eventImage);
    eventCard.innerHTML = eventCardMarkup;
    eventsContainer.appendChild(eventCard);
  
    // Add event listeners and logic related to the event card
    const buyTicketsButton = eventCard.querySelector('#buyTicketsBtn');
    const ticketCategorySelect = eventCard.querySelector(`.ticket-category-${eventData.eventId}`);
    const quantityInput = eventCard.querySelector('.ticket-quantity-input');

    buyTicketsButton.addEventListener('click', async () => 
    {
     const ticketCategorySelect= document.querySelector(`.ticket-category-${eventData.eventId}`);
     const selectedTicketCategory=ticketCategorySelect.value;

     console.log(selectedTicketCategory);
      const eventID = eventData.eventId; // ID-ul evenimentului
      console.log(eventID);
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
  
  //setupFilterButton(); // Configurarea butonului de filtrare

  setTimeout(() => {
    removeLoader();
  }, 200);

}
  export function getEventCardTemplate(eventData, eventImage) {
    return `
      <div class="card">
        <header>
          <h2 class="event-title text-2xl font-bold">${eventData.eventName}</h2>
        </header>
        <div class="content">
          <img src="${eventImage}" alt="Event Image" class="event-image">
          <p class="description text-gray-700">${eventData.eventDescription}</p>
          <div class="dropdowns absolute bottom-0 right-0 p-4 bg-white border rounded shadow-md">
            <p class="font-bold mb-2">Choose the Ticket Category:</p>
            <select class='ticket-category-${eventData.eventId} mb-2'>
              <option value="${eventData.ticketCategory[0].ticketCategoryId}">${eventData.ticketCategory[0].description}</option>
              <option value="${eventData.ticketCategory[1].ticketCategoryId}">${eventData.ticketCategory[1].description}</option>
            </select>
            <div class="quantity">
  <button class="btn btn-quantity margin-left:10px" data-action="decrement">-</button>
  <input type="number" class="ticket-quantity-input" value="0">
  <button class="btn btn-quantity" data-action="increment">+</button>
</div>

            <button class="btn btn-primary mt-4 mx-auto block rounded-full font-bold bg-purple-600 py-2 px-6" id="buyTicketsBtn">Buy Tickets</button>
          </div>
        </div>
      </div>
    `;
  }

export function setupFilterButton() {
    const filterEventsBtn = document.getElementById('filterEventsBtn');
    const eventNameFilter = document.getElementById('eventNameFilter');
  
    filterEventsBtn.addEventListener('click', async () => {
      const eventName = eventNameFilter.value;
      await setupAndRenderEvents(eventName);
    });
  }

  export async function renderFilteredEvents(eventName) {
    const eventsContainer = document.querySelector('.events');
    eventsContainer.innerHTML = '';
  
    addLoader();
  
    try {
      const eventsData = await fetchTicketEvents();
      const filteredEvents = eventsData.filter(eventData =>
        eventData.eventName.toLowerCase().includes(eventName.toLowerCase())
      );
  
      filteredEvents.forEach((eventData) => {
        const eventImageIndex = eventIdToImageIndexMap[eventData.eventId];
        const eventImage = eventImages[eventImageIndex];
        renderEventCard(eventData, eventImage, eventsContainer);
      });
      
    } catch (error) {
      console.error('Error rendering filtered events:', error);
    } finally {
      removeLoader();
    }
  }

  async function setupAndRenderEvents(eventName) {
    await fetchTicketEvents();

    renderFilteredEvents(eventName);
  }
  
  