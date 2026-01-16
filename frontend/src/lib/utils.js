// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Format date
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format date and time
export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Generate slug from string
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Truncate text
export function truncate(text, length = 100) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Calculate discount percentage
export function calculateDiscountPercent(originalPrice, discountPrice) {
  if (!discountPrice || discountPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
}

// Validate email
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Get order status color
export function getOrderStatusColor(status) {
  const colors = {
    pending: 'text-yellow-500 bg-yellow-500/20',
    paid: 'text-green-500 bg-green-500/20',
    processing: 'text-blue-500 bg-blue-500/20',
    shipped: 'text-purple-500 bg-purple-500/20',
    delivered: 'text-gold bg-gold/20',
    cancelled: 'text-red-500 bg-red-500/20',
    refunded: 'text-gray-500 bg-gray-500/20',
  };
  return colors[status] || colors.pending;
}

// Check if product is in stock
export function isInStock(product) {
  return product.stock_quantity > 0;
}

// Get stock status text
export function getStockStatus(quantity) {
  if (quantity === 0) return 'Out of Stock';
  if (quantity < 5) return 'Low Stock';
  return 'In Stock';
}

// Get stock status color
export function getStockStatusColor(quantity) {
  if (quantity === 0) return 'text-red-500';
  if (quantity < 5) return 'text-yellow-500';
  return 'text-green-500';
}
