<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow-lg rounded-xl overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
            <div class="flex justify-between items-center">
              <h1 class="text-2xl font-bold text-white">Resume Preview</h1>
              <div class="flex space-x-3">
                <button
                  @click="showDeleteConfirmation = true"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
                <button
                  @click="downloadPDF"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
          </div>

          <div class="p-6">
            <div class="mb-8">
              <label for="resume-select" class="block text-sm font-medium text-gray-700 mb-2">Select Resume</label>
              <select
                id="resume-select"
                v-model="selectedResumeId"
                class="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg shadow-sm"
              >
                <option v-for="resume in resumes" :key="resume.id" :value="resume.id">
                  {{ resume.fullName }} - {{ formatDate(resume.createdAt) }}
                </option>
              </select>
            </div>

            <div v-if="loading" class="text-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>

            <div v-else-if="resumes.length === 0" class="text-center py-12">
              <div class="bg-gray-50 rounded-lg p-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
                <p class="mt-1 text-sm text-gray-500">Get started by creating a new resume.</p>
                <div class="mt-6">
                  <router-link
                    to="/resume-form"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    Create Resume
                  </router-link>
                </div>
              </div>
            </div>

            <div v-else ref="resumeContent" class="prose max-w-none">
              <div class="bg-white rounded-lg shadow-sm p-8">
                <div id="resume-content" class="space-y-8">
                  <div class="text-center border-b pb-6">
                    <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ selectedResume.fullName }}</h1>
                    <p class="text-lg text-gray-600">{{ selectedResume.email }} | {{ selectedResume.phone }}</p>
                  </div>

                  <div>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                      <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Professional Summary
                    </h2>
                    <p class="text-gray-700 leading-relaxed">{{ selectedResume.summary }}</p>
                  </div>

                  <div>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                      <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Skills
                    </h2>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="skill in selectedResume.skills" :key="skill"
                        class="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                        {{ skill }}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                      <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Experience
                    </h2>
                    <div class="space-y-6">
                      <div v-for="(exp, index) in selectedResume.experience" :key="index" class="border-l-4 border-indigo-500 pl-4">
                        <h3 class="text-xl font-semibold text-gray-900">{{ exp.title }}</h3>
                        <p class="text-indigo-600 font-medium">{{ exp.company }}</p>
                        <p class="text-gray-500 text-sm mb-2">{{ exp.period }}</p>
                        <p class="text-gray-700">{{ exp.description }}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                      <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      Education
                    </h2>
                    <div class="space-y-6">
                      <div v-for="(edu, index) in selectedResume.education" :key="index" class="border-l-4 border-indigo-500 pl-4">
                        <h3 class="text-xl font-semibold text-gray-900">{{ edu.degree }}</h3>
                        <p class="text-indigo-600 font-medium">{{ edu.institution }}</p>
                        <p class="text-gray-500 text-sm mb-2">{{ edu.period }}</p>
                        <p class="text-gray-700">{{ edu.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="ml-3 text-lg font-medium text-gray-900">Delete Resume</h3>
        </div>
        <p class="text-sm text-gray-500 mb-6">
          Are you sure you want to delete this resume? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteConfirmation = false"
            class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth } from '../firebase/firebase';
import html2pdf from 'html2pdf.js';
import Navbar from '../components/Navbar.vue';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { success, error } = useToast();
const loading = ref(true);
const resumes = ref([]);
const selectedResumeId = ref(null);
const showDeleteConfirmation = ref(false);

const selectedResume = computed(() => {
  return resumes.value.find(resume => resume.id === selectedResumeId.value) || {};
});

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const fetchResumes = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      router.push('/auth');
      return;
    }

    const q = query(
      collection(db, 'resumes'),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);
    resumes.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => b.createdAt - a.createdAt);

    if (resumes.value.length > 0) {
      selectedResumeId.value = resumes.value[0].id;
    }
  } catch (err) {
    console.error('Error fetching resumes:', err);
    error('Error fetching resumes');
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  try {
    if (!selectedResumeId.value) {
      error('No resume selected');
      return;
    }

    await deleteDoc(doc(db, 'resumes', selectedResumeId.value));
    success('Resume deleted successfully');
    showDeleteConfirmation.value = false;
    await fetchResumes();
  } catch (err) {
    console.error('Error deleting resume:', err);
    error('Error deleting resume');
  }
};

const downloadPDF = () => {
  const element = document.getElementById('resume-content');
  const opt = {
    margin: 1,
    filename: `${selectedResume.value.fullName.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};

onMounted(fetchResumes);
</script>