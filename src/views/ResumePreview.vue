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

          <div v-if="showDeleteConfirmation"
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
                <div class="flex justify-between items-center mb-8">
                  <h2 class="text-2xl font-bold">Resume Preview</h2>
                  <button @click="downloadPDF"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Download PDF
                  </button>
                </div>

                <div id="resume-content" class="space-y-6">
                  <div class="text-center">
                    <h1 class="text-3xl font-bold">{{ resumeData.fullName }}</h1>
                    <p class="text-gray-600">{{ resumeData.email }} | {{ resumeData.phone }}</p>
                  </div>

                  <div>
                    <h2 class="text-xl font-semibold border-b-2 border-gray-300 pb-2">Professional Summary</h2>
                    <p class="mt-2">{{ resumeData.summary }}</p>
                  </div>

                  <div>
                    <h2 class="text-xl font-semibold border-b-2 border-gray-300 pb-2">Skills</h2>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span v-for="skill in resumeData.skills" :key="skill"
                        class="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {{ skill }}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 class="text-xl font-semibold border-b-2 border-gray-300 pb-2">Experience</h2>
                    <div v-for="(exp, index) in resumeData.experience" :key="index" class="mt-4">
                      <h3 class="font-semibold">{{ exp.title }}</h3>
                      <p class="text-gray-600">{{ exp.company }} | {{ exp.period }}</p>
                      <p class="mt-2">{{ exp.description }}</p>
                    </div>
                  </div>

                  <div>
                    <h2 class="text-xl font-semibold border-b-2 border-gray-300 pb-2">Education</h2>
                    <div v-for="(edu, index) in resumeData.education" :key="index" class="mt-4">
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase/firebase';
import { collection, query, where, orderBy, limit, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth } from '../firebase/firebase';
import html2pdf from 'html2pdf.js';
import Navbar from '../components/Navbar.vue';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { success, error } = useToast();
const showDeleteConfirmation = ref(false);
const currentResumeId = ref(null);
const resumeData = ref({
  fullName: '',
  email: '',
  phone: '',
  summary: '',
  skills: [],
  experience: [],
  education: []
});

onMounted(async () => {
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
    if (!querySnapshot.empty) {
      const resumes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const mostRecent = resumes.sort((a, b) => b.createdAt - a.createdAt)[0];
      currentResumeId.value = mostRecent.id;
      resumeData.value = mostRecent;
    } else {
      router.push('/resume-form');
    }
  } catch (err) {
    console.error('Error fetching resume:', err);
    router.push('/resume-form');
  }
});

const handleDelete = async () => {
  try {
    if (!currentResumeId.value) {
      error('No resume found to delete');
      return;
    }

    await deleteDoc(doc(db, 'resumes', currentResumeId.value));
    success('Resume deleted successfully');
    showDeleteConfirmation.value = false;
    router.push('/resume-form');
  } catch (err) {
    console.error('Error deleting resume:', err);
    error('Error deleting resume');
  }
};

const downloadPDF = () => {
  const element = document.getElementById('resume-content');
  const opt = {
    margin: 1,
    filename: `${resumeData.value.fullName.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};
</script>