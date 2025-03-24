<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow rounded-lg p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Create Your Resume</h1>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="fullName" v-model="formData.fullName"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" v-model="formData.email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required />
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" id="phone" v-model="formData.phone"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required />
              </div>
              <div>
                <label for="skills" class="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                <input type="text" id="skills" v-model="formData.skills"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g., JavaScript, Python, React" required />
              </div>
            </div>

            <div>
              <label for="summary" class="block text-sm font-medium text-gray-700">Professional Summary</label>
              <textarea id="summary" v-model="formData.summary" rows="4"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required></textarea>
            </div>

            <div>
              <label for="experience" class="block text-sm font-medium text-gray-700">Experience (JSON format)</label>
              <textarea id="experience" v-model="formData.experience" rows="6"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                placeholder='[{"company": "Company Name", "position": "Position", "startDate": "2020-01", "endDate": "2023-01", "description": "Job description"}]'
                required></textarea>
            </div>

            <div>
              <label for="education" class="block text-sm font-medium text-gray-700">Education (JSON format)</label>
              <textarea id="education" v-model="formData.education" rows="6"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                placeholder='[{"school": "School Name", "degree": "Degree", "startDate": "2016-09", "endDate": "2020-05", "description": "Education description"}]'
                required></textarea>
            </div>

            <div class="flex justify-end">
              <button type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Save Resume
              </button>
            </div>
          </form>
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
  } catch (err) {
    console.error('Error saving resume:', err);
    error('Error saving resume. Please check your input format.');
  }
};
</script>