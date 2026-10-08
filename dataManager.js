const DataManager = (function () {
    let products = [];
    let filteredProducts = [];

    async function initializeData() {
        try {
            const response = await fetch('api/products.php');
            if (!response.ok) throw new Error('API fetch failed');
            const result = await response.json();
            products = result.data;
        } catch (error) {
            console.warn('Backend API unavailable. Loading local fallback product dataset.');
            products = [
                { id: 1, sku: 'TF-DUMB-001', name: 'Adjustable Dumbbell Set (20kg)', category: 'Free Weights', price: 149.99, quantity: 12, reorderLevel: 15, status: 'low stock' },
                { id: 2, sku: 'TF-MAT-002', name: 'Non-Slip Yoga Mat (6mm)', category: 'Accessories', price: 29.50, quantity: 45, reorderLevel: 10, status: 'in stock' },
                { id: 3, sku: 'TF-TREAD-003', name: 'Pro Treadmill Pro-Run 5000', category: 'Cardio', price: 899.00, quantity: 4, reorderLevel: 5, status: 'low stock' },
                { id: 4, sku: 'TF-BAND-004', name: 'Resistance Band Set (5 Levels)', category: 'Accessories', price: 19.99, quantity: 0, reorderLevel: 20, status: 'out of stock' },
                { id: 5, sku: 'TF-BENCH-005', name: 'Multi-Angle Weight Bench', category: 'Strength', price: 199.99, quantity: 18, reorderLevel: 8, status: 'in stock' },
                { id: 6, sku: 'TF-KETTLE-006', name: 'Cast Iron Kettlebell (16kg)', category: 'Free Weights', price: 54.00, quantity: 25, reorderLevel: 10, status: 'in stock' },
                { id: 7, sku: 'TF-RACK-007', name: 'Heavy Duty Power Rack', category: 'Strength', price: 650.00, quantity: 3, reorderLevel: 5, status: 'low stock' }
            ];
        }
        filteredProducts = [...products];
        return filteredProducts;
    }

    function getProducts() {
        return filteredProducts;
    }

    function getAllProducts() {
        return products;
    }

    function applyFilters({ query = '', category = 'all', status = 'all' }) {
        filteredProducts = products.filter(product => {
            const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) || 
                                 product.sku.toLowerCase().includes(query.toLowerCase());
            const matchesCategory = category === 'all' || product.category === category;
            const matchesStatus = status === 'all' || product.status === status;
            return matchesQuery && matchesCategory && matchesStatus;
        });
        return filteredProducts;
    }

    function getStockStatistics() {
        const totalProducts = products.length;
        const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        const lowStockCount = products.filter(p => p.status === 'low stock').length;
        const outOfStockCount = products.filter(p => p.status === 'out of stock').length;

        return { totalProducts, totalValue, lowStockCount, outOfStockCount };
    }

    function getCategorySummary() {
        const summary = {};
        products.forEach(p => {
            const val = p.price * p.quantity;
            summary[p.category] = (summary[p.category] || 0) + val;
        });
        return summary;
    }

    function getStockStatusDistribution() {
        const counts = { 'in stock': 0, 'low stock': 0, 'out of stock': 0 };
        products.forEach(p => {
            if (counts[p.status] !== undefined) counts[p.status]++;
        });
        return counts;
    }

    function getTopProductsByValue(limit = 5) {
        return [...products]
            .map(p => ({ ...p, totalVal: p.price * p.quantity }))
            .sort((a, b) => b.totalVal - a.totalVal)
            .slice(0, limit);
    }

    function getLowStockProducts() {
        return products.filter(p => p.quantity <= p.reorderLevel);
    }

    function exportToCSV(filename = 'trackfit_inventory.csv') {
        if (filteredProducts.length === 0) return;

        const headers = ['SKU', 'Product Name', 'Category', 'Unit Price ($)', 'Quantity', 'Total Value ($)', 'Status'];
        const rows = filteredProducts.map(p => [
            `"${p.sku}"`,
            `"${p.name}"`,
            `"${p.category}"`,
            p.price.toFixed(2),
            p.quantity,
            (p.price * p.quantity).toFixed(2),
            `"${p.status}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function simulateInventoryChange() {
        if (products.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * products.length);
        const item = products[randomIndex];
        const change = Math.floor(Math.random() * 5) - 2; 
        item.quantity = Math.max(0, item.quantity + change);

        if (item.quantity === 0) item.status = 'out of stock';
        else if (item.quantity <= item.reorderLevel) item.status = 'low stock';
        else item.status = 'in stock';

        return item;
    }

    return {
        initializeData,
        getProducts,
        getAllProducts,
        applyFilters,
        getStockStatistics,
        getCategorySummary,
        getStockStatusDistribution,
        getTopProductsByValue,
        getLowStockProducts,
        exportToCSV,
        simulateInventoryChange
    };
})();