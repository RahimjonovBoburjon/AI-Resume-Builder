<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Resume Preview</h1>
            <div class="flex space-x-4">
              <button @click="showDeleteConfirmation = true"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Delete Resume
              </button>
              <button @click="downloadPDF"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Download PDF
              </button>
            </div>
          </div>

          <!-- Resume Selection -->
          <div class="mb-6">
            <label for="resume-select" class="block text-sm font-medium text-gray-700 mb-2">Select Resume</label>
            <select
              id="resume-select"
              v-model="selectedResumeId"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new resume.</p>
            <div class="mt-6">
              <router-link
                to="/resume-form"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Resume
              </router-link>
            </div>
          </div>

          <div v-else-if="showDeleteConfirmation"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Delete Resume</h3>
              <p class="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this resume? This action cannot be undone.
              </p>
              <div class="flex justify-end space-x-3">
                <button @click="showDeleteConfirmation = false"
                  class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Cancel
                </button>
                <button @click="handleDelete"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div ref="resumeContent" class="prose max-w-none">
            <div class="divide-y divide-gray-200">
              <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div id="resume-content" class="space-y-6">
                  <div class="text-center">
                    <h1 class="text-3xl font-bold">{{ selectedResume.fullName }}</h1>
                    <p class="text-gray-600">{{ selectedResume.email }} | {{ selectedResume.phone }}</p>
                  </div>

                  <div>
                    <h2 class="text-xl font-semibold border-b-2 border-gray-300 pb-2">Professional Summary</h2>
                    <p class="mt-2">{{ selectedResume.summary }}</p>
                  </div>

                  <div>
                    <h2 class="text-xl font-semibold border-b-2 border-gray-300 pb-2">Skills</h2>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span v-for="skill in selectedResume.skills" :key="skill"
                        class="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {{ skill }}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 class="text-xl font-semibold border-b-2 border-gray-300 pb-2">Experience</h2>
                    <div v-for="(exp, index) in selectedResume.experience" :key="index" class="mt-4">
                      <h3 class="font-semibold">{{ exp.title }}</h3>
                      <p class="text-gray-600">{{ exp.company }} | {{ exp.period }}</p>
                      <p class="mt-2">{{ exp.description }}</p>
                    </div>
                  </div>

                  <div>
                    <h2 class="text-xl font-semibold border-b-2 border-gray-300 pb-2">Education</h2>
                    <div v-for="(edu, index) in selectedResume.education" :key="index" class="mt-4">
                      <h3 class="font-semibold">{{ edu.degree }}</h3>
                      <p class="text-gray-600">{{ edu.institution }} | {{ edu.period }}</p>
                      <p class="mt-2">{{ edu.description }}</p>
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

    // Set the first resume as selected by default
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