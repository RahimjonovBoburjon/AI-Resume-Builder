<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-xl font-bold text-gray-800">
              Resume Builder
            </router-link>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link to="/resume-form" class="inline-flex items-center px-1 pt-1 border-b-2" :class="[
              $route.path === '/resume-form'
                ? 'border-indigo-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            ]">
              Create Resume
            </router-link>
            <router-link to="/resume-preview" class="inline-flex items-center px-1 pt-1 border-b-2" :class="[
              $route.path === '/resume-preview'
                ? 'border-indigo-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            ]">
              Preview
            </router-link>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <div class="ml-3 relative">
            <div class="flex items-center space-x-4">
              <span class="text-gray-700">{{ userEmail }}</span>
              <button @click="handleSignOut"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Sign Out
              </button>
            </div>
          </div>
        </div>
        <div class="-mr-2 flex items-center sm:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            <span class="sr-only">Open main menu</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-show="mobileMenuOpen" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link to="/resume-form" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium" :class="[
          $route.path === '/resume-form'
            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
        ]">
          Create Resume
        </router-link>
        <router-link to="/resume-preview" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium" :class="[
          $route.path === '/resume-preview'
            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
        ]">
          Preview
        </router-link>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span class="text-indigo-600 font-medium">{{ userEmail[0].toUpperCase() }}</span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ userEmail }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <button @click="handleSignOut"
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { success, error } = useToast();
const mobileMenuOpen = ref(false);

const userEmail = computed(() => auth.currentUser?.email || '');

const handleSignOut = async () => {
  try {
    await signOut(auth);
    success('Signed out successfully');
    router.push('/auth');
  } catch (err) {
    console.error('Sign out error:', err);
    error('Error signing out');
  }
};
</script>