<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div class="max-w-md mx-auto">
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <h2 class="text-2xl font-bold mb-8">Personal Information</h2>
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    v-model="formData.fullName"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Professional Summary</label>
                  <textarea
                    v-model="formData.summary"
                    rows="4"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                  <input
                    v-model="formData.skills"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Experience (JSON format)</label>
                  <textarea
                    v-model="formData.experience"
                    rows="6"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Education (JSON format)</label>
                  <textarea
                    v-model="formData.education"
                    rows="6"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  ></textarea>
                </div>

                <div class="flex justify-between">
                  <button
                    type="button"
                    @click="$router.push('/dashboard')"
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Generate Resume
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '../firebase/firebase';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { success, error } = useToast();
const formData = ref({
  fullName: '',
  email: '',
  phone: '',
  summary: '',
  skills: '',
  experience: '',
  education: ''
});

const handleSubmit = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      router.push('/auth');
      return;
    }

    let experienceData, educationData;
    try {
      experienceData = JSON.parse(formData.value.experience);
    } catch (e) {
      error('Invalid experience JSON format');
      return;
    }
    try {
      educationData = JSON.parse(formData.value.education);
    } catch (e) {
      error('Invalid education JSON format');
      return;
    }

    const resumeData = {
      ...formData.value,
      userId: user.uid,
      createdAt: new Date(),
      experience: experienceData,
      education: educationData,
      skills: formData.value.skills.split(',').map(skill => skill.trim())
    };

    const docRef = await addDoc(collection(db, 'resumes'), resumeData);
    console.log('Resume saved with ID:', docRef.id);
    success('Resume saved successfully!');
    router.push('/resume-preview');
  } catch (error) {
    console.error('Error saving resume:', error);
    error('Error saving resume. Please check your input format.');
  }
};
</script> 