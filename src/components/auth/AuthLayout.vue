<template>
    <div
        class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <!-- Header Slot-->
            <div>
                <slot name="header"></slot>
            </div>

            <!-- Main Content -->
            <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <slot></slot>
            </div>

            <!-- Footer Slot -->
            <div>
                <slot name="footer"></slot>
            </div>
        </div>

        <!-- Background Decorations-->
        <div class="fixed inset-0 -z-10 overflow-hidden">
            <div
                class="absolue -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-10 blur-3xl">
            </div>
            <div
                class="absolue -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-10 blur-3xl">
            </div>
        </div>
    </div>
</template>