export async function fetchTicketEvents(){
    const response = await fetch('https://localhost:7011/api/Event/GetAll');
    const data=await response.json();
    return data;
  }

  // export async function fetchEventsByVenueIdAndEventType(venueId, eventType) {
   
  //     const response = await fetch(`http://localhost:9090/event/events?venueId=${venueId}&eventType=${eventType}`);
  //     const data=await response.json();
  //     return data;

  // }
  
  export async function fetchOrders() {
    const response = await fetch('https://localhost:7011/api/Order/GetAll');
    const orders = await response.json();
  
    orders.forEach(order => {
      order.totalPrice = parseFloat(order.totalPrice);
    });
  
    return orders;
  
  }
  
  
 export async function placeOrder(orderData) {
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

  export async function deleteOrder(orderId) {
    try {
      const response = await fetch(`https://localhost:7011/api/Order/Delete?id=${orderId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        return { success: true, message: 'Event deleted successfully.' };
  
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message };
      }
  
    } catch (error) {
      return { success: false, message: 'An error occurred while deleting the event.' };
    }
  }
  
 export async function patchOrders(orderId, numberOfTickets, ticketCategoryId) {
    const url = `https://localhost:7011/api/Order/Patch`;
    const patchData = {
      orderId: orderId,
      numberOfTickets: numberOfTickets,
      ticketCategoryId: ticketCategoryId
    };
  
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchData)
      });
     console.log(response);
  
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }