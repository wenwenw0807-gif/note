import { GoogleGenAI, Type } from "@google/genai";
import { Task, TaskCategory, QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudyPlan = async (
  currentLevel: string,
  focusArea: string,
  availableTime: number
): Promise<Task[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `为一名 "${currentLevel}" 水平的学生创建一个专注于 "${focusArea}" 的学习计划，可用时间为 ${availableTime} 分钟。生成 3-5 个简明扼要的可执行任务（Tasks）。任务标题使用中文。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "简短且可执行的任务标题（中文）" },
              category: { 
                type: Type.STRING, 
                description: "必须是以下之一: 词汇, 语法, 听力, 阅读, 口语" 
              },
              durationMinutes: { type: Type.INTEGER, description: "预计时长（分钟）" }
            },
            required: ["title", "category", "durationMinutes"]
          }
        }
      }
    });

    const rawTasks = JSON.parse(response.text || '[]');
    
    // Map to our internal Task type
    return rawTasks.map((t: any, index: number) => ({
      id: `generated-${Date.now()}-${index}`,
      title: t.title,
      category: t.category as TaskCategory || TaskCategory.READING,
      durationMinutes: t.durationMinutes,
      completed: false
    }));

  } catch (error) {
    console.error("Error generating study plan:", error);
    return [];
  }
};

export const generateQuickQuiz = async (
  level: string,
  topic: string
): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `生成 3 道英语多项选择题，用于测试 "${level}" 水平的 "${topic}" 能力。问题和选项必须是英语。解析（explanation）必须用中文。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "Question in English" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Exactly 4 options in English"
              },
              correctIndex: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
              explanation: { type: Type.STRING, description: "Brief explanation in Chinese of why the answer is correct" }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const rawQuestions = JSON.parse(response.text || '[]');
    return rawQuestions.map((q: any, i: number) => ({
      ...q,
      id: i
    }));

  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};