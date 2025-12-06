export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    // Format date as 'MMM DD, YYYY' (e.g., 'Jan 01, 2024')
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function formatCurrency(amount: number): string {
    // Formatted currency string (e.g., '$1,234.56')
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}