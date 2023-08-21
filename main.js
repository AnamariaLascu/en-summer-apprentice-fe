 //Imports
 import { removeLoader, addLoader} from './loader.js';
 import { fetchTicketEvents, fetchOrders } from './api.js';
 import {renderOrders} from './ordersUtils.js'
 import { renderEventCard} from './eventsUtils.js';
 import {eventImages, setupFilterButton} from './eventsUtils.js'
 
 // Navigate to a specific URL
 function navigateTo(url) {
   history.pushState(null, null, url);
   renderContent(url);
 }
 // HTML templates
 function getHomePageTemplate() {
   return `
     <div id="content">
       <div class="search-container">
         <div class="filter-container">
           <input type="text" id="eventNameFilter" placeholder="Enter event name">
           <button class="btn btn-filter" id="filterEventsBtn"><i class="fas fa-search"></i> Filter By Event Name</button>
         </div>
       </div>
       <div class="events flex items-center justify-center flex-wrap">
       </div>
     </div>
   `;
 }
 
 
 export function getOrdersPageTemplate() {
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
    // setupSortButtons();
   });
 }
 

 
 function setupInitialPage() {
   const initialUrl = window.location.pathname;
   renderContent(initialUrl);
 }
 
 async function renderHomePage() {
   const mainContentDiv = document.querySelector('.main-content-component');
   mainContentDiv.innerHTML = getHomePageTemplate();
 
   addLoader();
 
   try {
     const eventsData = await fetchTicketEvents();
     const eventsContainer = document.querySelector('.events');
    //eventsContainer.innerHTML='';
     eventsData.forEach((eventData, index) => {
       const eventImage = eventImages[index];
       renderEventCard(eventData, eventImage, eventsContainer);
     });
 
     setupFilterButton();
 
     setTimeout(() => {
       removeLoader();
     }, 200);
   } catch (error) {
     console.error('Error rendering home page:', error);
     removeLoader();
   }
 }
 
 async function renderOrdersPage() {
   const mainContentDiv = document.querySelector('.main-content-component');
   mainContentDiv.innerHTML = getOrdersPageTemplate();
 
   addLoader();
 
   try {
     const initialOrdersData = await fetchOrders();
     await renderOrders(initialOrdersData);
 
   } catch (error) {
     console.error('Error rendering orders:', error);
 
   } finally {
     removeLoader();
   }
 }
 
 
 // Render content based on URL
 function renderContent(url) {
   const mainContentDiv = document.querySelector('.main-content-component');
   mainContentDiv.innerHTML = '';
 
   if (url === '/') {
     renderHomePage();
   } else if (url === '/orders') {
     renderOrdersPage();
   }
 }
 
 // Call the setup functions
 setupNavigationEvents();
 setupMobileMenuEvent();
 setupPopstateEvent();
 setupInitialPage();