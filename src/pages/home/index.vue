<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/services/http'
import { Bar, Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { FileText, DollarSign, TrendingUp, Calendar } from 'lucide-vue-next'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const loading = ref(false)
const summary = ref({
  totalInvoices: 0,
  totalAmount: 0,
  paidInvoices: 0,
  pendingInvoices: 0
})

// Chart data
const monthlyInvoiceData = ref({
  labels: [] as string[],
  datasets: [] as any[]
})

const statusDistributionData = ref({
  labels: [] as string[],
  datasets: [] as any[]
})

const revenueTrendData = ref({
  labels: [] as string[],
  datasets: [] as any[]
})

// Chart options
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2
    },
    point: {
      radius: 4,
      hoverRadius: 6
    }
  }
}

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 15,
        usePointStyle: true
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12
    }
  }
}

const fetchInvoiceData = async () => {
  loading.value = true
  try {
    // Fetch invoice statistics
    const res = await http.get('/invoice/statistics')
    
    if (res.data.code === 1) {
      const data = res.data.data
      
      // Update summary
      summary.value = {
        totalInvoices: data.totalInvoices || 0,
        totalAmount: data.totalAmount || 0,
        paidInvoices: data.paidInvoices || 0,
        pendingInvoices: data.pendingInvoices || 0
      }
      
      // Monthly invoice chart data
      if (data.monthlyData) {
        monthlyInvoiceData.value = {
          labels: data.monthlyData.map((item: any) => item.month),
          datasets: [{
            label: 'Invoices',
            data: data.monthlyData.map((item: any) => item.count),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
          }]
        }
      }
      
      // Status distribution chart data
      if (data.statusDistribution) {
        statusDistributionData.value = {
          labels: data.statusDistribution.map((item: any) => item.status),
          datasets: [{
            data: data.statusDistribution.map((item: any) => item.count),
            backgroundColor: [
              'rgba(34, 197, 94, 0.7)',
              'rgba(251, 191, 36, 0.7)',
              'rgba(239, 68, 68, 0.7)',
              'rgba(156, 163, 175, 0.7)'
            ],
            borderColor: [
              'rgba(34, 197, 94, 1)',
              'rgba(251, 191, 36, 1)',
              'rgba(239, 68, 68, 1)',
              'rgba(156, 163, 175, 1)'
            ],
            borderWidth: 2
          }]
        }
      }
      
      // Revenue trend chart data
      if (data.revenueTrend) {
        revenueTrendData.value = {
          labels: data.revenueTrend.map((item: any) => item.month),
          datasets: [{
            label: 'Revenue',
            data: data.revenueTrend.map((item: any) => item.amount),
            fill: true,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            tension: 0.4
          }]
        }
      }
    }
  } catch (error) {
    console.error('Error fetching invoice data:', error)
    // Set default/empty data for demo
    setDefaultData()
  } finally {
    loading.value = false
  }
}

const setDefaultData = () => {
  // Default data for demonstration
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  monthlyInvoiceData.value = {
    labels: months,
    datasets: [{
      label: 'Invoices',
      data: [12, 19, 15, 25, 22, 30],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1
    }]
  }
  
  statusDistributionData.value = {
    labels: ['Paid', 'Pending', 'Overdue', 'Draft'],
    datasets: [{
      data: [45, 20, 10, 5],
      backgroundColor: [
        'rgba(34, 197, 94, 0.7)',
        'rgba(251, 191, 36, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(156, 163, 175, 0.7)'
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(156, 163, 175, 1)'
      ],
      borderWidth: 2
    }]
  }
  
  revenueTrendData.value = {
    labels: months,
    datasets: [{
      label: 'Revenue',
      data: [5000, 7500, 6000, 9000, 8500, 12000],
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      tension: 0.4
    }]
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

onMounted(() => {
  fetchInvoiceData()
})
</script>

<template>
  <div class="container mx-auto py-6 px-4 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">Invoice Dashboard</h1>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Total Invoices</p>
            <p class="text-2xl font-bold mt-1">{{ summary.totalInvoices }}</p>
          </div>
          <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText class="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Total Amount</p>
            <p class="text-2xl font-bold mt-1">{{ formatCurrency(summary.totalAmount) }}</p>
          </div>
          <div class="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
            <DollarSign class="h-6 w-6 text-green-500" />
          </div>
        </div>
      </div>

      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Paid Invoices</p>
            <p class="text-2xl font-bold mt-1">{{ summary.paidInvoices }}</p>
          </div>
          <div class="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
            <TrendingUp class="h-6 w-6 text-blue-500" />
          </div>
        </div>
      </div>

      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Pending Invoices</p>
            <p class="text-2xl font-bold mt-1">{{ summary.pendingInvoices }}</p>
          </div>
          <div class="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <Calendar class="h-6 w-6 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Monthly Invoices Chart -->
      <div class="bg-card rounded-lg border p-6">
        <h2 class="text-xl font-semibold mb-4">Monthly Invoices</h2>
        <div class="h-64">
          <Bar
            v-if="monthlyInvoiceData.labels.length > 0"
            :data="monthlyInvoiceData"
            :options="barChartOptions"
          />
          <div v-else class="flex items-center justify-center h-full text-muted-foreground">
            No data available
          </div>
        </div>
      </div>

      <!-- Revenue Trend Chart -->
      <div class="bg-card rounded-lg border p-6">
        <h2 class="text-xl font-semibold mb-4">Revenue Trend</h2>
        <div class="h-64">
          <Line
            v-if="revenueTrendData.labels.length > 0"
            :data="revenueTrendData"
            :options="lineChartOptions"
          />
          <div v-else class="flex items-center justify-center h-full text-muted-foreground">
            No data available
          </div>
        </div>
      </div>
    </div>

    <!-- Status Distribution Chart -->
    <div class="bg-card rounded-lg border p-6">
      <h2 class="text-xl font-semibold mb-4">Invoice Status Distribution</h2>
      <div class="h-80">
        <Doughnut
          v-if="statusDistributionData.labels.length > 0"
          :data="statusDistributionData"
          :options="doughnutChartOptions"
        />
        <div v-else class="flex items-center justify-center h-full text-muted-foreground">
          No data available
        </div>
      </div>
    </div>
  </div>
</template>

