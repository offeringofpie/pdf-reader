<script>
  import pdfjs from 'pdfjs-dist/build/pdf';
  import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
  let canvas;

  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  let doc = pdfjs.getDocument('/doc.pdf');
  doc.promise.then((pdf) => {
    pdf.getPage(1).then(function (page) {
      page.getTextContent().then((content) => {
        console.log(content);
      });
      // console.log(page);

      var scale = 1.5;
      var viewport = page.getViewport({ scale: scale });
      let context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      var renderTask = page.render(renderContext);
      renderTask.promise.then(function () {
        // console.log('Page rendered');
      });
    });
  });
</script>

<canvas bind:this={canvas} />

<style></style>
