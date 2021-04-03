<script>
  import { onMount } from 'svelte';
  import { rate, voice } from '../store';
  export let show = false;

  let voiceContainer, navigation;
  let synth = window.speechSynthesis;
  let voices = [];

  onMount(() => {
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }
  });

  function updateRate(ev) {
    rate.set(ev.target.value);
  }

  function updateVoice(ev) {
    voice.set(voices[ev.target.value].name);
  }

  function populateVoiceList() {
    voices = synth.getVoices().sort(function (a, b) {
      const aname = a.lang.toUpperCase(),
        bname = b.lang.toUpperCase();
      if (aname < bname) return -1;
      else if (aname == bname) return 0;
      else return +1;
    });
    var selectedIndex =
      voiceContainer.selectedIndex < 0 ? 0 : voiceContainer.selectedIndex;
    voiceContainer.innerHTML = '';
    for (let i = 0; i < voices.length; i++) {
      var option = document.createElement('option');
      option.textContent = `(${voices[i].lang}) ${voices[i].name}`;
      if (voices[i].name == $voice) {
        selectedIndex = i;
      }
      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      option.value = i;
      voiceContainer.appendChild(option);
    }
    voiceContainer.selectedIndex = selectedIndex;
  }
</script>

<nav
  class={show
    ? 'absolute right-3 shadow-lg rounded-xl bg-gray-600 text-gray-400 p-5 z-10 top-20'
    : 'hidden'}
  bind:this={navigation}
>
  <h3 class="text-lg font-semibold uppercase">Voice Options</h3>
  <div>
    <label>
      <span>Rate <small>({$rate})</small></span>
      <input
        type="range"
        name="rate"
        min="0.5"
        max="3"
        value={$rate}
        step="0.1"
        on:change={updateRate}
      />
    </label>
  </div>
  <div class="relative inline-block w-full text-gray-300">
    <!-- svelte-ignore a11y-no-onchange -->
    <select
      class="w-full h-10 pl-3 pr-6 text-base bg-gray-500 rounded-lg appearance-none focus:shadow-outline shadow-xl border-0"
      on:change={updateVoice}
      bind:this={voiceContainer}
    />
    <div
      class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
    >
      <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"
        ><path
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
          fill-rule="evenodd"
        /></svg
      >
    </div>
  </div>
</nav>
