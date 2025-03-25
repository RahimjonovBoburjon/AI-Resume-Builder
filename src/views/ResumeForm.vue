<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow-lg rounded-xl overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
            <div class="flex justify-between items-center">
              <h1 class="text-2xl font-bold text-white">Create Your Resume</h1>
              <button
                @click="handleSubmit"
                :disabled="loading"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Save Resume
              </button>
            </div>
          </div>

          <div class="p-6">
            <form @submit.prevent="handleSubmit" class="space-y-8">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    v-model="formData.fullName"
                    required
                    class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    v-model="formData.email"
                    required
                    class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="formData.phone"
                    required
                    class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label for="skills" class="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                  <input
                    type="text"
                    id="skills"
                    v-model="formData.skills"
                    required
                    placeholder="e.g., JavaScript, Python, React"
                    class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label for="summary" class="block text-sm font-medium text-gray-700">Professional Summary</label>
                <textarea
                  id="summary"
                  v-model="formData.summary"
                  rows="4"
                  required
                  class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>

              <div>
                <div class="flex justify-between items-center mb-4">
                  <label class="block text-sm font-medium text-gray-700">Experience</label>
                  <button
                    type="button"
                    @click="addExperience"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Experience
                  </button>
                </div>

                <div v-for="(exp, index) in formData.experience" :key="index" class="mb-6 p-4 border border-gray-200 rounded-lg">
                  <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Experience #{{ index + 1 }}</h3>
                    <button
                      type="button"
                      @click="removeExperience(index)"
                      class="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        v-model="exp.title"
                        required
                        class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Company</label>
                      <input
                        type="text"
                        v-model="exp.company"
                        required
                        class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Period</label>
                      <input
                        type="text"
                        v-model="exp.period"
                        required
                        class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        v-model="exp.description"
                        rows="3"
                        required
                        class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center mb-4">
                  <label class="block text-sm font-medium text-gray-700">Education</label>
                  <button
                    type="button"
                    @click="addEducation"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Education
                  </button>
                </div>

                <div v-for="(edu, index) in formData.education" :key="index" class="mb-6 p-4 border border-gray-200 rounded-lg">
                  <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Education #{{ index + 1 }}</h3>
                    <button
                      type="button"
                      @click="removeEducation(index)"
                      class="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Degree</label>
                      <input
                        type="text"
                        v-model="edu.degree"
                        required
                        class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Institution</label>
                      <input
                        type="text"
                        v-model="edu.institution"
                        required
                        class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Period</label>
                      <input
                        type="text"
                        v-model="edu.period"
                        required
                        class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        v-model="edu.description"
                        rows="3"
                        required
                        class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { useToast } from '../composables/useToast';
import Navbar from '../components/Navbar.vue';

const router = useRouter();
const { success, error } = useToast();
const loading = ref(false);

const formData = ref({
  fullName: '',
  email: '',
  phone: '',
  summary: '',
  skills: '',
  experience: [],
  education: []
});

const addExperience = () => {
  formData.value.experience.push({
    title: '',
    company: '',
    period: '',
    description: ''
  });
};

const removeExperience = (index) => {
  formData.value.experience.splice(index, 1);
};

const addEducation = () => {
  formData.value.education.push({
    degree: '',
    institution: '',
    period: '',
    description: ''
  });
};

const removeEducation = (index) => {
  formData.value.education.splice(index, 1);
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    const user = auth.currentUser;
    if (!user) {
      router.push('/auth');
      return;
    }

    const resumeData = {
      ...formData.value,
      skills: formData.value.skills.split(',').map(skill => skill.trim()),
      userId: user.uid,
      createdAt: new Date()
    };

    await addDoc(collection(db, 'resumes'), resumeData);
    success('Resume created successfully');
    router.push('/resume-preview');
  } catch (err) {
    console.error('Error creating resume:', err);
    error('Error creating resume');
  } finally {
    loading.value = false;
  }
};
</script>