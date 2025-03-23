<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-4xl sm:mx-auto">
      <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div class="max-w-3xl mx-auto">
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl font-bold">Resume Preview</h2>
                <button
                  @click="downloadPDF"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
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
                    <span
                      v-for="skill in resumeData.skills"
                      :key="skill"
                      class="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { auth } from '../firebase/firebase';
import html2pdf from 'html2pdf.js';

const router = useRouter();
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
      resumeData.value = mostRecent;
    } else {
      router.push('/resume-form');
    }
  } catch (error) {
    console.error('Error fetching resume:', error);
    router.push('/resume-form');
  }
});

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