const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/.netlify/functions' 
  : 'http://localhost:8888/.netlify/functions';

export const api = {
  // Get all invoices
  async getInvoices() {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  // Get single invoice
  async getInvoice(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoice');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  // Create new invoice
  async createInvoice(invoiceData) {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create invoice');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  // Update invoice
  async updateInvoice(id, invoiceData) {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update invoice');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  // Delete invoice
  async deleteInvoice(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete invoice');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },
};
