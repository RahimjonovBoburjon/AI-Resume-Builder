<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ isLogin ? 'Sign in to your account' : 'Create your account' }}
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1">
              <input id="email" v-model="email" type="email" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1">
              <input id="password" v-model="password" type="password" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" v-model="rememberMe" type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
          </div>

          <div>
            <button type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {{ isLogin ? 'Sign in' : 'Sign up' }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
              </span>
            </div>
          </div>

          <div class="mt-6">
            <button @click="toggleMode"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {{ isLogin ? 'Create an account' : 'Sign in to your account' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebase/firebase';
import { useToast } from '../composables/useToast';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';

const router = useRouter();
const { success, error } = useToast();
const email = ref('');
const password = ref('');
const isLogin = ref(true);
const rememberMe = ref(false);

onMounted(() => {
  const storedEmail = localStorage.getItem('rememberedEmail');
  if (storedEmail) {
    email.value = storedEmail;
    rememberMe.value = true;
  }
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
};

const handleSubmit = async () => {
  try {
    if (rememberMe.value) {
      localStorage.setItem('rememberedEmail', email.value);
      await setPersistence(auth, browserLocalPersistence);
    } else {
      localStorage.removeItem('rememberedEmail');
      await setPersistence(auth, browserSessionPersistence);
    }

    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      success('Signed in successfully!');
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      success('Account created successfully!');
    }
    router.push('/resume-form');
  } catch (err) {
    console.error('Authentication error:', err);
    let errorMessage = 'An error occurred during authentication.';

    switch (err.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password';
        break;
      default:
        errorMessage = err.message || 'An error occurred during authentication.';
    }

    error(errorMessage);
  }
};
</script>