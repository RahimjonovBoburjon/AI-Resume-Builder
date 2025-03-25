<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900">My Resumes</h1>
            <router-link
              to="/resume-form"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Resume
            </router-link>
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

          <div v-else class="space-y-6">
            <div v-for="resume in resumes" :key="resume.id" class="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ resume.fullName }}</h3>
                  <p class="mt-1 text-sm text-gray-500">Created {{ formatDate(resume.createdAt) }}</p>
                </div>
                <div class="flex space-x-3">
                  <router-link
                    :to="'/resume-preview'"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View
                  </router-link>
                  <button
                    @click="deleteResume(resume.id)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div class="mt-4">
                <div class="flex flex-wrap gap-2">
                  <span v-for="skill in resume.skills.slice(0, 3)" :key="skill" class="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full text-gray-600">
                    {{ skill }}
                  </span>
                  <span v-if="resume.skills.length > 3" class="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full text-gray-600">
                    +{{ resume.skills.length - 3 }} more
                  </span>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth } from '../firebase/firebase';
import Navbar from '../components/Navbar.vue';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { success, error } = useToast();
const loading = ref(true);
const resumes = ref([]);

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
  } catch (err) {
    console.error('Error fetching resumes:', err);
    error('Error fetching resumes');
  } finally {
    loading.value = false;
  }
};

const deleteResume = async (resumeId) => {
  if (!confirm('Are you sure you want to delete this resume?')) return;

  try {
    await deleteDoc(doc(db, 'resumes', resumeId));
    success('Resume deleted successfully');
    await fetchResumes();
  } catch (err) {
    console.error('Error deleting resume:', err);
    error('Error deleting resume');
  }
};

onMounted(fetchResumes);
</script>