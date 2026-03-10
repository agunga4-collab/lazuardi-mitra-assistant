
import { GoogleGenAI, Type } from "@google/genai";
import { DailyTask, SchoolMitra, TaskStatus } from "../types";
import { CATEGORIES } from "../constants";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const generateProfessionalSummary = async (tasks: DailyTask[]) => {
  if (tasks.length === 0) return "Belum ada tugas untuk diringkas.";

  const taskString = tasks.map(t => `- [${t.status}] ${t.description} (${t.category})`).join('\n');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Saya adalah staff Mitra Office di Lazuardi GCS Cinere. Berikut adalah daftar pekerjaan saya hari ini:\n${taskString}\n\nBuatlah laporan naratif formal dan profesional dalam Bahasa Indonesia yang bisa saya kirimkan ke atasan saya. Fokus pada pencapaian dan status terkini.`,
    config: {
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  return response.text;
};

export const parseWhatsAppTasks = async (text: string): Promise<Partial<DailyTask>[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Ekstrak daftar pekerjaan dari teks WhatsApp berikut menjadi format JSON yang rapi. 
    Teks: "${text}"
    
    Aturan:
    1. Masukkan ke dalam array of objects.
    2. Kategori harus salah satu dari: ${CATEGORIES.join(', ')}.
    3. Status harus salah satu dari: Selesai, Proses, Tertunda.
    4. Jika tidak disebutkan statusnya, anggap 'Selesai'.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: "Deskripsi singkat pekerjaan" },
            category: { type: Type.STRING, description: "Kategori pekerjaan" },
            status: { type: Type.STRING, description: "Status pekerjaan (Selesai/Proses/Tertunda)" }
          },
          required: ["description", "category", "status"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
};

export const optimizeSchoolSorting = async (schools: SchoolMitra[]) => {
  const schoolData = schools.map(s => ({ name: s.name, status: s.checkpointStatus, count: s.studentCount }));
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Urutkan sekolah-sekolah mitra berikut berdasarkan prioritas penanganan untuk Checkpoint Test (dahulukan yang Belum Terdaftar tapi memiliki banyak siswa, atau yang sedang dalam proses). Berikan alasan singkat untuk setiap urutan.\nData: ${JSON.stringify(schoolData)}`,
    config: {
      temperature: 0.2,
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  return response.text;
};
