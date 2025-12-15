export function createPageUrl(pageName, params = {}) {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    return `/${pageName.toLowerCase()}${query ? `?${query}` : ''}`;
}

export function formatDate(date, format = 'MMM dd, yyyy') {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });
}

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