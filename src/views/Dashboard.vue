<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow-lg rounded-xl overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
            <div class="flex tablecss justify-between items-center">
              <h1 class="text-2xl textbot font-bold text-white">My Resumes</h1>
              <router-link to="/resume-form"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Create New Resume
              </router-link>
            </div>
          </div>

          <div class="p-6">
            <div v-if="loading" class="text-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>

            <div v-else-if="resumes.length === 0" class="text-center py-12">
              <div class="bg-gray-50 rounded-lg p-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No resumes yet</h3>
                <p class="mt-1 text-sm text-gray-500">Get started by creating your first resume.</p>
                <div class="mt-6">
                  <router-link to="/resume-form"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                    Create Resume
                  </router-link>
                </div>
              </div>
            </div>

            <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div v-for="resume in resumes" :key="resume.id"
                class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="p-6">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">{{ resume.fullName }}</h3>
                      <p class="text-sm text-gray-500 mt-1">{{ formatDate(resume.createdAt) }}</p>
                    </div>
                    <div class="flex space-x-2">
                      <button @click="deleteResume(resume.id)"
                        class="text-red-600 hover:text-red-800 transition-colors duration-200">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="mt-4">
                    <div class="flex flex-wrap gap-2">
                      <span v-for="skill in resume.skills.slice(0, 3)" :key="skill"
                        class="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                        {{ skill }}
                      </span>
                    </div>
                  </div>
                  <div class="mt-6">
                    <router-link :to="'/resume-preview/' + resume.id"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                      View Resume
                    </router-link>
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

const deleteResume = async (id) => {
  try {
    await deleteDoc(doc(db, 'resumes', id));
    success('Resume deleted successfully');
    await fetchResumes();
  } catch (err) {
    console.error('Error deleting resume:', err);
    error('Error deleting resume');
  }
};

onMounted(fetchResumes);
</script>

<style scoped>
@media only screen and (max-width: 416px) {
  .tablecss {
    display: table;
  }
  .textbot {
    margin-bottom: 10px;;
  }
}
</style>