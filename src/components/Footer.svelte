<script>
  import { onMount } from 'svelte';
  import { doc, pageContent, rate, voice } from '../store.js';
  import Button from './Button.svelte';

  let playing = false;
  let synth = window.speechSynthesis;

  function speak() {
    var utterThis = new SpeechSynthesisUtterance($pageContent);
    utterThis.onend = (event) => {
      playing = false;
    };
    // utterThis.onerror = function (event) {
    //   console.error('SpeechSynthesisUtterance.onerror');
    // };

    let currVoice = synth.getVoices().filter((v) => {
      return v.name == $voice;
    });
    utterThis.voice = currVoice[0];
    utterThis.pitch = 1;
    utterThis.rate = $rate;

    if (playing) {
      playing = false;
      synth.pause();
    } else if (synth.paused) {
      playing = true;
      synth.resume();
    } else {
      playing = true;
      synth.speak(utterThis);
    }
  }

  function stop() {
    synth.cancel();
  }
</script>

{#if $pageContent}
  <footer class="fixed right-3 bottom-3 inline-flex">
    <Button
      icon={playing ? 'pause' : 'play'}
      size="15"
      on:click={speak}
      className={`shadow-lg rounded-l-md ${
        playing ? 'bg-gray-700' : 'bg-gray-600'
      } hover:bg-gray-700 p-3 z-10`}
    />
    <Button
      icon="stop"
      size="15"
      on:click={stop}
      className="shadow-lg rounded-r-md bg-gray-600 hover:bg-gray-700 p-3 z-10"
    />
  </footer>
{/if}
