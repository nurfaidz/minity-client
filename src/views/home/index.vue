<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Reactive data
const isMenuOpen = ref(false)
const stats = ref([
    { label: 'Total Users', value: '10,234', icon: '👥' },
    { label: 'Active Projects', value: '156', icon: '📊' },
])

const features = ref([
    {
        title: 'Fast Performance',
        description: 'Built with modern technologies for optimal speed and efficiency.',
        icon: '⚡'
    },
    {
        title: 'Responsive Design',
        description: 'Looks great on all devices, from mobile to desktop.',
        icon: '📱'
    },
    {
        title: 'Easy to Use',
        description: 'Intuitive interface that anyone can learn quickly.',
        icon: '🎯'
    },
    {
        title: 'Secure',
        description: 'Enterprise-grade security to protect your data.',
        icon: '🔒'
    }
])

// Methods
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
    }
    isMenuOpen.value = false
}

// Lifecycle
onMounted(() => {
    console.log('Home page mounted')
})
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-lg sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <!-- Logo -->
                    <div class="flex-shrink-0 flex items-center">
                        <div class="text-2xl font-bold text-blue-600">
                            MyApp
                        </div>
                    </div>

                    <!-- Desktop Menu -->
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-4">
                            <button @click="scrollToSection('home')"
                                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Home
                            </button>
                            <button @click="scrollToSection('features')"
                                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Features
                            </button>
                            <button
                                class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                                Get Started
                            </button>
                        </div>
                    </div>

                    <!-- Mobile menu button -->
                    <div class="md:hidden">
                        <button @click="toggleMenu" class="text-gray-700 hover:text-blue-600 focus:outline-none">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <div v-show="isMenuOpen" class="md:hidden">
                    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                        <button @click="scrollToSection('home')"
                            class="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium w-full text-left">
                            Home
                        </button>
                        <button @click="scrollToSection('features')"
                            class="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium w-full text-left">
                            Features
                        </button>
                        <button
                            class="block bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-blue-700">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section id="home" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div class="text-center">
                    <h1 class="text-4xl md:text-6xl font-bold mb-6">
                        Welcome to the Future
                    </h1>
                    <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                        Build amazing applications with our powerful platform. Fast, secure, and scalable solutions for
                        your business needs.
                    </p>
                    <div class="space-x-4">
                        <button
                            class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Get Started Free
                        </button>
                        <button
                            class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section id="stats" class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    <div v-for="stat in stats" :key="stat.label"
                        class="text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow">
                        <div class="text-3xl mb-2">{{ stat.icon }}</div>
                        <div class="text-3xl font-bold text-gray-900 mb-2">{{ stat.value }}</div>
                        <div class="text-gray-600">{{ stat.label }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Why Choose Us?
                    </h2>
                    <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover the features that make our platform the best choice for your next project.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div v-for="feature in features" :key="feature.title"
                        class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div class="text-3xl mb-4">{{ feature.icon }}</div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
                        <p class="text-gray-600">{{ feature.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div class="text-2xl font-bold mb-4">MyApp</div>
                        <p class="text-gray-400">
                            Building the future, one application at a time.
                        </p>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Product</h3>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-white transition-colors">Features</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Company</h3>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-white transition-colors">About</a></li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 MyApp. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
</template>