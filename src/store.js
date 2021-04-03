import { writable } from 'svelte/store';

const storedRate = localStorage.getItem('rate');
const storedVoice = localStorage.getItem('voice');

export const rate = writable(storedRate);
export const voice = writable(storedVoice);
export const scale = writable(1);

export const canvas = writable(null);
export const doc = writable(0);
export const pageContent = writable([]);
export const fileInput = writable(null);
export const textElem = writable(null);
export const pageNum = writable(1);
export const numPages = writable(1);

rate.subscribe((value) => {
  localStorage.setItem('rate', value !== null ? value : Number(1));
});
voice.subscribe((value) => {
  let defaultVoice = window.speechSynthesis.getVoices().forEach((voice) => {
    if (voice.default) {
      return voice.name;
    }
  });
  localStorage.setItem('voice', value !== null ? value : defaultVoice);
});
