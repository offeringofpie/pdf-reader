<script>
  import { onMount } from 'svelte';
  import { doc, rate, voice, scale, settings_show } from '../store';
  export let zoom;

  let voiceContainer, navigation;
  let synth = window.speechSynthesis;
  let voices = [];

  onMount(() => {
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }
  });

  function clickOutside(node) {
    const handleClick = (event) => {
      if (
        node &&
        !node.contains(event.target) &&
        !event.defaultPrevented &&
        event.target.tagName !== 'use' &&
        event.target.tagName !== 'path' &&
        event.target.tagName !== 'svg' &&
        event.target.tagName !== 'button'
      ) {
        node.dispatchEvent(new CustomEvent('click_outside', node));
      }
    };

    document.addEventListener('click', handleClick, true);

    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      },
    };
  }

  function handleClickOutside(event) {
    if ($settings_show) {
      settings_show.update((val) => !val);
    }
  }

  function updateRate(ev) {
    rate.set(ev.target.value);
  }

  function updateVoice(ev) {
    voice.set(voices[ev.target.value].name);
  }

  function updateScale(ev) {
    scale.set(ev.target.value);
    zoom(ev.target.value);
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
  class={$settings_show
    ? 'absolute right-0 shadow-lg rounded-bl-xl bg-gray-600 text-gray-400 p-5 z-10 top-12'
    : 'hidden'}
  bind:this={navigation}
  use:clickOutside
  on:click_outside={handleClickOutside}
>
  <h3 class="text-lg font-semibold uppercase">Options</h3>

  {#if $doc}
    <h4>General</h4>
    <label>
      <span>Scale <small>({Math.round($scale * 10) / 10})</small></span>
      <input
        type="range"
        name="scale"
        min="1"
        max="3"
        value={$scale}
        step="0.1"
        on:change={updateScale}
      />
    </label>
  {/if}
  <h4>Voice</h4>
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
      class="cursor-pointer w-full h-10 pl-3 pr-6 text-base bg-gray-500 rounded-lg appearance-none focus:shadow-outline shadow-xl border-0"
      on:change={updateVoice}
      bind:this={voiceContainer}
    />
    <div
      class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
    >
      <svg width="20" height="20">
        <use xlink:href="#dropdown" />
      </svg>
    </div>
  </div>
</nav>
