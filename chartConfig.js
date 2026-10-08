const ChartManager = (function () {
    let categoryChartInstance = null;
    let statusChartInstance = null;
    let topProductsChartInstance = null;
    let inventoryTrendChartInstance = null;

    const brandColors = {
        primaryTeal: '#00A8A8',
        secondaryGreen: '#70C149',
        warningYellow: '#F59E0B',
        dangerRed: '#EF4444',
        accentMint: '#99F6E4',
        slateDark: '#334155'
    };

    // Live Synchronized Area Line Chart
    function renderInventoryTrendChart(trendData) {
        const canvas = document.getElementById('inventoryTrendChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const labels = trendData && trendData.labels ? trendData.labels : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'];
        const stockData = trendData && trendData.stockData ? trendData.stockData : [60, 64, 68, 72, 70, 77, 81, 75, 78, 82, 89, 85];
        const demandData = trendData && trendData.demandData ? trendData.demandData : [21, 26, 30, 34, 32, 38, 43, 36, 41, 44, 51, 54];

        if (inventoryTrendChartInstance) {
            // Update datasets in-place for active smooth animation
            inventoryTrendChartInstance.data.labels = labels;
            inventoryTrendChartInstance.data.datasets[0].data = stockData;
            inventoryTrendChartInstance.data.datasets[1].data = demandData;
            inventoryTrendChartInstance.update();
            return;
        }

        const datasets = [
            {
                label: 'Total Stock Available (Units)',
                data: stockData,
                borderColor: '#1D6FCE',
                backgroundColor: 'rgba(29, 111, 206, 0.12)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#1D6FCE',
                pointBorderWidth: 2
            },
            {
                label: 'Weekly Units Sold / Demanded',
                data: demandData,
                borderColor: '#E66A2C',
                backgroundColor: 'rgba(230, 106, 44, 0.12)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#E66A2C',
                pointBorderWidth: 2
            }
        ];

        inventoryTrendChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            boxWidth: 28,
                            boxHeight: 12,
                            padding: 15,
                            font: { size: 12, weight: '500' }
                        }
                    },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Units' },
                        grid: { color: '#E2E8F0' }
                    },
                    x: {
                        grid: { color: '#F1F5F9' }
                    }
                }
            }
        });
    }

    function renderCategoryValueChart(summaryData) {
        const canvas = document.getElementById('categoryValueChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const labels = Object.keys(summaryData || {});
        const values = Object.values(summaryData || {});

        if (categoryChartInstance) {
            categoryChartInstance.data.labels = labels;
            categoryChartInstance.data.datasets[0].data = values;
            categoryChartInstance.update();
            return;
        }

        categoryChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Value ($)',
                    data: values,
                    backgroundColor: [brandColors.primaryTeal, brandColors.secondaryGreen, '#3B82F6', '#8B5CF6'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    function renderStockStatusChart(statusData) {
        const canvas = document.getElementById('stockStatusChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const data = statusData || { 'in stock': 0, 'low stock': 0, 'out of stock': 0 };
        const newValues = [data['in stock'] || 0, data['low stock'] || 0, data['out of stock'] || 0];

        if (statusChartInstance) {
            statusChartInstance.data.datasets[0].data = newValues;
            statusChartInstance.update();
            return;
        }

        statusChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['In Stock', 'Low Stock', 'Out of Stock'],
                datasets: [{
                    data: newValues,
                    backgroundColor: [brandColors.secondaryGreen, brandColors.warningYellow, brandColors.dangerRed]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    function renderTopProductsChart(topProducts) {
        const canvas = document.getElementById('topProductsChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const products = topProducts || [];
        const labels = products.map(p => p.name);
        const dataValues = products.map(p => p.price * p.quantity);

        if (topProductsChartInstance) {
            topProductsChartInstance.data.labels = labels;
            topProductsChartInstance.data.datasets[0].data = dataValues;
            topProductsChartInstance.update();
            return;
        }

        topProductsChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Inventory Value ($)',
                    data: dataValues,
                    backgroundColor: brandColors.primaryTeal,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    function updateAllCharts(trendData) {
        renderInventoryTrendChart(trendData);
        if (typeof DataManager !== 'undefined') {
            renderCategoryValueChart(DataManager.getCategorySummary());
            renderStockStatusChart(DataManager.getStockStatusDistribution());
            if (typeof DataManager.getTopProductsByValue === 'function') {
                renderTopProductsChart(DataManager.getTopProductsByValue());
            }
        }
    }

    return {
        renderInventoryTrendChart,
        renderCategoryValueChart,
        renderStockStatusChart,
        renderTopProductsChart,
        updateAllCharts
    };
})();